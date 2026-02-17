# Contributing to CertiChain

Thank you for your interest in contributing to CertiChain! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional. We're all here to build something great together.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports:
1. Check existing issues
2. Verify it's reproducible
3. Test on latest version

When reporting bugs, include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)
- Console errors

### Suggesting Features

Feature requests are welcome! Include:
- Clear description of the feature
- Use case and benefits
- Potential implementation approach
- Examples from other apps (if applicable)

### Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Firebase account
- MetaMask (for blockchain features)

### Setup Steps

1. **Clone your fork**
```bash
git clone https://github.com/your-username/certichain.git
cd certichain
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
# Fill in your Firebase and blockchain credentials
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

## Project Structure

```
certichain/
├── app/              # Next.js pages (App Router)
├── components/       # React components
├── lib/             # Utility functions
├── store/           # State management
├── types/           # TypeScript types
├── contracts/       # Smart contracts
└── public/          # Static assets
```

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type
- Use type inference when possible

```typescript
// Good
interface Certificate {
  id: string;
  recipientName: string;
}

// Bad
const cert: any = { ... };
```

### React Components

- Use functional components
- Use hooks for state/effects
- Keep components focused and small
- Extract reusable logic to custom hooks

```typescript
// Good
export function CertificateCard({ certificate }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  // ...
}

// Bad
export default function Component(props: any) {
  // 500 lines of code
}
```

### Naming Conventions

- **Components**: PascalCase (`CertificateCard.tsx`)
- **Utilities**: camelCase (`generateHash.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types**: PascalCase (`Certificate`, `VerificationResult`)

### File Organization

- One component per file
- Co-locate related files
- Use index files for exports
- Keep files under 300 lines

### Styling

- Use Tailwind CSS classes
- Follow mobile-first approach
- Use consistent spacing (4, 8, 16, 24, 32)
- Maintain dark theme consistency

```tsx
// Good
<div className="p-4 md:p-6 lg:p-8 bg-gray-900 rounded-lg">

// Bad
<div style={{ padding: '15px', background: '#1a1a1a' }}>
```

### State Management

- Use Zustand for global state
- Use local state for component-specific state
- Keep state minimal and normalized
- Avoid prop drilling

```typescript
// Good - Zustand store
export const useCertificateStore = create<Store>((set) => ({
  certificates: [],
  addCertificate: (cert) => set((state) => ({
    certificates: [...state.certificates, cert]
  }))
}));

// Bad - Prop drilling
<Parent>
  <Child1 data={data}>
    <Child2 data={data}>
      <Child3 data={data} />
    </Child2>
  </Child1>
</Parent>
```

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Tests

Examples:
- `feature/batch-certificate-issuance`
- `fix/qr-scanner-camera-permission`
- `docs/update-deployment-guide`

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(certificates): add batch issuance feature

fix(verification): handle blockchain timeout gracefully

docs(readme): update setup instructions

refactor(pdf): extract template logic to separate file
```

### Pull Request Process

1. **Create feature branch**
```bash
git checkout -b feature/your-feature
```

2. **Make changes**
- Write clean code
- Follow coding standards
- Add comments where needed
- Update documentation

3. **Test thoroughly**
- Manual testing
- Check console for errors
- Test on mobile
- Test edge cases

4. **Commit changes**
```bash
git add .
git commit -m "feat: add your feature"
```

5. **Push to fork**
```bash
git push origin feature/your-feature
```

6. **Create pull request**
- Clear title and description
- Reference related issues
- Add screenshots if UI changes
- Request review

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] No console errors
- [ ] All features work

## Screenshots
(if applicable)

## Related Issues
Fixes #123
```

## Testing Guidelines

### Manual Testing

Before submitting PR:
- [ ] Test all affected features
- [ ] Test on desktop and mobile
- [ ] Check console for errors
- [ ] Verify no regressions
- [ ] Test edge cases

### Writing Tests (Recommended)

```typescript
// Example unit test
describe('generateCertificateHash', () => {
  it('should generate consistent hash', async () => {
    const data = {
      certificateId: 'CERT-123',
      recipientName: 'John Doe',
      // ...
    };
    
    const hash1 = await generateCertificateHash(data);
    const hash2 = await generateCertificateHash(data);
    
    expect(hash1).toBe(hash2);
  });
});
```

## Documentation

### Code Comments

- Comment complex logic
- Explain "why" not "what"
- Keep comments up to date
- Use JSDoc for functions

```typescript
/**
 * Generates a SHA256 hash for certificate verification
 * @param data - Certificate data to hash
 * @returns Promise resolving to hex string hash
 */
export async function generateCertificateHash(
  data: CertificateData
): Promise<string> {
  // Implementation
}
```

