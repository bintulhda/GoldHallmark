# 🏗️ Gold Guardian - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│              🌐 Client Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React App (Vite)                                      │ │
│  │  ├─ Components (Navbar, Layout)                        │ │
│  │  ├─ Pages (Home, Calculator, HUID, Learn, Complaint)  │ │
│  │  ├─ Utils (goldCalculator.js, firestore.js)          │ │
│  │  └─ Styles (Glassmorphism CSS)                        │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTPS Requests
                 │
┌────────────────▼────────────────────────────────────────────┐
│              🔥 Firebase Backend                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Cloud Functions                                        │ │
│  │ └─ getGoldRate() → Calls metals.live API             │ │
│  │                 → Returns INR/gram                    │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Firestore Database                                     │ │
│  │ ├─ Collection: huid_codes                             │ │
│  │ │  └─ Stores BIS registered codes & shop details     │ │
│  │ └─ Collection: complaints                             │ │
│  │    └─ Stores user complaints                         │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Hosting (Static Files)                                │ │
│  │ └─ Serves dist/ folder (React build)                │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ REST API Calls
                 │
┌────────────────▼────────────────────────────────────────────┐
│          🌍 External APIs                                   │
│  └─ metals.live API → Live Gold Commodity Prices          │
│     (metals.live/v1/spot/gold)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Component Architecture

### Frontend Structure

```
src/
├── App.jsx                        # Main app component with routing
├── main.jsx                       # React DOM entry point
│
├── pages/                         # Page components (route-level)
│   ├── Home.jsx                  # Landing page with features overview
│   ├── Calculator.jsx            # Gold price calculation page
│   ├── VerifyHUID.jsx           # HUID code verification page
│   ├── Learn.jsx                # Hallmark education page
│   └── Complaint.jsx            # Complaint generator page
│
├── components/                   # Reusable components
│   └── Navbar.jsx              # Navigation bar (sticky header)
│
├── utils/                       # Utility functions & logic
│   ├── goldCalculator.js       # Price calculation & fraud detection
│   └── firestore.js            # Firestore database operations
│
├── config/                      # Configuration files
│   └── firebase.js             # Firebase initialization & SDKs
│
└── styles/                      # CSS styling
    ├── global.css              # Global styles & glassmorphism variables
    ├── navbar.css              # Navbar styling
    ├── home.css                # Home page styling
    ├── calculator.css          # Calculator page styling
    ├── verify.css              # HUID verification styling
    ├── learn.css               # Learn page styling
    └── complaint.css           # Complaint page styling
```

---

## Data Flow Diagrams

### 1. Gold Price Calculator Flow

```
┌──────────────────────────────┐
│  User Input                  │
│  ├─ Weight (grams)           │
│  ├─ Purity (24K/22K/18K/14K) │
│  ├─ Making Charge (%)        │
│  └─ Live Gold Rate           │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Fetch Gold Rate             │
│  (if not cached)             │
│  └─ Call Cloud Function      │
│     └─ getGoldRate()        │
└──────────┬───────────────────┘
           │ Returns: inrPerGram
           ▼
┌──────────────────────────────┐
│  Calculate in goldCalculator.js
│  ├─ Calculate pure gold weight│
│  ├─ Calculate gold value      │
│  ├─ Calculate making charges  │
│  ├─ Calculate GST (3%)        │
│  ├─ Calculate final price     │
│  ├─ Calculate buyback value   │
│  └─ Calculate overpayment %   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Determine Safety Verdict    │
│  ├─ < 5%    → SAFE BUY      │
│  ├─ 5-12%   → SUSPICIOUS    │
│  └─ > 12%   → DO NOT BUY    │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Display Results             │
│  ├─ Verdict card with icon   │
│  ├─ Price breakdown table    │
│  └─ Fraud alert visual       │
└──────────────────────────────┘
```

### 2. HUID Verification Flow

```
┌──────────────────────────────┐
│  User Input                  │
│  └─ HUID Code (8 chars)      │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Query Firestore            │
│  └─ Search in huid_codes    │
│     collection              │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Document Found?            │
├─ YES → ──────────┐          │
│                  │          │
│                  ▼          │
│        ┌──────────────────┐ │
│        │ valid = true?    │ │
│        ├─ YES ──────┐     │ │
│        │            │     │ │
│        │            ▼     │ │
│        │       ✅ Verified │ │
│        │       Show shop   │ │
│        │       & location  │ │
│        │                  │ │
│        ├─ NO ───────┐     │ │
│        │            │     │ │
│        │            ▼     │ │
│        │       ❌ Invalid  │ │
│        │       Fake code   │ │
│        └──────────────────┘ │
│                             │
│                  NO ────────┤
│                             ▼
│                    ❌ Not Found
│                    No record in DB
└──────────────────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Display Result              │
│  ├─ Status message           │
│  ├─ Shop details (if valid)  │
│  └─ Action recommendations   │
└──────────────────────────────┘
```

