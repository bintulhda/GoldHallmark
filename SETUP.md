# 🚀 Gold Guardian - Complete Setup Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Project Setup](#firebase-project-setup)
3. [Local Development Setup](#local-development-setup)
4. [Database Initialization](#database-initialization)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

✅ **Node.js 18+** - [Download](https://nodejs.org/)
✅ **npm or yarn** - Comes with Node.js
✅ **Firebase Account** - [Free tier](https://firebase.google.com/)
✅ **Git** - For version control
✅ **VS Code** - Recommended IDE

### Check Installation:
```bash
node --version    # Should be v18+
npm --version     # Should be v8+
git --version     # Any recent version
```

---

## Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **✚ Add project**
3. Enter project name: `gold-guardian-project`
4. Enable Google Analytics (optional but recommended)
5. Click **Create project**
6. Wait for project creation (2-3 minutes)

### Step 2: Get Firebase Config

1. In Firebase Console, click **⚙️ Project Settings**
2. Go to **General** tab
3. Scroll down to "Your apps" section
4. Click **Web** icon (</> symbol)
5. Register app name: `gold-guardian`
6. Copy the config object shown on screen

### Step 3: Create Environment File

1. In project root, create file: `.env.local`
2. Add your Firebase config:

```env
# Copy these values from Firebase Console (Project Settings)
VITE_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=gold-guardian-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gold-guardian-xxx
VITE_FIREBASE_STORAGE_BUCKET=gold-guardian-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxx

# Optional - for live gold rate API
VITE_GOLD_RATE_API_KEY=your_api_key
VITE_GOLD_RATE_API_BASE=https://api.metals.live/v1/spot/gold
```

### Step 4: Setup Firestore Database

#### Via Firebase Console (Recommended):

1. Go to **Firestore Database** in left sidebar
2. Click **Create Database**
3. Choose location: 
   - For India: Select **asia-south1** (Mumbai)
   - For other regions: Choose closest location
4. Choose **Start in test mode** (for development)
5. Click **Create**
6. Wait for database to be created

#### Database Security Rules:

1. Go to **Firestore Database** → **Rules** tab
2. Replace default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // HUID codes: readable by all, not writable
    match /huid_codes/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Complaints: writable by anyone (or authenticated only)
    match /complaints/{document=**} {
      allow create: if true;  // Allow anyone to file complaints
      allow read: if false;   // Only admins can read
    }
  }
}
```

3. Click **Publish**

### Step 5: Setup Cloud Functions

#### Via Firebase CLI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase in project
firebase init

# When prompted, select:
# - Use existing project: gold-guardian-project
# - Choose Firestore, Functions, Hosting
```

#### Deploy Cloud Functions:

```bash
# Deploy
firebase deploy --only functions

# Watch logs (in another terminal)
firebase functions:log
```

---

## Local Development Setup

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### Step 2: Start Development Server

```bash
# In project root
npm run dev

# Should output:
# ➜ Local:   http://localhost:5173/
# ➜ Press h to show help

# App will auto-open
```

### Step 3: Connect to Firebase

The app will automatically connect to your Firebase project using credentials from `.env.local`.

---

## Database Initialization

### Populate Sample HUID Codes

Two methods:

#### Method 1: Firebase Console UI

1. Go to **Firestore Database**
2. Click **+ Start collection**
3. Name: `huid_codes`
4. Click **Next**
5. Auto-generate document ID, add fields:

```
Field: code        | Type: string | Value: AB1234
Field: valid       | Type: boolean| Value: true
Field: shop        | Type: string | Value: Gold Palace
Field: city        | Type: string | Value: Mumbai
```

6. Click Save
7. Repeat for other codes:
   - XY5678 (Royal Jewellers, Delhi)
   - JK9012 (Vijaya Jewellers, Bangalore)
   - LM3456 (Precious Gems, Pune)
   - PQ7890 (Shri Krishna Gold, Ahmedabad)

#### Method 2: Cloud Function (Automated)

Copy-paste in browser console (after app loads):

```javascript
// This calls the Cloud Function to initialize data
const { httpsCallable, getFunctions } = window.firebase.functions;
const functions = getFunctions();
const initData = httpsCallable(functions, 'initializeFirestore');
initData().then(result => console.log(result.data));
```

---

## Testing

### Test Calculator
1. Go to **Calculator** page
2. Enter:
   - Weight: 10g
   - Purity: 22K
   - Making Charge: 10%
3. Should show:
   - Live gold rate (fetched from API)
   - Fair price breakdown
   - Fraud alert status

**Expected values for 10g, 22K:**
- Pure gold weight: ~9.17g
- Gold value: ~₹68,750 (at ₹7,500/g)
- Making charges: ~₹6,875
- GST: ~₹2,281
- **Fair price: ~₹77,906**

### Test HUID Verification
1. Go to **Verify HUID** page
2. Enter: `AB1234`
3. Should show:
   - ✅ Verified BIS Hallmark
   - Shop: Gold Palace Jewellers
   - City: Mumbai

4. Try invalid code: `INVALID1`
5. Should show:
   - ❌ Invalid / Fake Jewellery

### Test Complaint Generation
1. Go to **Complaint** page
2. Fill form:
   - Name: Test User
   - Shop: Gold Palace
   - City: Mumbai
   - Issue: Test complaint
3. Click "Generate Complaint"
4. Should show:
   - Generated complaint letter
   - Copy/Download buttons

### Test Live Gold Rate
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Paste:
```javascript
const { httpsCallable, getFunctions } = window.firebase.functions;
const functions = getFunctions();
const getRate = httpsCallable(functions, 'getGoldRate');
getRate().then(r => console.log(r.data.inrPerGram));
```
4. Should return current gold rate in INR/gram

---

## Deployment

### Deploy to Firebase Hosting

```bash
# Step 1: Build production version
npm run build

# Should create 'dist' folder with optimized files

# Step 2: Deploy to Firebase Hosting
firebase deploy

# Step 3: Get live URL
# Output will show:
# Hosting URL: https://gold-guardian-xxx.web.app
```

### Deploy Cloud Functions Separately

```bash
firebase deploy --only functions
```

### Deploy Everything

```bash
firebase deploy
```

### Monitor Deployment

```bash
firebase hosting:channel:list      # View all deployments
firebase hosting:channel:delete c1  # Delete preview deployment
firebase functions:log              # View function logs
```

---

## Troubleshooting

### Issue: "Cannot find module 'firebase'"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use

**Solution 1:**
```bash
npm run dev -- --port 3000
```

**Solution 2:**
```bash
# Find process using port 5173 and kill it
lsof -i :5173
kill -9 <pid>
```

### Issue: Firebase credentials not loading (.env.local not found)

**Check:**
1. Confirm `.env.local` exists in project root
2. Restart dev server: `npm run dev`
3. Make sure you've copied Firebase config correctly
4. Check that values don't have extra spaces

### Issue: Cloud Function deployment fails

**Check:**
1. `firebase login` - Ensure you're logged in correctly
2. `firebase projects:list` - Should show your project
3. `cd functions && npm install` - Reinstall dependencies
4. `firebase deploy --only functions -v` - Deploy with verbose logging

### Issue: Firestore returns "Permission denied" errors

**Solution:**
1. Go to **Firestore** → **Rules**
2. Ensure rules are published (not just in editor)
3. Check security rules configuration shown above
4. Wait 1-2 minutes after publishing for rules to take effect

### Issue: Gold rate showing fallback value

**Reasons:**
1. External API (metals.live) is down
2. Cloud Function timed out
3. Network issue

**Check:**
```bash
# View Cloud Function logs
firebase functions:log

# Test API directly
curl https://api.metals.live/v1/spot/gold
```

### Issue: Build fails with errors

**Solution:**
```bash
# Clear Vite cache
rm -rf dist
npm run build

# Or use different Node version
nvm use 18
npm run build
```

### Issue: Styling not loading

**Check:**
1. CSS files are imported in components
2. Global.css is imported in App.jsx
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard refresh page (Ctrl+Shift+R)

### Issue: HUID verification showing all codes as invalid

**Check:**
1. Is Firestore database created?
2. Are HUID codes in `huid_codes` collection?
3. Check browser console → Network tab
4. Look for Firestore errors in console

---

## Performance Tips

### Development Mode
```bash
npm run dev
# Dev server rebuilds on file change
# Uses unoptimized code for faster builds
```

### Production Build
```bash
npm run build
# Creates optimized dist/ folder
# All CSS/JS minified and bundled
# Ready for deployment
```

### Optimize Images
```bash
# Compress before deployment
# Use WebP format when possible
```

### Monitor Bundle Size
```bash
npm run build --analyze
```

---

## Environment Variables Reference

```env
# Required
VITE_FIREBASE_API_KEY              # From Firebase Console
VITE_FIREBASE_AUTH_DOMAIN          # From Firebase Console
VITE_FIREBASE_PROJECT_ID           # From Firebase Console
VITE_FIREBASE_STORAGE_BUCKET       # From Firebase Console
VITE_FIREBASE_MESSAGING_SENDER_ID  # From Firebase Console
VITE_FIREBASE_APP_ID               # From Firebase Console

# Optional
VITE_GOLD_RATE_API_KEY            # For production API key
VITE_GOLD_RATE_API_BASE           # Custom gold rate API endpoint
```

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build production
npm run preview                # Preview production build

# Firebase
firebase login                 # Login to Firebase
firebase init                  # Initialize Firebase
firebase deploy                # Deploy everything
firebase deploy --only functions  # Deploy only functions
firebase deploy --only hosting    # Deploy only frontend
firebase functions:log         # View function logs

# Utilities
npm install                    # Install dependencies
npm install --save package     # Install & save dependency
npm uninstall package          # Remove dependency
npm list                       # List installed packages
```

---

## Expected Folder Structure After Setup

```
gold-guardian/
├── .env.local                 ← Created by you
├── .git/                      ← Git initialized
├── node_modules/              ← npm install
├── dist/                      ← After npm run build
├── src/                       ← React code
├── functions/
│   ├── node_modules/          ← npm install
│   └── index.js
├── package.json               ← Project config
└── ... (other files)
```

---

## Support & Help

1. **Check Documentation**: Read READMEmd and setup guides
2. **Firebase Docs**: https://firebase.google.com/docs
3. **React Docs**: https://react.dev
4. **Vite Docs**: https://vitejs.dev
5. **Cloud Functions**: https://firebase.google.com/docs/functions

---

**Status**: ✅ Ready to Deploy  
**Version**: 1.0.0

