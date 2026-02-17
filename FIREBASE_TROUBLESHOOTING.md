# Firebase Troubleshooting Guide

## Issue: Certificates Not Loading / Slow Loading

If you're experiencing slow loading or no certificates showing up, follow these steps:

### 1. Check Environment Variables

Ensure your `.env.local` file has all required Firebase variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important**: All variables must start with `NEXT_PUBLIC_` to be accessible in the browser.

### 2. Check Browser Console

Open Chrome DevTools (F12) and check the Console tab for errors:

**Common Errors:**

1. **"Firebase configuration is incomplete"**
   - Solution: Check your `.env.local` file exists and has all variables
   - Restart the dev server after adding variables

2. **"Missing or insufficient permissions"**
   - Solution: Update Firestore security rules (see below)

3. **"The query requires an index"**
   - Solution: Create the required Firestore index (see below)

4. **"Network request failed"**
   - Solution: Check your internet connection and Firebase project status

### 3. Firestore Security Rules

For development, use these permissive rules (update for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to certificates collection
    match /certificates/{document=**} {
      allow read, write: if true;
    }
    
    // Allow read/write to verifications collection
    match /verifications/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**To update rules:**
1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database
4. Click "Rules" tab
5. Paste the rules above
6. Click "Publish"

### 4. Create Firestore Index

If you see "index required" error:

**Option A: Use Firebase Console Link**
- Click the link in the error message
- It will take you directly to create the index
- Click "Create Index"

**Option B: Manual Creation**
1. Go to Firebase Console > Firestore Database
2. Click "Indexes" tab
3. Click "Create Index"
4. Configure:
   - Collection ID: `certificates`
   - Fields to index:
     - Field: `createdAt`, Order: `Descending`
   - Query scope: `Collection`
5. Click "Create"

Wait 2-5 minutes for the index to build.

### 5. Check Firebase Project Status

1. Go to https://status.firebase.google.com/
2. Verify all services are operational
3. Check if there are any ongoing incidents

### 6. Verify Data Exists

Check if certificates actually exist in your database:

1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database
4. Look for "certificates" collection
5. Check if documents exist

If no documents exist, that's why nothing shows up! Create a certificate first.

### 7. Network Performance

Slow loading can be caused by:

1. **Cold Start**: First load after deployment is slower
   - Solution: Wait 30 seconds, refresh

2. **Large Dataset**: Too many certificates
   - Solution: Already limited to 50 most recent

3. **Slow Network**: Poor internet connection
   - Solution: Check your connection speed

4. **Firestore Location**: Database in different region
   - Solution: Choose nearest region when creating project

### 8. Vercel Deployment Issues

If it works locally but not on Vercel:

1. **Check Environment Variables on Vercel:**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all `NEXT_PUBLIC_FIREBASE_*` variables
   - Redeploy after adding variables

2. **Check Build Logs:**
   - Look for Firebase initialization errors
   - Check if environment variables are loaded

3. **Check Function Logs:**
   - Go to Vercel Dashboard > Deployments
   - Click on your deployment
   - Check "Functions" tab for errors

### 9. Quick Diagnostic Commands

Run these in your browser console (F12):

```javascript
// Check if Firebase is initialized
console.log('Firebase config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
});

// Check Firestore connection
import { collection, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

getDocs(collection(db, 'certificates'))
  .then(snapshot => console.log(`Found ${snapshot.size} certificates`))
  .catch(error => console.error('Firestore error:', error));
```

### 10. Common Solutions Summary

| Problem | Solution |
|---------|----------|
| No certificates showing | Check if data exists in Firestore |
| "Permission denied" | Update Firestore security rules |
| "Index required" | Create Firestore index |
| Slow loading | Check network, wait for cold start |
| Works locally, not on Vercel | Add env variables to Vercel |
| "Firebase config incomplete" | Check .env.local file |

### 11. Still Not Working?

If none of the above helps:

1. Check the browser console for specific error messages
2. Check Vercel function logs for server-side errors
3. Verify Firebase project is active and not suspended
4. Try creating a new certificate to test the flow
5. Check if Firebase billing is enabled (required for some features)

### 12. Performance Optimization Tips

Once it's working, optimize performance:

1. **Enable Firestore Persistence:**
   ```typescript
   import { enableIndexedDbPersistence } from 'firebase/firestore';
   enableIndexedDbPersistence(db).catch(err => console.log(err));
   ```

2. **Use Firestore Caching:**
   - Firestore automatically caches data
   - Subsequent loads will be faster

3. **Implement Pagination:**
   - Load certificates in batches
   - Use `startAfter()` for pagination

4. **Use Real-time Listeners Sparingly:**
   - Only use `onSnapshot()` when needed
   - Prefer `getDocs()` for one-time reads

## Need More Help?

Check the Firebase documentation:
- https://firebase.google.com/docs/firestore
- https://firebase.google.com/docs/firestore/security/get-started
- https://firebase.google.com/docs/firestore/query-data/indexing
