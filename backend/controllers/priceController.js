import { getGoldPrice } from '../services/goldPriceService.js';
import {
  subscribeAlerts,
  unsubscribeAlerts,
} from '../services/alertsService.js';

export const getGoldPriceHandler = async (req, res, next) => {
  try {
    const price = await getGoldPrice();
    return res.json(price);
  } catch (err) {
    return next(err);
  }
};

export const subscribeAlertsHandler = async (req, res, next) => {
  try {
    const { phone } = req.body || {};

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ error: 'phone is required' });
    }

    const result = subscribeAlerts(phone);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const unsubscribeAlertsHandler = async (req, res, next) => {
  try {
    const { phone } = req.body || {};

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ error: 'phone is required' });
    }

    const result = unsubscribeAlerts(phone);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

