import type {NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Status_Codes } from "../constants/statusCodes.js";

interface JwtPayload{
    userId: string;
    role: "user" | "admin";
}
export interface AuthRequest extends Request{
    user?: JwtPayload
}

export const authMiddleware = (req: AuthRequest, res:Response, next: NextFunction):void =>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            res.status(Status_Codes.UNAUTHORIZED).json({
                message:"Authorizatoin header missing"
            })
            return;
        }
        let token = authHeader.split(" ")[1];
        if(!token){
            res.status(Status_Codes.UNAUTHORIZED).json({
                message:"Tokem missing"
            });
            return;
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    }
    catch(err)
    {
        console.log('authMiddleware error:',err);
        res.status(Status_Codes.UNAUTHORIZED).json({
            message:"Invalid or expired token"
        });
    }
};