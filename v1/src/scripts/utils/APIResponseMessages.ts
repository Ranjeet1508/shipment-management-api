import {Response} from "express";
import httpStatuses from 'http-status'
import { Document } from "mongoose";

class APIResponseMessages {
    field: string 

    constructor(field: string){
        this.field = field
    }

    alreadyExists(res: Response, value: string){
        return res.status(httpStatuses.CONFLICT).send({
            success: false,
            message: `${this.field} ${value} already exists`
        })
    }

    errorOccured(res: Response, error:Error){
        res.status(httpStatuses.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `An error occurred. ${error.message}`
        })
    }

    noRecordsFound(res: Response){
        res.status(httpStatuses.NOT_FOUND).send({
            success: false,
            message: `There is no such a ${this.field}`
        })
    }

    created(res: Response, created: Document | object){
        if(created instanceof Document){
            created = created.toJSON()
        }

        res.status(httpStatuses.CREATED).send({
            success: true,
            message: `${this.field} created successfully`,
            data: created
        })
    }

    updated(res: Response, updated: Document){
        res.status(httpStatuses.OK).send({
            success: true,
            message: `${this.field} updated successfully`,
            data: updated
        })
    }

    deleted(res: Response, deleted: Document){
        res.status(httpStatuses.OK).send({
            success: true,
            message: `${this.field} deleted successfully`,
            data: deleted
        })
    }

    listed(res: Response, listed: Document[]){
        res.status(httpStatuses.OK).send({
            success: true,
            message: `${this.field} listed successfully`,
            data: listed
        })
    }

    badRequest(res: Response, message: string){
        res.status(httpStatuses.BAD_REQUEST).send({
            success: false,
            message: message
        })
    }

    exceeded(res: Response, message: string){
        res.status(httpStatuses.FORBIDDEN).send({
            success: false,
            message: message
        })
    }

    custom(res: Response, data: string | object | Document){
        res.status(httpStatuses.OK).send({
            success: true,
            data: data
        })
    }
}

export default APIResponseMessages;