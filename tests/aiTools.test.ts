import { describe, it, expect } from "vitest";
import { executeAiTool } from "../src/lib/ai/tools/registry";
import { DEMO_DEALERSHIP } from "../src/lib/data/seedData";

describe("AI Tool Registry & Authorized Backend Execution", () => {
  const publicContext = {
    dealershipId: DEMO_DEALERSHIP.id,
  };

  const staffContext = {
    dealershipId: DEMO_DEALERSHIP.id,
    userRole: "DEALERSHIP_ADMIN",
    userId: "usr-admin-01",
  };

  it("executes searchInventory successfully with criteria and returns real vehicles", async () => {
    const result = await executeAiTool(
      "searchInventory",
      { vehicleType: "SUV", maxPrice: 2500000 },
      publicContext
    );

    expect(result.vehicles.length).toBeGreaterThan(0);
    // Every matched vehicle must be an SUV under 25 Lakh
    result.vehicles.forEach((car: any) => {
      expect(car.bodyType.toUpperCase()).toBe("SUV");
      expect(car.price).toBeLessThanOrEqual(2500000);
      expect(car.matchScore).toBeGreaterThanOrEqual(80);
      expect(car.matchReason).toBeDefined();
    });
  });

  it("calculates deterministic loan EMI through AI tool layer", async () => {
    const result = await executeAiTool(
      "calculateEMI",
      { vehiclePrice: 1800000, downPayment: 360000, interestRate: 8.99, tenureMonths: 60 },
      publicContext
    );

    expect(result.monthlyEmi).toBeGreaterThan(29000);
    expect(result.formattedEmi).toContain("/month");
  });

  it("blocks unauthorized public users from calling staff-only analytics tools", async () => {
    await expect(
      executeAiTool("getSalesSummary", {}, publicContext)
    ).rejects.toThrow(/Forbidden/);
  });

  it("allows staff user to query dealership analytics summary", async () => {
    const result = await executeAiTool("getSalesSummary", {}, staffContext);
    expect(result.totalVehicles).toBeGreaterThan(20);
    expect(result.leadsCount).toBeGreaterThan(0);
    expect(result.pipelineValue).toBeGreaterThan(0);
  });
});
