import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  changePass,
  deleteOwn,
} from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.get("/profile", authMiddleware, getProfile);
userRoute.put("/profile", authMiddleware, updateProfile);
userRoute.post("/change-password", authMiddleware, changePass);
userRoute.delete("/account", authMiddleware, deleteOwn);

export default userRoute;
