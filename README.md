# 🛡️ Gold Guardian - BIS Consumer Protection Platform

A complete, production-ready hackathon web application for consumer protection in India. **Gold Guardian** helps Indian consumers avoid fraud while buying gold jewellery by verifying BIS Hallmarks, calculating fair prices, and generating official complaints.

## ✨ Features

### 1. 🧮 **Gold Price Calculator**
- Calculate fair jewellery prices with **live gold rates**
- Detect overpricing instantly with fraud alerts
- Comprehensive price breakdown showing:
  - Pure gold weight
  - Gold value
  - Making charges
  - GST calculation
  - Fair price range
  - Buyback value
- Color-coded verdict: **SAFE BUY** (Green) | **SUSPICIOUS** (Yellow) | **DO NOT BUY** (Red)

### 2. 🔍 **HUID Verification**
- Verify BIS Hallmark codes (HUID) in real-time
- Check if jewellery is authentic or fake
- View shop details and certified location
- Search history for quick reference

### 2.1 📱 **Phase 1: WhatsApp Bot**
- Verify HUID directly over WhatsApp chat
- Get instant gold price and simple fraud guidance
- Subscribe/unsubscribe to gold price alerts

### 3. 📚 **Hallmark Education**
- Learn about BIS hallmark components
- Understand purity marks (24K, 22K, 18K, 14K)
- Spot fake hallmarks
- Official hallmark verification steps

### 4. 📝 **Complaint Generator**
- Generate formal BIS complaints
- Save complaints to database
- Copy/download complaint letters
- Official complaint format ready for submission

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Plain CSS (Glassmorphism)
- **Backend**: Firebase (Firestore, Cloud Functions, Hosting)
- **Real-time Data**: Live gold API integration via Cloud Functions
- **Database**: Firestore for HUID codes and complaints
- **Responsive**: Mobile, Tablet, Desktop optimized

## 📁 Project Structure

```
gold-guardian/
├── src/
│   ├── components/
│   │   └── Navbar.jsx                 # Navigation component
│   ├── pages/
│   │   ├── Home.jsx                   # Landing page
│   │   ├── Calculator.jsx             # Gold price calculator
│   │   ├── VerifyHUID.jsx             # HUID verification
│   │   ├── Learn.jsx                  # Education page
│   │   └── Complaint.jsx              # Complaint generator
│   ├── utils/
│   │   ├── goldCalculator.js          # Calculation logic
│   │   └── firestore.js               # Database operations
│   ├── config/
│   │   └── firebase.js                # Firebase config
│   ├── styles/
│   │   ├── global.css                 # Global styles & glassmorphism
│   │   ├── navbar.css                 # Navbar styles
│   │   ├── home.css                   # Home page styles
│   │   ├── calculator.css             # Calculator styles
│   │   ├── verify.css                 # Verify HUID styles
│   │   ├── learn.css                  # Learn page styles
│   │   └── complaint.css              # Complaint page styles
│   ├── App.jsx                        # Main app component
│   └── main.jsx                       # Entry point
├── backend/                           # Express backend for WhatsApp bot + REST APIs
│   ├── controllers/                   # Route controllers (WhatsApp, HUID, price, alerts)
│   ├── routes/                        # Express route definitions
│   ├── services/                      # Business logic + integrations
│   ├── data/                          # Mock HUID database
│   └── server.js                      # Express app entry
├── functions/
│   ├── index.js                       # Cloud Functions
│   └── package.json                   # Functions dependencies
├── public/                            # Static assets
├── index.html                         # HTML template
├── package.json                       # Frontend dependencies
├── vite.config.js                     # Vite configuration
├── firebase.json                      # Firebase config
├── .firebaserc                        # Firebase project config
└── .env.example                       # Environment variables template
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase account (free tier works)
- npm or yarn package manager

### Step 1: Clone & Setup

```bash
# Navigate to project directory
cd gold-guardian

