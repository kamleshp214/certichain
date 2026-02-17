# CHAPTER 5: SYSTEM DESIGN OVERVIEW

## 5.1 Class Diagram

The class diagram represents the static structure of the system, illustrating the classes, their attributes, methods, and relationships. CertiChain's architecture is organized around several key classes that encapsulate distinct functional responsibilities.

### 5.1.1 Core Domain Classes

[FIGURE 5.1: Class Diagram – to be inserted here]

#### Certificate Class

**Purpose:** Represents a certificate entity with all associated metadata.

**Attributes:**
- `id: string` - Firestore document identifier
- `certificateId: string` - Unique certificate identifier (CERT-XXX-XXX format)
- `recipientName: string` - Name of certificate recipient
- `courseName: string` - Name of course or program
- `institutionName: string` - Issuing institution name
- `issuerName: string` - Name of issuing authority
- `instructorName?: string` - Optional instructor name
- `issueDate: string` - Date of issuance (YYYY-MM-DD format)
- `expiryDate?: string` - Optional expiration date
- `durationFrom?: string` - Optional course start date
- `durationTo?: string` - Optional course end date
- `grade?: string` - Optional grade or score
- `template: TemplateType` - Certificate template identifier
- `hash: string` - SHA-256 hash of certificate data
- `txHash?: string` - Blockchain transaction hash
- `isRevoked: boolean` - Revocation status flag
- `revokedAt?: number` - Revocation timestamp
- `revokedBy?: string` - Identifier of revoking admin
- `createdAt: number` - Creation timestamp
- `logoUrl?: string` - URL of institution logo
- `signatureUrl?: string` - URL of signature image
- `qrPosition?: string` - QR code position on certificate
- `logoPosition?: string` - Logo position on certificate
- `signaturePosition?: string` - Signature position on certificate

**Methods:**
- `validate(): boolean` - Validates certificate data completeness
- `toFirestore(): object` - Converts to Firestore document format
- `fromFirestore(data: object): Certificate` - Creates instance from Firestore data

**Relationships:**
- Aggregates `TemplateType` enumeration
- Associated with `VerificationLog` (one-to-many)

---

#### CertificateData Class

**Purpose:** Represents the core data used for hash generation.

**Attributes:**
- `certificateId: string`
- `recipientName: string`
- `courseName: string`
- `institutionName: string`
- `issuerName: string`
- `issueDate: string`
- `instructorName?: string`
- `expiryDate?: string`
- `durationFrom?: string`
- `durationTo?: string`
- `grade?: string`

**Methods:**
- `toString(): string` - Converts to string format for hashing
- `validate(): boolean` - Validates required fields

**Relationships:**
- Used by `HashGenerator` class
- Subset of `Certificate` class attributes

---

#### VerificationLog Class

**Purpose:** Records verification attempts for analytics and audit purposes.

**Attributes:**
- `id: string` - Firestore document identifier
- `certificateId: string` - Certificate being verified
- `timestamp: number` - Verification timestamp
- `result: VerificationResult` - Verification outcome
- `ipAddress?: string` - Optional IP address of verifier

**Methods:**
- `toFirestore(): object` - Converts to Firestore document format
- `fromFirestore(data: object): VerificationLog` - Creates instance from Firestore data

**Relationships:**
- Associated with `Certificate` (many-to-one)
- Uses `VerificationResult` enumeration

---

#### DashboardStats Class

**Purpose:** Aggregates statistics for dashboard display.

**Attributes:**
- `totalIssued: number` - Total certificates issued
- `activeOnChain: number` - Active certificates on blockchain
- `revokedCount: number` - Number of revoked certificates
- `recentVerifications: number` - Recent verification count

**Methods:**
- `calculate(certificates: Certificate[]): DashboardStats` - Calculates statistics from certificate list
- `toJSON(): object` - Converts to JSON format

**Relationships:**
- Computed from `Certificate` collection

---

### 5.1.2 Service Classes

#### HashGenerator Class

**Purpose:** Generates cryptographic hashes of certificate data.

**Methods:**
- `generateCertificateHash(data: CertificateData): Promise<string>` - Generates SHA-256 hash
- `generateCertificateId(): string` - Generates unique certificate ID

**Dependencies:**
- Web Crypto API (browser environment)
- Node.js crypto module (server environment)

**Relationships:**
- Uses `CertificateData` class
- Utilized by certificate issuance and verification processes

---

#### BlockchainService Class

**Purpose:** Manages interactions with Polygon blockchain.

**Attributes:**
- `contractAddress: string` - Smart contract address
- `contractABI: array` - Contract interface definition
- `provider: Provider` - Blockchain provider instance
- `signer: Signer` - Transaction signer instance

