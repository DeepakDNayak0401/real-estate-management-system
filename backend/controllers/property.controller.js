import Property from "../models/property.model.js";
import Inquiry from "../models/inquiry.model.js";
// ✅ FIX: Added missing imports for Cloudinary and JWT
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken";

//Add a property
export const addProperty = async (req, res) => {
    try {
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const result = await uploadToCloudinary(file.buffer, "property_images");
                imageUrls.push(result.secure_url);
            }
        }

        const property = await Property.create({
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price),
            city: req.body.city,
            area: req.body.area,
            pincode: req.body.pincode,
            propertyType: req.body.propertyType,
            bhk: req.body.bhk ? String(req.body.bhk) : undefined,
            bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : undefined,
            areaSize: req.body.areaSize ? Number(req.body.areaSize) : undefined,
            furnishing: req.body.furnishing,
            status: req.body.status,
            images: imageUrls,
            seller: req.user._id,
            amenities: req.body.amenities
                ? Array.isArray(req.body.amenities)
                    ? req.body.amenities
                    : (() => {
                        try {
                            return JSON.parse(req.body.amenities);
                        } catch (e) {
                            return req.body.amenities.split(",");
                        }
                    })()
                : [],
        });

        res.status(201).json({ message: "Property added successfully", property: property, success: true });
    } catch (err) {
        console.error("Error in addProperty:", err);
        res.status(500).json({ message: err.message, success: false });
    }
};

//to get my properties
export const getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ seller: req.user._id });
        res.status(200).json({ properties, success: true });
    } catch (err) {
        console.error("Error in getMyProperties:", err);
        res.status(500).json({ message: err.message, success: false });
    }
};

//update property
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        if (property.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        const fields = [
            "title",
            "description",
            "price",
            "city",
            "area",
            "pincode",
            "propertyType",
            "bhk",
            "bathrooms",
            "areaSize",
            "furnishing",
            "status",
            "amenities",
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (field === "amenities" && typeof req.body[field] === "string") {
                    try {
                        property[field] = JSON.parse(req.body[field]);
                    } catch (e) {
                        property[field] = req.body[field].split(",");
                    }
                } else {
                    property[field] = req.body[field];
                }
            }
        });

        if (req.body.existingImages) {
            try {
                const existing = JSON.parse(req.body.existingImages);
                property.images = Array.isArray(existing) ? existing : property.images;
            } catch (e) {
                console.error("Failed to parse existingImages:", e);
            }
        }

        if (req.files && req.files.length > 0) {
            let newImages = [];
            for (let file of req.files) {
                const result = await uploadToCloudinary(file.buffer, "property_images");
                newImages.push(result.secure_url);
            }
            property.images = [...property.images, ...newImages];
        }

        await property.save();

        res.json({
            success: true,
            message: "Property updated",
            property,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//to delete a property
export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }

        if (property.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        //delete images from cloudinary
        if (property.images && property.images.length > 0) {
            for (let imageUrl of property.images) {
                const publicId = imageUrl.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`property_images/${publicId}`);
            }
        }

        //delete inquiries related to this property
        await Inquiry.deleteMany({ property: property._id });

        await property.deleteOne();

        res.json({
            success: true,
            message: "Property deleted",
        });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
}

//to update the property status
export const updatePropertyStatus = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found", success: false });
        }

        if (property.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        property.status = req.body.status;
        await property.save();

        res.json({
            success: true,
            message: "Property status updated",
            property,
        });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
}

//to get all properties
export const getAllProperties = async (req, res) => {
    try {
        const {
            city,
            area,
            pincode,
            propertyType,
            bhk,
            furnishing,
            status,
            minPrice,
            maxPrice,
            amenities,
            sort,
            seller,
        } = req.query;

        let query = {
            status: "sale",
        };

        if (seller) query.seller = seller;
        if (city) query.city = new RegExp(city, "i");
        if (area) query.area = new RegExp(area, "i");
        if (pincode) query.pincode = pincode;

        if (propertyType) {
            query.propertyType = { $in: propertyType.toLowerCase().split(",") };
        }

        if (bhk) {
            if (bhk === "5+") {
                query.bhk = { $gte: "5" };
            } else {
                query.bhk = bhk;
            }
        }

        if (furnishing) {
            const furnishingArray = furnishing.split(",");
            query.furnishing = {
                $in: furnishingArray.map((f) => new RegExp(`^${f.trim()}$`, "i")),
            };
        }

        if (status) query.status = status;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice && !isNaN(minPrice)) query.price.$gte = Number(minPrice);
            if (maxPrice && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
            if (Object.keys(query.price).length === 0) delete query.price;
        }

        if (amenities) {
            query.amenities = {
                $in: amenities.split(",").map((a) => a.trim()),
            };
        }

        let sortOption = { createdAt: -1 };
        if (sort === "priceLow") sortOption = { price: 1 };
        if (sort === "priceHigh") sortOption = { price: -1 };
        if (sort === "latest") sortOption = { createdAt: -1 };

        const properties = await Property.find(query)
            .populate("seller", "name phone profilePic")
            .sort(sortOption);

        res.json({
            success: true,
            count: properties.length,
            properties,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching properties",
            error: error.message,
        });
    }
};

//to get property details
export const getPropertyDetails = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate("seller", "name email phone profilePic");
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        let visitorId = req.ip;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            try {
                const token = authHeader.split(" ")[1];
                // ✅ FIX: jwt is now imported at the top of the file
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                visitorId = decoded.id;
            } catch (err) {
                console.error("Error decoding token:", err);
            }
        }

        const isSeller = visitorId === property.seller._id.toString();
        if (!isSeller && !property.viewedBy.includes(visitorId)) {
            property.views += 1;
            property.viewedBy.push(visitorId);
            await property.save();
        }

        const similarProperties = await Property.find({
            _id: { $ne: property._id },
            city: property.city,
            area: property.area,
            propertyType: property.propertyType,
            status: property.status,
        })
            .limit(5)
            .select("title price images city area propertyType status bhk");

        res.json({
            success: true,
            property,
            similarProperties,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching property details",
            error: error.message,
        });
    }
}

//seller dashboard stats
export const getSellerDashboardStats = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const totalProperties = await Property.countDocuments({ seller: sellerId });
        const activeListings = await Property.countDocuments({ seller: sellerId, status: "sale" });
        const soldProperties = await Property.countDocuments({ seller: sellerId, status: "sold" });

        const totalInquiries = await Inquiry.countDocuments({ property: { $in: await Property.find({ seller: sellerId }).distinct('_id') } });

        const totalViews = await Property.aggregate([
            { $match: { seller: sellerId } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]);
        const totalViewsCount = totalViews.length > 0 ? totalViews[0].totalViews : 0;

        res.json({
            success: true,
            stats: {
                totalProperties,
                activeListings,
                soldProperties,
                totalInquiries,
                totalViews: totalViewsCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching seller dashboard stats",
            error: error.message
        });
    }
}

//get the property count
export const getPropertyCount = async (req, res) => {
    try {
        const counts = await Property.aggregate([
            { $match: { status: "sale" } },
            { $group: { _id: "$propertyType", count: { $sum: 1 } } }
        ]);

        const formattedCounts = counts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.json({
            success: true,
            counts: formattedCounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching property counts",
            error: error.message
        });
    }
}
