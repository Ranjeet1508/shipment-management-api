import { DockService } from "../services";
import BaseController from "./baseController";
import { Request, Response } from "express";
import { IDock } from "../interfaces/models";
import { Types } from "mongoose";
import XLSX from "xlsx";

class Dock extends BaseController {
  constructor() {
    super(DockService, "Dock", "name", true);
  }

  update = (req: Request, res: Response) => {
    console.log("req comes in update method of dock controller", req.body);
    const { name, _id } = req.body;
    const user = (req as any).user;

    try {
      this.service
        .findOne({
          user_id: user.id,
          _id,
        })
        .then((existingDock: IDock) => {
          if (!existingDock)
            return this.APIResponseMessages.noRecordsFound(res);

          if (existingDock.name === name) {
            this.service
              .update(user.id, existingDock._id.toString(), req.body)
              .then((updatedDock: IDock) => {
                return this.APIResponseMessages.updated(res, updatedDock);
              });
          } else {
            this.service
              .countDocuments(user.id, { name })
              .then((count: number) => {
                if (count === 0) {
                  this.service
                    .update(user.id, existingDock._id.toString(), req.body)
                    .then((updatedDock: IDock) => {
                      return this.APIResponseMessages.updated(res, updatedDock);
                    });
                } else {
                  return this.APIResponseMessages.alreadyExists(
                    res,
                    `Dock with name ${name} already exists`,
                  );
                }
              });
          }
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  numberOfDocks = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const count = await this.service.countDocuments(user.id, {
        deleted: false,
      });
      return this.APIResponseMessages.custom(res, { count });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  uniqueDockFilterData = async (req: Request, res: Response) => {
    try {
      const list = await this.service.baseModel
        .aggregate([
          {
            $match: {
              user_id: new Types.ObjectId((req as any).user.id),
              deleted: false,
            },
          },
          {
            $group: {
              _id: null,
              names: { $addToSet: "$name" },
              purposes: { $addToSet: "$purpose" },
              comments: { $addToSet: "$comment" },
              availabilities: { $addToSet: "$availability" },
              statuses: { $addToSet: "$status" },
            },
          },
          {
            $project: { _id: 0 },
          },
        ])
        .exec();

      const result = list[0] || {};

      if (result.statuses) {
        result.statuses = result.statuses.map((status: boolean) => ({
          key: status ? 1 : 0,
          value: status ? "Active" : "Inactive",
        }));
      }

      if (result.availabilities) {
        result.availabilities = result.availabilities.map(
          (availability: boolean) => ({
            key: availability ? 1 : 0,
            value: availability ? "Available" : "Unavailable",
          }),
        );
      }

      return this.APIResponseMessages.custom(res, result);
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  getDocks = (req: Request, res: Response) => {
    try {
      this.service.baseModel
        .find({ user_id: (req as any).user.id, deleted: false }, "_id name")
        .then((docks: IDock[]) => {
          return this.APIResponseMessages.listed(res, docks);
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  list = async (req: Request, res: Response) => {
    const filters: Record<string, any> = {
      user_id: new Types.ObjectId((req as any).user.id),
      deleted: false,
    };

    if (req.query.id !== undefined) {
      let ids = req.query.id as string | string[];

      const idArray = Array.isArray(ids) ? ids : [ids];
      filters._id = { $in: idArray.map((id) => new Types.ObjectId(id)) };
    }

    if (req.query.name !== undefined) {
      let names = req.query.name as string[];

      if (!Array.isArray(names)) {
        names = [names];
      }
      filters.name = { $in: names };
    }

    if (req.query.contact_person !== undefined) {
      let contact_persons = req.query.contact_person as string[];

      if (!Array.isArray(contact_persons)) {
        contact_persons = [contact_persons];
      }
      filters.contact_person = { $in: contact_persons };
    }

    if (req.query.contact_phone !== undefined) {
      let contact_phones = req.query.contact_phone as string[];

      if (!Array.isArray(contact_phones)) {
        contact_phones = [contact_phones];
      }
      filters.contact_phone = { $in: contact_phones };
    }

    if (req.query.contact_email !== undefined) {
      let contact_emails = req.query.contact_email as string[];

      if (!Array.isArray(contact_emails)) {
        contact_emails = [contact_emails];
      }
      filters.contact_email = { $in: contact_emails };
    }

    if (req.query.address_1 !== undefined) {
      let addresses_1 = req.query.address_1 as string[];

      if (!Array.isArray(addresses_1)) {
        addresses_1 = [addresses_1];
      }
      filters.address_1 = { $in: addresses_1 };
    }

    if (req.query.address_2 !== undefined) {
      let addresses_2 = req.query.address_2 as string[];

      if (!Array.isArray(addresses_2)) {
        addresses_2 = [addresses_2];
      }
      filters.address_2 = { $in: addresses_2 };
    }

    if (req.query.address_3 !== undefined) {
      let addresses_3 = req.query.address_3 as string[];

      if (!Array.isArray(addresses_3)) {
        addresses_3 = [addresses_3];
      }
      filters.address_3 = { $in: addresses_3 };
    }

    if (req.query.country !== undefined) {
      let countries = req.query.country as string[];

      if (!Array.isArray(countries)) {
        countries = [countries];
      }
      filters.country = { $in: countries };
    }

    if (req.query.status !== undefined) {
      let statusRaw = Array.isArray(req.query.status)
        ? (req.query.status as string[])
        : [req.query.status as string];

      const status = statusRaw
        .map((s) => {
          const str = String(s).trim();
          if (str === "1") return true;
          if (str === "0") return false;
          return null;
        })
        .filter((s) => s !== null);

      if (status.length > 0) {
        filters.status = { $in: status };
      }
    }

    const pipeline: any[] = [{ $match: filters }];

    const countPipeline = [...pipeline, { $count: "totalCount" }];
    const countResult = await this.service.baseModel
      .aggregate(countPipeline)
      .exec();
    const totalCount = countResult[0] ? countResult[0].totalCount : 0;

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: parseInt((req.query.skip as string) || "0") || 0 },
      { $limit: parseInt((req.query.limit as string) || "50") || 50 },
    );

    console.log("pipeline for listing docks", pipeline);
    let list = await this.service.baseModel.aggregate(pipeline).exec();
    console.log("list of docks after aggregation", list);

    return this.APIResponseMessages.custom(res, {
      message: "docks listed successfully",
      data: list,
      length: totalCount,
      open_page:
        parseInt(req.query.skip as string) /
          parseInt(req.query.limit as string) +
        1,
    });
  };

  uploadDocks = async (req: Request, res: Response) => {
    try {
      const files = (req as any).files;
      if (!files.excel_file) {
        return this.APIResponseMessages.badRequest(
          res,
          "excel_file is required",
        );
      }
      const file = Array.isArray(files.excel_file)
        ? files.excel_file[0]
        : files.excel_file;

      const wb = file.tempFilePath
        ? XLSX.readFile(file.tempFilePath)
        : XLSX.read(file.data, { type: "buffer" });
      const sheetName = wb.SheetNames[0];

      if (!sheetName) {
        return this.APIResponseMessages.badRequest(res, "Excel file is empty");
      }

      const sheet = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!rows.length) {
        return this.APIResponseMessages.badRequest(
          res,
          "Excel file contains no data",
        );
      }

      const docks = rows.map((row: any, index) => {
        const name = String(row["name"] || "").trim();

        if (!name) {
          throw new Error(`Name is required at row ${index + 2}`);
        }

        return {
          user_id: (req as any).user.id,
          name: name.slice(0, 128),
          purpose: row.purpose
            ? String(row["purpose"]).slice(0, 128)
            : undefined,
          comment: row.comment
            ? String(row["comment"]).slice(0, 512)
            : undefined,
          availability:
            row.availability === "Unavailable" || row.availability === "0"
              ? false
              : true,
          status:
            row.status === "Inactive" || row.status === "0" ? false : true,
        };
      });
      const inserted = [];
      for (const dock of docks) {
        if (!dock.name) {
          continue;
        }
        try {
          const doc = await this.service.baseModel.findOneAndUpdate(
            { user_id: dock.user_id, name: dock.name, deleted: false },
            dock,
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
          inserted.push(doc);
        } catch (error) {
          continue;
        }
      }
      return this.APIResponseMessages.custom(res, {
        message: "Docks uploaded successfully",
        data: inserted,
        totalRows: rows.length,
      });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };
}

export default new Dock();
