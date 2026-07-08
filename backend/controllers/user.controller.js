import User from "../models/user.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
//get profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.status(200).json({ user, success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
}

//to get the public profile of a user by id
export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("name email role profilePic createdAt");
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.status(200).json({ user, success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
}


//upadte user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, removeProfilePic } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "profile_pics");
            user.profilePic = result.secure_url;
        } else if (removeProfilePic === "true") {
            user.profilePic = undefined;
        }
        const updateUser = await user.save();
        res.status(200).json({ message: "Profile updated successfully", user, success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
}