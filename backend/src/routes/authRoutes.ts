import express from "express";
import { register } from "../controllers/authController.js";

const AuthRouter = express.Router();
AuthRouter.post("/register", register);



export default AuthRouter;