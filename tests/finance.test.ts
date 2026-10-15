import { describe, it, expect } from "vitest";
import { calculateEmi } from "../src/lib/finance";

describe("EMI Calculator (Deterministic Math Engine)", () => {
  it("calculates accurate reducing-balance EMI for standard car loan", () => {
    // 20 Lakh vehicle, 4 Lakh down payment (16 Lakh loan), 8.99% interest, 5 years (60 months)
    const result = calculateEmi({
      vehiclePrice: 2000000,
      downPayment: 400000,
      interestRateAnnual: 8.99,
      tenureMonths: 60,
    });

    expect(result.principalLoanAmount).toBe(1600000);
    // Standard EMI for 16L at 8.99% for 60 mos is ~₹33,220
    expect(result.monthlyEmi).toBeGreaterThan(33000);
    expect(result.monthlyEmi).toBeLessThan(33500);
    expect(result.totalPayment).toBe(result.monthlyEmi * 60);
    expect(result.totalInterest).toBe(result.totalPayment - result.principalLoanAmount);
    expect(result.amortizationPreview.length).toBe(6);
  });

  it("handles 100% down payment (zero loan) gracefully without division by zero", () => {
    const result = calculateEmi({
      vehiclePrice: 1500000,
      downPayment: 1500000,
      interestRateAnnual: 8.99,
      tenureMonths: 60,
    });

    expect(result.principalLoanAmount).toBe(0);
    expect(result.monthlyEmi).toBe(0);
    expect(result.totalInterest).toBe(0);
  });

  it("handles 0% interest rate correctly", () => {
    const result = calculateEmi({
      vehiclePrice: 1200000,
      downPayment: 200000,
      interestRateAnnual: 0,
      tenureMonths: 50,
    });

    expect(result.principalLoanAmount).toBe(1000000);
    expect(result.monthlyEmi).toBe(20000);
    expect(result.totalInterest).toBe(0);
  });
});
