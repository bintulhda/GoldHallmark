import express from 'express';
import { createComplaintHandler } from '../controllers/complaintController.js';

const router = express.Router();

// POST /api/complaints
router.post('/complaints', createComplaintHandler);

export default router;
