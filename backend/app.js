import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({ path: "./config/config.env" });

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: "https://saadify.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json({ limit: "10mb" }));

// Routes
import router from "./routes/userR.js";
import routerP from "./routes/productR.js";
import routerO from "./routes/orderR.js";

app.use("/api", router);
app.use("/api", routerP);
app.use("/api", routerO);

// Health check
app.get("/", (req, res) => {
  res.send("Backend API is live 🚀");
});

// Connect to DB
connectDatabase().catch(err => console.error(err));

// Do NOT call app.listen() here
export default app;
