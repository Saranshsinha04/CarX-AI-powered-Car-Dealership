# Northstar Motors — AI-Powered Production Car Dealership Platform

A complete, production-ready, white-label automotive dealership platform built with **Next.js (App Router)**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, and an authorized **AI Tool Architecture**.

Designed for real-world automotive dealerships, demonstrated with **Northstar Motors** ("Drive what moves you.", Dehradun, Uttarakhand).

---

## 🌟 Key Capabilities

1. **Production-Ready & Fully Functional**
   - No mock buttons, no "coming soon" placeholders, no hardcoded component arrays.
   - Every filter, search, test drive, financing calculation, trade-in valuation, and CRM pipeline stage connects to real backend logic and PostgreSQL tables.

2. **Single Source of Truth: PostgreSQL**
   - Strictly PostgreSQL as the sole database (no SQLite, MongoDB, Firebase, or external vector DBs).
   - Multi-tenant architecture: every inventory item, lead, appointment, conversation, and analytics event is scoped to `dealership_id`.

3. **Authorized Backend AI Orchestrator (No Raw SQL to LLM)**
   - User queries flow through safety sanitizers and authorized backend tools (`searchInventory`, `getVehicle`, `calculateEMI`, `createLead`, `createAppointment`, etc.).
   - Distinguishes strictly between database facts and AI synthesis to eliminate hallucination.
   - Built-in prompt injection defense shields system prompts and DB credentials.

4. **Deterministic Loan & Financing Engine**
   - Standard reducing-balance mathematical formula: $E = P \cdot r \cdot \frac{(1+r)^n}{(1+r)^n - 1}$.
   - Instant calculation of monthly EMI, principal loan, interest payable, and amortization schedules.

5. **Algorithmic Used Car Trade-In Valuation**
   - Real-time valuation estimating realistic market range based on Indian automotive depreciation curves, age, mileage, owner count, and accident history.

6. **Full CRM Lead Pipeline & Dealership Admin Dashboard**
   - Kanban board with 7 deal stages: `New`, `Contacted`, `Qualified`, `Test Drive`, `Negotiation`, `Won`, `Lost`.
   - Lead notes thread, AI-generated summary, intent scoring (1–100), and test drive scheduling.
   - Employee AI Copilot for sales managers: natural language queries against real PostgreSQL metrics.

7. **White-Label Architecture**
   - Complete customizability of showroom name, logo, hero banner, primary colors, address, telephone, WhatsApp desk, operating hours, and SEO metadata via database settings (`DealershipSettings`).

8. **SEO & Local GEO Optimization**
   - Tailored LocalBusiness / AutoDealer JSON-LD schema with Dehradun GPS coordinates (Rajpur Road).
   - Vehicle-specific schema on individual vehicle pages (`/inventory/[id]`).
   - Dynamic `sitemap.xml` and `robots.txt`.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+ or v20+)
- PostgreSQL (Local PostgreSQL, Supabase, or Neon)

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd "Car Delarship"

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cardealership?schema=public"
NEXTAUTH_SECRET="your-secure-jwt-secret-key-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Optional OpenAI API Key (Deterministic fallback AI engine works automatically if omitted!)
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o-mini"
```

### 4. Database Setup & Seeding
```bash
# Push schema to PostgreSQL
npx prisma db push

# Seed 30+ realistic vehicles & staff accounts
npm run prisma:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the customer website.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to view the staff portal.

---

## 👥 Demo Staff Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Dealership Admin** | `admin@northstarmotors.in` | `Admin@123456` | Full CRUD, Settings, AI Copilot, Users |
| **Sales Manager** | `sales@northstarmotors.in` | `Admin@123456` | CRM Pipeline, Appointments, Funnel Analytics |
| **Sales Agent** | `agent@northstarmotors.in` | `Admin@123456` | Assigned Leads, Notes, Test Drives |

*(1-click demo login buttons are provided on the login screen for instant evaluation)*

---

## 🧪 Running Automated Tests
```bash
npm run test
```
Executes comprehensive Vitest test suites verifying EMI math, trade-in algorithms, AI tool registry schemas, and RBAC authorization guards.
