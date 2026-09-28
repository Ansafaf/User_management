import type { Request, Response } from "express";
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
        const { name, profileImage } = req.body as { name?: string; profileImage?: string };

        if (!name && !profileImage) {
            res.status(Status_Codes.BAD_REQUEST).json({
                message: "Name or profile image is required"
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

        if (name) user.name = name.trim();
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.status(Status_Codes.OK).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
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
        const user = await User.findByIdAndDelete(req.user?.userId);

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
