import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/user.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

// List of names to generate users
const names = [
    "Rahul", "Priya", "Amit", "Sneha", "Rohan", "Anjali", "Vikram", "Pooja",
    "Arjun", "Neha", "Karan", "Riya", "Siddharth", "Meera", "Aditya", "Kavya",
    "Rohit", "Divya", "Manish", "Tanvi", "Aarav", "Isha", "Kabir", "Nisha"
];

const seedUsers = async () => {
    try {
        await connectDB();
        console.log("MongoDB Connected for seeding users...");

        // ⚠️ WARNING: This clears all existing users! 
        await User.deleteMany({});
        console.log("Cleared existing users");

        const plainPassword = "123456";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const users = [];

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const email = `${name.toLowerCase()}@yopmail.com`;

            // Alternate roles: even index = buyer, odd index = seller
            const role = i % 2 === 0 ? "buyer" : "seller";

            users.push({
                name,
                email,
                password: hashedPassword,
                role,
                isVerified: true,       // ✅ Verified for ALL users
                isApproved: role === "seller", // ✅ Approved ONLY for sellers (false for buyers)
                phone: `98765${String(43210 + i).padStart(5, '0')}`, // Dummy phone numbers
                address: `${i + 1} Main Street, Metro City`,
            });
        }

        await User.insertMany(users);

        console.log("✅ Successfully seeded users!");
        console.log(`👥 Total Users: ${users.length} (${users.filter(u => u.role === 'buyer').length} Buyers, ${users.filter(u => u.role === 'seller').length} Sellers)`);
        console.log("📧 Email format: {name}@yopmail.com (e.g., rahul@yopmail.com)");
        console.log("🔑 Password for all users: 123456");
        console.log("💡 Tip: Go to MongoDB Atlas/Compass to change one user's role to 'admin'.");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();