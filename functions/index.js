const functions = require('firebase-functions')
const admin = require('firebase-admin')
const axios = require('axios')

admin.initializeApp()
const db = admin.firestore()

// ===========================================
// AUTHENTICATION TRIGGERS
// ===========================================

exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  try {
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      role: 'user',
      complaints: 0,
      fraudReports: 0,
    })
  } catch (error) {
    console.error('Error creating user profile:', error.message)
  }
})

exports.deleteUserProfile = functions.auth.user().onDelete(async (user) => {
  try {
    const batch = db.batch()
    
    // Delete user document
    batch.delete(db.collection('users').doc(user.uid))
    
    // Delete user's complaints
    const complaints = await db.collection('complaints').where('userId', '==', user.uid).get()
    complaints.docs.forEach((doc) => batch.delete(doc.ref))
    
    // Delete fraud logs
    const fraudLogs = await db.collection('fraudLogs').where('userId', '==', user.uid).get()
    fraudLogs.docs.forEach((doc) => batch.delete(doc.ref))
    
    await batch.commit()
  } catch (error) {
    console.error('Error deleting user profile:', error.message)
  }
})

// ===========================================
// GOLD RATE MANAGEMENT
// ===========================================

exports.getGoldRate = functions.https.onCall(async (data, context) => {
  try {
    const response = await axios.get('https://api.metals.live/v1/spot/gold', {
      timeout: 5000,
    })

    const usdPerOunce = response.data?.rate
    if (!usdPerOunce) throw new Error('Invalid API response')

    const USD_TO_INR = 83
    const OUNCE_TO_GRAM = 31.1035
    const inrPerGram = (usdPerOunce * USD_TO_INR) / OUNCE_TO_GRAM

    // Cache in Firestore
    await db.collection('goldRates').doc('current').set({
      rate24k: Math.round(inrPerGram * 100) / 100,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      source: 'metals.live',
    })

    return {
      success: true,
      rate24k: Math.round(inrPerGram * 100) / 100,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    try {
      const cached = await db.collection('goldRates').doc('current').get()
      if (cached.exists) {
        return {
          success: false,
          rate24k: cached.data().rate24k,
          message: 'Using cached rate',
        }
      }
    } catch (e) {
      //ignore
    }
    return {
      success: false,
      rate24k: 7500,
      message: 'Fallback rate',
    }
  }
})

// ===========================================
// HUID VERIFICATION
// ===========================================

exports.verifyHUID = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  
  const { huid } = data
  if (!huid) throw new functions.https.HttpsError('invalid-argument', 'HUID is required')

  try {
    const doc = await db.collection('huid_codes').doc(huid.toUpperCase()).get()
    
    if (!doc.exists) {
      return {
        valid: false,
        huid: huid.toUpperCase(),
        message: 'HUID not found in database',
        jewellerName: 'Unknown',
        registrationId: null,
      }
    }

    const data = doc.data()
    return {
      valid: data.valid || false,
      huid: huid.toUpperCase(),
      jewellerName: data.shop || 'Unknown',
      city: data.city || '',
      state: data.state || '',
      assayCenter: data.assayCenter || '',
      registrationId: data.registrationId || null,
    }
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error verifying HUID')
  }
})

// ===========================================
// PRICE CALCULATION
// ===========================================

exports.calculateGoldPrice = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  
  const { weight, purity, makingCharges, wastage } = data
  
  if (!weight || !purity) {
    throw new functions.https.HttpsError('invalid-argument', 'Weight and purity are required')
  }

  try {
    const rateDoc = await db.collection('goldRates').doc('current').get()
    const rate24k = rateDoc.exists ? rateDoc.data().rate24k : 7500

    // Calculate base price
    const basePrice = weight * (purity / 100) * rate24k
    
    // Calculate making charges
    const makingCost = (basePrice * (makingCharges || 0)) / 100
    
    // Calculate wastage
    const wastageCost = (basePrice * (wastage || 0)) / 100
    
    // Final price
    const finalPrice = basePrice + makingCost + wastageCost

    return {
      success: true,
      basePrice: Math.round(basePrice * 100) / 100,
      makingCost: Math.round(makingCost * 100) / 100,
      wastageCost: Math.round(wastageCost * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      rate24k,
    }
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error calculating price')
  }
})

// ===========================================
// FRAUD DETECTION
// ===========================================

exports.fraudCheck = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  
  const { quotedPrice, calculatedPrice, purityClaimed, huidValid } = data

  try {
    let riskScore = 0

    // Price deviation check (max 10% acceptable)
    if (quotedPrice && calculatedPrice) {
      const deviation = Math.abs((quotedPrice - calculatedPrice) / calculatedPrice) * 100
      if (deviation > 20) riskScore += 40
      else if (deviation > 10) riskScore += 20
    }

    // Invalid HUID check
    if (!huidValid) riskScore += 30

    // Purity mismatch (if claimed purity < 14k, suspicious)
    if (purityClaimed && purityClaimed < 14) riskScore += 20

    // Determine verdict
    let verdict = 'SAFE'
    if (riskScore >= 60) verdict = 'FRAUD'
    else if (riskScore >= 30) verdict = 'SUSPICIOUS'

    // Log fraud check
    await db.collection('fraudLogs').add({
      userId: context.auth.uid,
      riskScore,
      verdict,
      quotedPrice,
      calculatedPrice,
      huidValid,
      purityClaimed,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return {
      success: true,
      riskScore,
      verdict,
      recommendation: verdict === 'FRAUD' ? 'REPORT' : verdict === 'SUSPICIOUS' ? 'NEGOTIATE' : 'PROCEED',
    }
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error in fraud check')
  }
})

