import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";

const wishlistRouter = express.Router();


wishlistRouter.post("/:propertyID", protect, addToWishlist);
wishlistRouter.get("/", protect, getWishlist);
wishlistRouter.delete("/:propertyID", protect, removeFromWishlist);

export default wishlistRouter;