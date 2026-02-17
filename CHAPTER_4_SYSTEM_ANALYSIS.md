# CHAPTER 4: SYSTEM ANALYSIS OVERVIEW

## 4.1 Requirement Analysis

Requirement analysis forms the foundation of system development by identifying and documenting the capabilities, constraints, and characteristics that the system must possess. This section presents a comprehensive analysis of CertiChain's requirements across hardware, software, and functional dimensions.

### 4.1.1 Hardware Requirements

The hardware requirements for CertiChain are divided into development environment requirements and deployment/user access requirements.

#### Development Environment Hardware Requirements

**Minimum Requirements:**
- Processor: Intel Core i5 or AMD Ryzen 5 (8th generation or newer)
- RAM: 8 GB DDR4
- Storage: 256 GB SSD with at least 20 GB free space
- Network: Broadband internet connection with minimum 10 Mbps download speed
- Display: 1920x1080 resolution monitor

**Recommended Requirements:**
- Processor: Intel Core i7 or AMD Ryzen 7 (10th generation or newer)
- RAM: 16 GB DDR4 or higher
- Storage: 512 GB NVMe SSD with at least 50 GB free space
- Network: High-speed internet connection with minimum 50 Mbps download speed
- Display: 2560x1440 resolution monitor or higher

**Rationale:**
The development environment requires sufficient processing power to run multiple development tools simultaneously, including code editors, local development servers, blockchain development environments (Hardhat), and web browsers with developer tools. The SSD storage ensures fast file access and compilation times. Adequate RAM prevents system slowdowns when running multiple services concurrently.

#### User Access Hardware Requirements

**For Certificate Issuers (Admin Users):**
- Processor: Any modern dual-core processor (Intel Core i3, AMD Ryzen 3, or equivalent)
- RAM: 4 GB minimum
- Storage: Any storage type with web browser support
- Network: Internet connection with minimum 5 Mbps download speed
- Display: Minimum 1366x768 resolution
- Input: Keyboard and mouse/trackpad

**For Certificate Verifiers:**
- Any device capable of running a modern web browser
- Smartphones: iOS 12+ or Android 8.0+ with camera for QR code scanning
- Tablets: Any tablet with modern browser support
- Desktop/Laptop: Any system capable of running Chrome, Firefox, Safari, or Edge
- Network: Internet connection with minimum 2 Mbps download speed

**Rationale:**
The web-based architecture ensures broad accessibility across devices. Certificate issuance requires slightly higher specifications due to PDF generation and blockchain transaction processing, while verification is optimized for minimal hardware requirements to ensure universal accessibility.

### 4.1.2 Software Requirements

Software requirements encompass the development tools, runtime environments, and third-party services necessary for system operation.

#### Development Software Requirements

**Core Development Tools:**
- Node.js: Version 18.x or higher
- npm: Version 9.x or higher (included with Node.js)
- Git: Version 2.30 or higher for version control
- Code Editor: Visual Studio Code (recommended) or equivalent with TypeScript support

**Development Dependencies:**
- Next.js: Version 14.2.0
- React: Version 18.3.0
- TypeScript: Version 5.0.0
- Hardhat: Version 2.22.0 for smart contract development
- Solidity: Version 0.8.19 for smart contract implementation

**Browser Requirements for Development:**
- Google Chrome: Version 100 or higher (recommended for development)
- Firefox Developer Edition: Latest version (alternative)
- Browser extensions: MetaMask for blockchain interaction testing

**Operating System:**
- Windows 10/11 (64-bit)
- macOS 11 (Big Sur) or higher
- Linux: Ubuntu 20.04 LTS or equivalent distribution

#### Production Runtime Requirements

**Server-Side Requirements:**
- Node.js runtime: Version 18.x or higher (provided by Vercel hosting)
- Next.js framework: Version 14.2.0
- Serverless function support for API routes

**Client-Side Requirements:**
- Modern web browser with JavaScript enabled:
  - Google Chrome: Version 90 or higher
  - Mozilla Firefox: Version 88 or higher
  - Safari: Version 14 or higher
  - Microsoft Edge: Version 90 or higher
- JavaScript enabled (required)
- Cookies enabled for session management
- Local storage support for temporary data

