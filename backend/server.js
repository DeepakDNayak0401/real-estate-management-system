import express from "express";
import cors from "cors";
import 'dotenv/config';
import http from "http";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

//test
console.log("BREVO_API_KEY loaded:", process.env.BREVO_API_KEY ? "YES (hidden)" : "NO - MISSING!");
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "YES (hidden)" : "NO - MISSING!");

//DB
connectDB();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);


app.get("/", (req, res) => {
    res.send("API is running...");
});

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});