### 3. Complaint Generation Flow

```
┌──────────────────────────────┐
│  User Input                  │
│  ├─ Customer Name            │
│  ├─ Shop Name                │
│  ├─ City                      │
│  └─ Issue Description        │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Save to Firestore           │
│  ├─ Add document to          │
│  │  "complaints" collection  │
│  └─ Auto timestamp           │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Generate Complaint Letter   │
│  └─ Format official text     │
│     with user data           │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Display Options             │
│  ├─ Copy to Clipboard        │
│  └─ Download as .txt file    │
└──────────────────────────────┘
```

---

## Database Schema

### Firestore Collections

#### Collection: `huid_codes`

**Purpose**: Store BIS registered HUID codes and shop information

```javascript
{
  "code": "AB1234",           // String - Unique HUID
  "valid": true,              // Boolean - Is hallmark valid?
  "shop": "Gold Palace Jewellers",  // String - Shop name
  "city": "Mumbai",           // String - Location
  "state": "Maharashtra",     // String - State
 "assayCenter": "BIS Centre, Parel"  // String - Testing center
}
```

**Firestore Rules**:
```
read: true      // Anyone can verify codes
write: false    // Only admin can modify
```

---

#### Collection: `complaints`

**Purpose**: Store consumer complaints

```javascript
{
  "customerName": "Rajesh Kumar",     // String
  "shopName": "Gold Palace",          // String
  "city": "Mumbai",                   // String
  "issueDescription": "Sold overpriced...", // String
  "createdAt": Timestamp.now(),       // Timestamp - Auto
  "status": "pending"                 // String - pending/resolved
}
```

**Firestore Rules**:
```
write: true     // Anyone can file complaint
read: false     // Only admin can review
```

---

## State Management

### Local Component State

All state is managed locally in React components using `useState`:

- **Calculator.jsx**: 
  - weight, purity, goldRate, makingCharge
  - calculations (results), verdict (fraud detection)

- **VerifyHUID.jsx**:
  - huidCode (user input)
  - result (verification result)
  - searchHistory (recent searches)

- **Complaint.jsx**:
  - formData (form fields)
  - complaintLetter (generated text)
  - isSubmitting (loading state)

- **Home.jsx**:
  - scrolled (scroll animation state)

### No Global State Management

This app uses **local state only** (no Redux/Context) for:
- Simplicity
- Hackathon speediness
- No state complexity needed
- Each page is independent

For future scaling, consider adding:
- Redux for shared state
- Context API for theme/settings
- Custom hooks for reusable logic

---

## API Integration

### External APIs

#### 1. metals.live API

**Endpoint**: `https://api.metals.live/v1/spot/gold`

**Response Format**:
```json
{
  "rate": 2099.45
}
// Price in USD per troy ounce
```

**Conversion Logic** (in Cloud Functions):
```
USD/oz → INR/oz → INR/gram
  1. Multiply by USD→INR rate (≈83)
  2. Divide by ounce→gram ratio (31.1035)
  Result: INR per gram
```

### Cloud Functions API

**Function**: `getGoldRate`

**Request**: (No parameters needed)

**Response**:
```json
{
  "success": true,
  "inrPerGram": 7543.50,
  "timestamp": "2026-02-16T10:30:00Z",
  "source": "metals.live API"
}
```

**Error Handling**:
- If API fails: Returns fallback rate (₹7500/gram)
- Timeout: 5 seconds
- Retry: Yes (automatic)

---

## Security Architecture

### Frontend Security
1. **Environment Variables**:
   - API keys stored in `.env.local` (not browser)
   - Firebase config is public-safe (no sensitive data)
   - Never expose API keys in code

2. **HTTPS Only**: 
   - Firebase Hosting enforces HTTPS
   - All API calls use HTTPS

3. **CORS Configuration**: 
   - Cloud Functions allow safe origins
   - Firestore rules authenticate requests

### Backend Security (Firestore)

```javascript
// HUID Codes: Read-only public collection
"huid_codes": {
  ".read": true,
  ".write": false
}

// Complaints: Write-only (anyone can write, only admins read)
"complaints": {
  ".create": true,
  ".read": false,
  ".write": false
}
```

### Cloud Functions Security

```javascript
// Input Validation
- Validate API response format
- Timeout requests after 5 seconds
- Log errors for monitoring

// Error Handling
- Never expose internal errors to client
- Return safe fallback values
- Rate limiting possible (future)
```

---

## Performance Considerations

### Frontend Optimization

