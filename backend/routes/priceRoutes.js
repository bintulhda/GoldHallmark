import express from 'express';
import {
  getGoldPriceHandler,
  subscribeAlertsHandler,
  unsubscribeAlertsHandler,
} from '../controllers/priceController.js';

const router = express.Router();

router.get('/gold-price', getGoldPriceHandler);
router.post('/alerts/subscribe', subscribeAlertsHandler);
router.post('/alerts/unsubscribe', unsubscribeAlertsHandler);

export default router;

