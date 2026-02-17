# CHAPTER 6: WORK PLAN AND SYSTEM DATABASE STRUCTURE

## 6.1 Time Frame Work

The development of CertiChain follows a structured timeline organized into distinct phases, each with specific deliverables and milestones. This section presents the project schedule, resource allocation, and task dependencies.

### 6.1.1 Project Timeline Overview

**Total Project Duration:** 16 weeks (approximately 4 months)

**Project Start Date:** Week 1  
**Project Completion Date:** Week 16

The project is divided into eight major phases, with each phase building upon the deliverables of previous phases. The timeline incorporates buffer periods for unexpected challenges and allows for iterative refinement based on testing feedback.

### 6.1.2 Detailed Phase Schedule

[FIGURE 6.1: Gantt Chart – to be inserted here]

#### Phase 1: Requirements Analysis and Architecture Design
**Duration:** 2 weeks (Week 1-2)  
**Effort:** 80 hours

**Tasks:**
1. Problem domain analysis (8 hours)
2. Literature review and technology research (16 hours)
3. Requirements gathering and documentation (12 hours)
4. System architecture design (16 hours)
5. Technology stack selection and justification (8 hours)
6. Project setup and repository initialization (8 hours)
7. Development environment configuration (8 hours)
8. Initial documentation creation (4 hours)

**Deliverables:**
- Requirements specification document
- System architecture diagram
- Technology stack documentation
- Initialized project repository
- Development environment setup guide

**Milestones:**
- M1.1: Requirements specification approved (End of Week 1)
- M1.2: Architecture design completed (End of Week 2)

**Dependencies:** None (Initial phase)

**Resources Required:**
- Development workstation
- Internet access for research
- Documentation tools

---

#### Phase 2: Smart Contract Development and Blockchain Integration
**Duration:** 2 weeks (Week 3-4)  
**Effort:** 80 hours

**Tasks:**
1. Solidity smart contract development (20 hours)
   - Contract structure design
   - Function implementation (issue, verify, revoke)
   - Event definition
   - Access control implementation
2. Hardhat environment setup (4 hours)
3. Smart contract testing (16 hours)
   - Unit test development
   - Test execution and debugging
4. Contract deployment to testnet (8 hours)
5. Blockchain interaction library development (20 hours)
   - ethers.js integration
   - Provider and signer setup
   - Contract interface implementation
6. MetaMask integration (8 hours)
7. Blockchain operation testing (4 hours)

**Deliverables:**
- Compiled smart contract
- Deployed contract on Polygon Amoy testnet
- Contract address and ABI
- Blockchain interaction library
- Smart contract test suite
- Deployment documentation

**Milestones:**
- M2.1: Smart contract deployed to testnet (End of Week 3)
- M2.2: Blockchain integration tested (End of Week 4)

**Dependencies:**
- Phase 1 completion (architecture design)

**Resources Required:**
- Hardhat development environment
- Polygon Amoy testnet access
- Test MATIC tokens
- MetaMask wallet

---

#### Phase 3: Core Application Development
**Duration:** 3 weeks (Week 5-7)  
**Effort:** 120 hours

**Tasks:**
1. Next.js application structure setup (8 hours)
   - App Router configuration
   - Route structure creation
   - Layout components
2. Firebase integration (12 hours)
   - Firebase project setup
   - Firestore configuration
   - Storage configuration
   - Security rules definition
3. TypeScript interfaces and types (8 hours)
4. Certificate form development (20 hours)
   - Form component creation
   - Validation logic implementation
   - File upload handling
   - Real-time validation
5. Certificate preview component (16 hours)
   - Template rendering logic
   - Live preview updates
   - Responsive design
6. Certificate template system (24 hours)
   - Academic template
   - Corporate template
   - Premium template
   - Minimal template
7. PDF generation implementation (20 hours)
   - pdf-lib integration
   - Template rendering in PDF
   - QR code generation and embedding
   - Logo and signature embedding
8. Certificate issuance workflow (12 hours)
   - Multi-step process coordination
   - Progress indicator
   - Error handling

**Deliverables:**
- Functional certificate creation interface
- Four certificate templates
- PDF generation capability
- Firebase integration layer
- Certificate issuance workflow

**Milestones:**
- M3.1: Certificate form completed (End of Week 5)
- M3.2: Templates and preview implemented (End of Week 6)
- M3.3: PDF generation functional (End of Week 7)

**Dependencies:**
- Phase 1 completion (architecture)
- Phase 2 completion (blockchain integration)

