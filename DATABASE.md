# Database Documentation: PostgreSQL as the Single Source of Truth

## 1. Single Database Mandate
PostgreSQL is the **only** database used across the entire platform. No Redis, SQLite, MongoDB, Firebase, or external vector databases are introduced.

Vector search and semantic indexing for knowledge documents are handled natively via the **PostgreSQL `pgvector`** extension when enabled.

---

## 2. Relational Schema Architecture (Prisma ORM)

The relational schema is defined in `prisma/schema.prisma` and encompasses 22 models:

| Table | Purpose | Scoping |
|---|---|---|
| `dealerships` | Multi-tenant organization records (Name, slug, contact, address) | Primary Tenant Entity |
| `dealership_settings` | White-label theme, opening hours, SEO metadata, EMI defaults | 1:1 with `dealerships` |
| `users` | Staff members with RBAC roles (`SUPER_ADMIN`, `DEALERSHIP_ADMIN`, `SALES_MANAGER`, `SALES_AGENT`, `CUSTOMER`) | Scoped to `dealershipId` |
| `vehicles` | Showroom and pre-owned inventory with full powertrain, specs, warranty | Scoped to `dealershipId` |
| `vehicle_images` | High-resolution curated vehicle photography and order indexing | Scoped to `vehicleId` |
| `vehicle_features` | Categorized equipment (Safety, Comfort, Infotainment, Performance) | Scoped to `vehicleId` |
| `customers` | Customer identity records with contact details and preferences | Scoped to `dealershipId` |
| `leads` | CRM pipeline inquiries with intent scores (1-100) and 7 deal stages | Scoped to `dealershipId` |
| `lead_notes` | Staff interaction notes and AI-generated conversation summaries | Scoped to `leadId` |
| `appointments` | Showroom and doorstep test drive scheduling with status tracking | Scoped to `dealershipId` |
| `financing_requests` | Loan pre-approval applications with calculated EMI and principal | Scoped to `dealershipId` |
| `trade_in_requests` | Used car trade-in valuations with algorithmic market estimates | Scoped to `dealershipId` |
| `favorites` | Saved vehicles per session / customer | Session indexed |
| `comparisons` | Vehicles selected for side-by-side spec comparison | Session indexed |
| `conversations` | AI chat session records | Scoped to `dealershipId` |
| `messages` | Chat transcript messages with structured tool calls and outputs | Scoped to `conversationId` |
| `ai_interactions` | Audit log of AI queries, parameters, token counts, and execution latency | Scoped to `dealershipId` |
| `knowledge_documents` | Dealership policies, warranties, FAQs, and service information | Scoped to `dealershipId` |
| `knowledge_chunks` | Chunked documents ready for semantic search | Scoped to `documentId` |
| `analytics_events` | Granular customer behavior tracking (page views, vehicle views, searches) | Scoped to `dealershipId` |
| `audit_logs` | Administrative mutation logging for security and compliance | Scoped to `dealershipId` |
| `notifications` | Internal staff alerts for new leads and test drive bookings | Scoped to `dealershipId` |

---

## 3. High-Performance Indexing Strategy
Frequently queried fields in customer search and CRM lookups are indexed in PostgreSQL:
```prisma
@@index([dealershipId, status])
@@index([dealershipId, price])
@@index([dealershipId, bodyType])
@@index([dealershipId, make])
@@index([dealershipId, fuelType])
@@index([dealershipId, transmission])
@@index([dealershipId, condition])
@@index([isFeatured])
```

---

## 4. Migrations & Seeding
```bash
# Push schema changes to PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Populate demo dealership with 30+ vehicles and staff accounts
npm run prisma:seed
```
