import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAdminDashboardSummary,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateBlockToggle,
} from "../controllers/adminController.js";

const AdminRoute = express.Router();

AdminRoute.get("/dashboard", authMiddleware, getAdminDashboardSummary);
AdminRoute.get("/users", authMiddleware, getAllUsers);
AdminRoute.post("/users", authMiddleware, createUser);
AdminRoute.patch("/users/:id", authMiddleware, updateUser);
AdminRoute.delete("/users/:id", authMiddleware, deleteUser);
AdminRoute.get("/users/:id", authMiddleware, getUserById);
AdminRoute.patch("/users/:id/block", authMiddleware, updateBlockToggle);

export default AdminRoute;