**Third-Party Services:**
- Firebase: Firestore database and Storage services
- Polygon Network: Amoy testnet RPC access
- Vercel: Hosting and deployment platform
- MetaMask: Browser extension for blockchain transactions (admin users only)

#### Database and Storage Requirements

**Firebase Firestore:**
- NoSQL document database
- Real-time synchronization capabilities
- Minimum free tier allocation: 50,000 reads/day, 20,000 writes/day
- Storage: Sufficient for certificate metadata (estimated 1 KB per certificate)

**Firebase Storage:**
- Cloud storage for uploaded files
- Minimum free tier allocation: 5 GB storage, 1 GB/day download
- Support for image file formats: PNG, JPG, JPEG

**Blockchain Storage:**
- Polygon Amoy testnet access
- Smart contract deployment (one-time)
- Transaction capacity: Unlimited on testnet
- Gas requirements: Test MATIC tokens (free from faucet)

### 4.1.3 Functional and Non-Functional Requirements

Functional requirements define what the system must do, while non-functional requirements specify how the system should perform.

#### Functional Requirements

**FR1: User Authentication and Authorization**
- FR1.1: System shall support admin access for certificate issuance
- FR1.2: System shall allow public access to verification interface without authentication
- FR1.3: System shall integrate with MetaMask for blockchain transaction authorization

**FR2: Certificate Creation and Issuance**
- FR2.1: System shall provide a form interface for entering certificate details
- FR2.2: System shall validate all required fields before submission
- FR2.3: System shall generate unique certificate IDs automatically
- FR2.4: System shall support four certificate templates (Academic, Corporate, Premium, Minimal)
- FR2.5: System shall allow upload of institutional logos and signature images
- FR2.6: System shall provide real-time preview of certificate during creation
- FR2.7: System shall generate SHA-256 hash of certificate data
- FR2.8: System shall store certificate metadata in Firebase Firestore
- FR2.9: System shall upload logo and signature files to Firebase Storage
- FR2.10: System shall record certificate hash on Polygon blockchain
- FR2.11: System shall generate PDF certificate with embedded QR code
- FR2.12: System shall provide download capability for generated certificates

**FR3: Certificate Verification**
- FR3.1: System shall accept certificate ID for manual verification
- FR3.2: System shall support QR code scanning for verification
- FR3.3: System shall retrieve certificate data from Firestore
- FR3.4: System shall recalculate hash from retrieved data
- FR3.5: System shall query blockchain for stored hash
- FR3.6: System shall compare calculated hash with blockchain hash
- FR3.7: System shall check certificate revocation status
- FR3.8: System shall display verification results clearly (Verified, Tampered, Revoked, Not Found)
- FR3.9: System shall log verification attempts for analytics

**FR4: Certificate Management**
- FR4.1: System shall display dashboard with certificate statistics
- FR4.2: System shall list all issued certificates with search capability
- FR4.3: System shall allow filtering of certificates by status
- FR4.4: System shall support certificate revocation
- FR4.5: System shall support certificate restoration (un-revoke)
- FR4.6: System shall allow downloading certificates from issued list
- FR4.7: System shall display certificate details including blockchain transaction hash

**FR5: QR Code Generation**
- FR5.1: System shall generate QR codes containing verification URLs
- FR5.2: System shall embed QR codes in PDF certificates
- FR5.3: System shall support configurable QR code positioning
- FR5.4: System shall ensure QR codes are scannable with standard smartphone cameras

**FR6: Template Customization**
- FR6.1: System shall support selection of certificate template
- FR6.2: System shall allow configuration of logo position
- FR6.3: System shall allow configuration of signature position
- FR6.4: System shall allow configuration of QR code position
- FR6.5: System shall maintain consistent styling within each template

#### Non-Functional Requirements

**NFR1: Performance Requirements**
- NFR1.1: Certificate creation form shall respond to user input within 100ms
- NFR1.2: Certificate preview shall update within 500ms of data changes
- NFR1.3: PDF generation shall complete within 5 seconds for standard certificates
- NFR1.4: Blockchain transaction confirmation shall complete within 10 seconds
- NFR1.5: Verification process shall complete within 3 seconds
- NFR1.6: Page load time shall not exceed 3 seconds on broadband connections
- NFR1.7: System shall support concurrent access by at least 100 users

