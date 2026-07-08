import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (fileBuffer, folder = "general") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (error) {
                    console.error("Error uploading to Cloudinary:", error);
                    reject(error);
                }
                else {
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

export default uploadToCloudinary;