1. **Bundle Size**:
   - React 18: ≈45KB
   - Firebase SDK: ≈200KB
   - App code: ≈50KB
   - **Total**: ≈300KB (gzipped)

2. **Code Splitting**:
   - Vite auto-chunks pages
   - Each page loads on demand
   - Navbar split as separate chunk

3. **Rendering Optimization**:
   - No unnecessary re-renders
   - Simple state management
   - Memoization where needed

### Backend Optimization

1. **Cloud Functions**:
   - Memory: 256MB (minimal)
   - Timeout: 60 seconds
   - Concurrent: 100 (autoscaling)

2. **Firestore**:
   - Indexed queries
   - Composite indexes for complex read
   - Batch writes for bulk ops

3. **Caching**:
   - Browser cache CSS/JS
   - Service Worker possibility (future)
   - Firestore query caching
   - Gold rate cached in state (not re-fetched on every load)

---

## Error Handling

### Frontend Error Handling

```javascript
// Try-catch for async operations
try {
  const rate = await fetchGoldRate()
  setGoldRate(rate)
} catch (error) {
  console.error('Error:', error)
  setGoldRate(7500) // Fallback
}

// User-facing errors
alert('Error connecting to database')
```

### Cloud Functions Error Handling

```javascript
try {
  // Operation
  const response = await axios.get(url)
  return { success: true, data: response.data }
} catch (error) {
  // Log error
  console.error('Error:', error)
  // Return safe fallback
  return { success: false, fallback: 7500 }
}
```

---

## Deployment Architecture

### Local Development
```
localhost:5173 (Vite Dev Server)
    ↓
    Connects to: Firebase Project
    ├─ Firestore Database
    ├─ Cloud Functions
    └─ Auth (optional)
```

### Production Deployment
```
gold-guardian-xxx.web.app (Firebase Hosting CDN)
    ↓
    Serves: dist/ folder (React build)
    ├─ index.html
    ├─ Main JS bundle
    ├─ CSS bundles
    └─ Other assets
```

---

## Scaling Considerations

### Current Capacity (Free Tier)
- **Firestore**: 25,000 reads/day
- **Cloud Functions**: 2 million invocations/month
- **Hosting**: ~10GB/month free

### Scaling Steps

1. **Limited Users** (Current):
   - Free tier sufficient
   - No optimization needed

2. **Growing Users** (100-1000 users):
   - Move to Blaze plan (pay-as-you-go)
   - Monitor Firestore reads/writes
   - Implement caching

3. **Large Scale** (1000+ users):
   - Setup Cloud Load Balancing
   - Database sharding strategy
   - Implement CDN
   - Rate limiting on APIs

---

## Technology Rationale

### Why Vite?
- Fast development experience (< 1s reload)
- Small bundle size
- ES modules native support
- Easy configuration

### Why Firebase?
- Serverless (no infra management)
- Real-time database (Firestore)
- Built-in hosting
- Easy Cloud Functions
- Free tier sufficient for hackathon

### Why Plain CSS?
- No dependencies
- Lighter bundle
- Full control
- Easier to modify/style
- Better performance

### Why React?
- Component reusability
- Virtual DOM efficiently
- SEO friendly
- Large ecosystem
- Easy for teams

---

## Code Quality Standards

### Naming Conventions
```javascript
// Files
- Components: PascalCase (Navbar.jsx)
- Utilities: camelCase (goldCalculator.js)
- Stylesheets: kebab-case (global.css)

// Variables/Functions
- camelCase for variables/functions
- Descriptive names (let initialWeight, not let w)
- Prefix boolean with "is" (isLoading, not loading)
```

### Comments
```javascript
// Block comment for files
/**
 * Component: Gold Calculator
 * Purpose: Calculate fair jewellery price
 */

// Inline comments for complex logic
// Convert USD per ounce to INR per gram
const inrPerGram = (usdPerOunce * USD_TO_INR) / OUNCE_TO_GRAM
```

### Code Organization
- One component per file
- Utilities grouped by function
- Constants at top of files
- Imports before code
- Exports at end

---

## Future Enhancements

### Features
- [ ] User authentication
- [ ] Save favorites/history
- [ ] SMS/Email alerts
- [ ] Multi-language support
- [ ] Offline mode (Service Workers)
- [ ] Admin dashboard
- [ ] Jeweller profiles
- [ ] Rating system

### Technical
- [ ] TypeScript migration
- [ ] Unit testing (Jest)
- [ ] E2E testing (Cypress)
- [ ] Storybook for components
- [ ] GraphQL API (vs REST)
- [ ] WebRTC for video verification
- [ ] AI for fraud detection

---

**Document Version**: 1.0  
**Last Updated**: February 2026

