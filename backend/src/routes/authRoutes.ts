import express from "express";
import { login, register } from "../controllers/authController.js";

const AuthRouter = express.Router();
AuthRouter.post("/register", register);
AuthRouter.post("/login",login);


export default AuthRouter;