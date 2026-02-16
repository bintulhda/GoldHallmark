# ⚡ Gold Guardian - 5-Minute Quick Start

Get **Gold Guardian** running locally in 5 minutes!

---

## Prerequisites (2 minutes)

1. **Node.js 18+** installed
   - [Download here](https://nodejs.org/)
   - Check: `node --version`

2. **Firebase Account** (free)
   - Go to [firebase.google.com](https://firebase.google.com)
   - Click "Get Started" and create a new project
   - Name: `gold-guardian-project`

---

## Setup (3 minutes)

### Step 1: Get Firebase Config (30 seconds)

1. In [Firebase Console](https://console.firebase.google.com), select your project
2. Click **⚙️ Settings** → **General**
3. Scroll to "Your apps" → Click **Web** (</> icon)
4. Copy the config object (shows in a code snippet)
5. You'll use this in next step

### Step 2: Create Environment File (30 seconds)

In project root, create file `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIzaSy... (copy from step 1)
VITE_FIREBASE_AUTH_DOMAIN=gold-guardian-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gold-guardian-xxx
VITE_FIREBASE_STORAGE_BUCKET=gold-guardian-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789...
VITE_FIREBASE_APP_ID=1:123456789:web:xxx...
```

### Step 3: Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Start development
npm run dev

# App opens at http://localhost:5173 automatically!
```

---

## That's It! 🎉

Your app is now running locally!

### Test Features:

| Feature | Test It | Expected Result |
|---------|---------|-----------------|
| **Calculator** | Visit `/calculator` → Enter 10g, 22K | Shows live gold rate & price calculations |
| **HUID Verify** | Visit `/verify-huid` → Enter `AB1234` | Shows "Verified" (it's a sample code) |
| **Learn** | Visit `/learn` | Shows all hallmark education cards |
| **Complaint** | Visit `/complaint` → Fill form | Generates complaint letter |

---

## Setup Firestore (Optional - for full functionality)

### In Firebase Console:

1. Go to **Firestore Database**
2. Click **Create Database**
3. Choose location: **asia-south1** (India) or your region
4. Choose **Start in test mode**
5. Click **Create**

### Add Sample Data:

1. Still in Firestore, click **+ Start collection**
2. Name: `huid_codes`
3. Click **Next**, Auto-generate Document ID
4. Add fields:
   ```
   code: AB1234
   valid: true
   shop: Gold Palace Jewellers
   city: Mumbai
   ```
5. Save
6. Add more codes: XY5678, JK9012, LM3456, PQ7890

---

## Deploy to Web (Optional - 2 minutes)

Make your app **live on the internet**:

```bash
# Install Firebase CLI (one time)
npm install -g firebase-tools

# Login
firebase login

# Build
npm run build

# Deploy
firebase deploy

# Your app is now live! Check output for URL
# https://gold-guardian-xxx.web.app
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5173 in use | `npm run dev -- --port 3000` |
| .env.local not working | Restart: `npm run dev` |
| Gold rate showing fallback | Check internet & Firebase setup |
| HUID lookup not working | Check Firestore database created & has data |

---

## Project Structure

```
gold-guardian/
├── src/
│   ├── pages/           ← Main feature pages
│   ├── components/      ← UI components
│   ├── utils/           ← Logic functions
│   ├── config/          ← Firebase setup
│   ├── styles/          ← CSS files
│   └── App.jsx          ← Main app
├── .env.local           ← SECRET: Your Firebase keys
├── package.json         ← Dependencies
└── index.html           ← Entry HTML
```

---

## Commands Cheatsheet

```bash
npm run dev         # Start dev server (what you did!)
npm run build       # Create production build
npm run preview     # Preview production locally
firebase deploy     # Deploy to web
firebase functions:log  # View Cloud Function logs
```

---

## Next Steps

### Want to Customize?

- **Colors**: Edit `src/styles/global.css` (variables at top)
- **Text**: Edit individual page files in `src/pages/`
- **Add Features**: Create new file in `src/pages/`, add to Navbar

### Want to Add Real Data?

- **Gold Rates**: Cloud Function already fetches live rates
- **HUID Codes**: Add more in Firestore `huid_codes` collection
- **Complaints**: They auto-save to Firestore `complaints` collection

### Want to Deploy?

See **Deploy to Web** section above!

---

## Get Help

1. **Code not running?** → Check `.env.local` has all values
2. **Firebase errors?** → Check project exists in Firebase Console
3. **Page styling broken?** → Hard refresh browser (Ctrl+Shift+R)
4. **Gold rate not loading?** → Check internet connection

---

## Success Checklist ✅

- [ ] Node.js installed
- [ ] `.env.local` created with Firebase config
- [ ] `npm install` completed
- [ ] `npm run dev` running without errors
- [ ] App opening at localhost:5173
- [ ] Can navigate to all pages
- [ ] Gold calculator showing numbers
- [ ] No red errors in browser console

**All checked?** 🎉 **You're ready to go!**

---

## See Also

- **📖 Full README**: [README.md](./README.md) - Complete documentation
- **🛠️ Setup Guide**: [SETUP.md](./SETUP.md) - Detailed setup instructions
- **🚀 Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to production
- **🏗️ Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md) - How it all works

---

**Ready to build something amazing?** Start coding! 💪

