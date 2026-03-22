import BaseService from "./baseService";
import BaseModel from "../models/Docks"

class DockService extends BaseService{
    constructor(){
        super(BaseModel)
    }
}

export default new DockService()