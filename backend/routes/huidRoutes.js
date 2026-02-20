import express from 'express';
import { verifyHuidHandler } from '../controllers/huidController.js';

const router = express.Router();

// POST /api/verify-huid
router.post('/verify-huid', verifyHuidHandler);

export default router;