**Resources Required:**
- Next.js development server
- Firebase project
- pdf-lib library
- Test certificate data

---

#### Phase 4: Verification System Implementation
**Duration:** 2 weeks (Week 8-9)  
**Effort:** 80 hours

**Tasks:**
1. Verification interface development (12 hours)
   - Input form creation
   - QR scanner button
   - Result display area
2. QR code scanning implementation (16 hours)
   - Camera API integration
   - QR code decoding
   - Error handling
3. Verification algorithm implementation (20 hours)
   - Firestore data retrieval
   - Hash recalculation
   - Blockchain query
   - Hash comparison
   - Status determination
4. Verification result display (12 hours)
   - Result component creation
   - Certificate details display
   - Status indicators
5. Verification logging (8 hours)
6. Testing verification scenarios (12 hours)
   - Valid certificates
   - Tampered certificates
   - Revoked certificates
   - Non-existent certificates

**Deliverables:**
- Functional verification interface
- QR code scanning capability
- Verification algorithm
- Result display components
- Verification logging system

**Milestones:**
- M4.1: Verification interface completed (End of Week 8)
- M4.2: All verification scenarios tested (End of Week 9)

**Dependencies:**
- Phase 3 completion (certificate issuance)

**Resources Required:**
- Device with camera for QR testing
- Test certificates
- Blockchain testnet access

---

#### Phase 5: Administrative Features and Dashboard
**Duration:** 2 weeks (Week 10-11)  
**Effort:** 80 hours

**Tasks:**
1. Dashboard development (16 hours)
   - Statistics calculation
   - Stat card components
   - Data visualization
2. Issued certificates list (20 hours)
   - Table/card layout
   - Search functionality
   - Filter implementation
   - Pagination
3. Certificate management features (16 hours)
   - Certificate details view
   - Download functionality
   - Revocation implementation
   - Restoration implementation
4. Navigation system (12 hours)
   - Desktop navigation
   - Mobile navigation
   - Route handling
5. Empty states and loading indicators (8 hours)
6. Admin layout and styling (8 hours)

**Deliverables:**
- Administrative dashboard
- Certificate management interface
- Revocation functionality
- Navigation system
- Empty state components

**Milestones:**
- M5.1: Dashboard completed (End of Week 10)
- M5.2: Certificate management functional (End of Week 11)

**Dependencies:**
- Phase 3 completion (core application)
- Phase 4 completion (verification)

**Resources Required:**
- Test certificate data
- Multiple test scenarios

---

#### Phase 6: User Interface Refinement and Responsive Design
**Duration:** 2 weeks (Week 12-13)  
**Effort:** 80 hours

**Tasks:**
1. Responsive design implementation (24 hours)
   - Mobile layout optimization
   - Tablet layout optimization
   - Desktop layout refinement
2. Animation implementation (16 hours)
   - Page transitions
   - Component animations
   - Loading animations
3. Visual design refinement (16 hours)
   - Color scheme consistency
   - Typography optimization
   - Spacing and alignment
4. Accessibility improvements (12 hours)
   - Keyboard navigation
   - Screen reader support
   - Color contrast verification
5. Cross-browser testing (8 hours)
6. Performance optimization (4 hours)

**Deliverables:**
- Fully responsive interface
- Polished visual design
- Smooth animations
- Improved accessibility
- Cross-browser compatibility

**Milestones:**
- M6.1: Responsive design completed (End of Week 12)
- M6.2: UI refinement completed (End of Week 13)

**Dependencies:**
- Phase 5 completion (all features implemented)

**Resources Required:**
- Multiple devices for testing
- Browser testing tools
- Accessibility testing tools

---

#### Phase 7: Testing and Quality Assurance
**Duration:** 2 weeks (Week 14-15)  
**Effort:** 80 hours

**Tasks:**
1. Unit test development (20 hours)
   - Hash generation tests
   - Validation logic tests
   - Utility function tests
2. Integration testing (20 hours)
   - Certificate issuance workflow
   - Verification workflow
   - Management operations
3. Manual testing (16 hours)
   - Feature testing
   - Edge case testing
   - Error scenario testing
4. Performance testing (8 hours)
   - Load time measurement
   - PDF generation performance
   - Database query optimization
5. Security testing (8 hours)
   - Input validation
   - XSS prevention
   - CSRF protection
6. Bug fixing (8 hours)

**Deliverables:**
- Test suite with comprehensive coverage
- Test results documentation
- Bug fix implementations
- Performance optimization implementations
- Security audit report

