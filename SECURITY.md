# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in this project, please report it by creating a private security advisory on GitHub or by contacting the repository maintainer directly.

**Please do not report security vulnerabilities through public GitHub issues.**

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Security Best Practices

### Firebase Configuration

1. **API Key Exposure**

   - The Firebase API key in `environment.ts` is safe to be public
   - Firebase API keys are not secret and are meant to identify your Firebase project
   - Security is enforced through Firebase Security Rules, not API key secrecy

2. **Required Firebase Security Configurations**

   **Authentication Settings:**

   - ✅ Enable only necessary sign-in providers (Google recommended)
   - ✅ Configure authorized domains in Firebase Console
   - ✅ Remove unauthorized domains from the allowlist
   - ✅ Consider enabling Email Enumeration Protection

   **Firestore Security Rules:**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }

       // Analytics data requires authentication
       match /analytics/{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

   **Firebase App Check (Recommended for Production):**

   - Enable App Check to protect against abuse
   - Configure reCAPTCHA v3 for web apps
   - Monitor and analyze App Check metrics

3. **Data Protection**
   - User data is partitioned by UID
   - Only authenticated users can access the system
   - Each user can only access their own documents
   - No public read/write access to Firestore

### Production Deployment Checklist

Before deploying to production:

- [ ] Verify Firestore security rules are correctly configured
- [ ] Enable Firebase App Check
- [ ] Configure authorized domains for your production URL
- [ ] Review Firebase Authentication settings
- [ ] Enable Firestore backups
- [ ] Set up monitoring and alerts
- [ ] Review and update CORS settings if using custom domains
- [ ] Test authentication flow in production environment
- [ ] Verify that environment variables are correctly set
- [ ] Enable security headers in hosting configuration

### Development Best Practices

1. **Never commit:**

   - Real user data or credentials
   - Service account keys
   - Private API keys or secrets
   - `.env` files with sensitive data

2. **Always use:**

   - Environment variables for configuration
   - The provided `environment.example.ts` template
   - Secure authentication methods
   - HTTPS in production

3. **Code Security:**
   - Keep dependencies updated
   - Use `npm audit` regularly to check for vulnerabilities
   - Follow Angular security best practices
   - Sanitize user inputs
   - Use Content Security Policy (CSP) headers

## Known Security Considerations

### Client-Side Security

This is a frontend application, which means:

- All code is visible to users
- Firebase configuration is intentionally public
- Security relies on Firebase backend rules
- No sensitive logic should be client-side only

### Data Storage

- **Local Storage**: Used for caching and offline functionality

  - Contains user preferences and calendar modifications
  - Stored unencrypted (browser standard)
  - Cleared on sign-out

- **Firestore**: Primary data storage
  - Protected by security rules
  - Encrypted in transit and at rest
  - Partitioned per user

## Regular Security Tasks

We recommend:

- Monthly dependency updates
- Quarterly security rule reviews
- Regular Firebase security settings audits
- Monitoring Firebase usage for anomalies

## Resources

- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [Angular Security Guide](https://angular.dev/best-practices/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
