# CertiChain Testing Guide

## Manual Testing Checklist

### Setup Verification

- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created with all variables
- [ ] Firebase project created and configured
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] No console errors on page load

### Dashboard Testing (`/admin`)

#### Initial State (No Certificates)
- [ ] Empty state displays with illustration
- [ ] "Create Your First Certificate" button visible
- [ ] Button navigates to `/admin/create`
- [ ] All stat cards show 0
- [ ] No console errors

#### With Certificates
- [ ] Stats show real counts from Firestore
- [ ] Numbers animate on load
- [ ] Recent certificates list displays (max 5)
- [ ] Certificate cards show correct data
- [ ] Status badges display correctly (Active/Revoked)
- [ ] Dates format correctly

### Certificate Creation (`/admin/create`)

#### Form Validation
- [ ] Empty recipient name shows error
- [ ] Empty course name shows error
- [ ] Empty issuer name shows error
- [ ] Date field defaults to today
- [ ] Template selector works (3 options)

#### Live Preview
- [ ] Preview updates as you type
- [ ] Recipient name appears in preview
- [ ] Course name appears in preview
- [ ] Date appears in preview
- [ ] Issuer name appears in preview
- [ ] Preview maintains A4 aspect ratio

#### Image Upload
- [ ] Logo upload button works
- [ ] Logo preview displays after upload
- [ ] Signature upload button works
- [ ] Signature preview displays after upload
- [ ] Images appear in certificate preview

#### Issuance Flow
- [ ] "Issue Certificate" button submits form
- [ ] Progress modal appears
- [ ] 5 steps animate in sequence:
  1. Generating Hash
  2. Uploading Assets
  3. Saving to Database
  4. Blockchain Transaction
  5. Confirmed
- [ ] Each step shows loading spinner
- [ ] Completed steps show checkmark
- [ ] Success screen appears after completion

#### Success State
- [ ] Success icon animates in
- [ ] Certificate ID displays
- [ ] "Download PDF" button works
- [ ] PDF downloads with correct filename
- [ ] "Create Another" resets form
- [ ] "View All Certificates" navigates to `/admin/issued`

### Certificate Management (`/admin/issued`)

#### Desktop View (>1024px)
- [ ] Data table displays
- [ ] Columns: Recipient, Course, Issue Date, Status, Actions
- [ ] All certificates load from Firestore
- [ ] Rows animate in with stagger effect
- [ ] Hover effect on rows

#### Mobile View (<768px)
- [ ] Card layout displays instead of table
- [ ] Each card shows all certificate info
- [ ] Cards are touch-friendly (44px+ height)
- [ ] Actions buttons are accessible

#### Search Functionality
- [ ] Search input visible
- [ ] Search by recipient name works
- [ ] Search by course name works
- [ ] Search by certificate ID works
- [ ] Results update in real-time
- [ ] No results shows appropriate message

#### Actions
- [ ] Download button generates PDF
- [ ] PDF includes QR code
- [ ] PDF has correct certificate data
- [ ] Revoke button shows confirmation
- [ ] Revoke updates status in UI
- [ ] Revoke updates Firestore
- [ ] Revoked certificates show red badge
- [ ] Revoke button hidden for revoked certs

### Public Verification (`/verify`)

#### Landing Page
- [ ] Shield icon displays
- [ ] Title and description visible
- [ ] Certificate ID input field works
- [ ] "Verify" button enabled when ID entered
- [ ] Enter key triggers verification
- [ ] "Scan QR Code" button visible

#### QR Scanner
- [ ] Scanner button opens camera view
- [ ] Camera permission requested
- [ ] Camera feed displays
- [ ] Scan overlay animates
- [ ] Close button works
- [ ] Permission denied shows error message
- [ ] Error message is user-friendly

#### Manual Verification
- [ ] Enter valid certificate ID
- [ ] Click "Verify" button
- [ ] Loading state displays
- [ ] "Verifying certificate..." message shows
- [ ] "Checking blockchain records" message shows

### Verification Results (`/verify/[id]`)

