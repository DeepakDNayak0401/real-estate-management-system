import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Property from "./models/property.model.js";
import User from "./models/user.model.js";

dotenv.config();

// Data pools for random generation
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow"];
const areas = ["Andheri", "Bandra", "Connaught Place", "Indiranagar", "Koramangala", "Jubilee Hills", "Bodakdev", "Anna Nagar", "Salt Lake", "Koregaon Park", "Vaishali Nagar", "Gomti Nagar"];
const propertyTypes = ["apartment", "villa", "house", "flat", "studio", "penthouse", "plot", "commercial"];
const furnishingOptions = ["furnished", "semi-furnished", "unfurnished"];
const statuses = ["sale", "sold"];
const amenitiesList = ["Parking", "Swimming Pool", "Gym", "Lift", "Power Backup", "Security", "Garden", "Balcony", "AC", "WiFi", "Clubhouse", "Jogging Track"];

const generateRandomProperty = (index, sellerId) => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const bhk = Math.floor(Math.random() * 4) + 1; // 1 to 4 BHK
    const price = (Math.floor(Math.random() * 90) + 10) * 100000; // 10L to 1Cr
    const areaSize = (Math.floor(Math.random() * 20) + 5) * 100; // 500 to 2500 sq ft

    // Random amenities (2 to 5)
    const numAmenities = Math.floor(Math.random() * 4) + 2;
    const amenities = [];
    for (let i = 0; i < numAmenities; i++) {
        const amenity = amenitiesList[Math.floor(Math.random() * amenitiesList.length)];
        if (!amenities.includes(amenity)) amenities.push(amenity);
    }

    return {
        title: `Beautiful ${bhk} BHK ${type} in ${area}, ${city}`,
        description: `This stunning ${bhk} BHK ${type} is located in the heart of ${area}, ${city}. Featuring ${areaSize} sq ft of space, it offers modern amenities and a great view. Perfect for families looking for a comfortable home.`,
        price: price,
        city: city,
        area: area,
        pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
        propertyType: type,
        bhk: bhk.toString(),
        bathrooms: Math.max(1, bhk - 1),
        areaSize: areaSize,
        furnishing: furnishingOptions[Math.floor(Math.random() * furnishingOptions.length)],
        amenities: amenities,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        // Using picsum.photos for reliable, consistent placeholder images
        images: [
            `https://picsum.photos/seed/prop${index}img1/800/600`,
            `https://picsum.photos/seed/prop${index}img2/800/600`,
            `https://picsum.photos/seed/prop${index}img3/800/600`
        ],
        seller: sellerId,
        isVerified: true,
        views: Math.floor(Math.random() * 500)
    };
};

const seedDB = async () => {
    try {
        await connectDB();
        console.log("MongoDB Connected for seeding...");

        // ⚠️ WARNING: This clears all existing properties!
        await Property.deleteMany({});
        console.log("Cleared existing properties");

        // Find an existing seller to assign properties to
        let seller = await User.findOne({ role: "seller" });

        // If no seller exists, create a dummy one
        if (!seller) {
            console.log("No seller found in DB. Creating a dummy seller...");
            seller = await User.create({
                name: "Test Seller",
                email: "testseller@example.com",
                password: "password123",
                role: "seller",
                isApproved: true,
                isVerified: true
            });
        }
        console.log(`Assigning properties to seller: ${seller.name} (${seller._id})`);

        // Generate 100 properties
        const properties = [];
        for (let i = 1; i <= 100; i++) {
            properties.push(generateRandomProperty(i, seller._id));
        }

        await Property.insertMany(properties);
        console.log("✅ Successfully seeded 100 properties!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();