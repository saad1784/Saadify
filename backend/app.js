import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDatabase();

const app = express();

// ✅ Middleware
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// ✅ Fix CORS (only your frontend)
app.use(
  cors({
    origin: ['https://saadify.vercel.app'], // your frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// ✅ Quick health check route (must be FAST)
app.get('/', (req, res) => {
  res.status(200).send('✅ Backend API is live and healthy 🚀');
});

// ✅ Import routes
import router from './routes/userR.js';
import routerP from './routes/productR.js';
import routerO from './routes/orderR.js';

app.use('/api', router);
app.use('/api', routerP);
app.use('/api', routerO);

// ✅ Serve frontend if you ever want full-stack deploy
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'PRODUCTION') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// ✅ Start server
const PORT = process.env.PORT || 5000;

// Small delay ensures DB + server ready before Railway checks health
setTimeout(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server started and listening on port ${PORT}`);
  });
}, 3000); // 3-second delay helps prevent Railway 502 errors
