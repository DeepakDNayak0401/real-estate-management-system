import express from "express";
import {
    registerUser,
    loginUser,
    verifyEmail,
    getProfile,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

// ✅ Auth Routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser); // <--- This is the route that was returning 404
authRouter.post("/verify-email", verifyEmail);
authRouter.get("/me", protect, getProfile);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;