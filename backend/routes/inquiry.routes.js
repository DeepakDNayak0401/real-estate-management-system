import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
    sendInquiry,
    getSellerInquiries,
    markInquiryAsRead,
} from "../controllers/inquiry.controller.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/", protect, authorize("buyer"), sendInquiry);
inquiryRouter.get("/seller", protect, authorize("seller"), getSellerInquiries);
inquiryRouter.put("/read/:inquiryId", protect, markInquiryAsRead);

export default inquiryRouter;