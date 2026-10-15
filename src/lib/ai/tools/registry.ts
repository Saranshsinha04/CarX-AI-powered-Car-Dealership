import { z } from "zod";
import { AiToolDefinition, AiExecutionContext } from "../types";
import {
  getVehicles,
  getVehicleById,
  getVehiclesForComparison,
  getDealership,
  createLead,
  createAppointment,
  getLeads,
  getAppointments,
  getAnalyticsSummary,
} from "@/lib/db";
import { calculateEmi } from "@/lib/finance";

export const aiTools: Record<string, AiToolDefinition> = {
  // 1. Search Inventory Tool
  searchInventory: {
    name: "searchInventory",
    description: "Search the dealership's real PostgreSQL inventory by criteria like body type, price, transmission, fuel, or keywords.",
    roleRequired: "PUBLIC",
    parametersSchema: z.object({
      vehicleType: z.string().optional().describe("SUV, Sedan, Hatchback, EV, Luxury, MUV"),
      minPrice: z.number().optional().describe("Minimum price in INR"),
      maxPrice: z.number().optional().describe("Maximum price in INR"),
      transmission: z.string().optional().describe("Automatic, Manual, DCT, CVT, AMT"),
      fuelType: z.string().optional().describe("Petrol, Diesel, Electric, Hybrid"),
      make: z.string().optional().describe("Brand e.g. Hyundai, Mahindra, Tata, Toyota, BMW"),
      seatingCapacity: z.number().optional().describe("Number of seats, e.g. 5 or 7"),
      keyword: z.string().optional().describe("Search term or feature"),
      useCase: z.string().optional().describe("e.g. family, offroad, hill driving, daily commute"),
    }),
    execute: async (params, ctx) => {
      let bodyType = params.vehicleType;
      if (bodyType && bodyType.toUpperCase() === "CAR") bodyType = undefined;

      const result = await getVehicles({
        dealershipId: ctx.dealershipId,
        bodyType: bodyType ? bodyType.toUpperCase() : undefined,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        transmission: params.transmission,
        fuelType: params.fuelType,
        make: params.make,
        seatingCapacity: params.seatingCapacity,
        search: params.keyword,
        status: "AVAILABLE",
        limit: 6,
      });

      // Enhance with match rationale
      const enrichedVehicles = result.vehicles.map((v: any) => {
        let matchScore = 85;
        const reasons = [];

        if (params.maxPrice && v.price <= params.maxPrice) {
          matchScore += 5;
          reasons.push(`Within requested budget of ₹${(params.maxPrice / 100000).toFixed(1)} Lakh`);
        }
        if (params.transmission && v.transmission.toLowerCase().includes(params.transmission.toLowerCase())) {
          matchScore += 5;
          reasons.push(`${v.transmission} transmission`);
        }
        if (params.vehicleType && v.bodyType.toLowerCase() === params.vehicleType.toLowerCase()) {
          reasons.push(`${v.bodyType} body style`);
        }
        if (params.useCase && params.useCase.toLowerCase().includes("hill")) {
          if (v.drivetrain === "4WD" || v.drivetrain === "AWD" || v.bodyType === "SUV") {
            reasons.push("High ground clearance & strong torque for mountain terrains");
            matchScore += 5;
          }
        }
        if (reasons.length === 0) {
          reasons.push("Top available model matching your preferences");
        }

        return {
          id: v.id,
          name: `${v.year} ${v.make} ${v.model} ${v.trim || ""}`.trim(),
          make: v.make,
          model: v.model,
          year: v.year,
          price: v.price,
          formattedPrice: `₹${(v.price / 100000).toFixed(2)} Lakh`,
          bodyType: v.bodyType,
          fuelType: v.fuelType,
          transmission: v.transmission,
          mileageKm: v.mileageKm,
          powerBhp: v.powerBhp,
          seatingCapacity: v.seatingCapacity,
          imageUrl: v.images?.[0]?.url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
          matchScore: Math.min(99, matchScore),
          matchReason: reasons.join(" • "),
        };
      });

      return {
        totalMatches: result.total,
        vehicles: enrichedVehicles,
      };
    },
  },

  // 2. Get Vehicle Details
  getVehicle: {
    name: "getVehicle",
    description: "Get detailed official database specifications and pricing for a specific vehicle by ID or name.",
    roleRequired: "PUBLIC",
    parametersSchema: z.object({
      vehicleId: z.string().describe("ID, VIN, or stock number of the vehicle"),
    }),
    execute: async (params) => {
      const vehicle = await getVehicleById(params.vehicleId);
      if (!vehicle) {
        return { error: "Vehicle not found in database." };
      }
      return {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        trim: vehicle.trim,
        price: vehicle.price,
        formattedPrice: `₹${(vehicle.price / 100000).toFixed(2)} Lakh`,
        status: vehicle.status,
        bodyType: vehicle.bodyType,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        engineCc: vehicle.engineCapacityCc,
        powerBhp: vehicle.powerBhp,
        torqueNm: vehicle.torqueNm,
        fuelEconomy: vehicle.fuelEfficiencyKmpl ? `${vehicle.fuelEfficiencyKmpl} km/l` : undefined,
        seating: vehicle.seatingCapacity,
        warranty: vehicle.warranty,
        description: vehicle.description,
        features: vehicle.features?.map((f: any) => `${f.category}: ${f.name}`) || [],
      };
    },
  },

  // 3. Compare Vehicles
  compareVehicles: {
    name: "compareVehicles",
    description: "Compare 2 to 3 vehicles side-by-side using exact database specifications.",
    roleRequired: "PUBLIC",
    parametersSchema: z.object({
      vehicleIds: z.array(z.string()).min(2).max(4).describe("Array of vehicle IDs to compare"),
    }),
    execute: async (params) => {
      const vehicles = await getVehiclesForComparison(params.vehicleIds);
      return {
        comparisonCount: vehicles.length,
        vehicles: vehicles.map((v: any) => ({
          id: v.id,
          name: `${v.year} ${v.make} ${v.model} ${v.trim || ""}`.trim(),
          price: v.price,
          power: `${v.powerBhp} BHP`,
          torque: `${v.torqueNm} Nm`,
          fuelEconomy: v.fuelEfficiencyKmpl ? `${v.fuelEfficiencyKmpl} km/l` : "Electric/N/A",
          transmission: v.transmission,
          fuelType: v.fuelType,
          seating: `${v.seatingCapacity} Seater`,
        })),
      };
    },
  },

  // 4. Calculate EMI
  calculateEMI: {
    name: "calculateEMI",
    description: "Calculate deterministic vehicle loan EMI and total repayment schedule.",
    roleRequired: "PUBLIC",
    parametersSchema: z.object({
      vehiclePrice: z.number().describe("Vehicle price in INR"),
      downPayment: z.number().describe("Down payment in INR"),
      interestRate: z.number().default(8.99).describe("Annual interest rate percentage"),
      tenureMonths: z.number().default(60).describe("Loan duration in months"),
    }),
    execute: async (params) => {
      const res = calculateEmi({
        vehiclePrice: params.vehiclePrice,
        downPayment: params.downPayment,
        interestRateAnnual: params.interestRate,
        tenureMonths: params.tenureMonths,
      });
      return {
        monthlyEmi: res.monthlyEmi,
        formattedEmi: `₹${res.monthlyEmi.toLocaleString("en-IN")}/month`,
        principalAmount: res.principalLoanAmount,
        totalInterest: res.totalInterest,
        totalRepayment: res.totalPayment,
      };
    },
  },

  // 5. Dealership Information
  getDealershipInfo: {
    name: "getDealershipInfo",
    description: "Get verified showroom location, address, opening hours, contact numbers, and policies.",
    roleRequired: "PUBLIC",
    parametersSchema: z.object({
      topic: z.string().optional().describe("location, hours, contact, or policies"),
    }),
    execute: async (params, ctx) => {
      const dealership = await getDealership(ctx.dealershipId);
      return {
        name: dealership.name,
        tagline: dealership.tagline,
        address: dealership.address,
        city: dealership.city,
        state: dealership.state,
        phone: dealership.phone,
        whatsapp: dealership.whatsapp,
        email: dealership.email,
        hours: (dealership as any).settings?.openingHours || {
          mon_fri: "9:00 AM - 8:00 PM",
          sat: "9:00 AM - 8:30 PM",
          sun: "10:00 AM - 6:00 PM",
        },
      };
    },
  },

  // 6. Create Customer Lead
  createLead: {
    name: "createLead",
    description: "Create a verified buying lead in PostgreSQL when customer expresses clear purchase interest.",
    roleRequired: "PUBLIC",
    parametersSchema: z.object({
      customerName: z.string().min(2),
      customerPhone: z.string().min(10),
      customerEmail: z.string().email(),
      vehicleId: z.string().optional(),
      budgetMin: z.number().optional(),
      budgetMax: z.number().optional(),
      preferredTimeline: z.string().optional(),
      aiSummary: z.string().optional(),
    }),
    execute: async (params, ctx) => {
      const lead = await createLead({
        dealershipId: ctx.dealershipId,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        customerEmail: params.customerEmail,
        vehicleId: params.vehicleId,
        budgetMin: params.budgetMin,
        budgetMax: params.budgetMax,
        preferredTimeline: params.preferredTimeline || "Within 30 days",
        source: "AI_CHAT",
        aiSummary: params.aiSummary,
        intentScore: 85,
      });

      return {
        success: true,
        leadId: lead.id,
        message: "Lead successfully recorded. A Northstar automotive specialist will follow up.",
      };
    },
  },

  // 7. Create Test Drive Appointment
  createAppointment: {
    name: "createAppointment",
    description: "Book an official test drive appointment in PostgreSQL.",
    roleRequired: "PUBLIC",
    parametersSchema: z.object({
      vehicleId: z.string(),
      customerName: z.string(),
      customerPhone: z.string(),
      customerEmail: z.string(),
      scheduledAt: z.string().describe("ISO datetime string"),
      notes: z.string().optional(),
    }),
    execute: async (params, ctx) => {
      const apt = await createAppointment({
        dealershipId: ctx.dealershipId,
        vehicleId: params.vehicleId,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        customerEmail: params.customerEmail,
        scheduledAt: params.scheduledAt,
        notes: params.notes,
      });

      return {
        success: true,
        appointmentId: apt.id,
        scheduledAt: apt.scheduledAt,
        message: "Test drive appointment confirmed.",
      };
    },
  },

  // 8. Admin Copilot: Sales & Lead Summary
  getSalesSummary: {
    name: "getSalesSummary",
    description: "Admin analytics tool: Get overview metrics of leads, pipeline value, and appointments.",
    roleRequired: "STAFF",
    parametersSchema: z.object({}),
    execute: async (_params, ctx) => {
      return await getAnalyticsSummary(ctx.dealershipId);
    },
  },

  // 9. Admin Copilot: Lead Funnel
  getLeadFunnel: {
    name: "getLeadFunnel",
    description: "Admin tool: Get distribution of leads across CRM stages.",
    roleRequired: "STAFF",
    parametersSchema: z.object({}),
    execute: async (_params, ctx) => {
      const leads = await getLeads(ctx.dealershipId);
      const funnel: Record<string, number> = {
        NEW: 0,
        CONTACTED: 0,
        QUALIFIED: 0,
        TEST_DRIVE: 0,
        NEGOTIATION: 0,
        WON: 0,
        LOST: 0,
      };
      leads.forEach((l: any) => {
        if (funnel[l.status] !== undefined) funnel[l.status]++;
      });
      return { totalLeads: leads.length, funnel };
    },
  },

  // 10. Admin Copilot: High Intent & Pending Follow-ups
  getPendingFollowups: {
    name: "getPendingFollowups",
    description: "Admin tool: Find leads with high intent or requiring immediate follow-up.",
    roleRequired: "STAFF",
    parametersSchema: z.object({}),
    execute: async (_params, ctx) => {
      const leads = await getLeads(ctx.dealershipId);
      const urgent = leads
        .filter((l: any) => l.intentScore >= 75 && l.status !== "WON" && l.status !== "LOST")
        .slice(0, 5)
        .map((l: any) => ({
          id: l.id,
          customer: l.customerName || l.customer?.name,
          phone: l.customerPhone || l.customer?.phone,
          vehicle: l.vehicle ? `${l.vehicle.year} ${l.vehicle.make} ${l.vehicle.model}` : "General inquiry",
          intentScore: l.intentScore,
          stage: l.status,
          aiSummary: l.aiSummary,
        }));

      return { count: urgent.length, leads: urgent };
    },
  },
};

/**
 * Execute tool with strict authorization and validation
 */
export async function executeAiTool(
  toolName: string,
  rawParams: any,
  context: AiExecutionContext
) {
  const tool = aiTools[toolName];
  if (!tool) {
    throw new Error(`Unauthorized or unknown tool: ${toolName}`);
  }

  // Role check
  if (tool.roleRequired === "STAFF" || tool.roleRequired === "ADMIN") {
    if (!context.userRole || !["SUPER_ADMIN", "DEALERSHIP_ADMIN", "SALES_MANAGER", "SALES_AGENT"].includes(context.userRole)) {
      throw new Error(`Forbidden: Tool '${toolName}' requires staff credentials.`);
    }
  }

  // Schema validation
  const validatedParams = tool.parametersSchema.parse(rawParams);

  // Database Execution
  const result = await tool.execute(validatedParams, context);
  return result;
}
