# 🚀 Gold Guardian - Deployment Checklist

## Pre-Deployment Verification

### Code Quality
- [ ] All components render without console errors
- [ ] No warnings in browser console
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] All calculation formulas verified
- [ ] All links working correctly
- [ ] Images/icons loading properly

### Firebase Configuration
- [ ] `.env.local` file created with correct values
- [ ] Firebase project created in Firebase Console
- [ ] Firestore Database created and initialized
- [ ] Database security rules published
- [ ] Cloud Functions deployed successfully
- [ ] HUID codes populated in Firestore

### Features Testing
- [ ] **Calculator**: Live gold rate fetches correctly
- [ ] **Calculator**: Price calculations accurate
- [ ] **Calculator**: Fraud alerts show correct color codes
- [ ] **HUID Verification**: Code lookup works (both valid/invalid)
- [ ] **Learn Page**: All hallmark cards display properly
- [ ] **Complaint Generator**: Form submission works
- [ ] **Complaint Generator**: Downloads/copies work

### Performance
- [ ] Build completes without errors: `npm run build`
- [ ] `dist/` folder created with all assets
- [ ] Bundle size reasonable (< 500KB for app code)
- [ ] No broken imports in build output
- [ ] Build optimization enabled in vite.config.js

### Security
- [ ] API keys in `.env.local` (not committed to git)
- [ ] `.gitignore` configured properly
- [ ] Firestore rules set to restrict unauthorized access
- [ ] Cloud Functions have proper error handling
- [ ] No sensitive data logged to console

---

## Production Deployment Steps

### Step 1: Build Production Version
```bash
# Clean previous build
rm -rf dist/

# Build
npm run build

# Verify dist/ folder created
ls -la dist/

# Test production build locally
npm run preview
# Visit http://localhost:4173 and test all features
```

### Step 2: Update Firebase Configuration
```bash
# Ensure .firebaserc points to correct project
cat .firebaserc

# Should show:
# {
#   "projects": {
#     "default": "gold-guardian-project"
#   }
# }
```

### Step 3: Deploy to Firebase Hosting
```bash
# Deploy
firebase deploy

# Should output:
# ✔ Deploy complete!
# 
# Project Console: https://console.firebase.google.com/project/gold-guardian-xxx/overview
# Hosting URL: https://gold-guardian-xxx.web.app
```

### Step 4: Verify Deployment
1. Visit the Hosting URL from deployment output
2. Test all pages:
   - [ ] Home page loads
   - [ ] Calculator works with live rates
   - [ ] HUID verification functional
   - [ ] Learn page displays all cards
   - [ ] Complaint generator saves data
3. Check browser console for errors
4. Test on mobile device

### Step 5: Update DNS (if using custom domain)
```bash
# If you have custom domain:
# 1. Go to Firebase Hosting → Domain
# 2. Click "Add Custom Domain"
# 3. Follow DNS configuration instructions
```

---

## Post-Deployment Verification

### Check Deployment Status
```bash
# View deployment details
firebase hosting:channel:list

# View all deployments
firebase deploy:list

# View function status
firebase functions:log
```

### Monitor Performance
1. Firebase Console → Hosting → Metrics
2. Check request counts and bandwidth
3. Look for errors in Cloud Function logs

### Setup Error Tracking
```bash
# View error logs
firebase functions:log --filter "ERROR"

# View CPU/Memory usage
firebase functions:log
```

---

## Rollback Plan

If deployment has issues:

```bash
# Rollback to previous version
firebase hosting:channel:deploy <version>

# Or redeploy previous build
git checkout <previous-commit>
npm run build
firebase deploy
```

---

## Post-Launch Tasks

### Content & Data
- [ ] Add real BIS registered HUID codes (not just samples)
- [ ] Create admin dashboard for complaint review
- [ ] Setup email notifications for new complaints
- [ ] Add real shop/jeweller database

### Marketing & SEO
- [ ] Update meta tags in index.html
- [ ] Add Google Analytics tracking
- [ ] Setup Google Search Console
- [ ] Create sitemap.xml
- [ ] Add robots.txt

