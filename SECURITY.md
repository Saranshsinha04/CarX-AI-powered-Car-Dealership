# Security Principles & Hardening Guide

Security is treated as a first-class feature across the Northstar Motors platform.

---

## 1. Zero Trust Database Access
- **No Direct SQL Execution**: The AI is never provided direct SQL credentials or arbitrary query execution capabilities.
- **Parameterized Queries**: All queries pass through Prisma ORM, utilizing parameterized statements to eliminate SQL injection vulnerabilities.
- **Strict Role-Based Scoping**: Staff queries and admin operations enforce server-side role validation (`SUPER_ADMIN`, `DEALERSHIP_ADMIN`, `SALES_MANAGER`, `SALES_AGENT`). Frontend role checks are never trusted alone.
- **Multi-Tenant Boundary Enforcement**: Queries are automatically filtered by `dealership_id`. A tenant cannot access or mutate another dealership's records.

---

## 2. Authentication & Session Security
- **Bcrypt Password Hashing**: Passwords are encrypted with `bcryptjs` using a minimum cost factor of 10.
- **HTTP-Only Cookies**: JWT session tokens are stored in `httpOnly`, `sameSite: "lax"`, and `secure` cookies (in production), preventing client-side JavaScript access and XSS token theft.
- **Server-Side Session Verification**: `getSessionUser()` validates JWT signatures server-side on every protected API route and server action.

---

## 3. Rate Limiting & Cost Control
- Sliding-window rate limiter protects:
  - `/api/auth/login` (10 attempts / min / IP)
  - `/api/ai/chat` (25 requests / min / IP)
  - `/api/leads` (15 submissions / min / IP)
  - `/api/appointments` (10 bookings / min / IP)
- AI token limits: Max 600 completion tokens per conversation turn to prevent runaway API billing and denial-of-wallet attacks.

---

## 4. HTTP Security Headers
Configured in `next.config.mjs`:
- `Strict-Transport-Security`: Enforces HTTPS for 2 years with subdomains and preload.
- `X-Frame-Options`: `SAMEORIGIN` to prevent clickjacking attacks.
- `X-Content-Type-Options`: `nosniff` prevents MIME-type sniffing.
- `X-XSS-Protection`: `1; mode=block` enables browser XSS filtering.
- `Referrer-Policy`: `origin-when-cross-origin` shields private query strings from external domains.

---

## 5. Input Validation
Every API endpoint validates incoming JSON payloads using **Zod** schemas (`createLeadSchema`, `financeApplicationSchema`, `tradeInEstimateSchema`, `chatRequestSchema`). Malformed or out-of-spec requests are rejected with structured 400 errors.
