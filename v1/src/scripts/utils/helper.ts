import CryptoJS from "crypto-js";
import JWT from "jsonwebtoken";
import { IUser } from "../../interfaces/models";

const passwordToHash = (password: string): string => {
  return CryptoJS.HmacSHA256(
    password,
    CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH!).toString(),
  ).toString();
};

const generateAccessToken = (user: IUser): string => {
  return JWT.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
    expiresIn: "1W",
  });
};

const generateRefreshToken = (user: IUser): string => {
  return JWT.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY as string, {
    expiresIn: "1y",
  });
};

export { passwordToHash, generateAccessToken, generateRefreshToken };
