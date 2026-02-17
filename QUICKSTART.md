# CertiChain Quick Start Guide

Get CertiChain running in 10 minutes!

## 1. Install Dependencies (1 min)

```bash
cd certichain
npm install
```

## 2. Firebase Setup (3 min)

### Create Firebase Project
1. Visit https://console.firebase.google.com
2. Click "Add project"
3. Name it "certichain" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Firestore
1. Click "Firestore Database" in left menu
2. Click "Create database"
3. Select "Start in test mode"
4. Choose your region
5. Click "Enable"

### Enable Storage
1. Click "Storage" in left menu
2. Click "Get started"
3. Click "Next" (default rules)
4. Choose same region as Firestore
5. Click "Done"

### Get Config
1. Click gear icon → "Project settings"
2. Scroll to "Your apps"
3. Click web icon `</>`
4. Register app (name: "CertiChain Web")
5. Copy the config object

## 3. Create Environment File (2 min)

Create `.env.local` in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Temporary - we'll deploy contract later
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Run the App (1 min)

```bash
npm run dev
```

Open http://localhost:3000

## 5. Test Without Blockchain (2 min)

You can now:
- ✅ View the dashboard
- ✅ Create certificates (will save to Firebase)
- ✅ View issued certificates
- ✅ Download PDFs with QR codes
- ✅ Verify certificates (database only)

The app works without blockchain! Blockchain adds immutability.

## 6. Deploy Smart Contract (Optional - 5 min)

### Get Testnet MATIC
1. Install MetaMask browser extension
2. Add Polygon Amoy network:
   - Network: Polygon Amoy Testnet
   - RPC: https://rpc-amoy.polygon.technology
   - Chain ID: 80002
   - Symbol: MATIC
3. Visit https://faucet.polygon.technology
4. Select "Polygon Amoy"
5. Paste your wallet address
6. Get free testnet MATIC

### Deploy Contract
1. Export your MetaMask private key:
   - MetaMask → Account details → Export private key
   - Copy the key (without 0x prefix)

2. Add to `.env.local`:
```env
PRIVATE_KEY=your_private_key_here
```

3. Deploy:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network amoy
```

4. Copy the contract address and update `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

5. Restart the dev server:
```bash
npm run dev
```

## Features Overview

### Admin Panel
- **Dashboard** (`/admin`): Real-time stats, recent certificates
- **Create** (`/admin/create`): Issue certificates with live preview
- **Issued** (`/admin/issued`): Manage all certificates, download PDFs, revoke

### Public Verification
- **Verify** (`/verify`): Enter ID or scan QR code
- **Result** (`/verify/[id]`): Detailed verification with blockchain proof

## What's Working

✅ Certificate creation with live preview
✅ PDF generation with QR codes
✅ Firebase storage (certificates + assets)
✅ Real-time dashboard analytics
✅ Search and filter certificates
✅ Mobile-responsive design
✅ Framer Motion animations
✅ Certificate verification
✅ Revocation system
✅ Blockchain integration (when contract deployed)

## Next Steps

1. **Customize Templates**: Edit `lib/pdf-generator.ts`
2. **Add Branding**: Update logo and colors in components
3. **Deploy to Production**: See `DEPLOYMENT.md`
4. **Secure Firebase**: Update security rules (see `DEPLOYMENT.md`)

## Troubleshooting

### "Firebase not configured"
- Check `.env.local` exists
- Verify all Firebase variables are set
- Restart dev server

### "Cannot connect to blockchain"
- Normal if contract not deployed yet
- App works without blockchain
- Deploy contract to enable blockchain features

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## Demo Data

Want to test quickly? Create a certificate with:
- Recipient: John Doe
- Course: Blockchain Development Bootcamp
- Issuer: Tech Academy
- Date: Today

Then verify it at `/verify` using the generated certificate ID!

## Support

- Check browser console for errors
- View Firebase Console for database issues
- See `DEPLOYMENT.md` for detailed troubleshooting