**Milestones:**
- M7.1: Testing completed (End of Week 14)
- M7.2: All critical bugs fixed (End of Week 15)

**Dependencies:**
- Phase 6 completion (UI refinement)

**Resources Required:**
- Testing frameworks
- Test data sets
- Performance monitoring tools

---

#### Phase 8: Documentation and Deployment
**Duration:** 2 weeks (Week 16)  
**Effort:** 40 hours

**Tasks:**
1. Technical documentation (12 hours)
   - Architecture documentation
   - API documentation
   - Code documentation
2. User documentation (8 hours)
   - User guides
   - FAQ creation
   - Tutorial videos (optional)
3. Deployment documentation (4 hours)
   - Environment setup guide
   - Deployment procedures
   - Configuration guide
4. Project report (12 hours)
   - Report writing
   - Diagram creation
   - Review and revision
5. Production deployment (4 hours)
   - Vercel deployment
   - Environment configuration
   - Final testing

**Deliverables:**
- Complete technical documentation
- User guides and tutorials
- Deployment documentation
- Project report
- Deployed production system

**Milestones:**
- M8.1: Documentation completed (Mid Week 16)
- M8.2: System deployed to production (End of Week 16)

**Dependencies:**
- Phase 7 completion (testing)

**Resources Required:**
- Documentation tools
- Vercel account
- Production environment

---

### 6.1.3 Resource Allocation

**Human Resources:**
- Lead Developer: Full-time throughout project
- Technical Advisor: Available for consultation
- Test Users: Available during Phase 7

**Technical Resources:**
- Development workstation
- Internet connectivity
- Firebase project (free tier)
- Polygon Amoy testnet access
- Vercel hosting (free tier)
- Development tools and IDEs

**Financial Resources:**
- Minimal budget required (free tier services)
- Optional: Domain name registration
- Optional: Premium hosting if needed

### 6.1.4 Risk Management Timeline

**Identified Risks and Mitigation:**

1. **Blockchain Integration Complexity** (Week 3-4)
   - Risk: Difficulty integrating with Polygon network
   - Mitigation: Allocate extra time for research and testing
   - Contingency: 1 week buffer

2. **PDF Generation Performance** (Week 7)
   - Risk: Slow PDF generation for complex certificates
   - Mitigation: Optimize rendering logic, test early
   - Contingency: Simplify templates if necessary

3. **Cross-Browser Compatibility** (Week 13)
   - Risk: Features not working in all browsers
   - Mitigation: Use standard web APIs, test early
   - Contingency: Document browser requirements

4. **Scope Creep** (Throughout)
   - Risk: Additional features extending timeline
   - Mitigation: Strict scope definition, prioritization
   - Contingency: Defer non-critical features

## 6.2 Design Database Table

The database structure for CertiChain is implemented using Firebase Firestore, a NoSQL document database. This section details the collection structures, field specifications, and indexing strategies.

### 6.2.1 Firestore Collections Overview

CertiChain uses two primary Firestore collections:
1. **certificates** - Stores certificate metadata
2. **verifications** - Logs verification attempts

### 6.2.2 Certificates Collection

**Collection Name:** `certificates`

**Purpose:** Stores complete metadata for all issued certificates.

**Document Structure:**

```javascript
{
  // Unique Identifiers
  certificateId: "CERT-L8X9K2-A7B3C9D",  // String, Indexed
  
  // Recipient Information
  recipientName: "John Michael Doe",      // String, Required
  
  // Course Information
  courseName: "Advanced Blockchain Development",  // String, Required
  institutionName: "Tech Academy International",  // String, Required
  issuerName: "Dr. Jane Smith",                   // String, Required
  instructorName: "Prof. Robert Johnson",         // String, Optional
  
  // Dates
  issueDate: "2024-01-15",               // String (YYYY-MM-DD), Required
  expiryDate: "2026-01-15",              // String (YYYY-MM-DD), Optional
  durationFrom: "2023-09-01",            // String (YYYY-MM-DD), Optional
  durationTo: "2024-01-10",              // String (YYYY-MM-DD), Optional
  
  // Academic Information
  grade: "A+",                           // String, Optional
  
  // Template and Design
  template: "academic",                  // String (enum), Required
  qrPosition: "bottom-right",            // String (enum), Optional
  logoPosition: "top-center",            // String (enum), Optional
  signaturePosition: "bottom-center",    // String (enum), Optional
  
  // Cryptographic Data
  hash: "a3f5b8c2d1e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",  // String (64 hex), Required
  
  // Blockchain Data
  txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",  // String (66 hex), Optional
  
  // Status Flags
  isRevoked: false,                      // Boolean, Required
  revokedAt: null,                       // Number (timestamp), Optional
  revokedBy: null,                       // String, Optional
  restoredAt: null,                      // Number (timestamp), Optional
  restoredBy: null,                      // String, Optional
  
  // Timestamps
  createdAt: 1705334400000,              // Number (Unix timestamp), Required
  
  // Asset URLs
  logoUrl: "https://firebasestorage.googleapis.com/...",      // String (URL), Optional
  signatureUrl: "https://firebasestorage.googleapis.com/...", // String (URL), Optional
}
```

