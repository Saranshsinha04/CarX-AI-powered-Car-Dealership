# Testing Strategy & Automated Test Suite

## 1. Overview
The platform includes unit and integration tests built with **Vitest**. Critical business logic, deterministic calculations, AI tool schemas, and security boundaries are tested automatically.

---

## 2. Running Tests
```bash
# Run all automated tests
npm run test

# Run tests in watch mode
npx vitest

# Run a specific suite
npx vitest run tests/finance.test.ts
```

---

## 3. Test Suites

### 1. `tests/finance.test.ts`
- **Reducing-Balance EMI Math**: Validates that principal, interest, and monthly EMI align with banking standards ($E = P \cdot r \cdot \frac{(1+r)^n}{(1+r)^n - 1}$).
- **100% Down Payment**: Validates zero loan balance handling without zero-division runtime errors.
- **0% Interest Rate**: Validates simple flat division.
- **Amortization Preview**: Ensures valid month-by-month principal and interest progression.

### 2. `tests/tradeIn.test.ts`
- **Depreciation Curve**: Validates depreciation rates across vehicle age.
- **Condition Adjustments**: Checks multipliers for Excellent, Good, Fair, and Poor condition.
- **Accident & Ownership Penalties**: Tests depreciation deduction for multiple owners and claim history.

### 3. `tests/aiTools.test.ts`
- **`searchInventory` Execution**: Validates filter execution, parameter extraction, and match rationale generation.
- **`calculateEMI` Tool**: Verifies deterministic mathematical calculation through the AI tool layer.
- **RBAC Guard Enforcement**: Asserts that unauthenticated public requests to staff-only analytics tools (`getSalesSummary`) are strictly rejected with 403 Forbidden.
- **Staff Access**: Asserts that staff users can query dealership performance summaries.

### 4. `tests/auth.test.ts`
- **Bcrypt Hashing**: Tests secure password hashing and verification.
- **JWT Session Tokens**: Tests token signing and payload extraction.
- **RBAC Role Matrix**: Asserts role hierarchy (`SUPER_ADMIN` > `DEALERSHIP_ADMIN` > `SALES_MANAGER` > `SALES_AGENT`).
- **Staff Credentials**: Verifies demo user authentication against hashed credentials.
