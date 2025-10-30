import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';



dotenv.config({ path: './config/config.env' });

connectDatabase();

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

import router from './routes/userR.js';
import routerP from './routes/productR.js';
import routerO from './routes/orderR.js';

app.use('/api', router);
app.use('/api', routerP);
app.use('/api', routerO);





const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server started on port ${PORT}`);
});
