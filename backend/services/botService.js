import { verifyHuid } from './huidService.js';
import { getGoldPrice } from './goldPriceService.js';
import { subscribeAlerts, unsubscribeAlerts, isSubscribed } from './alertsService.js';
import { sendWhatsAppMessage } from './whatsappService.js';

const HELP_TEXT = [
  'Welcome to Gold Guardian 🛡️',
  '',
  'Available commands:',
  '- VERIFY <HUID>  → Check hallmark authenticity',
  '- PRICE          → Get today\'s gold price',
  '- ALERT ON       → Enable gold price alerts',
  '- ALERT OFF      → Disable gold price alerts',
  '- HELP           → Show this help menu',
].join('\n');

const formatHuidResponse = (result) => {
  if (!result.validFormat) {
    return `❌ ${result.message}`;
  }

  if (!result.success) {
    return [
      '❌ HUID NOT VERIFIED',
      '',
      result.message,
      '',
      'Tip: Only buy jewellery with a valid BIS hallmark and HUID.',
    ].join('\n');
  }

  return [
    '✅ HUID VERIFIED',
    '',
    `Gold Purity: ${result.goldPurity}`,
    `Status: ${result.certificationStatus}`,
    `Jeweller: ${result.jewelerName}`,
    `Location: ${result.location}`,
    '',
    'Always check the BIS logo, purity mark, and HUID on your bill.',
  ].join('\n');
};

const formatPriceResponse = (price) => {
  return [
    '📈 Today\'s Gold Price',
    '',
    `Rate: ₹${price.ratePerGram.toLocaleString('en-IN')} per gram`,
    `Source: ${price.source}`,
    '',
    'Use this rate inside Gold Guardian to calculate fair jewellery prices.',
  ].join('\n');
};

export const handleBotCommand = async (phone, text) => {
  const trimmed = text.trim();
  const upper = trimmed.toUpperCase();

  if (upper === 'HELP' || upper === 'MENU' || upper === 'HI') {
    await sendWhatsAppMessage(phone, HELP_TEXT);
    return HELP_TEXT;
  }

  if (upper === 'PRICE') {
    const price = await getGoldPrice();
    const message = formatPriceResponse(price);
    await sendWhatsAppMessage(phone, message);
    return message;
  }

  if (upper === 'ALERT ON') {
    const result = subscribeAlerts(phone);
    const message = `🔔 ${result.message}`;
    await sendWhatsAppMessage(phone, message);
    return message;
  }

  if (upper === 'ALERT OFF') {
    const result = unsubscribeAlerts(phone);
    const message = `🔕 ${result.message}`;
    await sendWhatsAppMessage(phone, message);
    return message;
  }

  if (upper.startsWith('VERIFY ')) {
    const parts = trimmed.split(/\s+/);
    const huid = parts[1];

    if (!huid) {
      const message = '❌ Please provide a HUID after VERIFY. Example: VERIFY AB1234';
      await sendWhatsAppMessage(phone, message);
      return message;
    }

    const result = await verifyHuid(huid);
    const message = formatHuidResponse(result);
    await sendWhatsAppMessage(phone, message);
    return message;
  }

  // Fallback: try single-word HUID verification
  if (/^[A-Z0-9]{6,10}$/.test(upper)) {
    const result = await verifyHuid(upper);
    const message = formatHuidResponse(result);
    await sendWhatsAppMessage(phone, message);
    return message;
  }

  const subscribed = isSubscribed(phone);
  const fallback = [
    '🤖 I did not understand that.',
    '',
    'You can use commands like:',
    '- VERIFY AB1234',
    '- PRICE',
    subscribed ? '- ALERT OFF' : '- ALERT ON',
    '- HELP',
  ].join('\n');

  await sendWhatsAppMessage(phone, fallback);
  return fallback;
};

