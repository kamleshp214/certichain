# CertiChain: Technical Report

## 1. INTRODUCTION

### 1.1 What is CertiChain

CertiChain is a blockchain-powered certificate issuance and verification platform that combines traditional web technologies with distributed ledger technology to create tamper-proof digital certificates. The system allows institutions to issue certificates that are cryptographically secured and permanently recorded on the Polygon blockchain, ensuring authenticity and preventing fraud.

### 1.2 Problem Statement

Traditional paper certificates and even digital PDFs face several critical challenges:

- **Forgery and Tampering**: Physical certificates can be easily forged or altered. Digital certificates stored as simple PDFs can be modified using editing software.
- **Verification Difficulty**: Employers and institutions must manually contact issuing organizations to verify credentials, which is time-consuming and inefficient.
- **Loss and Damage**: Physical certificates can be lost, damaged, or destroyed, requiring lengthy reissuance processes.
- **Lack of Transparency**: No public record exists to verify the authenticity of a certificate without contacting the issuer directly.

### 1.3 Why Blockchain for Certificates

Blockchain technology provides an ideal solution for certificate management:

- **Immutability**: Once a certificate hash is recorded on the blockchain, it cannot be altered or deleted, creating a permanent record.
- **Decentralization**: The verification data is stored across a distributed network, eliminating single points of failure.
- **Transparency**: Anyone can verify a certificate's authenticity by checking the blockchain record without needing permission from the issuer.
- **Cryptographic Security**: Hash functions ensure that even minor changes to certificate data will be detected during verification.
- **Cost-Effective**: Using Polygon's Layer 2 solution provides blockchain benefits with minimal transaction costs.

### 1.4 Real-World Use Cases


- **Educational Institutions**: Universities and training centers can issue degree certificates, course completion certificates, and transcripts that students can instantly share with employers.
- **Corporate Training**: Companies can issue professional development certificates to employees, creating verifiable records of skill acquisition.
- **Professional Certifications**: Certification bodies can issue industry-recognized credentials that professionals can prove without intermediary verification.
- **Event Participation**: Conference organizers can issue attendance or speaker certificates that participants can showcase in their portfolios.

---

## 2. SYSTEM OVERVIEW

### 2.1 High-Level Architecture

CertiChain follows a hybrid architecture that combines centralized and decentralized components:

**Frontend Layer**: Next.js 14 application with React components, providing the user interface for certificate creation, management, and verification.

**Data Storage Layer**: Firebase Firestore stores complete certificate metadata, while Firebase Storage handles file uploads (logos and signatures).

**Blockchain Layer**: Polygon Amoy testnet stores cryptographic hashes of certificates, providing immutable verification records.

**PDF Generation Layer**: Client-side PDF generation using pdf-lib creates downloadable certificate documents with embedded QR codes.

### 2.2 Data Flow Explanation

**Certificate Issuance Flow**:
1. Admin enters certificate details through the web form
2. System generates a unique certificate ID
3. Certificate data is hashed using SHA-256
4. Data is saved to Firebase Firestore
5. Hash is written to the blockchain smart contract via MetaMask
6. PDF certificate is generated with QR code
7. User downloads the certificate

**Certificate Verification Flow**:
1. User scans QR code or enters certificate ID
2. System retrieves certificate data from Firestore
3. System recalculates hash from stored data
4. System queries blockchain for the original hash
5. Hashes are compared to determine authenticity
6. Verification result is displayed and logged


### 2.3 Frontend-Backend-Blockchain Interaction

The system operates primarily as a client-side application with external service dependencies:

- **Frontend (Next.js)**: Handles all user interactions, form validation, state management, and UI rendering. Runs in the user's browser.
- **Firebase (Backend Services)**: Provides database (Firestore) and file storage (Storage) as managed cloud services. No custom backend server is required.
- **Blockchain (Polygon)**: Acts as a decentralized verification layer. Smart contract functions are called directly from the frontend using ethers.js and MetaMask.
- **MetaMask**: Browser extension that manages private keys and signs blockchain transactions on behalf of the user.

