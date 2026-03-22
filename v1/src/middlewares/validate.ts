import {Request, Response, NextFunction} from 'express';
import {Schema} from "joi"
import httpStatuses from 'http-status'

const validate = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const {value, error} = schema.validate(req.body)

    if(error){
        const errorMessage = error.details.map(detail => detail.message).join(', ')
        res.status(httpStatuses.BAD_REQUEST).json({error: errorMessage})
        return
    }
    Object.assign(req, value)
    next()
}

export default validate