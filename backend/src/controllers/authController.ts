import type { Request,Response } from "express";
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import { Status_Codes } from "../constants/statusCodes.js";
import { Messages } from "../constants/message.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async(req: Request, res: Response):Promise<void> =>{
    try{
        const {name , email , password} = req.body;

        if(!name || !email || !password){
            res.status(Status_Codes.BAD_REQUEST).json({
                message: Messages.Fields,
            })
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existUser = await User.findOne({email: normalizedEmail});
        if(existUser){
            res.status(Status_Codes.CONFLICT).json({
                message: Messages.userAlready
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword
        });
        res.status(Status_Codes.CREATED).json({
            message:Messages.UserRegister,
            user:{
             id: user._id,
             name: user.name,
             email: user.email   
            }
        });
    }
    catch(err){
        console.log(err);
        res.status(Status_Codes.INTERNAL_SERVER).json({
            message:Messages.Internal
        })
    }
}

export const login = async(req: Request, res:Response) :Promise<void> =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            res.status(Status_Codes.BAD_REQUEST).json({
                message: Messages.Fields
            })
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({
            email: normalizedEmail
        });
        const isBlocked = await user?.status === "Blocked";
        if(isBlocked){
            res.status(Status_Codes.FORBIDDEN).json({
                message: "This account was blocked by an administrator. Contact an administrator for help."
            });
            return;
        }

        if(!user){
            res.status(Status_Codes.UNAUTHORIZED).json({
                message: Messages.Invalid
            })
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            res.status(Status_Codes.UNAUTHORIZED).json({
                message:Messages.Invalid
            })
            return;
        }
        const token = generateToken({
            userId: user._id.toString(),
            role: user.role
        })
        res.status(Status_Codes.OK).json({
            message: Messages.LoginSuccess,
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        })

    }
    catch(err){
        console.log(err);

        res.status(Status_Codes.INTERNAL_SERVER).json({
            message: Messages.Internal
        })
    }
}