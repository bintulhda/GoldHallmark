import axios from 'axios';

const DEFAULT_FALLBACK_RATE = 7500; // INR per gram

export const getGoldPrice = async () => {
  try {
    const apiUrl =
      process.env.GOLD_PRICE_API ||
      'https://api.metals.live/v1/spot/gold';

    const response = await axios.get(apiUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Gold-Guardian-Backend',
      },
    });

    const priceUSD = Array.isArray(response.data)
      ? response.data[0]?.price || response.data[0]
      : response.data.price;

    const exchangeRate = Number(process.env.USD_INR_RATE) || 83;
    const gramsPerOunce = 31.1035;

    const ratePerGram = (priceUSD * exchangeRate) / gramsPerOunce;

    return {
      success: true,
      source: 'metals.live',
      ratePerGram: Math.round(ratePerGram * 100) / 100,
      currency: 'INR',
      unit: 'gram',
      timestamp: Date.now(),
    };
  } catch (err) {
    console.error('Error fetching gold price, using fallback:', err.message);

    return {
      success: true,
      source: 'fallback',
      ratePerGram: DEFAULT_FALLBACK_RATE,
      currency: 'INR',
      unit: 'gram',
      timestamp: Date.now(),
    };
  }
};

