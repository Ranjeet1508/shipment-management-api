import BaseContoller from './baseController';
import UserService from '../services/UserService';
import {IUser} from '../interfaces/models';
import { passwordToHash } from '../scripts/utils/helper';
import { Request, response, Response } from 'express';

class User extends BaseContoller{
    constructor(){
        super(UserService, 'User')
    }

    create = (req: Request, res: Response) => {
        const {email} = req.body;

        this.service.findOne({email}).then((existingUser: IUser[]) => {
            if(!existingUser){
                req.body.password = passwordToHash(req.body.password);
                this.service.create(req.body).then((response: IUser) => {
                    this.APIResponseMessages.created(res, response)
                }).catch((error: Error) => {
                    this.APIResponseMessages.errorOccured(res, error)
                })
            }
        }).catch((error: Error) => {
            this.APIResponseMessages.errorOccured(res, error)
        })
    }
}

export default new User;