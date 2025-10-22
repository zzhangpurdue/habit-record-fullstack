# Security Guidelines for habit-record-fullstack

This document provides security best practices tailored to the `habit-record-fullstack` repository—a Next.js (App Router) full-stack starter kit for a habit-tracking application. It covers principles and actionable recommendations, from authentication and data protection to deployment and dependency management.

---

## 1. Authentication & Access Control

- **Strong Password Policies**  
  • Enforce minimum length (≥ 12 characters).  
  • Require mixed-case letters, numbers, and symbols.  
  • Implement rate limiting and exponential backoff on login attempts to prevent brute-force attacks.

- **Session Management**  
  • Use secure, HttpOnly, `SameSite=Strict` cookies for sessions.  
  • Enforce both idle (e.g., 30 minutes) and absolute (e.g., 24 hours) timeouts.  
  • Rotate session identifiers after privilege changes (e.g., password reset) to prevent fixation.

- **Better Auth Configuration**  
  • Verify that default JWT signing algorithms are secure (e.g., `HS256` or `RS256`).  
  • Store private keys or secrets in a secrets manager; do not check them into source control.  
  • Validate JWT `exp`, `iat`, and `aud` claims server-side on every request.

- **Role-Based Access Control (RBAC)**  
  • Define roles (`user`, `admin`, etc.) and embed role claims in JWTs.  
  • Enforce server-side permission checks for all habit CRUD operations.  
  • Implement an allow-list for sensitive endpoints where only specific roles may access.

- **Multi-Factor Authentication (MFA)** *(Future Enhancement)*  
  • Consider adding TOTP or SMS-based MFA for high-risk actions (e.g., changing account email).

---

## 2. Input Validation & Output Encoding

- **Server-Side Validation**  
  • Use a schema validation library (e.g., Zod) in API routes and Server Actions.  
  • Validate request bodies, query parameters, and headers before processing.

- **Prevent Injection Attacks**  
  • Always use Drizzle ORM’s parameterized queries for database operations.  
  • Never interpolate user input directly into SQL or filesystem paths.  
  • Sanitize any dynamic values injected into templates.

- **Cross-Site Scripting (XSS) Mitigation**  
  • Context-aware encode all user-supplied data rendered in React (React escapes by default).  
  • Implement a strict Content Security Policy (CSP) via a Next.js custom `headers()` function:
    ```js
    // next.config.js
    async headers() {
      return [{
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" }
        ]
      }]
    }
    ```

- **CSRF Protection**  
  • Use an anti-CSRF token for all state-changing requests if you expose cookie-based sessions on the API.  
  • Alternatively, prefer stateless CSRF-safe mechanisms (e.g., double submit cookie pattern or same-site cookies).

- **Safe Redirects**  
  • Validate any redirection target against an allow-list of whitelisted paths or domains.  
  • Reject or normalize untrusted `returnTo` parameters.

---

## 3. Data Protection & Privacy

- **Encryption in Transit**  
  • Enforce HTTPS for all client–server and service–service communication.  
  • Enable HSTS (`Strict-Transport-Security` header) with a suitably long max-age.

- **Encryption at Rest**  
  • Rely on database-level encryption features (e.g., PostgreSQL Transparent Data Encryption).  
  • For additional sensitive fields, use AES-256 encryption within the application.

- **Secure Secret Management**  
  • Store database credentials, JWT secrets, and API keys in environment variables or a secrets manager (e.g., AWS Secrets Manager, Azure Key Vault).  
  • Load secrets at runtime; do not commit them to Git.  
  • Use Docker Compose’s `.env` file only for development; ensure it is in `.gitignore`.

- **PII Handling**  
  • Minimize collection of PII—store only what is strictly required.  
  • Mask or redact PII in logs and error messages.  
  • Implement data retention policies (e.g., auto-delete accounts after inactivity or upon user request).

- **Error Handling & Logging**  
  • In production, return generic error messages (e.g., “An unexpected error occurred”).  
  • Log detailed errors securely (e.g., in a centralized logging service) without leaking stack traces to clients.

---

## 4. API & Service Security

- **HTTPS Enforcement**  
  • Redirect HTTP to HTTPS at the edge (e.g., Vercel, Nginx).  
  • Disable insecure TLS versions (TLS 1.0/1.1).

- **Rate Limiting & Throttling**  
  • Use a rate-limiting library (e.g., `express-rate-limit`, `next-rate-limit`) on critical endpoints (login, habit logging).  
  • Lock out or slow down IPs after repeated failures.

