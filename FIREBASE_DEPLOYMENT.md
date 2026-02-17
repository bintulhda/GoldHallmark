# Firebase Deployment Guide

Complete steps to deploy Gold Guardian to Firebase Hosting with Cloud Functions.

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Active Firebase project created
- Admin access to Firebase project

## Step 1: Firebase CLI Setup

### 1.1 Install Firebase CLI

```bash
npm install -g firebase-tools@latest
```

Verify installation:
```bash
firebase --version
```

### 1.2 Login to Firebase

```bash
firebase login
```

This opens a browser window to authenticate with your Google account.

### 1.3 Initialize Firebase Project

In your project root directory:

```bash
firebase init
```

When prompted:
- Select "Hosting" and "Functions"
- Choose "Use an existing project"
- Select your Firebase project from the list
- For hosting root, enter: `src` (for dev build) or `.` (for production build)
- **Do NOT overwrite existing files**

## Step 2: Environment Configuration

### 2.1 Set Firebase Functions Environment Variables

In the Firebase Console:
1. Go to Project Settings → Functions
2. Set environment variables:

```
NODE_ENV=production
```

Or use CLI:
```bash
firebase functions:config:set api.key="YOUR_METALS_LIVE_API_KEY"
```

### 2.2 Frontend Environment Variables

Create `.env.local` with your Firebase credentials (from Firebase Console):

```env
VITE_FIREBASE_API_KEY=AIzaSyDj...
VITE_FIREBASE_AUTH_DOMAIN=goldhallmark-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=goldhallmark-xxx
VITE_FIREBASE_STORAGE_BUCKET=goldhallmark-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789...
VITE_FIREBASE_APP_ID=1:123456789:web:7f4d...
VITE_FIREBASE_FUNCTIONS_REGION=us-central1
```

## Step 3: Build for Production

### 3.1 Build Frontend

```bash
cd goldhallmark
npm install
npm run build
```

This creates `dist/` folder with optimized build.

### 3.2 Deploy Frontend to Hosting

### 3.2 Setup firebase.json

Update `firebase.json` at project root:

```json
{
  "hosting": [
    {
      "target": "goldhallmark-web",
      "public": "goldhallmark/dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ],
      "headers": [
        {
          "source": "/index.html",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=0"
            }
          ]
        },
        {
          "source": "**/*.@(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=31536000"
            }
          ]
        }
      ]
    }
  ],
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "ignore": ["node_modules", ".git"]
    }
  ]
}
```

### 3.3 Deploy to Hosting

```bash
firebase deploy --only hosting
```

## Step 4: Deploy Cloud Functions

### 4.1 Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### 4.2 Deploy Functions

```bash
firebase deploy --only functions
```

Monitor deployment:
```bash
firebase functions:log --limit 50
```

### 4.3 Update Security Rules

Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

## Step 5: Verify Deployment

### 5.1 Test Hosting

- Open: `https://your-project.firebaseapp.com`
- Check console for errors
- Test navigation (should see login/signup)

### 5.2 Test Functions

From browser console:
```javascript
// Call a function (requires auth)
getGoldRate()
  .then(result => console.log(result.data))
  .catch(err => console.error(err.message))
```

### 5.3 Monitor Cloud Functions

Firebase Console → Cloud Functions:
- View function logs
- Check execution statistics
- Monitor errors

### 5.4 Check Firestore

Firebase Console → Firestore Database:
- Verify collections created
- Check security rules deployed
- View user data

## Step 6: Post-Deployment Tasks

### 6.1 Enable Required APIs

Firebase Console → APIs & Services:
- ✅ Cloud Firestore API
- ✅ Cloud Functions API
- ✅ Firebase Authentication API
- ✅ Firebase Hosting API

### 6.2 Configure Authentication

Firebase Console → Authentication:
- Enable Email/Password provider
- Set up email templates (optional)
- Configure password policy (min 6 chars)

### 6.3 Setup Email (Optional)

Firebase Console → Authentication → Email Templates:
- Customize verification email
- Customize password reset email
- Customize other sign-in emails

### 6.4 Monitor Usage

Firebase Console → Usage:
- Track daily active users
- Monitor database reads/writes
- Track function executions
- Check storage usage

## Step 7: Update Code & Redeploy

### 7.1 Update Frontend Code

1. Make changes in `src/` or `goldhallmark/src/`
2. Rebuild: `npm run build` (in goldhallmark folder)
3. Deploy: `firebase deploy --only hosting`

### 7.2 Update Cloud Functions

1. Make changes in `functions/index.js`
2. Deploy: `firebase deploy --only functions`

### 7.3 Update Firestore Rules

1. Edit `functions/firestore.rules`
2. Deploy: `firebase deploy --only firestore:rules`

