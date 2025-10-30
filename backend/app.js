import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDatabase();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
import router from './routes/userR.js';
import routerP from './routes/productR.js';
import routerO from './routes/orderR.js';

app.use('/api', router);
app.use('/api', routerP);
app.use('/api', routerO);

// Serve frontend (only in production)
const __dirname = path.resolve();
if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Health check route
app.get('/', (req, res) => {
  res.send('Backend API is live on Railway 🚀');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server started on port ${PORT}`);
});