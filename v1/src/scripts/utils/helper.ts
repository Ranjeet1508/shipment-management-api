import CryptoJS from "crypto-js";
import JWT from "jsonwebtoken";
import { IUser } from "../../interfaces/models";

const passwordToHash = (password: string): string => {
  return CryptoJS.HmacSHA256(
    password,
    CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH!).toString(),
  ).toString();
};

const generateAccessToken = (user: IUser, time: any = `1W`): string => {
  return JWT.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
    expiresIn: time,
  });
};

const generateRefreshToken = (user: IUser, time: any = "1y"): string => {
  return JWT.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY as string, {
    expiresIn: time,
  });
};

export { passwordToHash, generateAccessToken, generateRefreshToken };