**Methods:**
- `getContract(): Promise<Contract>` - Returns contract instance with signer
- `getReadOnlyContract(): Promise<Contract>` - Returns read-only contract instance
- `issueCertificateOnChain(certificateId: string, hash: string): Promise<string>` - Issues certificate to blockchain
- `verifyCertificateOnChain(certificateId: string): Promise<BlockchainData>` - Retrieves certificate data from blockchain
- `revokeCertificateOnChain(certificateId: string): Promise<string>` - Revokes certificate on blockchain
- `getCertificateCount(): Promise<number>` - Returns total certificate count

**Dependencies:**
- ethers.js library
- MetaMask browser extension
- Polygon RPC endpoint

**Relationships:**
- Interacts with `CertificateRegistry` smart contract
- Used by certificate issuance and verification workflows

---

#### FirebaseService Class

**Purpose:** Manages Firebase Firestore and Storage operations.

**Attributes:**
- `db: Firestore` - Firestore database instance
- `storage: Storage` - Firebase Storage instance

**Methods:**
- `saveCertificate(certificate: Certificate): Promise<string>` - Saves certificate to Firestore
- `getCertificate(certificateId: string): Promise<Certificate>` - Retrieves certificate by ID
- `updateCertificate(id: string, data: Partial<Certificate>): Promise<void>` - Updates certificate
- `listCertificates(): Promise<Certificate[]>` - Retrieves all certificates
- `uploadFile(path: string, file: File): Promise<string>` - Uploads file to Storage
- `logVerification(log: VerificationLog): Promise<void>` - Logs verification attempt

**Dependencies:**
- Firebase SDK
- Firebase project configuration

**Relationships:**
- Manages `Certificate` and `VerificationLog` persistence
- Handles file storage for logos and signatures

---

#### PDFGenerator Class

**Purpose:** Generates PDF certificates with embedded QR codes.

**Methods:**
- `generateCertificatePDF(template: CertificateTemplate): Promise<Uint8Array>` - Generates PDF
- `drawAcademicTemplate(page: PDFPage, data: CertificateData, fonts: Fonts): void` - Renders academic template
- `drawCorporateTemplate(page: PDFPage, data: CertificateData, fonts: Fonts): void` - Renders corporate template
- `drawPremiumTemplate(page: PDFPage, data: CertificateData, fonts: Fonts): void` - Renders premium template
- `drawMinimalTemplate(page: PDFPage, data: CertificateData, fonts: Fonts): void` - Renders minimal template
- `drawQRCode(page: PDFPage, certificateId: string, position: string): Promise<void>` - Embeds QR code
- `drawLogo(page: PDFPage, logoUrl: string, position: string): Promise<void>` - Embeds logo
- `drawSignature(page: PDFPage, data: CertificateData, fonts: Fonts, position: string): Promise<void>` - Embeds signature

**Dependencies:**
- pdf-lib library
- qrcode library

**Relationships:**
- Uses `Certificate` data
- Generates output consumed by download functionality

---

#### VerificationService Class

**Purpose:** Orchestrates certificate verification process.

**Methods:**
- `verifyCertificate(certificateId: string): Promise<VerificationResult>` - Performs complete verification
- `retrieveCertificateData(certificateId: string): Promise<Certificate>` - Retrieves from Firestore
- `recalculateHash(certificate: Certificate): Promise<string>` - Recalculates hash
- `compareHashes(calculated: string, stored: string): boolean` - Compares hash values
- `checkRevocationStatus(certificate: Certificate): boolean` - Checks if revoked
- `logVerification(certificateId: string, result: VerificationResult): Promise<void>` - Logs attempt

**Dependencies:**
- `FirebaseService`
- `BlockchainService`
- `HashGenerator`

**Relationships:**
- Coordinates multiple services for verification
- Returns `VerificationResult`

---

### 5.1.3 Enumeration Types

#### TemplateType Enumeration

**Values:**
- `ACADEMIC` - Traditional academic certificate style
- `CORPORATE` - Modern corporate certificate style
- `PREMIUM` - Ornamental premium certificate style
- `MINIMAL` - Clean minimal certificate style

---

#### VerificationResult Enumeration

**Values:**
- `VERIFIED` - Certificate is authentic and valid
- `TAMPERED` - Certificate data has been modified
- `REVOKED` - Certificate has been revoked
- `NOT_FOUND` - Certificate does not exist
- `EXPIRED` - Certificate has expired (future enhancement)

---

### 5.1.4 Component Classes

#### CertificateForm Component

**Purpose:** Provides user interface for certificate data entry.

