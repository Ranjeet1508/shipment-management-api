import BaseService from "./baseService";
import BaseModel from "../models/Shipments"

class ShipmentService extends BaseService{
    constructor(){
        super(BaseModel)
    }
}

export default new ShipmentService()