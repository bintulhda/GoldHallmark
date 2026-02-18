/**
 * Gold Guardian Cloud Functions
 * Provides serverless backend functionality for the Gold Guardian app
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function: getGoldRate
 * Fetches current gold rate from metals.live API
 * 
 * Returns:
 * {
 *   rate: number (price per gram in INR),
 *   timestamp: number (Unix timestamp),
 *   source: string ("metals.live" or "fallback"),
 *   status: "success" | "error"
 * }
 */
export const getGoldRate = functions.https.onCall(async (data, context) => {
  try {
    // Fetch from metals.live API
    const response = await axios.get(
      'https://api.metals.live/v1/spot/gold',
      {
        timeout: 5000,
        headers: {
          'User-Agent': 'Gold-Guardian-App'
        }
      }
    );

    // Extract price (in USD per ounce) and convert to INR per gram
    const priceUSD = response.data.price;
    const exchangeRate = 83; // 1 USD = 83 INR (approximate, update as needed)
    const gramsPerOunce = 31.1035;
    
    // Calculate price per gram in INR
    const ratePerGram = (priceUSD * exchangeRate) / gramsPerOunce;

    return {
      rate: Math.round(ratePerGram * 100) / 100,
      timestamp: Date.now(),
      source: 'metals.live',
      status: 'success'
    };
  } catch (error) {
    console.error('Error fetching gold rate:', error);
    
    // Return fallback rate if API fails
    return {
      rate: 7500, // Fallback rate in INR per gram
      timestamp: Date.now(),
      source: 'fallback',
      status: 'error',
      error: error.message
    };
  }
});

/**
 * Cloud Function: initializeFirestore
 * Initializes Firestore collections with sample data
 * Only callable by authenticated users
 * 
 * Collections created:
 * - huid_codes: Valid HUID codes and their associated shops
 * - complaints: User submitted complaints
 */
export const initializeFirestore = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  try {
    // Initialize HUID codes collection with sample data
    const huidsRef = db.collection('huid_codes');
    
    const sampleHUIDs = [
      {
        code: 'BIS12345',
        shop_name: 'Gold Palace Jewelers',
        city: 'Mumbai',
        state: 'Maharashtra',
        assay_office: 'Mumbai Assay Office',
        registered: true,
        last_verified: admin.firestore.Timestamp.now()
      },
      {
        code: 'BIS54321',
        shop_name: 'Royal Gold Studio',
        city: 'Delhi',
        state: 'Delhi',
        assay_office: 'Delhi Assay Office',
        registered: true,
        last_verified: admin.firestore.Timestamp.now()
      },
      {
        code: 'BIS99999',
        shop_name: 'Premium Gold House',
        city: 'Bangalore',
        state: 'Karnataka',
        assay_office: 'Bangalore Assay Office',
        registered: true,
        last_verified: admin.firestore.Timestamp.now()
      }
    ];

    // Batch write sample HUID codes
    const batch = db.batch();
    for (const huid of sampleHUIDs) {
      const docRef = huidsRef.doc(huid.code);
      batch.set(docRef, huid, { merge: true });
    }
    await batch.commit();

    return {
      status: 'success',
      message: 'Firestore initialized with sample data',
      collections_created: ['huid_codes', 'complaints'],
      sample_huids_added: sampleHUIDs.length
    };
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to initialize Firestore: ' + error.message
    );
  }
});

/**
 * Cloud Function: saveComplaint
 * Saves a complaint to Firestore
 * 
 * Request data:
 * {
 *   customerName: string,
 *   shopName: string,
 *   city: string,
 *   issue: string
 * }
 */
export const saveComplaint = functions.https.onCall(async (data, context) => {
  // Validate input
  if (!data.customerName || !data.shopName || !data.city || !data.issue) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields'
    );
  }

  try {
    const complaintsRef = db.collection('complaints');
    
    const complaint = {
      customerName: data.customerName,
      shopName: data.shopName,
      city: data.city,
      issue: data.issue,
      submittedAt: admin.firestore.Timestamp.now(),
      status: 'open'
    };

    const docRef = await complaintsRef.add(complaint);

    return {
      status: 'success',
      message: 'Complaint saved successfully',
      complaintId: docRef.id
    };
  } catch (error) {
    console.error('Error saving complaint:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to save complaint: ' + error.message
    );
  }
});

/**
 * Cloud Function: verifyHUID
 * Verifies if a HUID code is valid
 * 
 * Request data:
 * {
 *   huid: string (8-character HUID code)
 * }
 * 
 * Returns:
 * {
 *   valid: boolean,
 *   shop: {
 *     name: string,
 *     city: string,
 *     state: string,
 *     assay_office: string
 *   } | null
 * }
 */
export const verifyHUID = functions.https.onCall(async (data, context) => {
  if (!data.huid || typeof data.huid !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'HUID code required'
    );
  }

  const huid = data.huid.toUpperCase().trim();

  try {
    const docRef = db.collection('huid_codes').doc(huid);
    const doc = await docRef.get();

    if (doc.exists) {
      const shopData = doc.data();
      return {
        valid: true,
        shop: {
          name: shopData.shop_name,
          city: shopData.city,
          state: shopData.state,
          assay_office: shopData.assay_office
        }
      };
    } else {
      return {
        valid: false,
        shop: null
      };
    }
  } catch (error) {
    console.error('Error verifying HUID:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to verify HUID: ' + error.message
    );
  }
});
