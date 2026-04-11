import { CarrierService } from "../services";
import BaseController from "./baseController";
import { Request, Response } from "express";
import { ICarrier } from "../interfaces/models";
import { Types } from "mongoose";

class Carrier extends BaseController {
  constructor() {
    super(CarrierService, "Carrier", "name", true);
  }

  update = (req: Request, res: Response) => {
    console.log("req comes in update method of carrier controller", req.body);
    const { name, _id } = req.body;
    const user = (req as any).user;

    try {
      this.service
        .findOne({
          user_id: user.id,
          _id,
        })
        .then((existingCarrier: ICarrier) => {
          if (!existingCarrier)
            return this.APIResponseMessages.noRecordsFound(res);

          if (existingCarrier.name === name) {
            this.service
              .update(user.id, existingCarrier._id.toString(), req.body)
              .then((updatedCarrier: ICarrier) => {
                return this.APIResponseMessages.updated(res, updatedCarrier);
              });
          } else {
            this.service
              .countDocuments(user.id, { name })
              .then((count: number) => {
                if (count === 0) {
                  this.service
                    .update(user.id, existingCarrier._id.toString(), req.body)
                    .then((updatedCarrier: ICarrier) => {
                      return this.APIResponseMessages.updated(
                        res,
                        updatedCarrier,
                      );
                    });
                } else {
                  return this.APIResponseMessages.alreadyExists(
                    res,
                    `Carrier with name ${name} already exists`,
                  );
                }
              });
          }
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  };

  numberOfCarriers = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const count = await this.service.countDocuments(user.id, {deleted: false});
      return this.APIResponseMessages.custom(res, {count});
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  }

  uniqueCarrierFilterData = async(req: Request, res: Response) => {
    try {
      const list = await this.service.baseModel.aggregate([
        {
          $match: {
            user_id: new Types.ObjectId((req as any).user.id),
            deleted: false
          }
        },
        {
          $group: {
            _id: null, 
            names: { $addToSet: "$name" },
            contact_persons: { $addToSet: "$contact_person" },
            contact_phones: { $addToSet: "$contact_phone" },
            contact_emails: { $addToSet: "$contact_email"},
            addresses_1: { $addToSet: "$address_1" },
            addresses_2: { $addToSet: "$address_2" },
            addresses_3: { $addToSet: "$address_3" },
            countries: { $addToSet: "$country" },
            comments: { $addToSet: "$comment" },
            statuses: { $addToSet: "$status" }

          }
        },
        {
          $project: { _id: 0 }
        }
      ]).exec();

      const result = list[0] || {};

      if(result.statuses){
        result.statuses = result.statuses.filter((status: boolean) => ({
          key: status ? 1 : 0,
          value: status ? "Active" : "Inactive"
        }))
      }
    }
    catch(error){
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  }

  getCarriers = (req: Request, res: Response) => {
    try {
      this.service.baseModel.find({user_id: (req as any).user.id, deleted: false}, '_id name').then((carriers: ICarrier[]) => {
        return this.APIResponseMessages.listed(res, carriers);
      })
    } catch (error) {
      return this.APIResponseMessages.errorOccured(res, error as Error);
    }
  }
 
  list = async(req: Request, res: Response) => {
    const filters: Record<string, any> = {user_id: new Types.ObjectId((req as any).user.id), deleted: false};

    if(req.query.id !== undefined){
      let ids = req.query.id as string | string[];

      const idArray = Array.isArray(ids) ? ids : [ids];
      filters._id = {$in: idArray.map(id => new Types.ObjectId(id))};
    }

    if(req.query.name !== undefined){
      let names = req.query.name as string[];

      if(!Array.isArray(names)){
        names = [names];
      }
      filters.name = {$in: names};
    }

    if(req.query.contact_person !== undefined){
      let contact_persons = req.query.contact_person as string[];

      if(!Array.isArray(contact_persons)){
        contact_persons = [contact_persons];
      }
      filters.contact_person = {$in: contact_persons};
    }

    if(req.query.contact_phone !== undefined){
      let contact_phones = req.query.contact_phone as string[];

      if(!Array.isArray(contact_phones)){
        contact_phones = [contact_phones];
      }
      filters.contact_phone = {$in: contact_phones};
    }

    if(req.query.contact_email !== undefined){
      let contact_emails = req.query.contact_email as string[];

      if(!Array.isArray(contact_emails)){
        contact_emails = [contact_emails];
      }
      filters.contact_email = {$in: contact_emails};
    }

    if(req.query.address_1 !== undefined){
      let addresses_1 = req.query.address_1 as string[];

      if(!Array.isArray(addresses_1)){
        addresses_1 = [addresses_1];
      }
      filters.address_1 = {$in: addresses_1};
    }

    if(req.query.address_2 !== undefined){
      let addresses_2 = req.query.address_2 as string[];

      if(!Array.isArray(addresses_2)){
        addresses_2 = [addresses_2];
      }
      filters.address_2 = {$in: addresses_2};
    }

    if(req.query.address_3 !== undefined){
      let addresses_3 = req.query.address_3 as string[];

      if(!Array.isArray(addresses_3)){
        addresses_3 = [addresses_3];
      }
      filters.address_3 = {$in: addresses_3};
    }

    if(req.query.country !== undefined){
      let countries = req.query.country as string[];

      if(!Array.isArray(countries)){
        countries = [countries];
      }
      filters.country = {$in: countries};
    }

    if(req.query.status !== undefined){
      let statusRaw = Array.isArray(req.query.status) ? req.query.status as string[] : [req.query.status as string];

      const status = statusRaw.map(s => {
        const str = String(s).trim();
        if(str === "1") return true;
        if(str === "0") return false;
        return null;
      }).filter(s => s !== null)
      
      if(status.length > 0){
        filters.status = {$in: status};
      }
    }

    const pipeline: any[] = [
      { $match: filters }  
    ]

    const countPipeline = [...pipeline, { $count: 'totalCount'}];
    const countResult = await this.service.baseModel.aggregate(countPipeline).exec();
    const totalCount = countResult[0] ? countResult[0].totalCount : 0;

    pipeline.push(
      { $sort: {createdAt: -1} },
      { $skip: parseInt(req.query.skip as string || '0') || 0 },
      { $limit: parseInt(req.query.limit as string || '50') || 50}
    )

    console.log("pipeline for listing carriers", pipeline);
    let list = await this.service.baseModel.aggregate(pipeline).exec();
    console.log("list of carriers after aggregation", list);

    return this.APIResponseMessages.custom(res, {
      "message" : "carriers listed successfully",
      "data": list,
      "length": totalCount,
      "open_page": parseInt(req.query.skip as string)/(parseInt(req.query.limit as string)) + 1
    });
  }

  uploadCarriers = () => {}
}

export default new Carrier();
