import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAdminDashboardSummary,
  getAllUsers,
  getUserById,
} from "../controllers/adminController.js";

const AdminRoute = express.Router();

AdminRoute.get("/dashboard", authMiddleware, getAdminDashboardSummary);
AdminRoute.get("/users", authMiddleware, getAllUsers);
AdminRoute.get("/users/:id", authMiddleware, getUserById);

export default AdminRoute;