This architecture eliminates the need for a traditional backend server, reducing infrastructure complexity and costs.

---

## 3. TECHNOLOGY STACK

### 3.1 Next.js 14 (App Router)

**Why Next.js**: Next.js provides a modern React framework with built-in routing, server-side rendering capabilities, and excellent developer experience.

**How It's Used**:
- **App Router**: The project uses Next.js 14's App Router architecture with file-based routing in the `app/` directory.
- **Client Components**: Most components use `'use client'` directive for interactivity and state management.
- **API Routes**: Not used in this project; all data operations go directly to Firebase or blockchain.
- **Static Generation**: The application is deployed as a static site on Vercel.

**Key Configuration** (`next.config.mjs`):
```javascript
webpack: (config) => {
  config.externals.push('pino-pretty', 'lokijs', 'encoding');
  return config;
}
```
This configuration excludes unnecessary dependencies that cause build issues with ethers.js.

### 3.2 TypeScript

**Benefits**:
- Type safety prevents runtime errors related to data structure mismatches
- IntelliSense support improves development speed
- Interface definitions document expected data shapes
- Compile-time error detection catches bugs early

**Usage**: All source files use `.ts` or `.tsx` extensions. Type definitions are centralized in the `types/` directory.



### 3.3 Tailwind CSS & Framer Motion

**Tailwind CSS**:
- Utility-first CSS framework for rapid UI development
- Custom configuration in `tailwind.config.ts` for theme customization
- Responsive design with mobile-first breakpoints
- Dark theme implementation with black backgrounds and white text

**Framer Motion**:
- Production-ready animation library for React
- Used for page transitions, component animations, and micro-interactions
- Stagger animations for list items and stat cards
- Spring physics for natural motion feel

**Example Usage**:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>
  {/* Content */}
</motion.div>
```

### 3.4 Firebase Firestore

**Purpose**: NoSQL cloud database for storing certificate metadata and verification logs.

**Collections**:
- `certificates`: Stores complete certificate information
- `verifications`: Logs all verification attempts with timestamps

**Why Firebase**:
- Real-time synchronization capabilities
- Scalable cloud infrastructure
- No server management required
- Built-in security rules
- Free tier suitable for development and small deployments

**Configuration** (`lib/firebase.ts`):
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};
```

### 3.5 Firebase Storage

**Purpose**: Cloud storage for user-uploaded files (institution logos and signature images).

**How It Works**:
- Files are uploaded to Firebase Storage buckets
- Download URLs are generated and stored in Firestore
- URLs are embedded in PDF certificates during generation
- Supports both PNG and JPG image formats

**Storage Structure**:
```
/logos/{certificateId}
/signatures/{certificateId}
```



### 3.6 Solidity Smart Contract

**Purpose**: Immutable storage of certificate hashes on the Polygon blockchain.

**Solidity Version**: 0.8.19

**Why Solidity**:
- Industry-standard language for Ethereum-compatible blockchains
- Strong type system prevents common vulnerabilities
- Extensive tooling and community support
- Audited patterns and best practices available

**Contract Location**: `contracts/CertificateRegistry.sol`

### 3.7 Ethers.js v6

**Purpose**: JavaScript library for interacting with Ethereum-compatible blockchains.

**Key Features Used**:
- `BrowserProvider`: Connects to MetaMask in the browser
- `JsonRpcProvider`: Read-only connection for verification without wallet
- `Contract`: Interface for calling smart contract functions
- Transaction signing and waiting for confirmations

**Why Ethers.js v6**:
- Modern API with TypeScript support
- Smaller bundle size compared to web3.js
- Better documentation and error messages
- Active maintenance and updates

**Example Usage** (`lib/blockchain.ts`):
```typescript
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
```

### 3.8 Polygon Amoy Testnet

**Why Polygon**:
- Layer 2 scaling solution for Ethereum
- Low transaction fees (fractions of a cent)
- Fast block times (2-3 seconds)
- Ethereum-compatible, allowing use of existing tools