- **CORS Hardening**  
  • Restrict `Access-Control-Allow-Origin` to explicit domains (your frontend).  
  • Avoid using wildcard (`*`) origins for credentials-enabled requests.

- **API Versioning**  
  • Prefix API routes with a version segment (`/api/v1/habits`).  
  • Maintain backward compatibility; deprecate old versions gracefully.

- **Principle of Least Privilege**  
  • Database user for the application should only have `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on the `users`, `habits`, and `completions` tables—nothing more.  
  • If using separate services (e.g., mailer), create distinct service accounts with scoped permissions.

---

## 5. Frontend Security Hygiene

- **Secure Cookies**  
  • Set `Secure`, `HttpOnly`, and `SameSite=Strict` on all authentication cookies.  
  • Avoid storing sensitive tokens in `localStorage` or `sessionStorage`.

- **Subresource Integrity (SRI)**  
  • If including third-party scripts or styles via CDN, supply an SRI `integrity` hash to guard against tampering.

- **Clickjacking Protection**  
  • Set `X-Frame-Options: DENY` or a strict CSP `frame-ancestors 'none'` to prevent framing.

- **Accessibility & ARIA Considerations**  
  • Ensure focus trapping in modal dialogs (Habit creation, deletion confirmation).  
  • Provide meaningful `aria-*` attributes—security notices should be screen-reader friendly.

---

## 6. Infrastructure & Deployment Security

- **Container Hardening**  
  • Use minimal base images (e.g., `node:18-alpine`).  
  • Drop unnecessary Linux capabilities and run the Node.js process as a non-root user.

- **Docker Compose & Secrets**  
  • Mount secrets via Docker secrets (in production) instead of environment variables.  
  • Avoid building credentials into images.

- **CI/CD Pipeline**  
  • Integrate security linting and SAST tools (e.g., ESLint security rules, `npm audit`).  
  • Run automated tests (unit, integration, E2E) on every pull request.  
  • Sign and verify production artifacts before deployment.

- **Cloud & Vercel**  
  • Enforce branch protection rules; require code reviews.  
  • Store production environment variables in Vercel’s encrypted environment settings.  
  • Enable Vercel’s Function Logging only for monitoring, not as a debug trace in responses.

- **Monitoring & Incident Response**  
  • Deploy application performance monitoring (APM) and error-tracking (e.g., Sentry).  
  • Set up alerts for anomalous behavior (e.g., spikes in failed logins).  
  • Prepare an incident response plan; maintain on-call rotations.

---

## 7. Dependency Management

- **Lockfiles & Deterministic Builds**  
  • Commit `package-lock.json` (or `yarn.lock`) to ensure reproducible installs.  
  • Pin critical dependencies where necessary.

- **Vulnerability Scanning**  
  • Integrate SCA tools (e.g., Dependabot, Snyk) to detect CVEs in direct and transitive dependencies.  
  • Review and patch vulnerable packages promptly.

- **Minimize Attack Surface**  
  • Remove unused dependencies (e.g., test frameworks not needed at runtime).  
  • Audit custom components and scripts for unnecessary privileges.

---

## 8. Testing & Validation

- **Security-Focused Tests**  
  • Write unit tests for authentication logic, including edge cases (expired tokens, invalid claims).  
  • Create integration tests to verify that one user cannot retrieve or modify another user’s habits.

- **Penetration Testing & Audit**  
  • Conduct periodic internal or third-party penetration tests.  
  • Address findings as part of sprint planning; track remediation tickets to closure.

- **Static Analysis & Linting**  
  • Apply TypeScript’s `strict` mode and ESLint security plugins.  
  • Enforce code style and catch common mistakes at commit time.

---

## 9. Developer Responsibilities

- **Secure Defaults**  
  • New routes/components must assume untrusted input.  
  • Always opt into secure headers and configuration flags.

- **Continuous Learning**  
  • Stay updated on Next.js security advisories and Drizzle ORM best practices.  
  • Share findings in team knowledge sessions; update this document as needed.

- **Code Reviews**  
  • Pay special attention to authentication, authorization, and data-access code paths.  
  • Verify that secrets are not accidentally exposed in diffs.

---

By following these guidelines, the `habit-record-fullstack` project will be better protected against common web application threats and vulnerabilities, ensuring a secure and trustworthy habit-tracking experience for end users. Stay vigilant and iterate on your security practices as the codebase and threat landscape evolve.