**Properties:**
- `onSubmit: (data: CertificateFormData) => void` - Submission callback
- `disabled: boolean` - Form disabled state

**State:**
- `formData: CertificateFormData` - Current form values
- `errors: FormErrors` - Validation errors
- `logoPreview: string` - Logo preview URL
- `signaturePreview: string` - Signature preview URL

**Methods:**
- `handleSubmit(): void` - Processes form submission
- `handleLogoChange(file: File): void` - Handles logo upload
- `handleSignatureChange(file: File): void` - Handles signature upload
- `validate(): boolean` - Validates form data

---

#### CertificatePreview Component

**Purpose:** Displays real-time preview of certificate being created.

**Properties:**
- `formData: CertificateFormData` - Data to preview

**Methods:**
- `renderTemplate(): JSX.Element` - Renders appropriate template
- `renderAcademicTemplate(): JSX.Element` - Renders academic template
- `renderCorporateTemplate(): JSX.Element` - Renders corporate template
- `renderPremiumTemplate(): JSX.Element` - Renders premium template
- `renderMinimalTemplate(): JSX.Element` - Renders minimal template

---

#### VerificationResult Component

**Purpose:** Displays certificate verification results.

**Properties:**
- `result: VerificationResult` - Verification outcome
- `certificate?: Certificate` - Certificate data if verified

**Methods:**
- `renderResultIcon(): JSX.Element` - Renders appropriate status icon
- `renderCertificateDetails(): JSX.Element` - Renders certificate information

---

## 5.2 Data Flow Diagram

Data Flow Diagrams (DFD) illustrate how data moves through the system, showing processes, data stores, and external entities.

### 5.2.1 Context Level DFD (Level 0)

[FIGURE 5.2: Context Level DFD – to be inserted here]

**External Entities:**
- Certificate Issuer (Admin)
- Certificate Verifier
- Certificate Recipient

**System Boundary:**
- CertiChain System

**Data Flows:**
- Certificate Issuer → System: Certificate Data, Logo/Signature Files
- System → Certificate Issuer: Certificate PDF, Issuance Confirmation
- Certificate Verifier → System: Certificate ID / QR Code
- System → Certificate Verifier: Verification Result
- Certificate Recipient → System: Certificate ID
- System → Certificate Recipient: Certificate PDF

---

### 5.2.2 Level 1 DFD - Certificate Issuance

[FIGURE 5.3: Level 1 DFD - Certificate Issuance – to be inserted here]

**Processes:**
1. **Validate Certificate Data**
   - Input: Certificate Data from Admin
   - Output: Validated Data or Error Messages
   - Data Store: None

2. **Generate Certificate ID and Hash**
   - Input: Validated Certificate Data
   - Output: Certificate ID, Hash Value
   - Data Store: None

3. **Upload Assets**
   - Input: Logo File, Signature File
   - Output: Asset URLs
   - Data Store: Firebase Storage

4. **Save to Database**
   - Input: Certificate Data, Asset URLs, Hash
   - Output: Document ID
   - Data Store: Firestore Database

5. **Record on Blockchain**
   - Input: Certificate ID, Hash
   - Output: Transaction Hash
   - Data Store: Polygon Blockchain

6. **Generate PDF**
   - Input: Certificate Data, Asset URLs
   - Output: PDF Document
   - Data Store: None

7. **Update Database with Transaction Hash**
   - Input: Document ID, Transaction Hash
   - Output: Confirmation
   - Data Store: Firestore Database

**Data Stores:**
- D1: Firestore Database (Certificate Metadata)
- D2: Firebase Storage (Logos and Signatures)
- D3: Polygon Blockchain (Certificate Hashes)

---

### 5.2.3 Level 1 DFD - Certificate Verification

[FIGURE 5.4: Level 1 DFD - Certificate Verification – to be inserted here]

**Processes:**
1. **Receive Certificate ID**
   - Input: Certificate ID from Verifier
   - Output: Certificate ID
   - Data Store: None

2. **Retrieve Certificate Data**
   - Input: Certificate ID
   - Output: Certificate Data or Not Found
   - Data Store: Firestore Database

3. **Recalculate Hash**
   - Input: Certificate Data
   - Output: Calculated Hash
   - Data Store: None

4. **Query Blockchain**
   - Input: Certificate ID
   - Output: Stored Hash, Blockchain Status
   - Data Store: Polygon Blockchain

5. **Compare and Validate**
   - Input: Calculated Hash, Stored Hash, Revocation Status
   - Output: Verification Result
   - Data Store: None

