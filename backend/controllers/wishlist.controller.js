import Wishlist from "../models/wishlist.model.js";

//to add property to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;

        const existing = await Wishlist.findOne({
            user: req.user._id,
            property: propertyId
        });

        if (!existing) {
            const wishlist = await Wishlist.create({
                user: req.user._id,
                property: [propertyId]
            });
            res.status(201).json({ message: "Property added to wishlist", wishlist });
        } else {
            res.status(200).json({ message: "Property is already in wishlist", success: true });
        }
    } catch (error) {
        res.status(500).json({ message: "Error adding property to wishlist", error, success: false });
    }
};


//to get the properties in the wishlist
export const getWishlist = async (req, res) => {
    try {
        const data = await Wishlist.findOne({ user: req.user._id }).populate("property");
        res.status(200).json({ wishlist: data, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving wishlist", error, success: false });
    }
}


//to remove a property from the wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const result = await Wishlist.findOneAndDelete({
            user: req.user._id,
            property: propertyId
        });

        if (!result) {
            return res.status(404).json({ message: "Property not found in wishlist", success: false });
        }

        res.status(200).json({ message: "Property removed from wishlist", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error removing property from wishlist", error, success: false });
    }
}