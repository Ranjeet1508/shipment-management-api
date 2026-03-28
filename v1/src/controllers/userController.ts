import BaseContoller from './baseController';
import UserService from '../services/UserService';
import {IUser} from '../interfaces/models';
import { passwordToHash } from '../scripts/utils/helper';
import { Request, response, Response } from 'express';

class User extends BaseContoller{
    constructor(){
        super(UserService, 'User')
    }

    create = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const existingUser = await this.service.findOne({ email });

            // ✅ Case 1: User already exists
            if (existingUser) {
                return this.APIResponseMessages.errorOccured(
                    res,
                    new Error("User already exists")
                );
            }

            // ✅ Hash password
            console.log("Password:", req.body.password);
            req.body.password = passwordToHash(req.body.password);

            // ✅ Create user
            const user = await this.service.create(req.body);

            return this.APIResponseMessages.created(res, user);

        } catch (error: any) {
            return this.APIResponseMessages.errorOccured(res, error);
        }
    
    }
}

export default new User;