6. **Log Verification**
   - Input: Certificate ID, Verification Result, Timestamp
   - Output: Log Entry
   - Data Store: Verification Logs

7. **Display Result**
   - Input: Verification Result, Certificate Data
   - Output: Result Display to Verifier
   - Data Store: None

**Data Stores:**
- D1: Firestore Database (Certificate Metadata)
- D3: Polygon Blockchain (Certificate Hashes)
- D4: Verification Logs (Verification History)

---

### 5.2.4 Level 2 DFD - Hash Generation Process

[FIGURE 5.5: Level 2 DFD - Hash Generation – to be inserted here]

**Processes:**
1. **Extract Core Fields**
   - Input: Complete Certificate Data
   - Output: Core Fields (ID, Name, Course, Institution, Issuer, Date)

2. **Concatenate Fields**
   - Input: Core Fields
   - Output: Concatenated String (field1|field2|field3...)

3. **Encode to Bytes**
   - Input: Concatenated String
   - Output: Byte Array

4. **Apply SHA-256**
   - Input: Byte Array
   - Output: Hash Buffer

5. **Convert to Hexadecimal**
   - Input: Hash Buffer
   - Output: 64-character Hex String

---

## 5.3 Data Dictionary

The data dictionary provides detailed specifications for all data elements used in the system.

### 5.3.1 Certificate Data Elements

| Data Element | Type | Length | Format | Constraints | Description |
|--------------|------|--------|--------|-------------|-------------|
| certificateId | String | 20-25 | CERT-XXXXX-XXXXX | Unique, Required | System-generated unique identifier |
| recipientName | String | 2-100 | Text | Required | Full name of certificate recipient |
| courseName | String | 2-200 | Text | Required | Name of course or program |
| institutionName | String | 2-200 | Text | Required | Name of issuing institution |
| issuerName | String | 2-100 | Text | Required | Name of issuing authority |
| instructorName | String | 0-100 | Text | Optional | Name of instructor or supervisor |
| issueDate | String | 10 | YYYY-MM-DD | Required | Date certificate was issued |
| expiryDate | String | 10 | YYYY-MM-DD | Optional | Date certificate expires |
| durationFrom | String | 10 | YYYY-MM-DD | Optional | Course start date |
| durationTo | String | 10 | YYYY-MM-DD | Optional | Course end date |
| grade | String | 0-50 | Text | Optional | Grade or score achieved |
| template | String | 8-10 | Enum | Required | Template type (academic, corporate, premium, minimal) |
| hash | String | 64 | Hexadecimal | Required | SHA-256 hash of certificate data |
| txHash | String | 66 | 0x + Hex | Optional | Blockchain transaction hash |
| isRevoked | Boolean | 1 | true/false | Required | Revocation status flag |
| revokedAt | Number | Variable | Timestamp | Optional | Unix timestamp of revocation |
| revokedBy | String | 0-100 | Text | Optional | Identifier of revoking admin |
| createdAt | Number | Variable | Timestamp | Required | Unix timestamp of creation |
| logoUrl | String | 0-500 | URL | Optional | Firebase Storage URL for logo |
| signatureUrl | String | 0-500 | URL | Optional | Firebase Storage URL for signature |
| qrPosition | String | 10-15 | Enum | Optional | QR code position (bottom-right, bottom-left, top-right, top-left) |
| logoPosition | String | 10-15 | Enum | Optional | Logo position (top-left, top-center, top-right) |
| signaturePosition | String | 10-15 | Enum | Optional | Signature position (bottom-left, bottom-center, bottom-right) |

### 5.3.2 Verification Log Data Elements

| Data Element | Type | Length | Format | Constraints | Description |
|--------------|------|--------|--------|-------------|-------------|
| id | String | 20 | Alphanumeric | Unique, Required | Firestore document ID |
| certificateId | String | 20-25 | CERT-XXXXX-XXXXX | Required | Certificate being verified |
| timestamp | Number | Variable | Unix Timestamp | Required | When verification occurred |
| result | String | 10-15 | Enum | Required | Verification outcome (verified, tampered, revoked, not_found) |
| ipAddress | String | 7-45 | IPv4/IPv6 | Optional | IP address of verifier |

### 5.3.3 Dashboard Statistics Data Elements

| Data Element | Type | Length | Format | Constraints | Description |
|--------------|------|--------|--------|-------------|-------------|
| totalIssued | Number | Variable | Integer | >= 0 | Total certificates issued |
| activeOnChain | Number | Variable | Integer | >= 0 | Active certificates on blockchain |
| revokedCount | Number | Variable | Integer | >= 0 | Number of revoked certificates |
| recentVerifications | Number | Variable | Integer | >= 0 | Recent verification count |

