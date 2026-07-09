import Wishlist from "../models/wishlist.model.js";

//to add property to wishlist
export const addToWishlist = async (req, res) => {
    try {
        // ✅ FIX 1: Match the route parameter case (/:propertyID)
        const propertyId = req.params.propertyID;

        if (!propertyId) {
            return res.status(400).json({ message: "Property ID is required", success: false });
        }

        // ✅ FIX 2: Find the user's existing wishlist document instead of creating a new one
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            // If no wishlist exists, create one with the property
            wishlist = await Wishlist.create({
                user: req.user._id,
                property: [propertyId]
            });
        } else {
            // Check if property is already in the array
            if (wishlist.property.includes(propertyId)) {
                return res.status(200).json({ message: "Property is already in wishlist", success: true });
            }
            // Push the new property to the existing array
            wishlist.property.push(propertyId);
            await wishlist.save();
        }

        // Populate the property details before sending back
        await wishlist.populate("property");
        res.status(200).json({ message: "Property added to wishlist", wishlist, success: true });
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
        // ✅ FIX 1: Match the route parameter case (/:propertyID)
        const propertyId = req.params.propertyID;

        if (!propertyId) {
            return res.status(400).json({ message: "Property ID is required", success: false });
        }

        // ✅ FIX 3: Use $pull to remove ONLY the property from the array, not the whole document
        const result = await Wishlist.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { property: propertyId } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Wishlist not found", success: false });
        }

        res.status(200).json({ message: "Property removed from wishlist", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error removing property from wishlist", error, success: false });
    }
}