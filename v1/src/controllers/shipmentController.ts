import { Request, Response } from "express";
import { ShipmentService } from "../services";
import BaseController from "./baseController";
import { Error, Types } from "mongoose";
import { IShipment } from "../interfaces/models";

class Shipment extends BaseController {
  constructor() {
    super(ShipmentService, "Shipment", "load_code", true);
  }

  create = (req: Request, res: Response) => {
    try {
      const { load_code } = req.body;
      const user = (req as any).user;
      this.service
        .findOne({ load_code, user_id: user.id })
        .then((response: object) => {
          if (!response) {
            Object.assign(req.body, { user_id: user.id });
            this.service.create(req.body).then((createdShipment: IShipment) => {
              createdShipment
                .populate("carrier destination dock sub_shipments")
                .then((populatedShipment) => {
                  this.APIResponseMessages.created(res, populatedShipment);
                });
            });
          } else {
            this.APIResponseMessages.alreadyExists(res, load_code);
          }
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  update = (req: Request, res: Response) => {
    const { load_code, _id } = req.body;
    const user = (req as any).user;
    try {
      this.service
        .findOne({ user_id: user?.id, _id: new Types.ObjectId(_id) })
        .then((shipment: IShipment) => {
          if (shipment) {
            if (shipment.load_code === load_code) {
              this.service
                .update((req as any).user?.id, req.body._id, req.body)
                .then((updatedShipment) => {
                  updatedShipment
                    .populate("carrier destination dock sub_shipments")
                    .then((populatedShipment: IShipment) => {
                      let availabilityOfTheDock = true;
                      if (req.body.status == 2) {
                        availabilityOfTheDock = false;
                      }
                      if (populatedShipment.dock) {
                        this.services["DockService"].update(
                          (req as any).user?.id,
                          (populatedShipment.dock as any)._id.toString(),
                          { available: availabilityOfTheDock },
                        );
                      }
                      return this.APIResponseMessages.updated(
                        res,
                        populatedShipment,
                      );
                    });
                });
            } else {
              this.service
                .countDocuments((req as any).user?.id, { load_code })
                .then((count: number) => {
                  if (count) {
                    return this.APIResponseMessages.alreadyExists(
                      res,
                      load_code,
                    );
                  } else {
                    this.service
                      .update((req as any).user?.id, req.body._id, req.body)
                      .then((updatedShipment) => {
                        console.log(updatedShipment);
                        updatedShipment
                          .populate("carrier destination dock sub_shipments")
                          .then((populatedShipment: IShipment) => {
                            let availabilityOfTheDock = true;
                            if (req.body.status == 2) {
                              availabilityOfTheDock = false;
                            }
                            if (populatedShipment.dock) {
                              this.services["DockService"].update(
                                (req as any).user?.id,
                                (populatedShipment.dock as any)._id.toString(),
                                { available: availabilityOfTheDock },
                              );
                            }
                            return this.APIResponseMessages.updated(
                              res,
                              populatedShipment,
                            );
                          });
                      });
                  }
                });
            }
          } else {
            return this.APIResponseMessages.noRecordsFound(res);
          }
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  addSubShipment = (req: Request, res: Response) => {
    if (!req.params.id)
      return this.APIResponseMessages.badRequest(
        res,
        "Shipment ID is required",
      );

    try {
      this.service
        .findOne({ user_id: (req as any).user?.id, _id: req.params.id })
        .then((parentShipment: IShipment) => {
          if (!parentShipment)
            return this.APIResponseMessages.custom(
              res,
              "Parent shipment not found",
            );

          if (parentShipment.is_sub_shipment)
            return this.APIResponseMessages.custom(
              res,
              "cannot add sub-shipment to a sub-shipment",
            );

          Object.assign(req.body, {
            user_id: (req as any).user?.id,
            is_sub_shipment: true,
          });

          this.service
            .create(req.body)
            .then((createdSubShipment: IShipment) => {
              parentShipment.sub_shipments.push(createdSubShipment._id);
              parentShipment.save().then((updatedParentShipment) => {
                updatedParentShipment
                  .populate("carrier destination dock sub_shipments")
                  .then((populatedShipment: IShipment) => {
                    return this.APIResponseMessages.updated(
                      res,
                      populatedShipment,
                    );
                  });
              });
            });
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  updatedSubShipment = (req: Request, res: Response) => {
    if (!req.params.parentShipmentId || !req.params.subShipmentId) {
      return this.APIResponseMessages.badRequest(
        res,
        "Parent Shipment Id ans sub-shipment id are required",
      );
    }

    try {
      this.service
        .findOne({
          user_id: (req as any).user?.id,
          _id: req.params.subShipmentId,
        })
        .then((subShipment: IShipment) => {
          if (!subShipment) {
            return this.APIResponseMessages.custom(
              res,
              "Sub-Shipment not found",
            );
          }
          this.service
            .update(
              (req as any).user?.id,
              req.params.subShipmentId.toString(),
              req.body,
            )
            .then((updatedSubShipment) => {
              this.service
                .findOne({
                  user_id: (req as any).user?.id,
                  _id: req.params.parentShipmentId,
                })
                .populate("carrier destination dock sub_shipments")
                .then((populatedParentShipment: IShipment) => {
                  return this.APIResponseMessages.updated(
                    res,
                    populatedParentShipment,
                  );
                });
            });
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  arrivedShipments = (req: Request, res: Response) => {
    this.service
      .list({
        status: 2,
        user_id: (req as any).user?.id,
        is_sub_shipment: false,
      })
      .populate("carrier destination dock")
      .then((arrivedShipments: IShipment[]) => {
        this.APIResponseMessages.listed(res, arrivedShipments);
      })
      .catch((e: Error) => this.APIResponseMessages.errorOccured(res, e));
  };

  todaysShipments = (req: Request, res: Response) => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    this.service
      .list({
        user_id: (req as any).user?.id,
        pickup_time: { $gte: startOfDay, $lte: endOfDay },
        is_sub_shipment: false,
      })
      .populate("carrier destination dock")
      .then((todaysShipments: IShipment[]) => {
        this.APIResponseMessages.listed(res, todaysShipments);
      })
      .catch((e: Error) => {
        this.APIResponseMessages.errorOccured(res, e);
      });
  };

  list = (req: Request, res: Response) => {};

  numberOfLastWeekShippedShipments = async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const utcDayIndex = (now.getUTCDay() + 6) % 7;
      const startOfThisWeek = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - utcDayIndex,
          0,
          0,
          0,
          0,
        ),
      );
      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setUTCDate(startOfThisWeek.getUTCDate() - 7);

      const endOfLastWeek = startOfThisWeek;
      const results = await this.service.baseModel.aggregate([
        {
          $match: {
            user_id: new Types.ObjectId((req as any).user?.id),
            is_sub_shipment: false,
            status: 3,
            pickup_time: {
              $gte: startOfLastWeek,
              $lt: endOfLastWeek,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$pickup_time" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
          },
        },
      ]);

      if (results.length) {
        const dayLabels = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        const countsByDate = results.reduce(
          (acc: any, { date, count }: any) => {
            acc[date] = count;
            return acc;
          },
          {},
        );

        const labels: string[] = [];
        const data: number[] = [];

        for (
          let d = new Date(startOfLastWeek);
          d < endOfLastWeek;
          d.setDate(d.getDate() + 1)
        ) {
          const iso = d.toISOString().slice(0, 10);
          labels.push(dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1]);
          data.push(countsByDate[iso] || 0);
        }

        return this.APIResponseMessages.custom(res, {
          labels,
          datasets: {
            label: "Last weeks shipped shipments",
            data,
          },
        });
      } else {
        return this.APIResponseMessages.custom(res, {
          labels: [],
          datasets: {
            label: "Last week shipped shipments",
            data: [],
          },
        });
      }
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  numberOfShipmentInThisYear = async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const startOfYear = new Date(
        Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0),
      );
      const startOfNextYear = new Date(
        Date.UTC(now.getUTCFullYear() + 1, 0, 1, 0, 0, 0, 0),
      );

      const results = await this.service.baseModel.aggregate([
        {
          $match: {
            user_id: new Types.ObjectId((req as any).user?.id),
            is_sub_shipment: false,
            status: 3,
            pickup_time: {
              $gte: startOfYear,
              $lt: startOfNextYear,
            },
          },
        },
        {
          $group: {
            _id: { $month: "$pickup_time" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const monthLabels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const countsByMonth = results.reduce((acc: any, { _id, count }: any) => {
        acc[_id] = count;
        return acc;
      }, {});

      const labels = monthLabels;
      const data = labels.map((_, index) => countsByMonth[index + 1] || 0);

      return this.APIResponseMessages.custom(res, {
        labels,
        datasets: {
          label: "Shipments shipped this year",
          data,
        },
      });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  numberOfShipmentsInThisMonth = async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
      );
      const startOfNextMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0),
      );

      const results = await this.service.baseModel.aggregate([
        {
          $match: {
            user_id: new Types.ObjectId((req as any).user?.id),
            is_sub_shipment: false,
            status: 3,
            pickup_time: {
              $gte: startOfMonth,
              $lt: startOfNextMonth,
            },
          },
        },
        {
          $group: {
            _id: { $dayOfMonth: "$pickup_time" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const daysInMonth = new Date(
        startOfNextMonth.getUTCFullYear(),
        startOfNextMonth.getUTCMonth(),
        0,
      ).getUTCDate();
      const countsByDay = results.reduce((acc: any, { _id, count }: any) => {
        acc[_id] = count;
        return acc;
      }, {});

      const labels: string[] = [];
      const data: number[] = [];
      for (let day = 1; day <= daysInMonth; day += 1) {
        labels.push(day.toString());
        data.push(countsByDay[day] || 0);
      }

      return this.APIResponseMessages.custom(res, {
        labels,
        datasets: {
          label: "Shipments shipped this month",
          data,
        },
      });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  statusOfShipments = async(req: Request, res: Response) => {
    try {
      const results = await this.service.baseModel.aggregate([
        {
          $match: {
            user_id: new Types.ObjectId((req as any).user?.id),
            is_sub_shipment: false
          }
        }, 
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ])
      const statusMap: Record<number, string> = {
        0: 'Confirmed',
        1: 'Ready to ship',
        2: 'Arrived',
        3: 'Shipped'
      }

      const countByLabel = Object.fromEntries(
        Object.values(statusMap).map(label => [label, 0])
      )

      for(const {_id: StatusCode, count} of results){
        const label = statusMap[StatusCode];
        if(label) countByLabel[label] = count
      }

      return this.APIResponseMessages.custom(res, {
        Confirmed: countByLabel['Confirmed'],
        ReadyToShip: countByLabel['Ready to ship'],
        Arrived: countByLabel['Arrived'],
        Shipped: countByLabel['Shipped']
      })
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  }

  numberOfShipments = async (req: Request, res: Response) => {
    try {
      const count = await this.service.countDocuments((req as any).user?.id, {is_sub_shipment: false});
      return this.APIResponseMessages.custom(res, {totalShipment: count});
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  }

  uniqueFilteringData = async (req: Request, res: Response) => {
    try {
      let list:any = await this.service.baseModel.aggregate([
        {
          $match: {
            user_id: new Types.ObjectId((req as any).user?.id),
            is_sub_shipment: false
          }
        },
        {
          $lookup: {
            from: 'carriers',
            localField: 'carrier',
            foreignField: '_id',
            as: 'carrier'
          }
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'destination',
            foreignField: '_id',
            as: 'destination'
          }
        },
        {
          $lookup: {
            from: 'docks',
            localField: 'dock',
            foreignField: '_id',
            as: 'dock'
          }
        },
        {
          $project: {
            pickup_time: 1,
            loading_time: 1,
            delivery_date_time: 1,
            load_code: 1,
            references: 1,
            pallets: 1,
            cartons: 1,
            kilo: 1,
            arrival_time: 1,
            departure_time: 1,
            status: 1,
            unloading_references: 1,
            comments: 1,
            cmr_status: 1,
            pod_status: 1,
            'carrier': { $arrayElemAt: ['$carrier.name', 0]},
            'destination': { $arrayElemAt: ['$destination.name', 0]},
            'dock': { $arrayElemAt: ['$dock.name', 0]}
          }
        }, 
        {
          $group: {
            _id: null,
            pickup_times: { $addToSet: "$pickup_time"},
            loading_times: { $addToSet: "$loading_time"},
            delivery_date_times: { $addToSet: "$delivery_date_time"},
            load_codes: { $addToSet: "$load_code"},
            references: { $addToSet: "$references"},
            pallets: { $addToSet: "$pallets"},
            cartons: { $addToSet: "$cartons"},
            kilos: { $addToSet: "$kilo"},
            arrival_times: { $addToSet: "$arrival_time"},
            departure_times: { $addToSet: "$departure_time" },
            statuses: { $addToSet: "$status" },
            unloading_references: { $addToSet: "$unloading_reference" },
            comments: { $addToSet: "$comments" },
            cmr_statuses: { $addToSet: "$cmr_status" },
            pod_statuses: { $addToSet: "$pod_status" },
            carriers: { $addToSet: "$carrier" },
            destinations: { $addToSet: "$destination" },
            docks: {
                $addToSet: "$dock"
            }
          }
        }
      ]).exec()
      list = list[0] || {}

      if (list && list.pickup_times) {
          // dd/mm/yyyy
          list.pickup_times = list.pickup_times.filter(Boolean).map((date: Date) => {
              const d = new Date(date)
              const day = String(d.getDate()).padStart(2, '0') // dd
              const month = String(d.getMonth() + 1).padStart(2, '0') // mm
              const year = d.getFullYear() // yyyy
              return `${day}/${month}/${year}`
          })
      }

      if (list && list.delivery_date_times) {
          // dd/mm/yyyy
          list.delivery_date_times = list.delivery_date_times.filter(Boolean).map((date: Date) => {
              const d = new Date(date)
              const day = String(d.getDate()).padStart(2, '0') // dd
              const month = String(d.getMonth() + 1).padStart(2, '0') // mm
              const year = d.getFullYear() // yyyy
              return `${day}/${month}/${year}`
          })
      }

      if (list && list.statuses) {
          list.statuses = list.statuses.map((status: number) => {
              if (status === 0) return 'Confirmed'
              if (status === 1) return 'Ready to ship'
              if (status === 2) return 'Arrived'
              if (status === 3) return 'Shipped'
              return 'Unknown'
          })
      }

      if (list && list.cmr_statuses) {
          list.cmr_statuses = list.cmr_statuses.map((status: boolean) => status ? 'Done' : 'To Do');
      }

      if (list && list.pod_statuses) {
          list.pod_statuses = list.pod_statuses.map((status: boolean) => status ? 'Done' : 'To Do');
      }

      return this.APIResponseMessages.listed(res, list);//list[0] or empty object
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  }
}

export default new Shipment();
