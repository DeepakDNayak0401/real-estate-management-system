import express from "express";
import cors from "cors";
import 'dotenv/config';
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import contactRouter from "./routes/contact.routes.js";
import adminRouter from "./routes/admin.routes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

//test
console.log("BREVO_API_KEY loaded:", process.env.BREVO_API_KEY ? "YES (hidden)" : "NO - MISSING!");
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "YES (hidden)" : "NO - MISSING!");

//DB
connectDB();

//Middleware
const allowedOrigins = [
    "http://localhost:5173",
].filter(Boolean);
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express.json());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);


app.get("/", (req, res) => {
    res.send("API is running...");
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
    });

    socket.on("sendMessage", (message) => {
        io.to(message.chatId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});