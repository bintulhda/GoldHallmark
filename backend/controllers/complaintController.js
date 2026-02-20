import { saveComplaintToDatabase } from '../services/complaintService.js';

/**
 * POST /api/complaints
 * Body: { customerName, shopName, city, issueDescription }
 */
export const createComplaintHandler = async (req, res, next) => {
  try {
    const { customerName, shopName, city, issueDescription } = req.body || {};

    // Validate required fields
    if (!customerName || !shopName || !city || !issueDescription) {
      return res.status(400).json({
        error: 'Missing required fields: customerName, shopName, city, issueDescription',
      });
    }

    // Save complaint
    const result = await saveComplaintToDatabase({
      customerName,
      shopName,
      city,
      issueDescription,
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error('Error creating complaint:', err);
    return next(err);
  }
};
