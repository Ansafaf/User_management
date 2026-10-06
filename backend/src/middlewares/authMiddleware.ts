import type {NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Status_Codes } from "../constants/statusCodes.js";
import User from "../models/User.js";

interface JwtPayload{
    userId: string;
    role: "user" | "admin";
}
export interface AuthRequest extends Request{
    user?: JwtPayload
}

export const authMiddleware = async(req: AuthRequest, res:Response, next: NextFunction) =>{
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
        const user = await User.findById(decoded.userId);
        if(!user){
            res.status(Status_Codes.UNAUTHORIZED).json({
                code: "ACCOUNT_DELETED",
                message:"Your account no longer exists. It may have been deleted by an administrator."
            });
            return;
        }
        if(user?.status === "Blocked"){
            res.status(Status_Codes.FORBIDDEN).json({
                code: "ACCOUNT_BLOCKED",
                message:"This account was blocked by an administrator."
            })
            return;
        }
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