**NFR2: Reliability Requirements**
- NFR2.1: System shall maintain 99% uptime during operational hours
- NFR2.2: System shall handle blockchain network failures gracefully
- NFR2.3: System shall provide fallback verification using Firestore if blockchain is unavailable
- NFR2.4: System shall implement error recovery for failed transactions
- NFR2.5: System shall maintain data consistency between Firestore and blockchain

**NFR3: Usability Requirements**
- NFR3.1: Certificate issuance workflow shall be completable by users with basic computer skills
- NFR3.2: Verification interface shall be usable without training or documentation
- NFR3.3: Error messages shall be clear and suggest corrective actions
- NFR3.4: Interface shall follow consistent design patterns throughout
- NFR3.5: System shall provide visual feedback for all user actions
- NFR3.6: Navigation shall be intuitive and require minimal clicks

**NFR4: Security Requirements**
- NFR4.1: System shall use HTTPS for all communications
- NFR4.2: System shall not expose private keys or sensitive credentials
- NFR4.3: System shall validate all user inputs to prevent injection attacks
- NFR4.4: System shall implement rate limiting to prevent abuse
- NFR4.5: System shall use cryptographic hashing (SHA-256) for data integrity
- NFR4.6: System shall require MetaMask authorization for blockchain transactions
- NFR4.7: System shall implement Firebase security rules for data access control

**NFR5: Scalability Requirements**
- NFR5.1: System architecture shall support horizontal scaling
- NFR5.2: Database design shall accommodate growth to 100,000+ certificates
- NFR5.3: System shall maintain performance with increasing data volume
- NFR5.4: Blockchain integration shall support migration to mainnet
- NFR5.5: System shall support addition of new certificate templates without code changes

**NFR6: Maintainability Requirements**
- NFR6.1: Code shall follow consistent style guidelines
- NFR6.2: System shall use TypeScript for type safety
- NFR6.3: Components shall be modular and loosely coupled
- NFR6.4: System shall include inline documentation for complex logic
- NFR6.5: Configuration shall be externalized from code
- NFR6.6: System shall use version control with meaningful commit messages

**NFR7: Portability Requirements**
- NFR7.1: System shall function on Windows, macOS, and Linux
- NFR7.2: System shall support major web browsers (Chrome, Firefox, Safari, Edge)
- NFR7.3: System shall be responsive across desktop, tablet, and mobile devices
- NFR7.4: System shall degrade gracefully on older browsers

**NFR8: Compatibility Requirements**
- NFR8.1: System shall integrate with MetaMask wallet
- NFR8.2: System shall support Polygon Amoy testnet
- NFR8.3: System shall be compatible with Firebase services
- NFR8.4: System shall support standard PDF readers
- NFR8.5: QR codes shall be scannable by standard QR code readers

**NFR9: Accessibility Requirements**
- NFR9.1: System shall support keyboard navigation
- NFR9.2: System shall provide sufficient color contrast (WCAG AA minimum)
- NFR9.3: System shall include alt text for images
- NFR9.4: System shall support screen readers for critical functions
- NFR9.5: Touch targets shall be minimum 44x44 pixels on mobile

**NFR10: Documentation Requirements**
- NFR10.1: System shall include technical documentation
- NFR10.2: System shall include user guides for certificate issuance
- NFR10.3: System shall include deployment documentation
- NFR10.4: System shall include API documentation for blockchain integration
- NFR10.5: Code shall include inline comments for complex logic

## 4.2 Use-Case Diagram and Use-Case Description

Use-case diagrams provide a high-level view of system functionality from the user's perspective, identifying actors and their interactions with the system.

### 4.2.1 System Actors

**Primary Actors:**

1. **Certificate Issuer (Admin)**
   - Role: Authorized personnel who create and manage certificates
   - Responsibilities: Create certificates, manage issued certificates, revoke certificates
   - Technical Requirements: MetaMask wallet, admin access credentials

