# CertiChain Architecture

## System Overview

CertiChain is a full-stack blockchain application built with Next.js 14, Firebase, and Ethereum smart contracts. It follows a modern JAMstack architecture with serverless functions and decentralized storage.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 14 App Router (React 18)                    │  │
│  │  - Server Components                                  │  │
│  │  - Client Components (use client)                     │  │
│  │  - API Routes                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  State Management (Zustand)                          │  │
│  │  - Certificate form state                            │  │
│  │  - UI state                                           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  UI Layer (Tailwind + Framer Motion)                 │  │
│  │  - Responsive components                             │  │
│  │  - Animations                                         │  │
│  │  - ShadCN UI components                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Services                        │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Firebase        │  │  Blockchain      │                │
│  │  - Firestore     │  │  - Polygon Amoy  │                │
│  │  - Storage       │  │  - Smart Contract│                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion 11
- **State**: Zustand 4
- **Forms**: React Hook Form + Zod
- **UI Components**: Custom + ShadCN patterns

### Backend
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage
- **Blockchain**: Polygon Amoy Testnet
- **Smart Contracts**: Solidity 0.8.19
- **Web3**: Ethers.js v6

### Development
- **Build Tool**: Next.js built-in (Turbopack)
- **Contract Dev**: Hardhat
- **Package Manager**: npm
- **Version Control**: Git

## Directory Structure

```
certichain/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin panel routes
│   │   ├── page.tsx        # Dashboard
│   │   ├── create/         # Certificate creation
│   │   ├── issued/         # Certificate management
│   │   └── layout.tsx      # Admin layout
│   ├── verify/             # Public verification
│   │   ├── page.tsx        # Verify entry
│   │   └── [id]/           # Verification result
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home (redirects)
│   └── globals.css         # Global styles
│
├── components/              # React components
│   ├── ui/                 # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/             # Layout components
│   │   └── sidebar.tsx
│   ├── certificate/        # Certificate components
│   │   ├── certificate-form.tsx
│   │   ├── certificate-preview.tsx
│   │   └── issuing-progress.tsx
│   ├── verify/             # Verification components
│   │   ├── qr-scanner.tsx
│   │   └── verification-result.tsx
│   └── dashboard/          # Dashboard components
│       ├── stat-card.tsx
│       └── empty-state.tsx
│
├── lib/                     # Utility libraries
│   ├── firebase.ts         # Firebase initialization
│   ├── blockchain.ts       # Blockchain interactions
│   ├── hash.ts             # Hashing utilities
│   ├── pdf-generator.ts    # PDF creation
│   └── utils.ts            # General utilities
│
├── store/                   # State management
│   └── certificate-store.ts # Zustand store
│
├── types/                   # TypeScript types
│   ├── certificate.ts      # Certificate interfaces
│   └── window.d.ts         # Window extensions
│
├── contracts/               # Smart contracts
│   └── CertificateRegistry.sol
│
├── scripts/                 # Deployment scripts
│   └── deploy.js
│
└── public/                  # Static assets
```

## Data Flow

### Certificate Issuance Flow

```
User Input (Form)
    │
    ▼
Form Validation (Zod)
    │
    ▼
Generate Certificate ID
    │
    ▼
Calculate SHA256 Hash
    │
    ▼
Upload Assets (Firebase Storage)
    │
    ▼
Save to Firestore
    │
    ▼
Issue on Blockchain (Smart Contract)
    │
    ▼
Generate PDF with QR Code
    │
    ▼
Return Certificate ID
```

### Verification Flow

```
Certificate ID Input
    │
    ▼
Query Firestore
    │
    ├─ Not Found → Return "Not Found"
    │
    ▼
Recalculate Hash
    │
    ▼
Query Blockchain
    │
    ├─ Not on Chain → Database-only verification
    │
    ▼
Compare Hashes
    │
    ├─ Match → Check Revocation
    │   │
    │   ├─ Not Revoked → "Verified"
    │   └─ Revoked → "Revoked"
    │
    └─ Mismatch → "Tampered"
    │
    ▼
Log Verification
    │
    ▼
Return Result
```

## Component Architecture

### Component Hierarchy

```
App
├── Layout (Root)
│   └── Body
│       ├── Admin Layout
│       │   ├── Sidebar
│       │   └── Main Content
│       │       ├── Dashboard
│       │       │   ├── StatCard (x4)
│       │       │   └── RecentCertificates
│       │       ├── Create Certificate
│       │       │   ├── CertificateForm
│       │       │   ├── CertificatePreview
│       │       │   └── IssuingProgress
│       │       └── Issued Certificates
│       │           └── CertificateTable/Cards
│       └── Verify
│           ├── VerifyInput
│           ├── QRScanner
│           └── VerificationResult
```

### Component Types

1. **Server Components** (default):
   - Layout components
   - Static pages
   - Data fetching wrappers

2. **Client Components** ('use client'):
   - Interactive forms
   - Animations
   - State management
   - Browser APIs (camera, etc.)

## State Management

### Zustand Store Structure

