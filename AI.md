# AI Architecture & Tool System Documentation

## 1. Architectural Philosophy
The AI engine in this platform operates under strict security and data-integrity boundaries:
- **Zero Raw SQL Execution**: The LLM is never given direct SQL execution capabilities or unrestricted database connection credentials.
- **Backend Orchestrator Pattern**: User queries pass into an orchestrator that extracts intent and parameters, validates them using **Zod**, and executes **authorized backend tools** against PostgreSQL.
- **Grounding in Database Facts**: The AI communicates actual inventory, verified pricing in INR, authentic specifications, and live appointment slots.

---

## 2. Tool Registry

Located in `src/lib/ai/tools/registry.ts`, each tool is strictly typed and role-protected:

### Public Tools (Customer-Facing)
1. **`searchInventory`**
   - *Input*: `vehicleType`, `minPrice`, `maxPrice`, `transmission`, `fuelType`, `make`, `seatingCapacity`, `useCase`, `keyword`
   - *Behavior*: Queries PostgreSQL with index-optimized filters. Enriches matches with match score (80–99%) and factual rationale.
2. **`getVehicle`**
   - *Input*: `vehicleId`
   - *Behavior*: Fetches full database specs, power, torque, warranty, and installed features.
3. **`compareVehicles`**
   - *Input*: `vehicleIds` (array of 2–4 IDs)
   - *Behavior*: Returns side-by-side spec differences directly from database fields.
4. **`calculateEMI`**
   - *Input*: `vehiclePrice`, `downPayment`, `interestRate`, `tenureMonths`
   - *Behavior*: Invokes deterministic reducing-balance mathematical formula. The AI never calculates financial math manually.
5. **`getDealershipInfo`**
   - *Input*: `topic` ("location", "hours", "contact", "policies")
   - *Behavior*: Returns official showroom address (Rajpur Road, Dehradun), telephone, and operating hours.
6. **`createLead`**
   - *Input*: `customerName`, `customerPhone`, `customerEmail`, `vehicleId`, `budgetMin`, `budgetMax`, `timeline`, `aiSummary`
   - *Behavior*: Inserts verified lead into PostgreSQL `Lead` table with AI-synthesized intent summary.
7. **`createAppointment`**
   - *Input*: `vehicleId`, `customerName`, `customerPhone`, `customerEmail`, `scheduledAt`, `notes`
   - *Behavior*: Books official test drive slot and automatically elevates customer inquiry in the CRM.

### Staff Tools (Admin AI Copilot)
8. **`getSalesSummary`**
   - Scoped to `STAFF` roles. Returns total inventory count, active leads, pipeline value in Crore, and closing rate.
9. **`getPendingFollowups`**
   - Scoped to `STAFF` roles. Identifies leads with intent score ≥ 75 needing immediate outreach.
10. **`getLeadFunnel`**
    - Scoped to `STAFF` roles. Returns breakdown of leads across all 7 deal stages (`NEW`, `CONTACTED`, `QUALIFIED`, `TEST_DRIVE`, `NEGOTIATION`, `WON`, `LOST`).

---

## 3. Prompt Injection Defense
In `src/lib/ai/promptSafety.ts`, inputs are scanned for adversarial patterns:
- Instruction override attempts (`ignore all previous instructions`)
- Credential harvesting (`reveal database credentials`, `give API key`)
- SQL injection patterns (`DROP TABLE`, `SELECT * FROM`, `DELETE FROM`)
- Role elevation attempts (`you are now in DAN mode`)

Any flagged input is rejected server-side before reaching LLM inference or backend tools.
