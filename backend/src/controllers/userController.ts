import type { Response } from "express";
import bcrypt from "bcrypt";
import { Messages } from "../constants/message.js";
import { Status_Codes } from "../constants/statusCodes.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.userId);

        if (!user) {
            res.status(Status_Codes.NOT_FOUND).json({
                message: "User not found"
            });
            return;
        }

        res.status(Status_Codes.OK).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (err) {
        console.log(err);
        res.status(Status_Codes.INTERNAL_SERVER).json({
            message: Messages.Internal
        });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name,profileImage,  email , phone} = req.body;

        const user = await User.findById(req.user?.userId);
        if (!user) {
            res.status(Status_Codes.NOT_FOUND).json({
                message: "User not found"
            });
            return;
        }

        if(name !== undefined){
            const trimmedName = name.trim();
            if(!trimmedName){
                res.status(Status_Codes.BAD_REQUEST).json({
                    message:"Name cannot be empty"
                })
                return;
            }
            user.name = trimmedName;
        }
        if(email !== undefined){
            const normalizedEmail = email.trim().toLowerCase();
            if(normalizedEmail !== user.email){
                const existingUser = await User.findOne({email: normalizedEmail,_id: {$ne: user._id}});
                if(existingUser){
                    res.status(Status_Codes.CONFLICT).json({
                        message:"Email already in use"
                    })
                    return;
                }
                user.email = normalizedEmail;
            }
        }
        if(phone !== undefined){
            user.phone = phone;
        }
        if(profileImage !== undefined){
            user.profileImage = profileImage;
        }
        
        await user.save();

        res.status(Status_Codes.OK).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (err) {
        console.log(err);
        res.status(Status_Codes.INTERNAL_SERVER).json({
            message: Messages.Internal
        });
    }
};

export const changePass = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body as {
            currentPassword?: string;
            newPassword?: string;
            confirmPassword?: string;
        };

        if (!currentPassword || !newPassword || !confirmPassword) {
            res.status(Status_Codes.BAD_REQUEST).json({
                message: Messages.Fields
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            res.status(Status_Codes.BAD_REQUEST).json({
                message: "New password and confirm password do not match"
            });
            return;
        }

        const user = await User.findById(req.user?.userId);
        if (!user) {
            res.status(Status_Codes.NOT_FOUND).json({
                message: "User not found"
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            res.status(Status_Codes.UNAUTHORIZED).json({
                message: "Current password is incorrect"
            });
            return;
        }

        if (newPassword.length < 6) {
            res.status(Status_Codes.BAD_REQUEST).json({
                message: "New password must be at least 6 characters long"
            });
            return;
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(Status_Codes.OK).json({
            message: "Password changed successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(Status_Codes.INTERNAL_SERVER).json({
            message: Messages.Internal
        });
    }
};

export const deleteOwn = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if(!userId){
            res.status(Status_Codes.UNAUTHORIZED).json({
                message: "Unauthorized"
            })
            return;
        }
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            res.status(Status_Codes.NOT_FOUND).json({
                message: "User not found"
            });
            return;
        }

        res.status(Status_Codes.OK).json({
            message: "Account deleted successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(Status_Codes.INTERNAL_SERVER).json({
            message: Messages.Internal
        });
    }
};
