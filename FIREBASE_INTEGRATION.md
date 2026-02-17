# Firebase Integration Guide

Complete guide for integrating Firebase Cloud Functions into React components.

## 1. Authentication Setup

### AuthContext Hook
The `useAuth()` hook provides authentication state and methods:

```javascript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, loading, error, signup, login, logout, isAuthenticated } = useAuth()
  
  // user: Firebase user object (or null)
  // loading: boolean - true while checking auth state
  // error: string - error message (if any)
  // signup: async function(email, password)
  // login: async function(email, password)
  // logout: async function()
  // isAuthenticated: boolean - true if user is logged in
}
```

### Protected Routes
Wrap pages with `PrivateRoute` to require authentication:

```javascript
<Route
  path="/calculator"
  element={
    <PrivateRoute>
      <Calculator />
    </PrivateRoute>
  }
/>
```

## 2. Cloud Functions Usage

All functions are imported from `src/config/firebase.js` and are callable via Firebase SDK.

### Gold Rate Function
Fetches current gold prices from metals.live API.

```javascript
import { getGoldRate } from '../config/firebase'

async function fetchGoldPrice() {
  try {
    const result = await getGoldRate()
    console.log('Current Gold Rate:', result.data.rate) // ₹/gram
    console.log('Updated at:', result.data.lastUpdated)
  } catch (error) {
    console.error('Error fetching gold rate:', error.message)
  }
}
```

### Verify HUID Function
Validates hallmark identification codes.

```javascript
import { verifyHUID } from '../config/firebase'

async function checkHallmark() {
  try {
    const result = await verifyHUID({ huid: 'AB1234' })
    if (result.data.valid) {
      console.log('Jeweller:', result.data.jewellerName)
      console.log('HUID:', result.data.huid)
    } else {
      console.log('Invalid HUID')
    }
  } catch (error) {
    console.error('Error verifying HUID:', error.message)
  }
}
```

Response format:
```javascript
{
  valid: boolean,      // true if HUID exists and is valid
  huid: string,        // uppercase HUID code
  jewellerName: string // jeweller shop name
}
```

### Calculate Gold Price Function
Computes price based on weight, purity, charges, and wastage.

```javascript
import { calculateGoldPrice } from '../config/firebase'

async function calculatePrice() {
  try {
    const result = await calculateGoldPrice({
      weight: 10,      // grams
      purity: 22,      // carats (8-24)
      makingCharges: 100, // ₹
      wastage: 0.5     // percentage (0-5)
    })
    
    console.log('Base Price:', result.data.basePrice) // ₹
    console.log('Making Cost:', result.data.makingCost) // ₹
    console.log('Wastage Cost:', result.data.wastageCost) // ₹
    console.log('Final Price:', result.data.finalPrice) // ₹
  } catch (error) {
    console.error('Error calculating price:', error.message)
  }
}
```

Response format:
```javascript
{
  basePrice: number,    // price = (weight/31.103) * rate * (purity/24)
  makingCost: number,   // making charges
  wastageCost: number,  // wastage cost
  finalPrice: number    // total price
}
```

### Fraud Detection Function
Analyzes transaction for suspicious patterns.

```javascript
import { fraudCheck } from '../config/firebase'

async function checkFraud() {
  try {
    const result = await fraudCheck({
      quotedPrice: 3500,     // price jeweller quoted
      calculatedPrice: 3200, // actual calculated price
      purityClaimed: 22,     // purity jeweller claimed
      huidValid: true        // whether HUID was valid
    })
    
    console.log('Risk Score:', result.data.riskScore) // 0-100
    console.log('Verdict:', result.data.verdict)       // SAFE|SUSPICIOUS|FRAUD
    console.log('Reasons:', result.data.reasons)       // array of strings
  } catch (error) {
    console.error('Error checking fraud:', error.message)
  }
}
```

Response format:
```javascript
{
  riskScore: number,      // 0-100 (0=safe, 100=fraudulent)
  verdict: string,        // "SAFE" | "SUSPICIOUS" | "FRAUD"
  reasons: [string]       // explanation of risk factors
}
```