#### Verified Certificate
- [ ] Green checkmark icon displays
- [ ] "Certificate Verified" title
- [ ] Success message displays
- [ ] Certificate details show:
  - Recipient name
  - Course name
  - Issue date
  - Issuer name
  - Certificate ID
  - Blockchain transaction link
- [ ] Transaction link opens Polygonscan
- [ ] Result animates in smoothly

#### Tampered Certificate
- [ ] Red X icon displays
- [ ] "Certificate Tampered" title
- [ ] Warning message displays
- [ ] No certificate details shown

#### Revoked Certificate
- [ ] Red X icon displays
- [ ] "Certificate Revoked" title
- [ ] Revocation message displays
- [ ] Certificate details may show

#### Not Found
- [ ] Gray icon displays
- [ ] "Certificate Not Found" title
- [ ] Not found message displays
- [ ] No certificate details shown

#### Back Navigation
- [ ] "Back to Verify" button visible
- [ ] Button navigates to `/verify`
- [ ] Navigation works smoothly

### Mobile Responsiveness

#### Sidebar/Navigation
- [ ] Desktop (>1024px): Sidebar visible on left
- [ ] Mobile (<1024px): Sidebar hidden
- [ ] Mobile: Top header with hamburger menu
- [ ] Mobile: Menu opens on hamburger click
- [ ] Mobile: Menu closes on link click
- [ ] Mobile: Menu closes on overlay click
- [ ] Mobile: Menu animates smoothly

#### Touch Interactions
- [ ] All buttons are 44px+ height
- [ ] Tap feedback on buttons
- [ ] Swipe gestures work naturally
- [ ] No accidental clicks
- [ ] Form inputs are easy to tap

#### Layout Adaptation
- [ ] Forms stack vertically on mobile
- [ ] Tables become cards on mobile
- [ ] Images scale appropriately
- [ ] Text remains readable
- [ ] No horizontal scrolling

### Animations

#### Page Transitions
- [ ] Pages fade in on load
- [ ] Smooth transitions between routes
- [ ] No jarring movements

#### Component Animations
- [ ] Stat cards animate in with stagger
- [ ] Numbers count up smoothly
- [ ] Certificate cards hover effect
- [ ] Button tap feedback
- [ ] Progress steps animate
- [ ] Success icon scales in
- [ ] Verification result reveals

#### Loading States
- [ ] Skeleton loaders display
- [ ] Spinners rotate smoothly
- [ ] Loading messages display
- [ ] No layout shift

### Performance

#### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Navigation feels instant
- [ ] Images load progressively
- [ ] No blocking operations

#### Interactions
- [ ] Form inputs respond immediately
- [ ] Search results update quickly
- [ ] Button clicks feel responsive
- [ ] Animations are smooth (60fps)

### Browser Testing

#### Chrome
- [ ] All features work
- [ ] Animations smooth
- [ ] Camera access works
- [ ] No console errors

#### Firefox
- [ ] All features work
- [ ] Animations smooth
- [ ] Camera access works
- [ ] No console errors

#### Safari
- [ ] All features work
- [ ] Animations smooth
- [ ] Camera access works
- [ ] No console errors

#### Edge
- [ ] All features work
- [ ] Animations smooth
- [ ] Camera access works
- [ ] No console errors

### Mobile Browsers

#### iOS Safari
- [ ] Layout correct
- [ ] Touch interactions work
- [ ] Camera access works
- [ ] No viewport issues

#### Chrome Mobile
- [ ] Layout correct
- [ ] Touch interactions work
- [ ] Camera access works
- [ ] No viewport issues

### Blockchain Integration (If Deployed)

#### MetaMask Connection
- [ ] MetaMask prompt appears
- [ ] Account connection works
- [ ] Network switch prompt (if needed)
- [ ] Transaction signing works

#### Contract Interaction
- [ ] Certificate issuance creates transaction
- [ ] Transaction confirmation received
- [ ] Transaction hash saved to Firestore
- [ ] Gas estimation reasonable
- [ ] Transaction link works

#### Verification
- [ ] Blockchain verification works
- [ ] Hash comparison accurate
- [ ] Revocation status correct
- [ ] Fallback to database if blockchain fails

### Error Handling

#### Network Errors
- [ ] Offline message displays
- [ ] Retry mechanism works
- [ ] User-friendly error messages