### 5.3.4 Blockchain Data Elements

| Data Element | Type | Length | Format | Constraints | Description |
|--------------|------|--------|--------|-------------|-------------|
| certificateHash | bytes32 | 32 bytes | Hexadecimal | Required | SHA-256 hash stored on blockchain |
| isValid | Boolean | 1 bit | true/false | Required | Whether certificate exists on blockchain |
| isRevoked | Boolean | 1 bit | true/false | Required | Blockchain revocation status |
| timestamp | uint256 | 32 bytes | Unix Timestamp | Required | Block timestamp of issuance |

### 5.3.5 Configuration Data Elements

| Data Element | Type | Length | Format | Constraints | Description |
|--------------|------|--------|--------|-------------|-------------|
| CONTRACT_ADDRESS | String | 42 | 0x + Hex | Required | Smart contract address |
| RPC_URL | String | Variable | URL | Required | Polygon RPC endpoint |
| FIREBASE_API_KEY | String | Variable | Alphanumeric | Required | Firebase API key |
| FIREBASE_PROJECT_ID | String | Variable | Alphanumeric | Required | Firebase project identifier |
| APP_URL | String | Variable | URL | Required | Application base URL |

## 5.4 Extended E-R Diagram

The Extended Entity-Relationship (E-R) diagram illustrates the logical structure of the database, showing entities, attributes, and relationships.

### 5.4.1 Entity Definitions

[FIGURE 5.6: Extended E-R Diagram – to be inserted here]

#### Certificate Entity

**Primary Key:** id (Firestore document ID)

**Attributes:**
- id (PK)
- certificateId (Unique)
- recipientName
- courseName
- institutionName
- issuerName
- instructorName
- issueDate
- expiryDate
- durationFrom
- durationTo
- grade
- template
- hash
- txHash
- isRevoked
- revokedAt
- revokedBy
- createdAt
- logoUrl
- signatureUrl
- qrPosition
- logoPosition
- signaturePosition

**Relationships:**
- One-to-Many with VerificationLog (one certificate can have many verification attempts)

---

#### VerificationLog Entity

**Primary Key:** id (Firestore document ID)

**Attributes:**
- id (PK)
- certificateId (FK)
- timestamp
- result
- ipAddress

**Relationships:**
- Many-to-One with Certificate (many logs reference one certificate)

---

#### BlockchainRecord Entity

**Primary Key:** certificateId (on-chain)

**Attributes:**
- certificateId (PK)
- certificateHash
- isValid
- isRevoked
- timestamp

**Relationships:**
- One-to-One with Certificate (each certificate has one blockchain record)

---

### 5.4.2 Relationship Specifications

**Certificate ↔ VerificationLog**
- Relationship Type: One-to-Many
- Cardinality: 1:N
- Participation: Certificate (Partial), VerificationLog (Total)
- Description: Each certificate can have zero or more verification attempts logged. Each verification log entry must reference exactly one certificate.

**Certificate ↔ BlockchainRecord**
- Relationship Type: One-to-One
- Cardinality: 1:1
- Participation: Certificate (Partial), BlockchainRecord (Total)
- Description: Each certificate may have one corresponding blockchain record. Each blockchain record corresponds to exactly one certificate.

### 5.4.3 Attribute Specifications

**Derived Attributes:**
- `activeOnChain` - Derived from count of certificates where isRevoked = false
- `revokedCount` - Derived from count of certificates where isRevoked = true
- `recentVerifications` - Derived from count of verification logs within time period

**Composite Attributes:**
- `duration` - Composed of durationFrom and durationTo
- `position` - Composed of qrPosition, logoPosition, signaturePosition

**Multi-valued Attributes:**
- None (normalized design)

### 5.4.4 Constraints

**Domain Constraints:**
- certificateId must match pattern: CERT-[A-Z0-9]{5,6}-[A-Z0-9]{5,6}
- issueDate, expiryDate, durationFrom, durationTo must be valid dates in YYYY-MM-DD format
- template must be one of: academic, corporate, premium, minimal
- result must be one of: verified, tampered, revoked, not_found
- hash must be 64-character hexadecimal string
- txHash must be 66-character string starting with 0x

**Key Constraints:**
- certificateId must be unique across all certificates
- id must be unique within each entity

**Referential Integrity Constraints:**
- VerificationLog.certificateId must reference existing Certificate.certificateId
- Deletion of Certificate should cascade to related VerificationLog entries

**Entity Integrity Constraints:**
- All primary keys must be non-null and unique
- Required attributes must have non-null values

---

**End of Chapter 5**

Say `Continue with Chapter 6` to proceed.
