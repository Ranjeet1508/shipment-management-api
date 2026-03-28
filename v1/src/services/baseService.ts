import {Model} from 'mongoose'

class BaseService{
    baseModel: typeof Model

    constructor(model: typeof Model){
        this.baseModel = model
    }

    list(where: object){
        return this.baseModel.find(where).sort({createdAt: -1})
    }

    create(data: object){
        return this.baseModel.create(data)
    }

    findOne(where: object){
        return this.baseModel.findOne(where)
    }

    update(user_id: string, id: string, data: object){
        return this.baseModel.findOneAndUpdate({_id: id, user_id}, data, {new: true})
    }

    delete(user_id: string, id: string){
        return this.baseModel.findOneAndDelete({_id: id, user_id})
    }

    countDocuments(user_id: string, where: object){
        return this.baseModel.countDocuments({user_id, ...where})
    }
}

export default BaseService