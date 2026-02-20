import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import whatsappRouter from './routes/whatsappRoutes.js';
import huidRouter from './routes/huidRoutes.js';
import priceRouter from './routes/priceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Basic security and parsing middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Global rate limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // max 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gold-guardian-backend' });
});

// API routes
app.use('/api/whatsapp', whatsappRouter);
app.use('/api', huidRouter);
app.use('/api', priceRouter);

// Not found handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Gold Guardian backend running on port ${PORT}`);
});

