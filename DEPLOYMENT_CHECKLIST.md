# Deployment Checklist

## Pre-Deployment

### 1. Environment Variables
Ensure these are set in Vercel:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 2. Firebase Configuration

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /certificates/{document=**} {
      allow read: if true;
      allow write: if true; // Update for production
    }
    match /verifications/{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Firestore Indexes
Create index for:
- Collection: `certificates`
- Field: `createdAt`
- Order: Descending

### 3. Build Test
```bash
npm run build
```

Should complete without errors.

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Production optimizations and fixes"
git push origin main
```

### 2. Vercel Auto-Deploy
- Vercel will automatically deploy from GitHub
- Monitor deployment at https://vercel.com/dashboard

### 3. Check Build Logs
Look for:
- ✓ Compiled successfully
- ✓ Linting and checking validity of types
- ✓ Collecting page data
- ✓ Generating static pages

### 4. Verify Environment Variables
In Vercel Dashboard:
- Settings > Environment Variables
- Ensure all `NEXT_PUBLIC_*` variables are set
- Redeploy if you added new variables

## Post-Deployment Verification

### 1. Check Homepage
- [ ] Loads in <2 seconds
- [ ] All animations work
- [ ] Navigation works
- [ ] No console errors

### 2. Check Admin Dashboard
- [ ] Status indicator shows green
- [ ] Stats display correctly
- [ ] Recent certificates show (if any exist)
- [ ] No console errors

### 3. Check Certificate Creation
- [ ] Form loads correctly
- [ ] Preview updates in real-time
- [ ] Can upload logo/signature
- [ ] Certificate issues successfully
- [ ] PDF downloads correctly

### 4. Check Issued Certificates
- [ ] List loads in <3 seconds
- [ ] Search works
- [ ] Download works
- [ ] Revoke/Restore works

### 5. Check Verification
- [ ] Verify page loads
- [ ] Manual ID entry works
- [ ] QR scanner opens (on mobile)
- [ ] Verification results display correctly

## Common Deployment Issues

### Build Fails with TypeScript Errors
**Solution:**
```bash
npm run build
# Fix any TypeScript errors shown
```

### Build Fails with ESLint Errors
**Solution:**
```bash
npm install --save-dev eslint
# Or disable ESLint in next.config.mjs:
eslint: {
  ignoreDuringBuilds: true,
}
```

### Environment Variables Not Working
**Solution:**
1. Check they start with `NEXT_PUBLIC_`
2. Redeploy after adding variables
3. Clear Vercel cache and redeploy

### Firebase Connection Fails
**Solution:**
1. Check environment variables in Vercel
2. Verify Firebase project is active
3. Check Firestore security rules
4. Check browser console for specific errors

### Slow Loading on Vercel
**Solution:**
1. First load is always slower (cold start)
2. Check Firestore indexes are created
3. Verify no console errors
4. Check Vercel function logs

## Performance Monitoring

### Vercel Analytics
Enable in Vercel Dashboard:
- Settings > Analytics
- Monitor Core Web Vitals

### Expected Metrics
- First Contentful Paint: <1.5s
- Time to Interactive: <2.5s
- Largest Contentful Paint: <2.0s

### Lighthouse Score
Run Lighthouse audit:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

## Rollback Plan

If deployment has critical issues:

### Option 1: Revert in Vercel
1. Go to Vercel Dashboard
2. Deployments tab
3. Find previous working deployment
4. Click "..." > "Promote to Production"

### Option 2: Revert Git Commit
```bash
git revert HEAD
git push origin main
```

## Production Optimizations

### Already Implemented
- ✓ Dynamic imports for heavy libraries
- ✓ Code splitting
- ✓ Lazy loading components
- ✓ Optimized Firebase queries
- ✓ Error handling
- ✓ Loading states

### Optional Enhancements
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring alerts
- [ ] Configure custom domain
- [ ] Enable Vercel Speed Insights
- [ ] Set up error tracking (Sentry)

## Maintenance

### Regular Checks
- Monitor Vercel function logs
- Check Firebase usage/quotas
- Review error rates
- Monitor performance metrics

### Updates
```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Fix security issues
npm audit fix
```

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Firebase Docs: https://firebase.google.com/docs
- Vercel Support: https://vercel.com/support

## Success Criteria

Deployment is successful when:
- ✓ Build completes without errors
- ✓ All pages load in <3 seconds
- ✓ No console errors
- ✓ Firebase connection works
- ✓ Certificate creation works
- ✓ Verification works
- ✓ Status indicator shows green
- ✓ Lighthouse score >90

## Emergency Contacts

If critical issues occur:
1. Check Vercel status: https://www.vercel-status.com/
2. Check Firebase status: https://status.firebase.google.com/
3. Review deployment logs in Vercel Dashboard
4. Check browser console for client-side errors
5. Check Vercel function logs for server-side errors
