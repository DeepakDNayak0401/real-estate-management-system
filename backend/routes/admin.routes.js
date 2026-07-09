import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
    getAllUsers,
    blockUser,
    deleteUser,
    getAllProperties,
    deleteProperty,
    getAllInquiries,
    getDashboardStats,
    getPendingSellers,
    approveSeller,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.use(protect, authorize("admin"));

adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:id/block", blockUser);
adminRouter.delete("/users/:id", deleteUser);

adminRouter.get("/properties", getAllProperties);
adminRouter.delete("/properties/:id", deleteProperty);

adminRouter.get("/inquiries", getAllInquiries);

adminRouter.get("/dashboard/stats", getDashboardStats);
adminRouter.get("/pending-seller-approvals", getPendingSellers);
adminRouter.patch("/sellers/:id/approve", approveSeller);

export default adminRouter;