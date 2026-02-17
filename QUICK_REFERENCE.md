# Quick Reference: Commands & Code Snippets

Essential commands and code snippets for daily development.

## Setup Commands

```bash
# Initial setup (run once)
npm install
cd goldhallmark && npm install && cd ..
cd functions && npm install && cd ..

# Get Firebase credentials
# Visit: https://console.firebase.google.com
# Project Settings → Web App → Copy config

# Edit .env with Firebase credentials
echo "VITE_FIREBASE_API_KEY=..." > .env

# Enable services in Firebase Console
# - Authentication (Email/Password)
# - Firestore Database
# - Cloud Functions
```

## Development Commands

```bash
# Start development server
cd goldhallmark
npm run dev

# In another terminal, start Firebase emulator
firebase emulators:start

# View Firebase logs
firebase functions:log

# Test specific function
firebase functions:log -c functionName

# Open browser to localhost
http://localhost:5173
```

## Deployment Commands

```bash
# Login to Firebase (first time)
firebase login

# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules

# Deploy with force (if needed)
firebase deploy --only functions --force

# Monitor deployment
firebase functions:log -n 50
```

## Building

```bash
# Build production frontend
cd goldhallmark
npm run build

# Output goes to: goldhallmark/dist/

# Test production build locally
npx serve goldhallmark/dist
# Visit: http://localhost:3000
```

## Testing

```bash
# Clear browser cache
# Windows: Ctrl+Shift+Delete
# Mac: Command+Shift+Delete

# View browser console
# F12 or Ctrl+Shift+I or Command+Option+I

# Test in browser console
getGoldRate()
  .then(r => console.log(r.data.rate))
  .catch(e => console.error(e.message))

# Clear localStorage (logout forcefully)
localStorage.clear()
```

## Code Snippets

### Import Firebase Functions

```javascript
import {
  getGoldRate,
  verifyHUID,
  calculateGoldPrice,
  fraudCheck,
  generateComplaint,
  submitComplaint,
  deleteComplaint,
  getUserProfile,
  updateUserProfile
} from '../config/firebase'
```

### Use Auth Hook

```javascript
import { useAuth } from '../contexts/AuthContext'

export function MyComponent() {
  const { user, loading, isAuthenticated, logout } = useAuth()
  
  if (loading) return <p>Loading auth state...</p>
  if (!isAuthenticated) return <p>Not logged in</p>
  
  return (
    <>
      <p>Welcome, {user.email}</p>
      <button onClick={logout}>Logout</button>
    </>
  )
}
```

### Fetch Gold Rate

```javascript
async function getPrice() {
  try {
    const result = await getGoldRate()
    const rate = result.data.rate // ₹/gram
    console.log('Gold Rate:', rate)
  } catch (error) {
    console.error('Error:', error.message)
  }
}
```

### Verify HUID

```javascript
async function checkHallmark(huid) {
  try {
    const result = await verifyHUID({ huid })
    if (result.data.valid) {
      console.log('Valid HUID:', result.data.jewellerName)
    } else {
      console.log('Invalid HUID')
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}
```

### Calculate Gold Price

```javascript
async function calculatePrice(weight, purity) {
  try {
    const result = await calculateGoldPrice({
      weight,
      purity,
      makingCharges: 200,
      wastage: 0.5
    })
    console.log('Final Price:', result.data.finalPrice)
  } catch (error) {
    console.error('Error:', error.message)
  }
}
```

### Check for Fraud

```javascript
async function detectFraud(quoted, calculated) {
  try {
    const result = await fraudCheck({
      quotedPrice: quoted,
      calculatedPrice: calculated,
      purityClaimed: 22,
      huidValid: true
    })
    console.log('Risk Score:', result.data.riskScore)
    console.log('Verdict:', result.data.verdict) // SAFE|SUSPICIOUS|FRAUD
  } catch (error) {
    console.error('Error:', error.message)
  }
}
```

### Generate Complaint

```javascript
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
    console.log('Formal Letter:', result.data.complaintText)
  } catch (error) {
    console.error('Error:', error.message)
  }
}
```

### Get User Profile

```javascript
async function getProfile() {
  try {
    const result = await getUserProfile()
    console.log('Profile:', result.data)
  } catch (error) {
    console.error('Error:', error.message)
  }
}
```

### Update User Profile

```javascript
async function updateName(newName) {
  try {
    const result = await updateUserProfile({
      displayName: newName
    })
    console.log('Updated:', result.data.displayName)
  } catch (error) {
    console.error('Error:', error.message)
  }
}
```

## Common Error Codes

```javascript
error.code // One of:
// - 'unauthenticated' → User must login
// - 'permission-denied' → No access
// - 'invalid-argument' → Bad input
// - 'internal' → Server error
// - 'resource-exhausted' → Rate limit
```

## React Component Template

```javascript
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { yourFunction } from '../config/firebase'
import '../styles/yourpage.css'

export default function YourPage() {
  const { user, isAuthenticated } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAction = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      setLoading(true)
      const result = await yourFunction({ /* params */ })
      setData(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <p>Please login to access this page</p>
  }

  return (
    <div className="page-container">
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleAction}>
        {/* Form fields */}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {data && <div className="result">{/* Display data */}</div>}
    </div>
  )
}
```

## CSS Classes Available

