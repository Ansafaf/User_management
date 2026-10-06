import type { Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { Status_Codes } from "../constants/statusCodes.js";
import { Messages } from "../constants/message.js";

const getUserSummary = (user: any) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status ?? "Active",
  phone: user.phone ?? "",
  profileImage: user.profileImage ?? "",
});

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(Status_Codes.FORBIDDEN).json({ message: "Access denied. Admin only." });
      return;
    }

    const { name, email, password } = req.body;
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" ||
      !name.trim() || !email.trim() || password.length < 6) {
      res.status(Status_Codes.BAD_REQUEST).json({ message: "Name, email, and a password of at least 6 characters are required." });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) {
      res.status(Status_Codes.CONFLICT).json({ message: Messages.userAlready });
      return;
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role: "user",
    });
    res.status(Status_Codes.CREATED).json({ user: getUserSummary(user) });
  } catch (err) {
    console.log(err);
    res.status(Status_Codes.INTERNAL_SERVER).json({ message: Messages.Internal });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(Status_Codes.FORBIDDEN).json({
        message: "Access denied. Admin only."
      });
      return;
    }

    const users = await User.find({_id: {$ne: req.user.userId }}).sort({ createdAt: -1 }).lean();

    res.status(Status_Codes.OK).json({
      users: users.map(getUserSummary)
    });
  } catch (err) {
    console.log(err);
    res.status(Status_Codes.INTERNAL_SERVER).json({
      message: Messages.Internal
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
      message: Messages.Internal
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(Status_Codes.FORBIDDEN).json({ message: "Access denied. Admin only." });
      return;
    }

    const { id } = req.params;
    if (req.user.userId === id) {
      res.status(Status_Codes.BAD_REQUEST).json({ message: "You cannot delete your own admin account." });
      return;
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(Status_Codes.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    res.status(Status_Codes.OK).json({ message: "User deleted successfully." });
  } catch (err) {
    console.log(err);
    res.status(Status_Codes.INTERNAL_SERVER).json({ message: Messages.Internal });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(Status_Codes.FORBIDDEN).json({ message: "Access denied. Admin only." });
      return;
    }

    const { id } = req.params;
    const { name, email, phone, role } = req.body;
    if (typeof name !== "string" || typeof email !== "string" ||
      (phone !== undefined && typeof phone !== "string") ||
      (role !== "user" && role !== "admin") || !name.trim() || !email.trim()) {
      res.status(Status_Codes.BAD_REQUEST).json({ message: "Name, email, and a valid role are required." });
      return;
    }

    if (req.user.userId === id && role !== "admin") {
      res.status(Status_Codes.BAD_REQUEST).json({ message: "You cannot remove your own  role." });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });
    if (duplicate) {
      res.status(Status_Codes.CONFLICT).json({ message: Messages.userAlready });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(Status_Codes.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    user.name = name.trim();
    user.email = normalizedEmail;
    user.phone = phone?.trim() ?? "";
    user.role = role;
    await user.save();

    res.status(Status_Codes.OK).json({ user: getUserSummary(user) });
  } catch (err) {
    console.log(err);
    res.status(Status_Codes.INTERNAL_SERVER).json({ message: Messages.Internal });
  }
};

export const updateBlockToggle = async(req: AuthRequest, res: Response): Promise<void> =>{
  try{
    if (req.user?.role !== "admin") {
      res.status(Status_Codes.FORBIDDEN).json({ message: "Access denied. Admin only." });
      return;
    }
    const {id} = req.params;
    const {status} = req.body;
    if (status !== "Active" && status !== "Blocked") {
      res.status(Status_Codes.BAD_REQUEST).json({ message: "Status must be Active or Blocked." });
      return;
    }
    if (req.user.userId === id && status === "Blocked") {
      res.status(Status_Codes.BAD_REQUEST).json({ message: "You cannot block your own admin account." });
      return;
    }
    const user = await User.findOne({_id:id});
    if(!user){
      res.status(Status_Codes.NOT_FOUND).json({
        message:"User not found"
      });
      return;
    }
    user.status = status;
    await user.save();
    res.status(Status_Codes.OK).json({
      message: status === "Active" ? "User unblocked successfully": "User blocked successfully",
      user: getUserSummary(user),
    })
  }
  catch(err){
    console.log(err);
    res.status(Status_Codes.INTERNAL_SERVER).json({
      message:Messages.Internal
    })
  }
}

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
    const blocked = users.filter((user) => user.status === "Blocked").length;

    const recentActivity = users
      .slice()
      .sort((a, b) => Number(b.createdAt ?? 0) - Number(a.createdAt ?? 0))
      .slice(0, 5)
      .map((user) => `${user.name} joined the platform`);

    res.status(Status_Codes.OK).json({
      totalUsers,
      active,
      blocked,
      activity: recentActivity.length ? recentActivity : ["No recent activity"]
    });
  } catch (err) {
    console.log(err);
    res.status(Status_Codes.INTERNAL_SERVER).json({
      message: Messages.Internal
    });
  }
};