### Security Hardening
- [ ] Update Firestore rules to production security model
- [ ] Setup authentication (if required)
- [ ] Enable reCAPTCHA for forms
- [ ] Setup rate limiting on Cloud Functions
- [ ] Configure CORS properly

### Performance Optimization
- [ ] Enable compression on Firebase Hosting
- [ ] Setup CDN caching
- [ ] Optimize images to WebP format
- [ ] Minify CSS/JS (Vite does this automatically)
- [ ] Setup Cloud Functions with 256MB memory minimum

### Monitoring & Alerts
- [ ] Setup Firebase Cloud Monitoring
- [ ] Configure error alerts
- [ ] Monitor Cloud Function costs
- [ ] Setup daily backup alerts
- [ ] Create incident response procedures

---

## Performance Metrics

### Target Metrics (After Deployment)
- First Contentful Paint (FCP): < 2s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

### Monitor Using
- Google PageSpeed Insights
- Lighthouse (in Chrome DevTools)
- Firebase Performance Monitoring

---

## Troubleshooting Deployment Issues

### Issue: 404 "Page not found"
**Solution**: Ensure `firebase.json` has correct routing rules:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Issue: CSS not loading
**Reason**: CSS files embedded in JS  
**Solution**: Check Vite CSS extraction is enabled (default)

### Issue: Images showing 404
**Solution**: Ensure images in `public/` folder and use `/image-name` path

### Issue: Cloud Functions timeout
**Solution**: Increase timeout in firebase.json:
```json
{
  "functions": {
    "timeoutSeconds": 60
  }
}
```

### Issue: High bills from Cloud Functions
**Solution**: Setup alerts and optimize function execution:
- Reduce function memory if not needed
- Create background functions for heavy tasks
- Setup concurrent execution limits

---

## Cost Management

### Estimate Costs
- Firebase Hosting: Free (within limits)
- Firestore: Free tier covers 25K reads/day
- Cloud Functions: Free tier covers 2M invocations/month
- Data Transfer: Free (within Firebase)

### Monitor Costs
1. Firebase Console → Billing
2. Set up billing alerts
3. Monitor:
   - Firestore read/write count
   - Cloud Function invocations
   - Data transfer

### Optimize Costs
- Use Firestore queries efficiently
- Cloud Function: Cache responses where possible
- Compress data before storage
- Implement request rate limiting

---

## Maintenance Schedule

### Daily
- [ ] Monitor error logs
- [ ] Check function performance

### Weekly
- [ ] Review user complaints in Firestore
- [ ] Check Cloud Function costs
- [ ] Monitor performance metrics

### Monthly
- [ ] Update gold rate data if needed
- [ ] Review and update HUID database
- [ ] Performance analysis
- [ ] User feedback review

### Quarterly
- [ ] Security audit
- [ ] Dependency updates
- [ ] Feature requests review
- [ ] Backup verification

---

## Contact & Support

For deployment issues:
1. Check Firebase Console status page
2. Review error logs in `firebase functions:log`
3. Check browser console in deployed site
4. Contact Firebase support if infrastructure issue

---

## Version Control

### Before Deployment
```bash
# Commit all changes
git add .
git commit -m "Deployment preparation v1.0"

# Create deployment tag
git tag -a v1.0-production -m "Production deployment"

# Push to repository
git push origin main
git push origin v1.0-production
```

### Post-Deployment
```bash
# Document deployment
git log --oneline | head -5

# Keep deployment logs
firebase deploy > deployment.log 2>&1
```

---

## Success Criteria ✅

Your deployment is successful when:

✅ App loads without errors on deployed URL  
✅ All pages render correctly  
✅ Live gold rate displays  
✅ HUID verification works  
✅ Complaints save to Firestore  
✅ No console errors  
✅ Mobile responsive  
✅ All links working  
✅ Performance metrics acceptable  
✅ No security vulnerabilities  

---

**Last Updated**: February 2026  
**Status**: Ready for Production Deployment

