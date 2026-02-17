# Quick Start: Complete Setup Guide

Get Gold Guardian running locally in 10 minutes.

## Prerequisites

✅ Node.js 18+ installed  
✅ Firebase project created (https://console.firebase.google.com)  
✅ Git installed  

## Step 1: Clone/Download Project

```bash
# If cloning from git
git clone <your-repo-url>
cd GoldHallmark

# Or open existing project folder
```

## Step 2: Get Firebase Credentials

1. Open Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Under **Your apps**, click **Web**
5. Copy the configuration values:

```javascript
const config = {
  apiKey: "AIzaSyDj...",           // COPY THIS
  authDomain: "goldhallmark-xxx.firebaseapp.com",  // COPY THIS
  projectId: "goldhallmark-xxx",   // COPY THIS
  storageBucket: "goldhallmark-xxx.appspot.com",   // COPY THIS
  messagingSenderId: "123456789...",                // COPY THIS
  appId: "1:123456789:web:7f4d..."  // COPY THIS
};
```

## Step 3: Setup Environment Variables

### Option A: Using .env file (Recommended)

1. Open `.env` file in project root
2. Replace placeholder values:

```env
VITE_FIREBASE_API_KEY=AIzaSyDj...                    # From config above
VITE_FIREBASE_AUTH_DOMAIN=goldhallmark-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=goldhallmark-xxx
VITE_FIREBASE_STORAGE_BUCKET=goldhallmark-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789...
VITE_FIREBASE_APP_ID=1:123456789:web:7f4d...
VITE_FIREBASE_FUNCTIONS_REGION=us-central1
```

### Option B: Update src/config/firebase.js

Edit `src/config/firebase.js` and replace `import.meta.env.VITE_*` with actual values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDj...",
  authDomain: "goldhallmark-xxx.firebaseapp.com",
  // ... etc
};
```

## Step 4: Install Dependencies

```bash
# Root dependencies
npm install

# Frontend dependencies
cd goldhallmark
npm install
cd ..

# Cloud Functions dependencies
cd functions
npm install
cd ..
```

Or all at once:
```bash
npm install && cd goldhallmark && npm install && cd .. && cd functions && npm install && cd ..
```

## Step 5: Enable Firebase Services

In Firebase Console:

### 5.1 Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Click **Email/Password**
3. Toggle **Enable**
4. Click **Save**

### 5.2 Enable Firestore

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **Production mode**
4. Choose location (closest to you)
5. Click **Create**

### 5.3 Verify Cloud Functions

1. Go to **Cloud Functions**
2. You should see functions listed (they'll be empty until deployed)

## Step 6: Deploy Backend (Local Testing)

### Option A: Using Firebase Emulator (Recommended for Dev)

```bash
# Install emulator
firebase init emulators

# Start emulator
firebase emulators:start
```

The emulator will:
- Start local Firestore (http://localhost:8080)
- Start local Functions (http://localhost:5001)
- Show emulator UI (http://localhost:4000)

### Option B: Deploy to Firebase (For Production)

```bash
# Make sure you're logged in
firebase login

# Deploy functions and rules
firebase deploy --only functions,firestore:rules
```

Wait for deployment to complete.

## Step 7: Start Development Server

```bash
# From goldhallmark folder
cd goldhallmark
npm run dev
```

You should see:
```
VITE v4.x.x  building for development

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open http://localhost:5173 in your browser.

## Step 8: Test the Application

### Test Home Page
- Should see landing page
- Navigation bar visible
- "Sign In" and "Sign Up" buttons in navbar

### Test Authentication
1. Click **Sign Up**
2. Enter:
   - Email: `test@example.com`
   - Password: `Test123456` (min 6 chars)
   - Confirm: `Test123456`
3. Click **Sign Up**
4. Should redirect to home or dashboard

### Test Protected Routes
1. Click **Calculator** in navbar
2. If not logged in → redirects to login
3. If logged in → shows calculator page

### Test Cloud Functions
1. Open browser **DevTools** (F12)
2. Go to **Console** tab
3. Run:

```javascript
// Test gold rate function
import('./config/firebase').then(m => {
  m.getGoldRate()
    .then(result => console.log('Gold Rate:', result.data.rate))
    .catch(err => console.error('Error:', err.message))
})
```

Should log current gold price.

## Step 9: Verify Firestore

### Check Created Data

1. Open Firebase Console
2. Go to **Firestore Database**
3. You should see:
   - `users` collection (with your test user)
   - Other collections when you use features

### Check Security Rules

1. Go to **Firestore Database** → **Rules**
2. Should see your security rules deployed
3. Click **Rules Simulator** to test rules

## Step 10: Common Issues & Fixes

### Issue: "Cannot find module 'firebase'"

```bash
# Solution: Install dependencies
npm install firebase firebase-functions
```

### Issue: Environment variables not loading

```bash
# Solution: Restart dev server
# Press Ctrl+C and run:
npm run dev
```

