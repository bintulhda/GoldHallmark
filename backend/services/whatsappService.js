import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const hasTwilioConfig =
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_WHATSAPP_NUMBER;

const twilioClient = hasTwilioConfig
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

/**
 * Send WhatsApp message via Twilio if configured,
 * otherwise log to console (mock mode).
 */
export const sendWhatsAppMessage = async (to, body) => {
  if (!hasTwilioConfig || !twilioClient) {
    console.log('[MOCK WHATSAPP] To:', to, 'Body:', body);
    return {
      mock: true,
      to,
      body,
    };
  }

  const from = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
  const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  const message = await twilioClient.messages.create({
    from,
    to: toFormatted,
    body,
  });

  return {
    sid: message.sid,
    to: message.to,
    status: message.status,
  };
};

