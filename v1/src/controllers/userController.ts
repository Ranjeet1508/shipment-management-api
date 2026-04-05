import BaseContoller from "./baseController";
import UserService from "../services/UserService";
import { IUser } from "../interfaces/models";
import { generateAccessToken, passwordToHash } from "../scripts/utils/helper";
import { Request, Response } from "express";
import httpStatus from "http-status";

class User extends BaseContoller {
  constructor() {
    super(UserService, "User");
  }

  create = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const existingUser = await this.service.findOne({ email });

      if (existingUser) {
        return this.APIResponseMessages.errorOccured(
          res,
          new Error("User already exists"),
        );
      }

      console.log("Password:", req.body.password);
      req.body.password = passwordToHash(req.body.password);

      const user = await this.service.create(req.body);

      return this.APIResponseMessages.created(res, user);
    } catch (error: any) {
      return this.APIResponseMessages.errorOccured(res, error);
    }
  };

  login = async (req: Request, res: Response) => {
    req.body.password = passwordToHash(req.body.password);
    this.service.findOne(req.body).then((user: IUser) => {
      if (!user) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "User not found" });
      }

      const result = {
        ...user.toObject(),
        tokens: {
          accessToken: generateAccessToken({
            email: user.email,
            id: user._id,
          } as any),
          refreshToken: generateAccessToken({
            email: user.email,
            id: user._id,
          } as any),
        },
      };
      return res.status(httpStatus.OK).send(result);
    });
  };

  forgotPassword = (req: Request, res: Response) => {};

  changePassword = (req: Request, res: Response) => {
    req.body.password = passwordToHash(req.body.password);
    const user = (req as any).user;

    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    this.service.baseModel
      .findByIdAndUpdate(user.id, req.body)
      .then((updatedUser: IUser) => {
        if (updatedUser) {
          return res
            .status(httpStatus.OK)
            .send({ message: "Password changed successfully" });
        } else {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "User not found" });
        }
      })
      .catch((error: any) => {
        return this.APIResponseMessages.errorOccured(res, error);
      });
  };

  getProfile = (req: Request, res: Response) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    this.service
      .findOne({ _id: user.id })
      .then((user: IUser) => {
        if (user) {
          return this.APIResponseMessages.custom(res, user);
        } else {
          return this.APIResponseMessages.noRecordsFound(res);
        }
      })
      .catch((error: Error) => {
        return this.APIResponseMessages.errorOccured(res, error);
      });
  };

  updateBillingInformation = (req: Request, res: Response) => {
    const modifiedBody = Object.keys(req.body).reduce(
      (acc: any, key: string) => {
        return acc;
      },
      {},
    );
    const user = (req as any).user;

    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    this.service.baseModel
      .findByIdAndUpdate(user.id, modifiedBody, { new: true })
      .then((updatedUser: IUser) => {
        if (updatedUser) {
          return this.APIResponseMessages.updated(
            res,
            updatedUser.billing_information as any,
          );
        } else {
          return this.APIResponseMessages.noRecordsFound(res);
        }
      })
      .catch((error: Error) => {
        return this.APIResponseMessages.errorOccured(res, error);
      });
  };

  getBillingInformation = (req: Request, res: Response) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    this.service.baseModel
      .findOne({ _id: user.id })
      .select({
        "billing_information.compnay_name": 1,
        "billing_information.registration_tax_id": 1,
        "billing_information.vat_number": 1,
        "billing_information.billing_email": 1,
        "billing_information.contact_name": 1,
        "billing_information.phone_number": 1,
        "billing_information.billing_address": 1,
        "billing_information.city": 1,
        "billing_information.state_province": 1,
        "billing_information.country": 1,
        "billing_information.postcode": 1,
        _id: 0,
      })
      .then((user: IUser) => {
        if (user) {
          return this.APIResponseMessages.custom(res, user);
        } else {
          return this.APIResponseMessages.noRecordsFound(res);
        }
      })
      .catch((error: Error) => {
        return this.APIResponseMessages.errorOccured(res, error);
      });
  };

  uploadCompanyLogo = (req: Request, res: Response) => {};
}

export default new User();
