import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import JWT from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Access denied.' });
    }

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string, (err, user) => {
        if (err) {
            return res.status(httpStatus.FORBIDDEN).json({ message: 'Invalid token.' });
        }

        Object.assign(req, { user });
        next();
    })
}

export default authenticateToken;