**Field Specifications:**

| Field Name | Data Type | Size | Constraints | Index | Description |
|------------|-----------|------|-------------|-------|-------------|
| certificateId | String | 20-25 chars | Unique, Required | Yes | System-generated unique identifier |
| recipientName | String | 2-100 chars | Required | No | Full name of certificate recipient |
| courseName | String | 2-200 chars | Required | No | Name of course or program |
| institutionName | String | 2-200 chars | Required | No | Name of issuing institution |
| issuerName | String | 2-100 chars | Required | No | Name of issuing authority |
| instructorName | String | 0-100 chars | Optional | No | Name of instructor |
| issueDate | String | 10 chars | Required, Format: YYYY-MM-DD | Yes | Date certificate was issued |
| expiryDate | String | 10 chars | Optional, Format: YYYY-MM-DD | No | Date certificate expires |
| durationFrom | String | 10 chars | Optional, Format: YYYY-MM-DD | No | Course start date |
| durationTo | String | 10 chars | Optional, Format: YYYY-MM-DD | No | Course end date |
| grade | String | 0-50 chars | Optional | No | Grade or score achieved |
| template | String | 8-10 chars | Required, Enum | No | Template type |
| qrPosition | String | 10-15 chars | Optional, Enum | No | QR code position |
| logoPosition | String | 10-15 chars | Optional, Enum | No | Logo position |
| signaturePosition | String | 10-15 chars | Optional, Enum | No | Signature position |
| hash | String | 64 chars | Required, Hex | No | SHA-256 hash |
| txHash | String | 66 chars | Optional, Hex | No | Blockchain transaction hash |
| isRevoked | Boolean | 1 bit | Required, Default: false | Yes | Revocation status |
| revokedAt | Number | Variable | Optional | No | Revocation timestamp |
| revokedBy | String | 0-100 chars | Optional | No | Revoking admin identifier |
| restoredAt | Number | Variable | Optional | No | Restoration timestamp |
| restoredBy | String | 0-100 chars | Optional | No | Restoring admin identifier |
| createdAt | Number | Variable | Required | Yes | Creation timestamp |
| logoUrl | String | 0-500 chars | Optional, URL | No | Firebase Storage URL |
| signatureUrl | String | 0-500 chars | Optional, URL | No | Firebase Storage URL |

**Indexes:**
- Composite index: `certificateId` (ASC)
- Composite index: `isRevoked` (ASC), `createdAt` (DESC)
- Composite index: `createdAt` (DESC)

**Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /certificates/{certId} {
      // Allow read access to all
      allow read: if true;
      
      // Allow write access only to authenticated admins
      allow create, update: if request.auth != null;
      
      // Prevent deletion
      allow delete: if false;
    }
  }
}
```

---

### 6.2.3 Verifications Collection

**Collection Name:** `verifications`

**Purpose:** Logs all certificate verification attempts for analytics and audit purposes.

**Document Structure:**

```javascript
{
  // Certificate Reference
  certificateId: "CERT-L8X9K2-A7B3C9D",  // String, Required, Indexed
  
  // Verification Details
  timestamp: 1705334400000,               // Number (Unix timestamp), Required, Indexed
  result: "verified",                     // String (enum), Required
  
  // Optional Metadata
  ipAddress: "192.168.1.1",              // String, Optional
  userAgent: "Mozilla/5.0...",           // String, Optional
  location: "US",                         // String, Optional
}
```

**Field Specifications:**

| Field Name | Data Type | Size | Constraints | Index | Description |
|------------|-----------|------|-------------|-------|-------------|
| certificateId | String | 20-25 chars | Required | Yes | Certificate being verified |
| timestamp | Number | Variable | Required | Yes | When verification occurred |
| result | String | 10-15 chars | Required, Enum | Yes | Verification outcome |
| ipAddress | String | 7-45 chars | Optional | No | IP address of verifier |
| userAgent | String | 0-500 chars | Optional | No | Browser user agent |
| location | String | 2-50 chars | Optional | No | Geographic location |

**Allowed Values for result:**
- `verified` - Certificate is authentic and valid
- `tampered` - Certificate data has been modified
- `revoked` - Certificate has been revoked
- `not_found` - Certificate does not exist

**Indexes:**
- Composite index: `certificateId` (ASC), `timestamp` (DESC)
- Composite index: `timestamp` (DESC)
- Composite index: `result` (ASC), `timestamp` (DESC)

**Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /verifications/{verifyId} {
      // Allow read access only to authenticated admins
      allow read: if request.auth != null;
      
      // Allow create access to all (for logging)
      allow create: if true;
      
      // Prevent updates and deletes
      allow update, delete: if false;
    }
  }
}
```

