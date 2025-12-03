import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDatabase();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'https://saadify.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json({ limit: '10mb' }));

// Routes
import router from './routes/userR.js';
import routerP from './routes/productR.js';
import routerO from './routes/orderR.js';

app.use('/api', router);
app.use('/api', routerP);
app.use('/api', routerO);

// Health check route
app.get('/', (req, res) => {
  res.send('Backend API is live 🚀');
});

// Export app for Vercel serverless
export default app;