2. **Certificate Verifier**
   - Role: Any individual or organization verifying certificate authenticity
   - Responsibilities: Verify certificates using ID or QR code
   - Technical Requirements: Web browser, internet connection

3. **Certificate Recipient**
   - Role: Individual who receives a certificate
   - Responsibilities: Download certificate, share certificate for verification
   - Technical Requirements: Web browser, PDF reader

**Secondary Actors:**

4. **Blockchain Network (Polygon)**
   - Role: Distributed ledger storing certificate hashes
   - Responsibilities: Record transactions, provide verification data
   - Technical Requirements: RPC endpoint access

5. **Firebase Services**
   - Role: Backend services for data storage
   - Responsibilities: Store certificate metadata, host uploaded files
   - Technical Requirements: Firebase project configuration

### 4.2.2 Use-Case Diagram

[FIGURE 4.1: Use-Case Diagram – to be inserted here]

The use-case diagram illustrates the following relationships:
- Certificate Issuer interacts with: Create Certificate, View Dashboard, Manage Certificates, Revoke Certificate, Download Certificate
- Certificate Verifier interacts with: Verify Certificate (Manual), Verify Certificate (QR Scan)
- Certificate Recipient interacts with: Download Certificate, View Certificate
- System interacts with: Blockchain Network (for hash storage and retrieval), Firebase Services (for data storage)

### 4.2.3 Use-Case Descriptions

#### Use Case 1: Create Certificate

**Use Case ID:** UC-001  
**Use Case Name:** Create Certificate  
**Actor:** Certificate Issuer  
**Preconditions:**
- User has admin access to the system
- User has MetaMask wallet installed and configured
- User has test MATIC tokens for transaction fees

**Main Flow:**
1. User navigates to certificate creation page
2. System displays certificate creation form
3. User enters recipient name, course name, institution name, issuer name, and issue date
4. User selects certificate template (Academic, Corporate, Premium, or Minimal)
5. User optionally uploads institutional logo and signature image
6. User optionally configures advanced settings (instructor name, duration, grade, expiry date)
7. System displays live preview of certificate
8. User reviews preview and clicks "Issue Certificate"
9. System validates form data
10. System generates unique certificate ID
11. System calculates SHA-256 hash of certificate data
12. System uploads logo and signature to Firebase Storage
13. System saves certificate metadata to Firebase Firestore
14. System prompts MetaMask for transaction authorization
15. User approves transaction in MetaMask
16. System submits transaction to Polygon blockchain
17. System waits for transaction confirmation
18. System generates PDF certificate with QR code
19. System displays success message with certificate ID
20. User downloads generated certificate

**Alternative Flows:**
- 9a. Validation fails: System displays error messages, user corrects data and resubmits
- 14a. User rejects MetaMask transaction: System displays error, certificate not issued to blockchain but saved in Firestore
- 16a. Blockchain transaction fails: System logs error, allows retry

**Postconditions:**
- Certificate metadata stored in Firestore
- Certificate hash recorded on blockchain
- PDF certificate generated and available for download
- Certificate appears in issued certificates list

**Special Requirements:**
- Form validation must occur in real-time
- Preview must update within 500ms of data changes
- PDF generation must complete within 5 seconds

---

#### Use Case 2: Verify Certificate

**Use Case ID:** UC-002  
**Use Case Name:** Verify Certificate  
**Actor:** Certificate Verifier  
**Preconditions:**
- User has certificate ID or QR code
- User has internet connection

**Main Flow (Manual Verification):**
1. User navigates to verification page
2. System displays verification interface
3. User enters certificate ID in input field
4. User clicks "Verify" button
5. System retrieves certificate data from Firestore
6. System recalculates hash from retrieved data
7. System queries blockchain for stored hash
8. System compares calculated hash with blockchain hash
9. System checks revocation status
10. System displays verification result (Verified, Tampered, Revoked, or Not Found)
11. If verified, system displays certificate details
12. System logs verification attempt

**Alternative Flow (QR Code Verification):**
3a. User clicks "Scan QR Code" button
4a. System requests camera permission
5a. User grants camera permission
6a. System activates camera and displays scanning interface
7a. User points camera at certificate QR code
8a. System decodes QR code to extract certificate ID
9a. System automatically proceeds with verification (steps 5-12 of main flow)