Risk thresholds:
- ≤ 30: SAFE
- 31-70: SUSPICIOUS
- ≥ 71: FRAUD

### Generate Complaint Function
Creates formal complaint letter and stores in database.

```javascript
import { generateComplaint } from '../config/firebase'

async function createComplaint() {
  try {
    const result = await generateComplaint({
      jewellerName: 'ABC Gold Shop',
      issue: 'Price overcharge',
      weight: 10,
      quotedPrice: 3500,
      calculatedPrice: 3200,
      location: 'Mumbai',
      riskScore: 65
    })
    
    console.log('Complaint ID:', result.data.complaintId)
    console.log('Complaint Text:', result.data.complaintText)
    console.log('Status:', result.data.status) // 'draft'
  } catch (error) {
    console.error('Error generating complaint:', error.message)
  }
}
```

Response format:
```javascript
{
  complaintId: string,   // unique complaint ID
  complaintText: string, // formatted complaint letter
  status: string,        // 'draft'
  createdAt: timestamp   // when complaint was created
}
```

### Submit Complaint Function
Changes complaint status from 'draft' to 'submitted'.

```javascript
import { submitComplaint } from '../config/firebase'

async function submitMyComplaint() {
  try {
    const result = await submitComplaint({
      complaintId: 'complaint-123'
    })
    
    console.log('Status:', result.data.status) // 'submitted'
    console.log('Submitted at:', result.data.updatedAt)
  } catch (error) {
    console.error('Error submitting complaint:', error.message)
  }
}
```

### Delete Complaint Function
Permanently deletes a complaint (owners only).

```javascript
import { deleteComplaint } from '../config/firebase'

async function removeComplaint() {
  try {
    await deleteComplaint({
      complaintId: 'complaint-123'
    })
    
    console.log('Complaint deleted successfully')
  } catch (error) {
    console.error('Error deleting complaint:', error.message)
  }
}
```

### User Profile Functions
Get and update user profile information.

```javascript
import { getUserProfile, updateUserProfile } from '../config/firebase'

// Get user profile
async function getProfile() {
  try {
    const result = await getUserProfile()
    console.log('Display Name:', result.data.displayName)
    console.log('Email:', result.data.email)
    console.log('Complaints:', result.data.complaintCount)
    console.log('Created:', result.data.createdAt)
  } catch (error) {
    console.error('Error fetching profile:', error.message)
  }
}

// Update display name
async function updateProfile() {
  try {
    const result = await updateUserProfile({
      displayName: 'John Doe'
    })
    console.log('Profile updated:', result.data.displayName)
  } catch (error) {
    console.error('Error updating profile:', error.message)
  }
}
```

Response format:
```javascript
{
  uid: string,          // user ID
  email: string,        // email address
  displayName: string,  // display name (settable)
  role: string,         // 'user' (cannot be changed by user)
  complaintCount: number, // number of complaints filed
  createdAt: timestamp,  // account creation time
  updatedAt: timestamp   // last profile update
}
```

## 3. Error Handling

All functions throw errors with structured messages. Handle them properly:

```javascript
try {
  const result = await calculateGoldPrice(params)
  // Use result.data
} catch (error) {
  if (error.code === 'unauthenticated') {
    // User not logged in
    navigate('/login')
  } else if (error.code === 'permission-denied') {
    // User doesn't have permission
    setError('You do not have permission to perform this action')
  } else if (error.code === 'invalid-argument') {
    // Invalid input parameters
    setError('Invalid input: ' + error.message)
  } else if (error.code === 'internal') {
    // Server error
    setError('Server error. Please try again later.')
  } else {
    setError(error.message)
  }
}
```

Common error codes:
- `unauthenticated`: User must log in
- `permission-denied`: User doesn't have access
- `invalid-argument`: Invalid input provided
- `internal`: Server error
- `resource-exhausted`: Rate limit exceeded

## 4. Example: Calculator Page Integration