### Issue: "User does not have permission"

Check:
1. Firestore rules deployed correctly
2. You're authenticated (check browser console)
3. User exists in Firestore `users` collection

```bash
firebase deploy --only firestore:rules --force
```

### Issue: Cloud Functions returning errors

```bash
# View logs
firebase functions:log

# For emulator
# Check console output from emulator
```

### Issue: CORS errors calling functions

Ensure functions use proper Firebase SDK syntax:
```javascript
// ✅ Correct - uses httpsCallable
const result = await getGoldRate()

// ❌ Wrong - direct fetch
fetch('/api/goldRate')
```

## Step 11: File Structure Reference

```
GoldHallmark/
├── .env                    # Firebase credentials (create)
├── README.md
├── firebase.json           # Firebase config
├── functions/
│   ├── index.js           # Cloud Functions (10 functions)
│   ├── firestore.rules    # Security rules
│   └── package.json
├── goldhallmark/           # Frontend React app
│   ├── src/
│   │   ├── App.jsx        # Main app with routing
│   │   ├── main.jsx
│   │   ├── config/
│   │   │   └── firebase.js # Firebase imports & exports
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx    # Auth state management
│   │   │   └── PrivateRoute.jsx   # Protected route wrapper
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx          # NEW
│   │   │   ├── Signup.jsx         # NEW
│   │   │   ├── Calculator.jsx
│   │   │   ├── VerifyHUID.jsx
│   │   │   ├── Learn.jsx
│   │   │   └── Complaint.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Updated with auth
│   │   └── styles/
│   │       ├── auth.css          # NEW
│   │       ├── theme.css
│   │       └── ...
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
└── docs/
    ├── FIREBASE_INTEGRATION.md   # How to use functions
    └── FIREBASE_DEPLOYMENT.md    # How to deploy
```

## Development Workflow

### Day-to-day Development

```bash
# 1. Start dev server (from goldhallmark folder)
cd goldhallmark
npm run dev

# 2. In another terminal, start Firebase emulator
firebase emulators:start

# 3. Code changes auto-reload in browser

# 4. To test production build
npm run build
# Output in dist/ folder
```

### Making Changes

**Frontend Changes:**
- Edit files in `src/`
- Changes auto-reload
- No need to rebuild

**Backend Changes (Cloud Functions):**
- Edit `functions/index.js`
- Redeploy: `firebase deploy --only functions`
- Or restart emulator: `firebase emulators:start`

**Security Rules Changes:**
- Edit `functions/firestore.rules`
- Redeploy: `firebase deploy --only firestore:rules`

## Database Schema Reference

After creating data, your Firestore will have:

```
users/
  ├── {uid}
  │   ├── email
  │   ├── displayName
  │   ├── role: "user"
  │   ├── complaintCount: 0
  │   ├── createdAt
  │   └── updatedAt

complaints/
  ├── {complaintId}
  │   ├── userId
  │   ├── jewellerName
  │   ├── issue
  │   ├── weight
  │   ├── quotedPrice
  │   ├── calculatedPrice
  │   ├── location
  │   ├── riskScore
  │   ├── complaintText
  │   ├── status: "draft|submitted"
  │   ├── createdAt
  │   └── updatedAt

fraudLogs/
  ├── {logId}
  │   ├── userId
  │   ├── riskScore
  │   ├── verdict
  │   └── createdAt

goldRates/
  └── current
      ├── rate: 7250
      └── lastUpdated: timestamp

admin_logs/
  └── (admin-only)
```

## Testing Checklist

- [ ] Home page loads
- [ ] Authentication pages accessible
- [ ] Can create account
- [ ] Can log in
- [ ] Protected pages require login
- [ ] Navigation updates based on auth state
- [ ] Logout works
- [ ] Cloud Functions callable
- [ ] Firestore data persists
- [ ] Security rules working

## Next Steps

1. **Customize UI:** Edit CSS files in `src/styles/`
2. **Add features:** Create new Cloud Functions in `functions/index.js`
3. **Deploy:** Follow FIREBASE_DEPLOYMENT.md
4. **Monitor:** Set up alerts in Firebase Console
5. **Scale:** Upgrade to paid plan when needed

## Support Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Firestore Rules](https://firebase.google.com/docs/firestore/security/start)
- [React Router Docs](https://reactrouter.com/docs)

## Quick Commands Reference

```bash
# Development
npm run dev                    # Start dev server
firebase emulators:start       # Start local emulator

# Build & Deploy
npm run build                  # Build production
firebase deploy                # Deploy everything
firebase deploy --only hosting # Deploy frontend only
firebase deploy --only functions # Deploy backend only

# Debugging
firebase functions:log         # View function logs
firebase projects:describe     # Project info

# Database
firebase open firestore        # Open Firestore console
firebase open hosting          # Open hosting console
```

---

**You're all set!** 🎉

Start with `npm run dev` and begin building!