**Alternative Flows:**
- 5a. Certificate not found in Firestore: System displays "Certificate Not Found" message
- 7a. Blockchain query fails: System falls back to Firestore-only verification
- 9a. Hashes do not match: System displays "Certificate Tampered" message
- 9b. Certificate is revoked: System displays "Certificate Revoked" message with revocation date

**Postconditions:**
- Verification result displayed to user
- Verification attempt logged in database
- User has clear understanding of certificate status

**Special Requirements:**
- Verification must complete within 3 seconds
- QR code scanning must work with standard smartphone cameras
- Results must be displayed clearly with appropriate visual indicators

---

#### Use Case 3: Manage Certificates

**Use Case ID:** UC-003  
**Use Case Name:** Manage Certificates  
**Actor:** Certificate Issuer  
**Preconditions:**
- User has admin access to the system
- Certificates have been issued

**Main Flow:**
1. User navigates to issued certificates page
2. System retrieves certificate list from Firestore
3. System displays certificates in table/card format
4. User can search certificates by name, course, or ID
5. User can filter certificates by status (Active/Revoked)
6. User selects a certificate to view details
7. System displays certificate information including blockchain transaction hash
8. User can download certificate PDF
9. User can revoke or restore certificate

**Alternative Flows:**
- 2a. No certificates exist: System displays empty state with prompt to create first certificate
- 4a. Search returns no results: System displays "No certificates found" message
- 8a. Download fails: System displays error message and allows retry

**Postconditions:**
- User has viewed certificate information
- User has performed desired management action (download, revoke, restore)

**Special Requirements:**
- List must support pagination for large numbers of certificates
- Search must be responsive and provide instant feedback
- Download must generate PDF on-demand with current data

---

#### Use Case 4: Revoke Certificate

**Use Case ID:** UC-004  
**Use Case Name:** Revoke Certificate  
**Actor:** Certificate Issuer  
**Preconditions:**
- User has admin access
- Certificate exists and is currently active

**Main Flow:**
1. User navigates to issued certificates page
2. User locates certificate to revoke
3. User clicks "Revoke" button
4. System displays confirmation dialog
5. User confirms revocation
6. System updates certificate record in Firestore
7. System sets isRevoked flag to true
8. System records revocation timestamp and admin identifier
9. System displays success message
10. System updates certificate list to show revoked status

**Alternative Flows:**
- 5a. User cancels revocation: System returns to certificate list without changes
- 6a. Update fails: System displays error message and allows retry

**Postconditions:**
- Certificate marked as revoked in Firestore
- Revocation timestamp recorded
- Certificate displays as revoked in management interface
- Future verification attempts will show certificate as revoked

**Special Requirements:**
- Revocation must be instant (no blockchain transaction required)
- Revocation must be reversible (restore capability)
- Audit trail must be maintained

---

## 4.3 Sequence Diagram

Sequence diagrams illustrate the temporal sequence of interactions between system components for specific scenarios.

### 4.3.1 Certificate Issuance Sequence

[FIGURE 4.2: Certificate Issuance Sequence Diagram – to be inserted here]

**Participants:**
- Admin User
- Web Browser
- Certificate Form Component
- Hash Generator
- Firebase Storage
- Firebase Firestore
- MetaMask
- Blockchain Network
- PDF Generator

**Sequence:**
1. Admin User → Web Browser: Navigate to create certificate page
2. Web Browser → Certificate Form Component: Load form
3. Certificate Form Component → Admin User: Display form
4. Admin User → Certificate Form Component: Enter certificate data
5. Certificate Form Component → Certificate Form Component: Validate input
6. Certificate Form Component → Admin User: Display live preview
7. Admin User → Certificate Form Component: Click "Issue Certificate"
8. Certificate Form Component → Hash Generator: Generate certificate hash
9. Hash Generator → Certificate Form Component: Return hash
10. Certificate Form Component → Firebase Storage: Upload logo/signature
11. Firebase Storage → Certificate Form Component: Return download URLs
12. Certificate Form Component → Firebase Firestore: Save certificate metadata
13. Firebase Firestore → Certificate Form Component: Return document ID
14. Certificate Form Component → MetaMask: Request transaction authorization
15. MetaMask → Admin User: Display transaction details
16. Admin User → MetaMask: Approve transaction
17. MetaMask → Blockchain Network: Submit transaction
18. Blockchain Network → MetaMask: Return transaction hash
19. MetaMask → Certificate Form Component: Transaction confirmed
20. Certificate Form Component → Firebase Firestore: Update with transaction hash
21. Certificate Form Component → PDF Generator: Generate certificate PDF
22. PDF Generator → Certificate Form Component: Return PDF blob
23. Certificate Form Component → Admin User: Display success and download option

