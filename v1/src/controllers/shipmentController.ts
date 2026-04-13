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

  list = (req: Request, res: Response) => {};

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
}

export default new Shipment();