**Why Testnet (Amoy)**:
- Free test tokens for development
- No real money required for transactions
- Same functionality as mainnet
- Easy migration path to mainnet when ready

**Network Details**:
- Chain ID: 80002
- RPC URL: https://rpc-amoy.polygon.technology
- Block Explorer: https://amoy.polygonscan.com

### 3.9 pdf-lib

**Purpose**: Client-side PDF generation without server dependencies.

**Why pdf-lib**:
- Pure JavaScript implementation
- Works in browser and Node.js
- No external dependencies
- Supports custom fonts, images, and shapes
- Can create PDFs from scratch

**Features Used**:
- Page creation with custom dimensions (A4 landscape: 842x595 points)
- Text rendering with multiple fonts (Times Roman, Helvetica)
- Image embedding (logos, signatures, QR codes)
- Shape drawing (borders, lines, decorative elements)
- Color management with RGB values

### 3.10 QR Code Generation

**Library**: `qrcode` npm package

**Purpose**: Generate QR codes that link to verification pages.

**Implementation**:
- QR code contains verification URL: `{APP_URL}/verify/{certificateId}`
- Generated as PNG data URL
- Embedded in PDF at configurable positions
- High error correction level for reliability

**User Experience**:
- Recipients can scan QR code with smartphone
- Instantly redirected to verification page
- No manual ID entry required

---

## 4. PROJECT ARCHITECTURE

### 4.1 Folder Structure

```
certichain/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard routes
│   │   ├── create/              # Certificate creation page
│   │   ├── issued/              # Issued certificates list
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   └── page.tsx             # Dashboard home
│   ├── verify/                  # Verification routes
│   │   ├── [id]/               # Dynamic verification page
│   │   └── page.tsx            # Verification input page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── certificate/            # Certificate-related components
│   ├── dashboard/              # Dashboard components
│   ├── layout/                 # Layout components (sidebar)
│   ├── ui/                     # Reusable UI components
│   └── verify/                 # Verification components
├── contracts/                   # Solidity smart contracts
│   └── CertificateRegistry.sol
├── lib/                        # Utility libraries
│   ├── blockchain.ts           # Blockchain interaction
│   ├── firebase.ts             # Firebase configuration
│   ├── hash.ts                 # Hash generation
│   ├── pdf-generator.ts        # PDF creation
│   └── utils.ts                # Helper functions
├── scripts/                    # Deployment scripts
│   └── deploy.js              # Contract deployment
├── store/                      # State management
│   └── certificate-store.ts   # Zustand store
├── types/                      # TypeScript definitions
│   ├── certificate.ts         # Certificate types
│   └── window.d.ts            # Window extensions
├── hardhat.config.js          # Hardhat configuration
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```



### 4.2 Purpose of Major Directories

**`app/`**: Contains all application pages using Next.js 14 App Router. File-based routing where each folder represents a route segment.

**`components/`**: Reusable React components organized by feature. Promotes code reuse and maintainability.

**`lib/`**: Business logic and external service integrations. Keeps components clean and focused on presentation.

**`contracts/`**: Solidity smart contracts that run on the blockchain. Separate from frontend code for clarity.

**`types/`**: TypeScript type definitions shared across the application. Ensures type safety and better IDE support.

**`store/`**: Global state management using Zustand. Manages form data and UI state across components.

### 4.3 Separation of Concerns

The architecture follows clear separation of concerns:

**Presentation Layer** (`components/`, `app/`):
- UI rendering and user interactions
- Form validation and input handling
- Animation and visual feedback

**Business Logic Layer** (`lib/`):
- Certificate hash generation
- PDF creation logic
- Blockchain transaction handling
- Firebase data operations

**Data Layer** (Firebase, Blockchain):
- Persistent storage of certificate data
- Immutable hash storage on blockchain
- Verification logs

**State Management** (`store/`):
- Form state during certificate creation
- UI state (loading, steps, etc.)
- Temporary data before submission