```typescript
CertificateStore {
  formData: {
    recipientName: string
    courseName: string
    issueDate: string
    issuerName: string
    template: 'modern' | 'classic' | 'minimal'
    logoFile?: File
    signatureFile?: File
    logoUrl?: string
    signatureUrl?: string
  }
  issuingStep: number
  updateFormData: (data) => void
  setIssuingStep: (step) => void
  resetForm: () => void
}
```

### Local State
- Component-specific UI state
- Form validation state
- Loading states
- Error states

## Database Schema

### Firestore Collections

#### certificates
```typescript
{
  id: string (auto-generated)
  certificateId: string (CERT-XXX)
  recipientName: string
  courseName: string
  issueDate: string
  issuerName: string
  template: 'modern' | 'classic' | 'minimal'
  hash: string (SHA256)
  txHash?: string (blockchain)
  isRevoked: boolean
  createdAt: number (timestamp)
  logoUrl?: string
  signatureUrl?: string
}
```

#### verifications
```typescript
{
  id: string (auto-generated)
  certificateId: string
  timestamp: number
  result: 'verified' | 'tampered' | 'revoked' | 'expired' | 'not_found'
  ipAddress?: string
}
```

### Firebase Storage Structure

```
/logos/
  ├── CERT-XXX-YYY
  └── CERT-AAA-BBB

/signatures/
  ├── CERT-XXX-YYY
  └── CERT-AAA-BBB
```

## Smart Contract

### CertificateRegistry.sol

```solidity
struct Certificate {
  bytes32 certificateHash;
  bool isValid;
  bool isRevoked;
  uint256 timestamp;
}

mapping(string => Certificate) certificates;
uint256 certificateCount;
address owner;

Functions:
- issueCertificate(id, hash)
- verifyCertificate(id) → (hash, isValid, isRevoked, timestamp)
- revokeCertificate(id)
- getCertificateCount() → uint256
```

### Events
- `CertificateIssued(certificateId, hash, timestamp)`
- `CertificateRevoked(certificateId, timestamp)`

## Security Considerations

### Frontend Security
- Environment variables for sensitive data
- Input validation (Zod schemas)
- XSS prevention (React escaping)
- CSRF protection (Next.js built-in)

### Backend Security
- Firestore security rules
- Storage security rules
- Smart contract owner-only functions
- Hash verification

### Blockchain Security
- Immutable records
- Owner-controlled issuance
- Public verification
- Event logging

## Performance Optimizations

### Frontend
- Code splitting (automatic)
- Image optimization (Next.js)
- Lazy loading components
- Skeleton loaders
- Debounced search

### Backend
- Firestore query optimization
- Indexed queries
- Cached blockchain reads
- Batch operations

### Network
- CDN delivery (Vercel)
- Edge functions
- Optimized bundle size
- Compression

## Deployment Architecture

### Development
```
Local Machine
├── Next.js Dev Server (localhost:3000)
├── Firebase Emulators (optional)
└── Hardhat Local Node (optional)
```

### Production
```
Vercel Edge Network
├── Next.js App (SSR + Static)
├── API Routes (Serverless)
└── Static Assets (CDN)
    │
    ├─→ Firebase (Cloud)
    │   ├── Firestore
    │   └── Storage
    │
    └─→ Polygon Amoy (Blockchain)
        └── Smart Contract
```

## API Endpoints

### Internal API Routes (if needed)
- `/api/certificates` - CRUD operations
- `/api/verify` - Verification logic
- `/api/stats` - Dashboard statistics

### External APIs
- Firebase Firestore API
- Firebase Storage API
- Polygon RPC API
- MetaMask Provider API

## Error Handling Strategy

### Levels
1. **User Input**: Form validation (Zod)
2. **Network**: Retry logic, fallbacks
3. **Blockchain**: Database fallback
4. **Firebase**: Error messages, retry
5. **Application**: Error boundaries

### User Feedback
- Inline form errors
- Toast notifications
- Error pages
- Loading states
- Success confirmations

## Testing Strategy (Recommended)

### Unit Tests
- Utility functions (hash, PDF)
- Component logic
- State management

### Integration Tests
- Form submission
- Verification flow
- Database operations

### E2E Tests
- Complete user flows
- Cross-browser testing
- Mobile testing

### Contract Tests
- Hardhat tests
- Gas optimization
- Security audits

## Monitoring & Analytics

### Metrics to Track
- Certificate issuance rate
- Verification attempts
- Success/failure rates
- Page load times
- Error rates

### Tools (Recommended)
- Vercel Analytics
- Firebase Analytics
- Blockchain explorers
- Error tracking (Sentry)

## Scalability Considerations

### Current Limits
- Firestore: 1M reads/day (free tier)
- Storage: 5GB (free tier)
- Blockchain: Gas costs per transaction

### Scaling Strategy
1. Implement caching
2. Batch operations
3. Optimize queries
4. Use CDN for assets
5. Consider mainnet for production

## Future Architecture Improvements

1. **Backend API**: Separate API server for admin operations
2. **Queue System**: Background job processing
3. **Caching Layer**: Redis for frequently accessed data
4. **Microservices**: Separate verification service
5. **Multi-chain**: Support multiple blockchains
6. **IPFS**: Decentralized storage for certificates