---

### 6.2.4 Firebase Storage Structure

**Storage Buckets:**

**Bucket Name:** `{project-id}.appspot.com`

**Directory Structure:**
```
/
├── logos/
│   ├── CERT-L8X9K2-A7B3C9D
│   ├── CERT-M9Y0L3-B8C4D0E
│   └── ...
└── signatures/
    ├── CERT-L8X9K2-A7B3C9D
    ├── CERT-M9Y0L3-B8C4D0E
    └── ...
```

**File Naming Convention:**
- Logo files: `logos/{certificateId}`
- Signature files: `signatures/{certificateId}`

**Supported File Types:**
- PNG (image/png)
- JPG/JPEG (image/jpeg)

**File Size Limits:**
- Maximum file size: 5 MB per file
- Recommended size: < 1 MB for optimal performance

**Security Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /logos/{certId} {
      // Allow read access to all
      allow read: if true;
      
      // Allow write access only to authenticated admins
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    
    match /signatures/{certId} {
      // Allow read access to all
      allow read: if true;
      
      // Allow write access only to authenticated admins
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

### 6.2.5 Blockchain Data Structure

**Smart Contract:** `CertificateRegistry`

**Network:** Polygon Amoy Testnet

**Contract Address:** `0x...` (deployed address)

**Data Structure:**

```solidity
struct Certificate {
    bytes32 certificateHash;  // 32 bytes - SHA-256 hash
    bool isValid;             // 1 bit - Existence flag
    bool isRevoked;           // 1 bit - Revocation flag
    uint256 timestamp;        // 32 bytes - Block timestamp
}

mapping(string => Certificate) public certificates;
uint256 public certificateCount;
```

**Storage Layout:**

| Field | Type | Size | Description |
|-------|------|------|-------------|
| certificateHash | bytes32 | 32 bytes | SHA-256 hash of certificate data |
| isValid | bool | 1 bit | Whether certificate exists |
| isRevoked | bool | 1 bit | Whether certificate is revoked |
| timestamp | uint256 | 32 bytes | Unix timestamp of issuance |

**Key:** Certificate ID (string)

**Gas Costs (Approximate):**
- Issue certificate: ~50,000 gas
- Verify certificate: 0 gas (view function)
- Revoke certificate: ~30,000 gas

---

### 6.2.6 Database Optimization Strategies

**Firestore Optimization:**

1. **Indexing Strategy:**
   - Index frequently queried fields (certificateId, isRevoked, createdAt)
   - Composite indexes for complex queries
   - Avoid over-indexing to reduce write costs

2. **Query Optimization:**
   - Use pagination for large result sets
   - Limit query results to necessary fields
   - Cache frequently accessed data client-side

3. **Data Denormalization:**
   - Store computed values (e.g., certificate count) to avoid aggregation queries
   - Duplicate data where read performance is critical

4. **Write Batching:**
   - Batch related writes to reduce transaction costs
   - Use transactions for operations requiring atomicity

**Storage Optimization:**

1. **Image Compression:**
   - Compress uploaded images before storage
   - Use appropriate image formats (PNG for logos, JPG for photos)

2. **CDN Utilization:**
   - Leverage Firebase Storage's built-in CDN
   - Set appropriate cache headers

**Blockchain Optimization:**

1. **Minimize On-Chain Data:**
   - Store only hashes on blockchain
   - Keep detailed data in Firestore

2. **Gas Optimization:**
   - Use efficient data types
   - Minimize storage operations
   - Batch operations when possible

---

**End of Chapter 6**

Say `Continue with Chapter 7` to proceed.
