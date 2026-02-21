/**
 * Utility: Fetch live gold rate from Cloud Function
 */
import { httpsCallable } from 'firebase/functions'
import { functions } from '../config/firebase'

/**
 * Fetches current gold rate (INR per gram) from Firebase Cloud Function
 * @returns {Promise<number>} Gold rate in INR per gram
 */
export const fetchGoldRate = async () => {
  try {
    const getGoldRate = httpsCallable(functions, 'getGoldRate')
    const result = await getGoldRate({})
    return result.data.inrPerGram || 0
  } catch (error) {
    console.error('Error fetching gold rate:', error)
    // Return fallback rate if API fails
    return 7500 // Approximate fallback rate
  }
}

/**
 * Utility: Calculate gold jewellery price
 */
export const calculateGoldPrice = (weight, purity, goldRate, makingChargePercent) => {
  // Convert purity (24K, 22K, etc.) to decimal
  const purityDecimal = purity / 24

  // Calculate pure gold weight
  const pureGoldWeight = weight * purityDecimal

  // Calculate base gold value
  const goldValue = pureGoldWeight * goldRate

  // Calculate making charges
  const makingChargesValue = goldValue * (makingChargePercent / 100)

  // Calculate GST (3% on making charges + gold value)
  const gstAmount = (goldValue + makingChargesValue) * 0.03

  // Final jewellery price
  const finalPrice = goldValue + makingChargesValue + gstAmount

  // Fair buyback value (98% of gold value only)
  const buybackValue = goldValue * 0.98

  // Extra amount paid (difference between final price and buyback)
  const extraAmountPaid = finalPrice - buybackValue

  // Calculate percentage overpayment
  const overpaymentPercent = (extraAmountPaid / buybackValue) * 100

  return {
    pureGoldWeight: pureGoldWeight.toFixed(2),
    goldValue: goldValue.toFixed(2),
    makingChargesValue: makingChargesValue.toFixed(2),
    gstAmount: gstAmount.toFixed(2),
    finalPrice: finalPrice.toFixed(2),
    buybackValue: buybackValue.toFixed(2),
    extraAmountPaid: extraAmountPaid.toFixed(2),
    overpaymentPercent: overpaymentPercent.toFixed(2),
  }
}

/**
 * Determine safety verdict based on overpayment percentage
 */
export const getSafetyVerdict = (overpaymentPercent) => {
  const percent = parseFloat(overpaymentPercent)

  if (percent < 5) {
    return {
      status: 'SAFE BUY',
      color: '#10b981', // Green
      message: 'Price is fair and competitive.',
      icon: '✅',
    }
  } else if (percent >= 5 && percent < 12) {
    return {
      status: 'SUSPICIOUS',
      color: '#f59e0b', // Yellow
      message: 'Price seems slightly high. Consider comparing with other shops.',
      icon: '⚠️',
    }
  } else {
    return {
      status: 'DO NOT BUY',
      color: '#ef4444', // Red
      message: 'Price is significantly overpriced. This is likely fraud.',
      icon: '❌',
    }
  }
}
