import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://deepudeenayak77_db_user:LhjLZvuNj9qOEilh@cluster0.umbgsk7.mongodb.net/RealEstate").then(() => {
            console.log("MongoDB connected successfully");
        })
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}