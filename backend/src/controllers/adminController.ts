import type { Response } from "express";
import User from "../models/User.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { Status_Codes } from "../constants/statusCodes.js";

const getUserSummary = (user: any) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status ?? "Active",
  phone: user.phone ?? "",
  profileImage: user.profileImage ?? "",
});

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(Status_Codes.FORBIDDEN).json({
        message: "Access denied. Admin only."
      });
      return;
    }

    const users = await User.find({}).sort({ createdAt: -1 }).lean();

    res.status(Status_Codes.OK).json({
      users: users.map(getUserSummary)
    });
  } catch (err) {
    console.log(err);
    res.status(Status_Codes.INTERNAL_SERVER).json({
      message: "Internal Server error"
    });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(Status_Codes.FORBIDDEN).json({
        message: "Access denied. Admin only."
      });
      return;
    }

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(Status_Codes.NOT_FOUND).json({
        message: "User not found"
      });
      return;
    }

    res.status(Status_Codes.OK).json({
      user: getUserSummary(user)
    });
  } catch (err) {
    console.log(err);
    res.status(Status_Codes.INTERNAL_SERVER).json({
      message: "Internal Server error"
    });
  }
};

export const getAdminDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(Status_Codes.FORBIDDEN).json({
        message: "Access denied. Admin only."
      });
      return;
    }

    const users = await User.find({}).lean();
    const totalUsers = users.length;
    const active = users.filter((user) => user.status === "Active").length;
    const pending = users.filter((user) => (user.status ?? "Active") === "Pending").length;
    const blocked = users.filter((user) => (user.status ?? "Active") === "Inactive").length;

    const recentActivity = users
      .slice()
      .sort((a, b) => Number(b.createdAt ?? 0) - Number(a.createdAt ?? 0))
      .slice(0, 5)
      .map((user) => `${user.name} joined the platform`);

    res.status(Status_Codes.OK).json({
      totalUsers,
      active,
      pending,
      blocked,
      activity: recentActivity.length ? recentActivity : ["No recent activity"]
    });
  } catch (err) {
    console.log(err);
    res.status(Status_Codes.INTERNAL_SERVER).json({
      message: "Internal Server error"
    });
  }
};
