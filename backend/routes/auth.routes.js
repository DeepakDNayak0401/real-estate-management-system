import express from "express";
import { registerUser, loginUser, verifyEmail, getProfile, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { get } from "http";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

authRouter.post("/verify-email", verifyEmail);
authRouter.get("/me", protect, getProfile);

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;