#### Firebase Errors
- [ ] Connection errors handled
- [ ] Permission errors handled
- [ ] Quota errors handled
- [ ] Error messages are clear

#### Blockchain Errors
- [ ] MetaMask not installed handled
- [ ] Transaction rejection handled
- [ ] Network errors handled
- [ ] Fallback to database works

#### Form Errors
- [ ] Validation errors display inline
- [ ] Error messages are helpful
- [ ] Errors clear on correction
- [ ] Submit disabled when invalid

### Accessibility

#### Keyboard Navigation
- [ ] Tab order is logical
- [ ] All interactive elements focusable
- [ ] Focus indicators visible
- [ ] Enter key submits forms
- [ ] Escape closes modals

#### Screen Reader
- [ ] Page titles announced
- [ ] Form labels associated
- [ ] Error messages announced
- [ ] Status changes announced
- [ ] Images have alt text

#### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Links distinguishable
- [ ] Status colors clear
- [ ] Focus indicators visible

### Security

#### Input Validation
- [ ] XSS attempts blocked
- [ ] SQL injection not applicable
- [ ] File upload restrictions work
- [ ] Form validation prevents bad data

#### Environment Variables
- [ ] API keys not exposed in client
- [ ] Private keys not in repository
- [ ] .env.local in .gitignore
- [ ] .env.example provided

## Automated Testing (Recommended)

### Unit Tests
```bash
# Test utility functions
npm run test:unit

# Tests to write:
- generateCertificateHash()
- generateCertificateId()
- PDF generation
- Hash verification
```

### Integration Tests
```bash
# Test component interactions
npm run test:integration

# Tests to write:
- Form submission flow
- Certificate creation
- Verification flow
- Search functionality
```

### E2E Tests
```bash
# Test complete user flows
npm run test:e2e

# Tests to write:
- Complete issuance flow
- Complete verification flow
- Mobile navigation
- Error scenarios
```

## Performance Testing

### Lighthouse Audit
```bash
# Run Lighthouse
npm run lighthouse

# Target scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90
```

### Load Testing
- Test with 100+ certificates
- Test concurrent verifications
- Test image upload limits
- Test search performance

## Bug Reporting Template

When reporting bugs, include:

```
**Description**: Clear description of the issue

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. See error

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Screenshots**: If applicable

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Screen size: 1920x1080
- Mobile: Yes/No

**Console Errors**: Any errors in console

**Additional Context**: Any other relevant info
```

## Test Data

### Sample Certificates
```
Certificate 1:
- Recipient: Alice Johnson
- Course: Blockchain Fundamentals
- Issuer: Tech Academy
- Date: 2024-01-15

Certificate 2:
- Recipient: Bob Smith
- Course: Smart Contract Development
- Issuer: Crypto Institute
- Date: 2024-02-20

Certificate 3:
- Recipient: Carol Williams
- Course: Web3 Security
- Issuer: Security School
- Date: 2024-03-10
```

### Test Certificate IDs
- Valid: CERT-XXXXX-YYYYY (from your database)
- Invalid: CERT-00000-00000
- Malformed: invalid-id-format

## Continuous Testing

### Before Each Commit
- [ ] Run linter
- [ ] Check TypeScript errors
- [ ] Test changed features
- [ ] Check console for errors

### Before Each Deploy
- [ ] Run full test suite
- [ ] Test on staging environment
- [ ] Verify environment variables
- [ ] Check Firebase rules
- [ ] Test blockchain integration

### After Each Deploy
- [ ] Smoke test critical paths
- [ ] Check error monitoring
- [ ] Verify analytics
- [ ] Monitor performance

## Known Issues / Limitations

Document any known issues:
- QR scanner requires HTTPS in production
- Camera access requires user permission
- Blockchain requires MetaMask
- Large images may slow upload
- Free tier limits apply

## Testing Checklist Summary

Quick checklist for release:
- [ ] All manual tests pass
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Animations smooth
- [ ] Forms validate
- [ ] PDFs generate
- [ ] Verification works
- [ ] Blockchain integration works
- [ ] Error handling works
- [ ] Documentation updated
