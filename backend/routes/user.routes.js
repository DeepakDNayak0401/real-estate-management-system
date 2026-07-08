import express from "express";
import { getPublicProfile, updateProfile, getProfile } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { get } from "http";

const userRouter = express.Router();

userRouter.get("/profile", protect, getProfile);
userRouter.get("/public/:id", getPublicProfile);
userRouter.put("/profile", protect, updateProfile);

export default userRouter;