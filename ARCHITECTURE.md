# System Architecture: AI-Powered Car Dealership Platform

## 1. Architectural Philosophy
The core architectural principle of this platform is intentional simplicity and uncompromising data integrity:
- **One Application**: Next.js App Router providing customer portal, CRM, admin console, and AI orchestration.
- **One Database**: PostgreSQL as the single source of truth for inventory, leads, conversations, appointments, settings, and analytics.
- **Zero Raw SQL from LLMs**: The AI never generates or runs arbitrary SQL in production. It interacts exclusively through authorized, validated backend tools.

```
                    CUSTOMER & STAFF
                           │
                           ▼
                  NEXT.JS APPLICATION
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    PUBLIC WEBSITE      AI LAYER       ADMIN PORTAL
   (/inventory, etc.)  (/api/ai/chat)    (/admin)
          │                │                │
          └────────────────┼────────────────┘
                           │
                    BACKEND SERVICES
            (Auth RBAC, Zod Validation,
             EMI Math, Rate Limiting)
                           │
                           ▼
                  PRISMA ORM LAYER
                           │
                           ▼
                      POSTGRESQL
              (Single Source of Truth)
```

---

## 2. Multi-Tenancy Architecture
The system supports multiple dealerships on a single deployed instance without duplicating codebase or database instances.

- **Dealership Identity**: Every dealership has a unique UUID `dealership.id` and URL slug (e.g., `northstar-motors`).
- **Scoping Rule**: Every table containing business data contains `dealership_id`:
  - `vehicles.dealershipId`
  - `leads.dealershipId`
  - `appointments.dealershipId`
  - `customers.dealershipId`
  - `conversations.dealershipId`
  - `analytics_events.dealershipId`
  - `dealership_settings.dealershipId`
- **Isolation Enforcement**: All backend repository queries in `src/lib/db/index.ts` automatically scope queries with `where: { dealershipId }`. Staff from one dealership cannot view or mutate another dealership's records.

---

## 3. Controlled AI Tool Execution Pipeline
The platform implements a strict tool registry pattern:

```
User Query: "Show me automatic SUVs under ₹18 lakh"
     │
     ▼
Prompt Injection & Safety Defense (sanitizeAndGuardPrompt)
     │
     ▼
Intent & Parameter Parsing (Zod Schema Validation)
     {
       vehicleType: "SUV",
       maxPrice: 1800000,
       transmission: "Automatic"
     }
     │
     ▼
Role & Scope Verification (Public vs Staff check)
     │
     ▼
Authorized Tool Execution (searchInventory)
     │
     ▼
PostgreSQL Query via Prisma
     │
     ▼
Structured Database Facts (Real inventory records only)
     │
     ▼
Grounded AI Explanation & Vehicle Card Formatting
```

---

## 4. Hallucination Prevention
1. Specifications, prices, mileage, warranties, and stock numbers are strictly extracted from PostgreSQL records.
2. If no exact match is found, the AI transparently declares: *"We currently don't have an exact match for those specific parameters in our showroom inventory today"* and surfaces the closest verified alternatives.
3. Financial calculations are handled by the deterministic reducing balance engine (`calculateEmi()`), never estimated by LLM arithmetic.
