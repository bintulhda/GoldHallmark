import { verifyHuid } from '../services/huidService.js';

/**
 * POST /api/verify-huid
 * Body: { huid: string }
 */
export const verifyHuidHandler = async (req, res, next) => {
  try {
    const { huid } = req.body || {};

    if (!huid || typeof huid !== 'string') {
      return res.status(400).json({ error: 'HUID is required' });
    }

    const result = await verifyHuid(huid);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