```javascript
import { useState } from 'react'
import { getGoldRate, calculateGoldPrice, fraudCheck } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'

export default function Calculator() {
  const { user } = useAuth()
  const [weight, setWeight] = useState('')
  const [purity, setPurity] = useState('22')
  const [makingCharges, setMakingCharges] = useState('')
  const [wastage, setWastage] = useState('0.5')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleCalculate = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      setLoading(true)
      
      // Fetch current gold rate
      const rateResult = await getGoldRate()
      const currentRate = rateResult.data.rate
      
      // Calculate price
      const priceResult = await calculateGoldPrice({
        weight: parseFloat(weight),
        purity: parseInt(purity),
        makingCharges: parseFloat(makingCharges || 0),
        wastage: parseFloat(wastage)
      })
      
      // Check for fraud patterns
      const fraudResult = await fraudCheck({
        quotedPrice: priceResult.data.finalPrice,
        calculatedPrice: priceResult.data.finalPrice,
        purityClaimed: parseInt(purity),
        huidValid: true
      })
      
      setResult({
        currentRate,
        ...priceResult.data,
        fraud: fraudResult.data
      })
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="calculator">
      <form onSubmit={handleCalculate}>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Gold Weight (grams)"
          required
        />
        <select value={purity} onChange={(e) => setPurity(e.target.value)}>
          <option value="08">8 Carat</option>
          <option value="14">14 Carat</option>
          <option value="18">18 Carat</option>
          <option value="22">22 Carat</option>
          <option value="24">24 Carat</option>
        </select>
        <input
          type="number"
          value={makingCharges}
          onChange={(e) => setMakingCharges(e.target.value)}
          placeholder="Making Charges (₹)"
        />
        <input
          type="number"
          value={wastage}
          onChange={(e) => setWastage(e.target.value)}
          placeholder="Wastage (%)"
          step="0.1"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      
      {result && (
        <div className="result">
          <h3>Price Calculation</h3>
          <p>Current Rate: ₹{result.currentRate}/gram</p>
          <p>Base Price: ₹{result.basePrice.toFixed(2)}</p>
          <p>Making Cost: ₹{result.makingCost.toFixed(2)}</p>
          <p>Wastage Cost: ₹{result.wastageCost.toFixed(2)}</p>
          <h4>Final Price: ₹{result.finalPrice.toFixed(2)}</h4>
          
          <h3>Fraud Check</h3>
          <p>Risk Score: {result.fraud.riskScore}/100</p>
          <p>Verdict: {result.fraud.verdict}</p>
        </div>
      )}
    </div>
  )
}
```

## 5. Environment Variables

Ensure `.env` file is set up with Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_FUNCTIONS_REGION=us-central1
```

## 6. Testing the Integration

1. **Test login/signup**: Navigate to `/login` and `/signup`
2. **Protected routes**: Try accessing `/calculator` without logging in (should redirect to login)
3. **Call functions**: After login, test each function from the browser console
4. **Check Firestore**: View created data in Firebase Console → Firestore Database
5. **Monitor Cloud Functions**: Check function execution logs in Firebase Console

## 7. Common Patterns

### Loading States
```javascript
const [loading, setLoading] = useState(false)

async function handleSubmit() {
  setLoading(true)
  try {
    // Call function
  } finally {
    setLoading(false)
  }
}
```

### Error Messages
```javascript
const [error, setError] = useState('')

async function handleSubmit() {
  setError('')
  try {
    // Call function
  } catch (err) {
    setError(err.message)
  }
}
```

### Refetch on Update
```javascript
const [shouldRefetch, setShouldRefetch] = useState(false)

useEffect(() => {
  if (shouldRefetch) {
    // Refetch data
    setShouldRefetch(false)
  }
}, [shouldRefetch])

async function updateData() {
  // Update
  setShouldRefetch(true)
}
```

## 8. Security Notes

- All functions check authentication automatically
- Users can only access their own data (complaints, profiles)
- Admin functions are restricted to admin role
- Sensitive operations (price calculation) happen on server
- No sensitive data is exposed to client-side code