### 7.4 Full Deploy (All Services)

```bash
firebase deploy
```

## Step 8: CI/CD Deployment (GitHub Actions)

### 8.1 Generate Firebase Token

```bash
firebase login:ci
```

Copy the token (do NOT commit to repo).

### 8.2 Setup GitHub Secrets

In GitHub repo → Settings → Secrets → New Secret:
- Name: `FIREBASE_TOKEN`
- Value: (paste token from step 8.1)

### 8.3 Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install
          cd goldhallmark && npm install && cd ..
      
      - name: Build frontend
        run: cd goldhallmark && npm run build && cd ..
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: your-project-id
        env:
          FIREBASE_CLI_EXPERIMENTS_maxBundleSize: 150
```

## Step 9: Monitoring & Maintenance

### 9.1 Monitor Cloud Functions

```bash
# View function logs
firebase functions:log --limit 100

# View specific function
firebase functions:log -c calculateGoldPrice --limit 50
```

### 9.2 Monitor Database

- Firestore Console: Check document counts, storage
- Database Insights: Monitor query performance
- Security Rules: Test rules in Rules Simulator

### 9.3 Set Alerts

Firebase Console → Monitoring → Create Alert:
- Function error rate
- High latency
- Storage quota

### 9.4 Backup Strategy

Regular exports:
```bash
# Export Firestore data
gcloud firestore export gs://your-bucket/exported-data

# Automate with Cloud Scheduler
gcloud scheduler jobs create app-engine backup-firestore \
  --schedule="0 2 * * *" \
  --http-method=POST \
  --uri=...
```

## Step 10: Troubleshooting

### Functions Not Working

```bash
# Check deployment status
firebase functions:list

# Check logs
firebase functions:log

# Redeploy
firebase deploy --only functions --force
```

### Environment Variables Not Set

```bash
# Check config
firebase functions:config:get

# Set variable
firebase functions:config:set api.key="..."

# Deploy to apply
firebase deploy --only functions
```

### Hosting Not Updating

```bash
# Clear cache
firebase hosting:disable

# Re-enable and deploy
firebase deploy --only hosting --force
```

### Database Not Accessible

```bash
# Check rules
firebase deploy --only firestore:rules --force

# Test rules
# Use Firestore Rules Simulator in Console
```

### CORS Issues

Ensure Cloud Functions have proper CORS headers:

```javascript
// In functions/index.js
functions.https.onCall((data, context) => {
  // CORS handled by Firebase SDK
})
```

## Step 11: Production Checklist

Before going live:

- [ ] Firestore security rules reviewed
- [ ] Cloud Functions tested with various inputs
- [ ] Environment variables configured
- [ ] Authentication methods enabled
- [ ] Email templates customized
- [ ] User data privacy policy reviewed
- [ ] GDPR compliance (if applicable)
- [ ] SSL certificate (auto-configured)
- [ ] Custom domain configured (optional)
- [ ] Performance monitoring setup
- [ ] Error tracking enabled
- [ ] Backup strategy in place
- [ ] Support/contact info added
- [ ] Logging configured

## Step 12: Custom Domain Setup (Optional)

### 12.1 Connect Domain

Firebase Console → Hosting → Add custom domain:
1. Enter your domain (e.g., goldhallmark.com)
2. Verify domain ownership
3. Update DNS records as shown
4. Wait 24 hours for propagation

### 12.2 SSL Certificate

Firebase provides free SSL automatically. Monitor status:
- Provisioning: 24 hours
- Active: Certificate active

## Useful Commands

```bash
# List all resources
firebase list

# Deploy specific service
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules

# View logs
firebase functions:log -n 50

# Serve locally before deployment
firebase emulators:start

# Check project info
firebase projects:list
firebase projects:describe your-project-id

# Set default project
firebase use your-project-id

# View configuration
firebase --debug deploy
```

## Support & Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

## Cost Optimization

### Free Tier Limits

- Firestore: 50K reads/day, 20K writes/day, 1 GB storage
- Cloud Functions: 2M invocations/month, 400K GB-seconds/month
- Hosting: 1 GB storage, 10 GB bandwidth/month

### Tips to Stay Free

1. Optimize Firestore queries (composite indexes)
2. Cache API responses
3. Batch operations when possible
4. Use security rules to prevent unauthorized access
5. Monitor and set up alerts
6. Archive old complaints
7. Implement pagination in UI

### Upgrade to Paid Plan

When hitting limits:
- Blaze plan: Pay-as-you-go
- Estimated cost for 10K users: $10-50/month
- Always set budget alerts

---

**Last Updated**: 2024
**Firebase SDK Version**: Latest (v18+)
**Node.js Version**: 18+ (Cloud Functions)