# Install frontend dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### Step 2: Firebase Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init
```

### Step 3: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Name it: **gold-guardian-project**
4. Enable Google Analytics (optional)
5. Click "Create project"
6. Wait for project creation to complete

### Step 4: Configure Environment Variables

1. In Firebase Console, go to **Project Settings** → **General** tab
2. Copy your Firebase config details
3. Create `.env.local` file in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_GOLD_RATE_API_KEY=optional_api_key
VITE_GOLD_RATE_API_BASE=https://api.metals.live/v1/spot/gold
```

### Step 5: Initialize Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select region closest to you (e.g., asia-south1 for India)
5. Click "Create"

### Step 6: Set Firestore Rules

1. Go to **Firestore** → **Rules** tab
2. Replace content with rules from `functions/firestore.rules`
3. Click "Publish"

### Step 7: Deploy Cloud Functions

```bash
# Deploy functions
firebase deploy --only functions

# After deployment, functions will be created and available
```

### Step 8: Initialize Sample HUID Data

After Cloud Functions are deployed:

```bash
# Run this in your app or terminal to initialize sample data
# In your React app, you can create a test button that calls:
# const initializeData = httpsCallable(functions, 'initializeFirestore')
# initializeData({}).then(result => console.log(result))

# Or use Firebase CLI:
firebase shell
db.collection('huid_codes').doc('AB1234').set({code: 'AB1234', valid: true, shop: 'Gold Palace', city: 'Mumbai'})
```

---

## 📖 How to Run

### Development Mode (Frontend only)

```bash
# Start frontend development server
npm run dev

# App will open at http://localhost:5173
```

### Development Mode (Frontend + WhatsApp Backend)

```bash
# Install dependencies
npm install

# Copy backend env template (optional)
cp .env.example.backend .env

# Start both frontend and backend together
npm run dev:all

# Frontend: http://localhost:5173
# Backend:  http://localhost:4000
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Firebase Hosting

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy

# Your app will be live at: https://gold-guardian-project.web.app
```

---

## 🌐 Live Gold Rate Integration

The app uses **metals.live API** for real-time gold prices:

- **API Endpoint**: `https://api.metals.live/v1/spot/gold`
- **Update Frequency**: Real-time
- **Price Format**: USD per ounce (converted to INR per gram in Cloud Function)
- **Fallback**: If API fails, uses ₹7500/gram as fallback

### Cloud Function Flow:
```
React App → Calls getGoldRate() Cloud Function
         ↓
Cloud Function → Fetches from metals.live API
              ↓
              Converts USD/oz to INR/gram
              ↓
              Returns converted rate to app
```

---

## 📊 Database Structure

### Firestore Collections

#### 1. `huid_codes` Collection
Stores BIS registered HUID codes and shop details.

```javascript
{
  "code": "AB1234",
  "valid": true,
  "shop": "Gold Palace Jewellers",
  "city": "Mumbai",
  "state": "Maharashtra",
  "assayCenter": "BIS Assay Centre, Parel"
}
```

#### 2. `complaints` Collection
Stores consumer complaints.

```javascript
{
  "customerName": "Rajesh Kumar",
  "shopName": "Gold Palace",
  "city": "Mumbai",
  "issueDescription": "Sold overpriced jewellery without proper hallmark...",
  "createdAt": Timestamp,
  "status": "pending"
}
```

---

## 🎨 Design Highlights

- **Glassmorphism UI**: Beautiful frosted glass effect with blurred backdrop
- **Blue + White Theme**: Government-grade, trustworthy appearance
- **Color-Coded Alerts**: 
  - Green (✅ Safe): Fraud-free
  - Yellow (⚠️ Suspicious): Needs verification
  - Red (❌ Fraud): High risk
- **Responsive Design**: Works perfectly on all devices
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Modern Icons**: Emoji-based intuitive design

### Glassmorphism CSS Example:
```css
.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1200px
- **Mobile**: 480px - 768px
- **Small Mobile**: < 480px

All layouts adjust seamlessly for perfect UX on any device.

---

## 🔐 Security & Privacy

### Frontend Security:
- Environment variables for API keys
- No sensitive data stored in localStorage
- HTTPS only communication
- CORS configured on Firebase

### Backend Security (Firestore):
```javascript
// HUID codes: Readable by all (to allow verification)
huid_codes: { ".read": true, ".write": false }

