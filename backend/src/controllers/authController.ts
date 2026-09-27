import type { Request,Response } from "express";
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import { Status_Codes } from "../constants/statusCodes.js";

export const register = async(req: Request, res: Response):Promise<void> =>{
    try{
        const {name , email , password} = req.body;

        if(!name || !email || !password){
            res.status(Status_Codes.BAD_REQUEST).json({
                message: "All fields are required",
            })
            return;
        }
        const existUser = await User.findOne({email});
        if(existUser){
            res.status(Status_Codes.CONFLICT).json({
                message:'User already exists'
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        res.status(Status_Codes.CREATED).json({
            message:"user registered successfully",
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
            message: "Internal Server error"
        })
    }
}