```css
/* Theme Variables */
--color-primary           /* Main app color */
--color-gold-main         /* #D9A945 */
--color-gold-light        /* #E8D5B7 */
--color-text-primary      /* Main text color */
--color-text-secondary    /* Secondary text */

--spacing-sm              /* 8px */
--spacing-md              /* 16px */
--spacing-lg              /* 24px */
--spacing-xl              /* 32px */

--radius-sm               /* 8px */
--radius-md               /* 12px */
--radius-lg               /* 16px */

--glass-blur-md           /* 12px backdrop blur */
--glass-bg-dark           /* Glass background */
--glass-border-light      /* Glass border color */
--glass-shadow-md         /* Glass shadow */

--transition-base         /* 0.3s */
--glow-sm                 /* Gold glow effect */

/* Component Classes (Use in HTML) */
.navbar                   /* Navigation bar */
.navbar-logo              /* Logo text */
.navbar-auth              /* Auth button */
.navbar-logout            /* Logout button */

.auth-container           /* Auth page container */
.auth-card                /* Auth form card */
.auth-header              /* Auth heading */
.auth-form                /* Form element */
.auth-button              /* Submit button */
.auth-error               /* Error message */
.auth-link                /* Link styling */

.form-input               /* Form fields */
.form-group               /* Input group */
.form-label               /* Input labels */

.loading-spinner          /* Loading animation */
.error-message            /* Error display */
.status-message           /* Status display */
```

## File Locations Reference

```
Frontend Code:
  Components: goldhallmark/src/components/
  Pages: goldhallmark/src/pages/
  Styles: goldhallmark/src/styles/
  Config: goldhallmark/src/config/
  Context: goldhallmark/src/contexts/

Backend Code:
  Functions: functions/index.js
  Rules: functions/firestore.rules
  Config: firebase.json

Documentation:
  Auth: AUTHENTICATION.md
  Integration: FIREBASE_INTEGRATION.md
  Deployment: FIREBASE_DEPLOYMENT.md
  Setup: QUICK_START_SETUP.md
  Status: IMPLEMENTATION_STATUS.md
```

## Environment Variables

```env
# Firebase Web Config (from Firebase Console)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Optional: Functions Region
VITE_FIREBASE_FUNCTIONS_REGION=us-central1

# Optional: Emulator Settings
# VITE_FIREBASE_EMULATOR=true
# VITE_FIREBASE_AUTH_EMULATOR_PORT=9099
# VITE_FIREBASE_DB_EMULATOR_PORT=8080
```

## Firestore Collections Reference

```javascript
// Structure for reference
users/{uid}
  ├── email: string
  ├── displayName: string
  ├── role: "user"
  ├── complaintCount: number
  ├── createdAt: timestamp
  └── updatedAt: timestamp

huid_codes/{huid}
  ├── huid: string
  ├── shop: string
  ├── valid: boolean
  └── verified: boolean

goldRates
  └── current
      ├── rate: number
      └── lastUpdated: timestamp

complaints/{id}
  ├── userId: string
  ├── jewellerName: string
  ├── status: "draft|submitted"
  └── createdAt: timestamp

fraudLogs/{id}
  ├── userId: string
  ├── riskScore: number
  ├── verdict: string
  └── createdAt: timestamp

admin_logs/{id}
  ├── action: string
  ├── adminId: string
  └── timestamp: timestamp
```

## Keyboard Shortcuts

```
F12 or Ctrl+Shift+I        Open Developer Tools
Ctrl+Shift+Delete          Clear Cache
Ctrl+Shift+R               Hard Reload
Ctrl+Shift+C               Inspect Element
Ctrl+J                     Open Console
Ctrl+K                     Clear Console
```

## Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Feature: Add authentication system"

# Push to repository
git push

# Pull latest changes
git pull

# View commit history
git log --oneline
```

## Performance Tips

```javascript
// Use useCallback for expensive operations
const handleCalculate = useCallback(async () => {
  // Expensive calculation
}, [dependencies])

// Use useMemo for derived data
const finalPrice = useMemo(() => {
  return basePrice + charges + wastage
}, [basePrice, charges, wastage])

// Prevent unnecessary re-renders
// Use lazy loading
const Component = lazy(() => import('./Component'))

// Optimize images
// Use WebP format
// Compress with tools like TinyPNG
```

## Security Reminders

```javascript
// ✅ DO:
// - Check user authentication before sensitive ops
// - Validate input on client AND server
// - Use HTTPS in production
// - Keep secrets in environment variables
// - Log important events

// ❌ DON'T:
// - Store sensitive data in localStorage
// - Expose API keys in code
// - Trust client-side validation alone
// - Disable security rules for testing
// - Leave debug logs in production
```

## Debugging Tips

```javascript
// Log user state
const { user, loading, isAuthenticated } = useAuth()
console.log('User:', user)
console.log('Auth State:', isAuthenticated)

// Log function results
const result = await getGoldRate()
console.log('Full Result:', result)
console.log('Data:', result.data)

// Check error details
} catch (error) {
  console.error('Code:', error.code)
  console.error('Message:', error.message)
  console.error('Full Error:', error)
}

// Monitor performance
console.time('functionName')
await someFunction()
console.timeEnd('functionName')
```

## Useful Links

```
Firebase Console: https://console.firebase.google.com
Firebase Docs: https://firebase.google.com/docs
React Docs: https://react.dev
Vite Docs: https://vitejs.dev
Git Docs: https://git-scm.com/doc

Project Files:
- AUTHENTICATION.md
- FIREBASE_INTEGRATION.md
- FIREBASE_DEPLOYMENT.md
- QUICK_START_SETUP.md
```

---

**Quick Reference Version:** 1.0  
**Last Updated:** 2024
