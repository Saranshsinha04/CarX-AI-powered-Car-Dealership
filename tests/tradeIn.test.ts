import { describe, it, expect } from "vitest";
import { estimateTradeInValue } from "../src/lib/tradeIn";

describe("Trade-In Valuation Algorithm", () => {
  it("calculates realistic market valuation range for 3-year-old vehicle", () => {
    const result = estimateTradeInValue({
      make: "Hyundai",
      model: "Creta",
      year: 2021,
      mileageKm: 35000,
      condition: "GOOD",
      ownersCount: 1,
      accidentHistory: false,
    });

    expect(result.isEstimate).toBe(true);
    expect(result.estimatedMin).toBeGreaterThan(700000);
    expect(result.estimatedMax).toBeGreaterThan(result.estimatedMin);
    expect(result.confidenceScore).toBe(90);
    expect(result.disclaimer).toContain("Northstar Motors");
  });

  it("applies penalty for accident history and multiple owners", () => {
    const cleanCar = estimateTradeInValue({
      make: "Mahindra",
      model: "Thar",
      year: 2022,
      mileageKm: 20000,
      condition: "EXCELLENT",
      ownersCount: 1,
      accidentHistory: false,
    });

    const accidentCar = estimateTradeInValue({
      make: "Mahindra",
      model: "Thar",
      year: 2022,
      mileageKm: 20000,
      condition: "EXCELLENT",
      ownersCount: 3,
      accidentHistory: true,
    });

    expect(accidentCar.estimatedMin).toBeLessThan(cleanCar.estimatedMin);
    expect(accidentCar.confidenceScore).toBeLessThan(cleanCar.confidenceScore);
  });
});