This separation makes the codebase:
- Easier to test (logic isolated from UI)
- More maintainable (changes localized)
- Scalable (new features don't affect existing code)
- Reusable (logic can be used in different contexts)

---

## 5. FIREBASE INTEGRATION

### 5.1 Firebase Configuration

Firebase is initialized once when the application loads using the singleton pattern:

```typescript
const app = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
```

This ensures only one Firebase instance exists, preventing memory leaks and connection issues.

### 5.2 Environment Variables

All sensitive configuration is stored in environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

The `NEXT_PUBLIC_` prefix makes these variables accessible in the browser, which is necessary for client-side Firebase operations.

### 5.3 Firestore Collections and Schema

**Certificates Collection**:
```typescript
{
  certificateId: string;        // Unique identifier (CERT-XXX-XXX)
  recipientName: string;        // Certificate recipient
  courseName: string;           // Course/program name
  institutionName: string;      // Issuing institution
  issuerName: string;           // Person who issued
  instructorName?: string;      // Optional instructor
  issueDate: string;            // Issue date (YYYY-MM-DD)
  expiryDate?: string;          // Optional expiry
  durationFrom?: string;        // Course start date
  durationTo?: string;          // Course end date
  grade?: string;               // Grade/score
  template: string;             // Template type
  hash: string;                 // SHA-256 hash
  txHash?: string;              // Blockchain transaction hash
  isRevoked: boolean;           // Revocation status
  revokedAt?: number;           // Revocation timestamp
  revokedBy?: string;           // Who revoked it
  createdAt: number;            // Creation timestamp
  logoUrl?: string;             // Institution logo URL
  signatureUrl?: string;        // Signature image URL
  qrPosition?: string;          // QR code position
  logoPosition?: string;        // Logo position
  signaturePosition?: string;   // Signature position
}
```

**Verifications Collection**:
```typescript
{
  certificateId: string;        // Certificate being verified
  timestamp: number;            // When verification occurred
  result: string;               // Verification result
}
```

### 5.4 Storage Uploads

File upload process:

1. User selects image file (logo or signature)
2. File is read as Data URL for preview
3. On form submission, file is uploaded to Firebase Storage
4. Download URL is retrieved
5. URL is saved in Firestore document
6. URL is used in PDF generation

**Code Example** (`app/admin/create/page.tsx`):
```typescript
if (formData.logoFile) {
  const logoRef = ref(storage, `logos/${certId}`);
  await uploadBytes(logoRef, formData.logoFile);
  logoUrl = await getDownloadURL(logoRef);
}
```

### 5.5 Why Firebase Auth is Not Used

The current implementation does not use Firebase Authentication because:

1. **Simplicity**: The project focuses on certificate issuance and verification, not user management
2. **Demo Purpose**: Easier to demonstrate without login requirements
3. **Future Enhancement**: Authentication can be added later without affecting core functionality
4. **Access Control**: Currently assumes trusted admin access

For production deployment, Firebase Authentication should be added to:
- Restrict admin dashboard access
- Track who issued each certificate
- Implement role-based permissions
- Audit certificate operations

---

## 6. SMART CONTRACT DESIGN

### 6.1 Contract Purpose

The `CertificateRegistry` smart contract serves as an immutable ledger for certificate hashes. It provides:

- Permanent storage of certificate hashes
- Proof of issuance timestamp
- Revocation capability
- Public verification without authentication

### 6.2 Contract Structure

```solidity
contract CertificateRegistry {
    struct Certificate {
        bytes32 certificateHash;
        bool isValid;
        bool isRevoked;
        uint256 timestamp;
    }

    mapping(string => Certificate) public certificates;
    uint256 public certificateCount;
    address public owner;
}
```

**Data Types**:
- `bytes32`: 32-byte hash value (SHA-256 output)
- `bool`: Boolean flags for validity and revocation
- `uint256`: Unsigned integer for timestamp and count
- `address`: Ethereum address of contract owner
- `mapping`: Key-value store (certificateId → Certificate)



### 6.3 Contract Functions

**issueCertificate**:
```solidity
function issueCertificate(string memory certificateId, bytes32 certificateHash) 
    public onlyOwner
```
- Stores certificate hash on blockchain
- Requires owner permission (onlyOwner modifier)
- Prevents duplicate issuance
- Emits `CertificateIssued` event
- Increments certificate counter

**verifyCertificate**:
```solidity
function verifyCertificate(string memory certificateId) 
    public view returns (bytes32, bool, bool, uint256)
```
- Read-only function (view modifier)
- Returns hash, validity, revocation status, and timestamp
- No gas cost for calling
- Publicly accessible

**revokeCertificate**:
```solidity
function revokeCertificate(string memory certificateId) 
    public onlyOwner
```
- Marks certificate as revoked
- Requires owner permission
- Cannot revoke non-existent certificates
- Cannot revoke already-revoked certificates
- Emits `CertificateRevoked` event

**getCertificateCount**:
```solidity
function getCertificateCount() public view returns (uint256)
```
- Returns total number of issued certificates
- Used for statistics

### 6.4 Events Emitted

**CertificateIssued**:
```solidity
event CertificateIssued(
    string indexed certificateId, 
    bytes32 certificateHash, 
    uint256 timestamp
);
```
- Logged when certificate is issued
- Indexed certificateId for efficient searching
- Can be queried from blockchain explorers

**CertificateRevoked**:
```solidity
event CertificateRevoked(
    string indexed certificateId, 
    uint256 timestamp
);
```
- Logged when certificate is revoked
- Provides audit trail

### 6.5 How Certificate Hashes Are Stored

**Hash Generation Process**:
1. Certificate data is concatenated: `certificateId|recipientName|courseName|institutionName|issuerName|issueDate`
2. SHA-256 hash is computed (64 hex characters)
3. Hash is converted to `bytes32` format for Solidity
4. Stored in blockchain mapping

**Storage Format**:
- Key: Certificate ID (string)
- Value: Certificate struct containing hash and metadata

**Why Hash Instead of Full Data**:
- Privacy: Sensitive data not exposed on public blockchain
- Cost: Storing 32 bytes is cheaper than storing full text
- Security: Hash proves data integrity without revealing content
- Efficiency: Smaller storage footprint

### 6.6 Security Considerations

**Owner-Only Functions**:
- Only contract deployer can issue or revoke certificates
- Prevents unauthorized certificate creation
- Uses `onlyOwner` modifier for access control

**Duplicate Prevention**:
- Contract checks if certificate already exists before issuance
- Prevents accidental re-issuance with different hash

**Immutability**:
- Once issued, certificate hash cannot be changed
- Revocation only sets a flag, doesn't delete data
- Provides permanent audit trail

**Gas Optimization**:
- Uses `view` functions for read operations (no gas cost)
- Efficient data structures (mapping instead of array)
- Minimal storage usage

---

## 7. CERTIFICATE ISSUANCE FLOW

### 7.1 Admin Dashboard Overview

The admin dashboard (`/admin`) provides:
- Statistics overview (total issued, active, revoked)
- Recent certificates list
- Navigation to create and manage certificates
- Real-time data from Firebase

### 7.2 Certificate Builder Workflow

**Step 1: Form Input** (`/admin/create`)
- User fills certificate details in form
- Live preview updates as user types
- Form validation using Zod schema
- Optional fields for advanced customization
- File uploads for logo and signature

**Step 2: Template Selection**
- Four template options: Academic, Corporate, Premium, Minimal
- Each template has unique design and layout
- Preview shows selected template in real-time

**Step 3: Customization**
- QR code position (4 options)
- Logo position (3 options)
- Signature position (3 options)
- Optional fields: instructor, grade, duration, expiry

**Step 4: Submission**
- Form validation runs
- If valid, issuance process begins
- Progress indicator shows current step

### 7.3 Hash Generation Logic

**Implementation** (`lib/hash.ts`):
```typescript
export async function generateCertificateHash(data: CertificateData): Promise<string> {
  const content = `${data.certificateId}|${data.recipientName}|${data.courseName}|${data.institutionName}|${data.issuerName}|${data.issueDate}`;
  
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

**Process**:
1. Concatenate core certificate fields with pipe separator
2. Encode string to UTF-8 bytes
3. Compute SHA-256 hash using Web Crypto API
4. Convert binary hash to hexadecimal string
5. Return 64-character hash

**Why These Fields**:
- `certificateId`: Unique identifier
- `recipientName`: Who received it
- `courseName`: What was completed
- `institutionName`: Who issued it
- `issuerName`: Authority name
- `issueDate`: When it was issued

Optional fields (instructor, grade, duration) are not included in hash to allow flexibility without affecting verification.

### 7.4 Firestore Write Process

**Step 1: Generate Certificate ID**
```typescript
const certId = generateCertificateId();
// Format: CERT-{timestamp}-{random}
// Example: CERT-L8X9K2-A7B3C9D
```

**Step 2: Upload Files to Storage**
```typescript
if (formData.logoFile) {
  const logoRef = ref(storage, `logos/${certId}`);
  await uploadBytes(logoRef, formData.logoFile);
  logoUrl = await getDownloadURL(logoRef);
}
```

**Step 3: Create Certificate Object**
```typescript
const certificate = {
  ...certData,
  template: data.template,
  hash,
  isRevoked: false,
  createdAt: Date.now(),
  logoUrl: logoUrl || '',
  signatureUrl: signatureUrl || '',
  // ... position settings
};
```

**Step 4: Write to Firestore**
```typescript
const docRef = await addDoc(collection(db, 'certificates'), certificate);
```

**Step 5: Update with Transaction Hash**
```typescript
await updateDoc(docRef, { txHash });
```

### 7.5 Blockchain Transaction Process

**Step 1: Connect to MetaMask**
```typescript
const provider = new BrowserProvider(window.ethereum);
await provider.send("eth_requestAccounts", []);
```
- Prompts user to connect wallet
- Requests account access permission

**Step 2: Get Signer**
```typescript
const signer = await provider.getSigner();
```
- Retrieves user's account for signing transactions

**Step 3: Create Contract Instance**
```typescript
const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
```
- Connects to deployed smart contract
- Uses signer for write operations

**Step 4: Call Contract Function**
```typescript
const tx = await contract.issueCertificate(certificateId, hash);
```
- Sends transaction to blockchain
- MetaMask prompts user to confirm and pay gas

**Step 5: Wait for Confirmation**
```typescript
await tx.wait();
```
- Waits for transaction to be mined
- Typically takes 2-3 seconds on Polygon

**Step 6: Return Transaction Hash**
```typescript
return tx.hash;
```
- Transaction hash is stored in Firestore
- Used for blockchain explorer links

### 7.6 Status Handling

The issuance process shows 4 steps with visual progress:

1. **Generating Hash**: Computing SHA-256 hash
2. **Uploading Files**: Saving logo and signature to Firebase Storage
3. **Saving Data**: Writing certificate to Firestore
4. **Blockchain Transaction**: Recording hash on Polygon network

Each step includes:
- Loading animation
- Status indicator (pending → processing → confirmed)
- Error handling with user-friendly messages
- Ability to retry on failure

**Success State**:
- Shows success message with certificate ID
- Provides download button for PDF
- Options to create another or view all certificates

**Error Handling**:
- Catches and logs errors at each step
- Shows alert with error message
- Resets form state for retry
- Blockchain errors don't prevent Firestore save

---

## 8. CERTIFICATE DESIGN & PDF GENERATION

### 8.1 Landscape Certificate Layout

All certificates use A4 landscape orientation:
- Width: 842 points (11.69 inches)
- Height: 595 points (8.27 inches)
- 1 point = 1/72 inch

**Why Landscape**:
- Traditional certificate format
- Better visual balance for text
- More space for decorative elements
- Easier to frame and display