// Complaints: Only authenticated users can write
complaints: { 
  ".write": "request.auth != null"
}
```

---

## 🧪 Testing

### Test HUID Codes (already in database):
- `AB1234` - Gold Palace Jewellers, Mumbai (Valid)
- `XY5678` - Royal Jewellers, Delhi (Valid)
- `JK9012` - Vijaya Jewellers, Bangalore (Valid)
- `LM3456` - Precious Gems, Pune (Valid)
- `PQ7890` - Shri Krishna Gold, Ahmedabad (Valid)
- `INVALID1` - Fake code (Invalid)

### Test Calculator:
- Weight: 10g
- Purity: 22K
- Making Charge: 10%
- Live rate will be fetched automatically

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'firebase'"
```bash
npm install firebase
```

### Issue: Gold rate shows fallback value
- Check internet connection
- Verify API endpoint is accessible
- Check Cloud Function logs: `firebase functions:log`

### Issue: Firestore data not saving
- Check Firestore Rules are published
- Ensure database is created in correct region
- Check browser console for errors

### Issue: Hot reload not working in development
```bash
# Clear cache and restart
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📈 Future Enhancement Ideas

- [ ] SMS alerts for price thresholds
- [ ] User accounts and complaint history
- [ ] Integration with BIS official database
- [x] WhatsApp bot for verification
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Offline mode support
- [ ] Analytics dashboard
- [ ] Jeweller ratings and reviews

---

## 📞 Support

For issues or questions:
1. Check Firestore Rules and Cloud Function logs
2. Review browser console for errors
3. Test with sample HUID codes
4. Verify Firebase project configuration

---

## 📜 License

This project is open-source and available for educational and hackathon purposes.

---

## 👨‍💻 Development by

**Gold Guardian Team** - Building consumer protection one hallmark at a time! 🛡️

---

## 📝 Notes for Deployment

### Before Going Live:

1. **Update Firestore Rules** to production security:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /huid_codes/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    match /complaints/{document=**} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
    }
  }
}
```

2. **Add Real HUID Database** (integrate with actual BIS database)

3. **Setup Email Notifications** for new complaints

4. **Configure Cloud Function Quotas** to prevent abuse

5. **Setup Monitoring & Alerts** in Firebase Console

6. **Enable Analytics** for insights

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready ✅

---

## 🤖 WhatsApp Bot (Phase 1)

### Commands

- `VERIFY <HUID>`: Verify a hallmark code using mock BIS-style data
- `PRICE`: Get today&apos;s gold price per gram (INR)
- `ALERT ON`: Subscribe this WhatsApp number to gold price alerts (mock, in-memory)
- `ALERT OFF`: Unsubscribe from price alerts
- `HELP`: Show available commands

If the message is just an 6–10 character alphanumeric string (like `AB1234`), the bot will treat it as a HUID and try to verify it.

### Backend REST APIs

- `POST /api/verify-huid`
  - Body: `{ "huid": "AB1234" }`
  - Returns: `goldPurity`, `certificationStatus`, `jewelerName`, `location`, `message`, `success`
- `GET /api/gold-price`
  - Returns: current gold rate per gram in INR with source and timestamp
- `POST /api/alerts/subscribe`
  - Body: `{ "phone": "whatsapp-number" }`
  - Returns: subscription status and message
- `POST /api/alerts/unsubscribe`
  - Body: `{ "phone": "whatsapp-number" }`
  - Returns: subscription status and message

### Backend Environment Variables

Backend env template: `.env.example.backend`

```env
PORT=4000
ALLOWED_ORIGINS=http://localhost:5173

# WhatsApp / Twilio (optional - leave blank to use mock service)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

# Gold price API (optional)
GOLD_PRICE_API=https://api.metals.live/v1/spot/gold
USD_INR_RATE=83
```

If the Twilio variables are not set, the backend will run in **mock mode** and simply log outgoing WhatsApp messages to the console.

