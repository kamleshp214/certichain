# CertiChain Deployment Guide

## Prerequisites

1. Node.js 18+ installed
2. MetaMask wallet with Polygon Amoy testnet configured
3. Firebase project created
4. Polygon Amoy testnet MATIC (from faucet)

## Step-by-Step Deployment

### 1. Firebase Setup

1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose a location
4. Enable Storage:
   - Go to Storage
   - Click "Get started"
   - Use default security rules
5. Get your Firebase config:
   - Go to Project Settings
   - Scroll to "Your apps"
   - Click web icon (</>)
   - Copy the config values

### 2. Environment Configuration

Create `.env.local` in the project root:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Blockchain
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... (will be filled after deployment)
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For contract deployment
PRIVATE_KEY=your_metamask_private_key_without_0x
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
```

### 3. Get Testnet MATIC

1. Go to https://faucet.polygon.technology
2. Select "Polygon Amoy"
3. Enter your wallet address
4. Request testnet MATIC

### 4. Deploy Smart Contract

```bash
# Install dependencies
npm install

# Compile contract
npx hardhat compile

# Deploy to Polygon Amoy
npx hardhat run scripts/deploy.js --network amoy
```

Copy the deployed contract address and add it to `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

### 5. Run the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

### 6. Verify Deployment

1. Open http://localhost:3000
2. Go to `/admin` - should see dashboard
3. Create a test certificate
4. Verify the certificate at `/verify`

## Production Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Add environment variables (all NEXT_PUBLIC_* variables)
4. Deploy

### 3. Update App URL

After deployment, update `.env.local` and Vercel environment variables:

```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Firestore Security Rules

Update Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /certificates/{document} {
      allow read: if true;
      allow write: if false; // Only allow writes from your backend
    }
    match /verifications/{document} {
      allow read: if false;
      allow write: if true;
    }
  }
}
```

## Storage Security Rules

Update Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /logos/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
    match /signatures/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Troubleshooting

### MetaMask Connection Issues

- Ensure Polygon Amoy network is added to MetaMask
- Network details:
  - Network Name: Polygon Amoy Testnet
  - RPC URL: https://rpc-amoy.polygon.technology
  - Chain ID: 80002
  - Currency Symbol: MATIC
  - Block Explorer: https://amoy.polygonscan.com

### Firebase Connection Issues

- Check if API key is correct
- Verify Firebase project is active
- Ensure Firestore and Storage are enabled

### Contract Deployment Issues

- Ensure you have enough testnet MATIC
- Check private key format (no 0x prefix)
- Verify RPC URL is correct

## Monitoring

- View blockchain transactions: https://amoy.polygonscan.com
- Monitor Firebase usage: Firebase Console
- Check Vercel logs: Vercel Dashboard

## Support

For issues, check:
- Firebase Console for database errors
- Browser console for frontend errors
- Polygon Amoy explorer for transaction status