// ===========================================
// COMPLAINT GENERATION & STORAGE
// ===========================================

exports.generateComplaint = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  
  const { jewellerName, issue, weight, quotedPrice, calculatedPrice, location, riskScore } = data

  if (!jewellerName || !issue) {
    throw new functions.https.HttpsError('invalid-argument', 'Jeweller name and issue are required')
  }

  try {
    const complaintText = generateComplaintText({
      jewellerName,
      issue,
      weight,
      quotedPrice,
      calculatedPrice,
      location,
    })

    const complaintRef = await db.collection('complaints').add({
      userId: context.auth.uid,
      jewellerName,
      issue,
      weight: weight || null,
      quotedPrice: quotedPrice || null,
      calculatedPrice: calculatedPrice || null,
      generatedText: complaintText,
      location: location || '',
      riskScore: riskScore || 0,
      status: 'draft',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    // Update user complaint count
    await db.collection('users').doc(context.auth.uid).update({
      complaints: admin.firestore.FieldValue.increment(1),
    })

    return {
      success: true,
      complaintId: complaintRef.id,
      generatedText: complaintText,
    }
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error generating complaint')
  }
})

// ===========================================
// COMPLAINT MANAGEMENT
// ===========================================

exports.submitComplaint = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  
  const { complaintId } = data

  try {
    const complaintRef = db.collection('complaints').doc(complaintId)
    const complaint = await complaintRef.get()

    if (!complaint.exists || complaint.data().userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Cannot access this complaint')
    }

    await complaintRef.update({
      status: 'submitted',
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return { success: true, message: 'Complaint submitted successfully' }
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error submitting complaint')
  }
})

exports.deleteComplaint = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  
  const { complaintId } = data

  try {
    const complaintRef = db.collection('complaints').doc(complaintId)
    const complaint = await complaintRef.get()

    if (!complaint.exists || complaint.data().userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Cannot access this complaint')
    }

    await complaintRef.delete()

    await db.collection('users').doc(context.auth.uid).update({
      complaints: admin.firestore.FieldValue.increment(-1),
    })

    return { success: true, message: 'Complaint deleted' }
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error deleting complaint')
  }
})

// ===========================================
// USER MANAGEMENT
// ===========================================

exports.getUserProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')

  try {
    const userDoc = await db.collection('users').doc(context.auth.uid).get()
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User profile not found')
    }
    return userDoc.data()
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error fetching user profile')
  }
})

exports.updateUserProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  
  const { displayName } = data

  try {
    await db.collection('users').doc(context.auth.uid).update({
      displayName: displayName || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    return { success: true, message: 'Profile updated' }
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error updating profile')
  }
})

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function generateComplaintText(data) {
  const { jewellerName, issue, weight, quotedPrice, calculatedPrice, location } = data
  const timestamp = new Date().toLocaleDateString('en-IN')

  return `GOLD FRAUD COMPLAINT LETTER

Date: ${timestamp}
Jeweller: ${jewellerName}
Location: ${location || 'Unspecified'}

DETAILS:
Issue: ${issue}
${weight ? `Weight: ${weight}g` : ''}
${quotedPrice ? `Quoted Price: ₹${quotedPrice}` : ''}
${calculatedPrice ? `Calculated Fair Price: ₹${calculatedPrice}` : ''}

COMPLAINT:
This letter is to formally lodge a complaint regarding potential fraudulent practices by the above-mentioned jeweller. The details mentioned above indicate a discrepancy in pricing and authenticity.

REQUEST:
We kindly request immediate investigation and necessary action as per Consumer Protection Act and BIS regulations.

Yours faithfully,
Gold Guardian Consumer`
}

// ===========================================
// INITIALIZATION
// ===========================================

exports.initializeHallmarks = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin access required')

  try {
    const isAdmin = await db.collection('users').doc(context.auth.uid).get()
    if (!isAdmin.data() || isAdmin.data().role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Admin access required')
    }

    const sampleHuids = [
      { code: 'AB1234', valid: true, shop: 'Gold Palace Jewellers', city: 'Mumbai', state: 'Maharashtra', assayCenter: 'BIS Assay Centre, Parel' },
      { code: 'XY5678', valid: true, shop: 'Royal Jewellers', city: 'Delhi', state: 'Delhi', assayCenter: 'BIS Assay Centre, New Delhi' },
      { code: 'JK9012', valid: true, shop: 'Vijaya Jewellers', city: 'Bangalore', state: 'Karnataka', assayCenter: 'BIS Assay Centre, Bangalore' },
      { code: 'LM3456', valid: true, shop: 'Precious Gems', city: 'Pune', state: 'Maharashtra', assayCenter: 'BIS Assay Centre, Pune' },
    ]

    let count = 0
    for (const huid of sampleHuids) {
      await db.collection('huid_codes').doc(huid.code).set(huid)
      count++
    }

    return { success: true, initialized: count }
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error initializing hallmarks')
  }
})
