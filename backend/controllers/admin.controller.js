import User from "../models/user.model.js";
import Property from "../models/property.model.js";
import Inquiry from "../models/inquiry.model.js";
import Wishlist from "../models/wishlist.model.js";
import Contact from "../models/contact.model.js";
import Chat from "../models/chat.model.js";
import cloudinary from "../config/cloudinary.js";

//view all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ users, success: true, count: users.length });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users", error, success: false });
    }
}

//block or unblock a user
export const blockUser = async (req, res) => {
    try {
        const userId = req.params.id; // ✅ Fixed: was req.params.userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.status(200).json({
            message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
            isBlocked: user.isBlocked,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Error blocking user",
            error,
            success: false
        });
    }
}

//to delete a user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; // ✅ Fixed: was req.params.userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Delete user's properties and their images from Cloudinary
        const userProperties = await Property.find({ seller: userId });
        for (const property of userProperties) {
            if (property.images && property.images.length > 0) {
                for (const imageUrl of property.images) {
                    try {
                        const publicId = imageUrl.split("/").pop().split(".")[0];
                        await cloudinary.uploader.destroy(`property_images/${publicId}`);
                    } catch (err) {
                        console.error("Error deleting image from Cloudinary:", err);
                    }
                }
            }
        }
        await Property.deleteMany({ seller: userId });

        // Delete inquiries where user is buyer or seller
        await Inquiry.deleteMany({ $or: [{ buyer: userId }, { seller: userId }] });

        // Delete user's wishlist
        await Wishlist.deleteMany({ user: userId });

        // Delete chats involving this user
        await Chat.deleteMany({ $or: [{ buyer: userId }, { seller: userId }] });

        // Finally delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User and associated data deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error, success: false });
    }
}

//view all the properties
export const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate("seller", "name email");
        res.status(200).json({ properties, success: true, count: properties.length });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving properties", error, success: false });
    }
}

//to delete a property
export const deleteProperty = async (req, res) => {
    try {
        const propertyId = req.params.id; // ✅ Fixed: was req.params.propertyId
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }

        // Delete images from Cloudinary
        if (property.images && property.images.length > 0) {
            for (const imageUrl of property.images) {
                try {
                    const publicId = imageUrl.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(`property_images/${publicId}`);
                } catch (err) {
                    console.error("Error deleting image from Cloudinary:", err);
                }
            }
        }

        // Delete inquiries related to this property
        await Inquiry.deleteMany({ property: propertyId });

        // Delete the property
        await Property.findByIdAndDelete(propertyId);

        res.status(200).json({ message: "Property deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error deleting property", error, success: false });
    }
}

//to view all the inquiries
export const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find()
            .populate("property", "title location price")
            .populate("buyer", "name email")
            .populate("seller", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ inquiries, success: true, count: inquiries.length });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving inquiries", error, success: false });
    }
}

//dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProperties = await Property.countDocuments();
        const activeListings = await Property.countDocuments({ status: "sale" });
        const soldProperties = await Property.countDocuments({ status: "sold" });
        const totalInquiries = await Inquiry.countDocuments();
        const totalWishlistItems = await Wishlist.countDocuments();
        const totalContacts = await Contact.countDocuments();
        res.status(200).json({
            stats: {
                totalUsers,
                totalProperties,
                activeListings,
                soldProperties,
                totalInquiries,
                totalWishlistItems,
                totalContacts
            },
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving dashboard statistics", error, success: false });
    }
}

//to get pending seller account
export const getPendingSellers = async (req, res) => {
    try {
        const pendingSellers = await User.find({ role: "seller", isApproved: false }).select("-password");
        res.status(200).json({ pendingSellers, success: true, count: pendingSellers.length });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving pending sellers", error, success: false });
    }
}

//to approve a seller account
export const approveSeller = async (req, res) => {
    try {
        const sellerId = req.params.id; // ✅ Fixed: was req.params.sellerId
        const seller = await User.findById(sellerId);
        if (!seller || seller.role !== "seller") {
            return res.status(404).json({ message: "Seller not found", success: false });
        }
        seller.isApproved = true;
        await seller.save();
        res.status(200).json({ message: "Seller approved successfully", seller: seller, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error approving seller", error, success: false });
    }
}