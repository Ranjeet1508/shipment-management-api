import BaseService from "./baseService";
import BaseModel from "../models/Users";

class UserService extends BaseService{
    constructor(){
        super(BaseModel)
    }
}

export default new UserService();