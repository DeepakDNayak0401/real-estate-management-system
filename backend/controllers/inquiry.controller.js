import Inquiry from "../models/inquiry.model.js";
import Property from "../models/property.model.js";

//buyer sends the enquiry to seller
export const sendInquiry = async (req, res) => {
    try {
        const { propertyId, message } = req.body;
        const property = await Property.findById(propertyId).populate("seller");

        if (!property) {
            return res.status(404).json({
                message: "Property not found",
                success: false,
            })
        }

        const inquiry = await Inquiry.create({
            property: property._id,
            buyer: req.user._id,
            seller: property.seller._id,
            message
        });
        res.status(201).json({
            success: true,
            message: "Inquiry sent successfully",
            inquiry
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

//seller view inquiries
export const getSellerInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({
            seller: req.user._id
        })
            .populate("buyer", "name, email phone")
            .populate("property", "title price images city")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: inquiries.length,
            inquiries
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

//mark inquiries read
export const markInquiryAsRead = async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const inquiry = await Inquiry.findById(inquiryId);
        if (!inquiry) {
            return res.status(404).json({
                message: "Inquiry not found",
                success: false
            })
        }
        inquiry.isRead = true;
        await inquiry.save();
        res.json({
            success: true,
            message: "Inquiry marked as read",
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}