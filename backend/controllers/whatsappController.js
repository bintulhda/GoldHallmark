import { handleBotCommand } from '../services/botService.js';

/**
 * WhatsApp webhook controller
 * Compatible with Twilio WhatsApp sandbox / Business API style payloads.
 */
export const handleIncomingMessage = async (req, res, next) => {
  try {
    const { Body, From } = req.body || {};

    if (!Body || !From) {
      return res.status(400).json({ error: 'Missing Body or From in payload' });
    }

    const phoneNumber = From;
    const incomingText = String(Body).trim();

    const replyText = await handleBotCommand(phoneNumber, incomingText);

    // For Twilio-style webhooks, a 200 with body is enough when using TwiML.
    // Here we just send JSON; you can adapt to TwiML if needed.
    return res.status(200).json({ message: replyText });
  } catch (err) {
    return next(err);
  }
};

