# CertiChain - Blockchain Certificate Verification Platform

A production-ready web application for issuing and verifying tamper-proof certificates on the Polygon blockchain.

## Overview

CertiChain enables institutions to issue blockchain-verified certificates that are:
- **Tamper-proof**: Secured by cryptographic hashing and blockchain immutability
- **Instantly verifiable**: Anyone can verify authenticity via certificate ID or QR code
- **Professional**: Multiple certificate templates with customizable branding
- **Transparent**: All records publicly verifiable on Polygon blockchain

## Features

### Certificate Issuance
- **Multiple Templates**: Academic, Corporate, Premium, and Minimal designs
- **Landscape Orientation**: True A4 landscape (842x595 points) for professional appearance
- **Comprehensive Fields**:
  - Recipient full name
  - Course/Program title
  - Institution name
  - Issuer and instructor names
  - Issue and expiry dates
  - Duration (from-to dates)
  - Grade/Score
  - Custom logo and signature
  - Configurable QR code, logo, and signature positions
- **Live Preview**: Real-time certificate preview as you type
- **PDF Generation**: High-quality PDFs with embedded QR codes
- **Blockchain Recording**: SHA256 hash stored on Polygon Amoy testnet

### Certificate Management
- **Dashboard**: Real-time analytics and statistics
- **Search & Filter**: Find certificates by name, course, or ID
- **Download**: Generate PDFs for any issued certificate
- **Revocation**: Revoke certificates with blockchain update
- **Status Tracking**: Active/Revoked status badges

### Public Verification
- **Dual Verification**: Manual ID entry or QR code scanning
- **Camera Scanning**: Mobile-first QR scanner with permission handling
- **Verification States**: Verified, Tampered, Revoked, Expired, Not Found
- **Blockchain Proof**: Direct links to Polygon blockchain transactions
- **Verification Logging**: All verification attempts recorded

## Tech Stack

### Frontend
- **Next.js 14**: App Router with React Server Components
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Zustand**: Lightweight state management
- **React Hook Form + Zod**: Form handling and validation

### Backend
- **Firebase Firestore**: NoSQL database for certificate storage
- **Firebase Storage**: Image hosting for logos and signatures
- **Polygon Amoy**: Ethereum-compatible testnet for blockchain verification
- **Ethers.js v6**: Blockchain interaction library

### Smart Contract
- **Solidity 0.8.19**: Smart contract language
- **Hardhat**: Development environment
- **OpenZeppelin**: Security-audited contract libraries

## Project Structure

```
certichain/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin panel routes
│   │   ├── page.tsx             # Dashboard
│   │   ├── create/              # Certificate creation
│   │   ├── issued/              # Certificate management
│   │   └── layout.tsx           # Admin layout
│   ├── verify/                  # Public verification
│   │   ├── page.tsx            # Verify entry
│   │   └── [id]/               # Verification result
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home (redirects to admin)
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── ui/                     # Base UI components
│   ├── layout/                 # Navigation components
│   ├── certificate/            # Certificate-specific components
│   ├── verify/                 # Verification components
│   └── dashboard/              # Dashboard components
│
├── lib/                        # Utility libraries
│   ├── firebase.ts            # Firebase initialization
│   ├── blockchain.ts          # Blockchain interactions
│   ├── hash.ts                # SHA256 hashing
│   ├── pdf-generator.ts       # PDF creation with templates
│   └── utils.ts               # General utilities
│
├── store/                      # State management
│   └── certificate-store.ts   # Zustand store
│
├── types/                      # TypeScript types
│   ├── certificate.ts         # Certificate interfaces
│   └── window.d.ts            # Window extensions
│
├── contracts/                  # Smart contracts
│   └── CertificateRegistry.sol
│
├── scripts/                    # Deployment scripts
│   └── deploy.js
│
└── public/                     # Static assets
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- MetaMask wallet (for blockchain deployment)
- Polygon Amoy testnet MATIC (from faucet)

### 1. Clone and Install

```bash
git clone <repository-url>
cd certichain
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (update rules for production)
   - Choose your region

3. Enable **Storage**:
   - Go to Storage
   - Click "Get started"
   - Use default security rules
   - Choose same region as Firestore

4. Get your Firebase configuration:
   - Go to Project Settings
   - Scroll to "Your apps"
   - Click web icon (</>)
   - Copy the config values

### 3. Environment Variables

Create `.env.local` in the project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD7z9ce1fRXZoO_fkdk-t78mvrC6QYDzPY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=certichain-11c80.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=certichain-11c80
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=certichain-11c80.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=941127523787
NEXT_PUBLIC_FIREBASE_APP_ID=1:941127523787:web:6ea3b9356d8145feb6aa4e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ZZB1KWPZET

# Blockchain Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For Smart Contract Deployment
PRIVATE_KEY=your_metamask_private_key_without_0x_prefix
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

**Note**: The Firebase credentials above are pre-configured for the CertiChain project. For production, create your own Firebase project and update these values.

### 4. Smart Contract Deployment (Optional)

The app works without blockchain deployment (database-only verification). To enable blockchain features:

1. **Get Testnet MATIC**:
   - Install MetaMask browser extension
   - Add Polygon Amoy network:
     - Network Name: Polygon Amoy Testnet
     - RPC URL: https://rpc-amoy.polygon.technology
     - Chain ID: 80002
     - Currency Symbol: MATIC
     - Block Explorer: https://amoy.polygonscan.com
   - Get free testnet MATIC from https://faucet.polygon.technology

2. **Deploy Contract**:
   ```bash
   # Compile contract
   npx hardhat compile

   # Deploy to Polygon Amoy
   npx hardhat run scripts/deploy.js --network amoy
   ```

3. **Update Environment**:
   - Copy the deployed contract address
   - Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
   - Restart the development server

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Usage Guide

### Issuing Certificates

1. Navigate to **Create Certificate** (`/admin/create`)
2. Fill in the certificate details:
   - **Basic Information**: Recipient, course, institution, issuer, date
   - **Advanced Options** (optional): Instructor, duration, grade, expiry, positions
3. Select a template (Academic, Corporate, Premium, or Minimal)
4. Upload logo and signature images (optional)
5. Preview the certificate in real-time
6. Click **Issue Certificate**
7. Wait for the 5-step process to complete:
   - Generating hash
   - Uploading assets
   - Saving to database
   - Blockchain transaction (if configured)
   - Confirmation
8. Download the PDF certificate

### Managing Certificates

1. Navigate to **Issued Certificates** (`/admin/issued`)
2. View all issued certificates in a table (desktop) or cards (mobile)
3. Use the search bar to find specific certificates
4. Actions available:
   - **Download**: Generate and download PDF
   - **Revoke**: Invalidate the certificate (updates blockchain)

### Verifying Certificates

1. Navigate to **Verify Certificate** (`/verify`)
2. Choose verification method:
   - **Manual**: Enter certificate ID
   - **QR Scanner**: Scan QR code from certificate PDF
3. View verification result:
   - ✅ **Verified**: Certificate is authentic
   - ❌ **Tampered**: Certificate data has been modified
   - ❌ **Revoked**: Certificate has been revoked
   - ⚠️ **Expired**: Certificate has passed expiry date
   - 🔍 **Not Found**: Certificate doesn't exist

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (all `NEXT_PUBLIC_*` variables)
   - Click "Deploy"

3. **Update App URL**:
   - After deployment, copy your Vercel URL
   - Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
   - Redeploy

### Production Firestore Rules

Update Firestore security rules for production:

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
      allow write: if true; // Allow public verification logging
    }
  }
}
```

### Production Storage Rules

Update Storage security rules:

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

## Smart Contract

### CertificateRegistry.sol

The smart contract provides:

- `issueCertificate(certificateId, hash)`: Store certificate hash on-chain
- `verifyCertificate(certificateId)`: Retrieve certificate data and verify
- `revokeCertificate(certificateId)`: Mark certificate as revoked
- `getCertificateCount()`: Get total certificates issued

### Contract Functions

```solidity
// Issue a new certificate
function issueCertificate(string memory certificateId, bytes32 certificateHash) public onlyOwner

// Verify a certificate
function verifyCertificate(string memory certificateId) public view returns (
    bytes32 certificateHash,
    bool isValid,
    bool isRevoked,
    uint256 timestamp
)

// Revoke a certificate
function revokeCertificate(string memory certificateId) public onlyOwner

// Get total count
function getCertificateCount() public view returns (uint256)
```

## Security

### Hash Generation
- SHA256 algorithm for certificate integrity
- Includes: ID, recipient, course, institution, issuer, date
- Deterministic and verifiable

### Blockchain
- Immutable storage on Polygon
- Public verification
- Owner-controlled issuance and revocation
- Event logging for transparency

### Firebase
- Secure rules for production
- Environment variables for credentials
- No sensitive data in client code

## Troubleshooting

### Firebase Connection Issues
- Verify API key is correct
- Check if Firestore and Storage are enabled
- Ensure Firebase project is active

### Blockchain Connection Issues
- Verify MetaMask is installed
- Check you're on Polygon Amoy network
- Ensure you have testnet MATIC
- Verify contract address is correct

### PDF Generation Issues
- Check image URLs are accessible
- Verify images are in supported formats (PNG, JPG)
- Ensure pdf-lib is installed

### Camera Access Issues
- HTTPS required for camera access in production
- Check browser permissions
- Verify camera is not in use by another app

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx hardhat compile  # Compile smart contracts
npx hardhat test     # Run contract tests
```

### Adding New Certificate Templates

1. Update `types/certificate.ts` to add new template type
2. Add template rendering in `lib/pdf-generator.ts`
3. Add preview component in `components/certificate/certificate-preview.tsx`
4. Update form options in `components/certificate/certificate-form.tsx`

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: Report bugs and request features
- Documentation: Check all .md files in the repository
- Firebase Console: Monitor database and storage usage
- Polygon Explorer: View blockchain transactions

## Acknowledgments

Built with:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Firebase
- Ethers.js
- Polygon
- pdf-lib
- And many other open-source projects

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