### README Updates

Update README.md when:
- Adding new features
- Changing setup process
- Modifying dependencies
- Updating requirements

### Documentation Files

Update relevant docs:
- `QUICKSTART.md` - Setup changes
- `DEPLOYMENT.md` - Deployment changes
- `FEATURES.md` - New features
- `ARCHITECTURE.md` - Architecture changes
- `FAQ.md` - Common questions

## Component Guidelines

### Creating New Components

1. **Create component file**
```typescript
// components/certificate/certificate-badge.tsx
'use client';

import { motion } from 'framer-motion';

interface CertificateBadgeProps {
  status: 'active' | 'revoked';
}

export function CertificateBadge({ status }: CertificateBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`px-2 py-1 rounded-full text-xs ${
        status === 'active' 
          ? 'bg-green-500/20 text-green-400'
          : 'bg-red-500/20 text-red-400'
      }`}
    >
      {status}
    </motion.span>
  );
}
```

2. **Add to index** (if applicable)
```typescript
// components/certificate/index.ts
export { CertificateBadge } from './certificate-badge';
export { CertificateCard } from './certificate-card';
```

3. **Document usage**
```typescript
/**
 * Badge component for certificate status
 * 
 * @example
 * <CertificateBadge status="active" />
 */
```

### Component Checklist

- [ ] TypeScript types defined
- [ ] Props interface documented
- [ ] Responsive design
- [ ] Accessibility considered
- [ ] Error states handled
- [ ] Loading states included
- [ ] Animations smooth
- [ ] Reusable and focused

## Smart Contract Changes

### Modifying Contracts

1. **Update Solidity file**
```solidity
// contracts/CertificateRegistry.sol
```

2. **Test locally**
```bash
npx hardhat test
```

3. **Deploy to testnet**
```bash
npx hardhat run scripts/deploy.js --network amoy
```

4. **Update ABI**
```typescript
// lib/blockchain.ts
const CONTRACT_ABI = [
  // Updated ABI
];
```

5. **Document changes**
- Update README
- Note breaking changes
- Provide migration guide

### Contract Testing

```javascript
// test/CertificateRegistry.test.js
describe("CertificateRegistry", function () {
  it("Should issue certificate", async function () {
    const [owner] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("CertificateRegistry");
    const registry = await Registry.deploy();
    
    await registry.issueCertificate("CERT-123", "0x...");
    
    const [hash, isValid] = await registry.verifyCertificate("CERT-123");
    expect(isValid).to.be.true;
  });
});
```

## Performance Considerations

### Optimization Checklist

- [ ] Images optimized (WebP, compressed)
- [ ] Code split appropriately
- [ ] Lazy load components
- [ ] Minimize bundle size
- [ ] Use React.memo for expensive components
- [ ] Debounce/throttle event handlers
- [ ] Optimize database queries
- [ ] Cache when appropriate

### Performance Testing

```bash
# Run Lighthouse
npm run lighthouse

# Check bundle size
npm run analyze
```

## Accessibility

### Accessibility Checklist

- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Alt text for images
- [ ] Form labels associated
- [ ] Error messages clear

### Testing Accessibility

- Use keyboard only
- Test with screen reader
- Check color contrast
- Verify focus order
- Test with zoom

## Security

### Security Checklist

- [ ] Input validation
- [ ] XSS prevention
- [ ] Environment variables secure
- [ ] No sensitive data in client
- [ ] Firebase rules updated
- [ ] Smart contract audited
- [ ] Dependencies updated

### Security Review

Before merging:
1. Review for vulnerabilities
2. Check dependencies
3. Verify input validation
4. Test error handling
5. Review Firebase rules

## Release Process

### Version Numbering

Follow Semantic Versioning (SemVer):
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

Example: `1.2.3`

### Creating a Release

1. **Update version**
```bash
npm version minor
```

2. **Update CHANGELOG**
```markdown
## [1.2.0] - 2024-01-15

### Added
- Batch certificate issuance
- Email notifications

### Fixed
- QR scanner camera permissions
- Mobile layout issues

### Changed
- Updated dependencies
```

3. **Create release**
```bash
git tag v1.2.0
git push origin v1.2.0
```

4. **Deploy to production**
```bash
npm run deploy
```

## Getting Help

### Resources

- **Documentation**: Check all .md files
- **Issues**: Search existing issues
- **Discussions**: Ask questions
- **Code**: Read existing code

### Contact

- GitHub Issues: Bug reports, features
- GitHub Discussions: Questions, ideas
- Email: For private matters

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make CertiChain better for everyone. Thank you for taking the time to contribute!

---

**Questions?** Open an issue or discussion on GitHub.
