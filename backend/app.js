// backend/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import your routes
import routerUser from "./routes/userR.js";
import routerProduct from "./routes/productR.js";
import routerOrder from "./routes/orderR.js";
import { connectDatabase } from "./config/db.js";

dotenv.config({ path: "./config/config.env" });

const app = express();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "https://saadify.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api", routerUser);
app.use("/api", routerProduct);
app.use("/api", routerOrder);

// Health check
app.get("/", (req, res) => {
  res.send("Backend API is live 🚀");
});

// Connect to DB
connectDatabase().catch((err) => console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});