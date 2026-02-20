import express from 'express';
import rateLimit from 'express-rate-limit';
import { handleIncomingMessage } from '../controllers/whatsappController.js';

const router = express.Router();

// Stricter rate limit for bot webhook
const whatsappLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/webhook', whatsappLimiter, handleIncomingMessage);

export default router;

