import express from "express";
import cors from "cors";
import 'dotenv/config';
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";

// ✅ Import all routers
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

// Connect to Database
connectDB();

// Middleware
const allowedOrigins = ["http://localhost:5173"].filter(Boolean);
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

// ✅ ROUTES (Make sure these are NOT deleted or commented out!)
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);

// Test route
app.get("/", (req, res) => {
    res.send("Nestify API is running...");
});

// Socket.io Setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    socket.on("joinChat", (chatId) => socket.join(chatId));
    socket.on("sendMessage", (message) => io.to(message.chatId).emit("receiveMessage", message));
    socket.on("disconnect", () => console.log("User disconnected"));
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});