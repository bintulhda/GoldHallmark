const functions = require('firebase-functions')
const admin = require('firebase-admin')
const axios = require('axios')

/**
 * Initialize Firebase Admin SDK
 */
admin.initializeApp()

/**
 * Cloud Function: Fetch Live Gold Rate
 *
 * This function fetches the current gold rate from an external API
 * and returns it in INR per gram format.
 *
 * API Used: https://api.metals.live/v1/spot/gold
 * This API provides real-time commodity prices
 *
 * Response: { inrPerGram: number }
 */
exports.getGoldRate = functions.https.onCall(async (data, context) => {
  try {
    // Log request for debugging
    console.log('Fetching gold rate...')

    /**
     * Fetch gold rate from metals.live API
     * Returns price in USD per ounce
     */
    const response = await axios.get('https://api.metals.live/v1/spot/gold', {
      timeout: 5000,
    })

    // Extract gold price in USD per ounce
    const usdPerOunce = response.data?.rate || null

    if (!usdPerOunce) {
      throw new Error('Invalid response from gold rate API')
    }

    /**
     * Convert USD per ounce to INR per gram
     * 1 ounce = 31.1035 grams
     * USD to INR conversion rate (approximate, can be updated)
     */
    const USD_TO_INR = 83 // This can be fetched from another API for accuracy
    const OUNCE_TO_GRAM = 31.1035

    const inrPerOunce = usdPerOunce * USD_TO_INR
    const inrPerGram = inrPerOunce / OUNCE_TO_GRAM

    console.log(`Gold Rate Fetched: ₹${inrPerGram.toFixed(2)}/gram`)

    return {
      success: true,
      inrPerGram: Math.round(inrPerGram * 100) / 100, // Round to 2 decimal places
      timestamp: new Date().toISOString(),
      source: 'metals.live API',
    }
  } catch (error) {
    console.error('Error fetching gold rate:', error.message)

    /**
     * Return fallback rate if API fails
     * This ensures the app still works even if the external API is down
     */
    return {
      success: false,
      inrPerGram: 7500, // Fallback rate
      message: 'Using fallback rate. Live rate unavailable.',
      error: error.message,
      timestamp: new Date().toISOString(),
    }
  }
})

/**
 * Cloud Function: Initialize Firestore Collections
 *
 * This function creates sample HUID codes in Firestore.
 * Call this function once to initialize the database.
 * Can be triggered manually via Firebase Console
 */
exports.initializeFirestore = functions.https.onCall(async (data, context) => {
  try {
    const db = admin.firestore()

    /**
     * Sample HUID codes with shop details
     * These are demo data - replace with real BIS registered codes
     */
    const sampleHuids = [
      {
        code: 'AB1234',
        valid: true,
        shop: 'Gold Palace Jewellers',
        city: 'Mumbai',
        state: 'Maharashtra',
        assayCenter: 'BIS Assay Centre, Parel',
      },
      {
        code: 'XY5678',
        valid: true,
        shop: 'Royal Jewellers',
        city: 'Delhi',
        state: 'Delhi',
        assayCenter: 'BIS Assay Centre, New Delhi',
      },
      {
        code: 'JK9012',
        valid: true,
        shop: 'Vijaya Jewellers',
        city: 'Bangalore',
        state: 'Karnataka',
        assayCenter: 'BIS Assay Centre, Bangalore',
      },
      {
        code: 'LM3456',
        valid: true,
        shop: 'Precious Gems',
        city: 'Pune',
        state: 'Maharashtra',
        assayCenter: 'BIS Assay Centre, Pune',
      },
      {
        code: 'PQ7890',
        valid: true,
        shop: 'Shri Krishna Gold',
        city: 'Ahmedabad',
        state: 'Gujarat',
        assayCenter: 'BIS Assay Centre, Ahmedabad',
      },
      {
        code: 'INVALID1',
        valid: false,
        shop: 'Unknown',
        city: 'Unknown',
        state: 'Unknown',
        assayCenter: 'Not Registered',
      },
    ]

    const huidCollection = db.collection('huid_codes')

    /**
     * Add each HUID code to Firestore
     */
    for (const huid of sampleHuids) {
      await huidCollection.doc(huid.code).set(huid)
    }

    console.log(`Initialized ${sampleHuids.length} HUID codes in Firestore`)

    return {
      success: true,
      message: `Successfully created ${sampleHuids.length} HUID codes`,
      codesCreated: sampleHuids.length,
    }
  } catch (error) {
    console.error('Error initializing Firestore:', error.message)
    return {
      success: false,
      error: error.message,
    }
  }
})

/**
 * Cloud Function: Log Complaint (Optional)
 *
 * This function can be used to log analytics about complaints
 */
exports.logComplaintAnalytics = functions.firestore
  .document('complaints/{complaintId}')
  .onCreate(async (snap, context) => {
    try {
      const complaintData = snap.data()

      // Log to console (can be upgraded to send to analytics service)
      console.log('New complaint filed:', {
        complaintId: context.params.complaintId,
        city: complaintData.city,
        shop: complaintData.shopName,
        timestamp: new Date().toISOString(),
      })

      return null
    } catch (error) {
      console.error('Error logging analytics:', error.message)
      return null
    }
  })