### 4.3.2 Certificate Verification Sequence

[FIGURE 4.3: Certificate Verification Sequence Diagram – to be inserted here]

**Participants:**
- Verifier User
- Web Browser
- Verification Component
- Firebase Firestore
- Hash Generator
- Blockchain Network
- Result Display Component

**Sequence:**
1. Verifier User → Web Browser: Navigate to verification page
2. Web Browser → Verification Component: Load verification interface
3. Verification Component → Verifier User: Display input field
4. Verifier User → Verification Component: Enter certificate ID
5. Verification Component → Firebase Firestore: Query certificate by ID
6. Firebase Firestore → Verification Component: Return certificate data
7. Verification Component → Hash Generator: Calculate hash from data
8. Hash Generator → Verification Component: Return calculated hash
9. Verification Component → Blockchain Network: Query stored hash
10. Blockchain Network → Verification Component: Return blockchain data
11. Verification Component → Verification Component: Compare hashes
12. Verification Component → Verification Component: Check revocation status
13. Verification Component → Result Display Component: Pass verification result
14. Result Display Component → Verifier User: Display result (Verified/Tampered/Revoked/Not Found)
15. Verification Component → Firebase Firestore: Log verification attempt

## 4.4 System Flow Diagram

System flow diagrams provide a high-level view of data and control flow through the system.

### 4.4.1 Overall System Architecture Flow

[FIGURE 4.4: System Architecture Flow Diagram – to be inserted here]

The system architecture consists of three primary layers:

**Presentation Layer:**
- Next.js frontend application
- React components for UI
- Responsive design for multiple devices
- Client-side routing

**Business Logic Layer:**
- Certificate creation logic
- Hash generation algorithms
- Verification logic
- PDF generation
- Blockchain interaction

**Data Layer:**
- Firebase Firestore (certificate metadata)
- Firebase Storage (uploaded files)
- Polygon Blockchain (certificate hashes)
- Browser local storage (temporary data)

### 4.4.2 Certificate Issuance Flow

[FIGURE 4.5: Certificate Issuance Flow Diagram – to be inserted here]

**Flow Steps:**
1. START
2. User enters certificate data
3. Validate input data
4. If invalid → Display errors → Return to step 2
5. If valid → Generate unique certificate ID
6. Calculate SHA-256 hash of certificate data
7. Upload logo and signature to Firebase Storage
8. Save certificate metadata to Firestore
9. Request MetaMask authorization
10. If rejected → Display error → END
11. If approved → Submit transaction to blockchain
12. Wait for transaction confirmation
13. Update Firestore with transaction hash
14. Generate PDF certificate
15. Display success message
16. Provide download option
17. END

### 4.4.3 Certificate Verification Flow

[FIGURE 4.6: Certificate Verification Flow Diagram – to be inserted here]

**Flow Steps:**
1. START
2. User provides certificate ID (manual entry or QR scan)
3. Query Firestore for certificate data
4. If not found → Display "Not Found" → Log attempt → END
5. If found → Retrieve certificate data
6. Recalculate hash from retrieved data
7. Query blockchain for stored hash
8. If blockchain query fails → Use Firestore hash for comparison
9. Compare calculated hash with stored hash
10. If hashes don't match → Display "Tampered" → Log attempt → END
11. If hashes match → Check revocation status
12. If revoked → Display "Revoked" with date → Log attempt → END
13. If not revoked → Display "Verified" with details → Log attempt → END

---

**End of Chapter 4**

Say `Continue with Chapter 5` to proceed.
