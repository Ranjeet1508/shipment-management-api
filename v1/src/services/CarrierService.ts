import BaseService from "./baseService";
import BaseModel from "../models/Carriers"

class CarrierService extends BaseService {
    constructor(){
        super(BaseModel)
    }
}

export default new CarrierService()