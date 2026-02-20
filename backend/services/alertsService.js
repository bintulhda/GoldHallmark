// Simple in-memory alert subscription store for development.
// Replace with a real database in production.

const subscribers = new Set();

export const subscribeAlerts = (phone) => {
  subscribers.add(phone);
  return {
    success: true,
    subscribed: true,
    phone,
    totalSubscribers: subscribers.size,
    message: 'Gold price alerts enabled for this number.',
  };
};

export const unsubscribeAlerts = (phone) => {
  subscribers.delete(phone);
  return {
    success: true,
    subscribed: false,
    phone,
    totalSubscribers: subscribers.size,
    message: 'Gold price alerts disabled for this number.',
  };
};

export const isSubscribed = (phone) => subscribers.has(phone);

