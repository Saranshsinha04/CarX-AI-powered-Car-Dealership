import OpenAI from "openai";
import { aiTools, executeAiTool } from "./tools/registry";
import { sanitizeAndGuardPrompt } from "./promptSafety";
import { AiExecutionContext, AiResponsePayload, ChatMessage } from "./types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are Northstar AI, the intelligent automotive concierge for Northstar Motors located on Rajpur Road, Dehradun, Uttarakhand.
Your core mission is to help customers explore real inventory, understand vehicle specifications, calculate financing, and schedule test drives.

CRITICAL RULES:
1. Grounding in Database Facts: Only recommend vehicles that exist in the PostgreSQL database. Never invent or hallucinate price, specs, mileage, warranty, or availability.
2. If no exact match is found, clearly state so and suggest the closest available vehicles from the inventory.
3. Pricing & Specifications: All prices are in Indian Rupees (₹ Lakhs / Crores). Always use the exact data provided by authorized tools.
4. Lead Capture: When a customer expresses genuine purchase intent or interest in a test drive, politely offer to connect them with a showroom automotive specialist.
5. Tone: Professional, warm, automotive-savvy, and concise.`;

export async function processAiMessage(
  messages: ChatMessage[],
  context: AiExecutionContext
): Promise<AiResponsePayload> {
  const lastUserMessage = messages[messages.length - 1];
  const queryText = lastUserMessage?.content || "";

  // 1. Safety check
  const safety = sanitizeAndGuardPrompt(queryText);
  if (!safety.safe) {
    return {
      message: "I cannot process this request due to security constraints. Please ask an automotive or inventory question.",
    };
  }

  const cleanQuery = safety.sanitized;

  // 2. If OpenAI API key is available, use LLM function calling
  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const openAiTools: OpenAI.Chat.Completions.ChatCompletionTool[] = Object.values(aiTools).map((t) => ({
        type: "function",
        function: {
          name: t.name,
          description: t.description,
          parameters: {
            type: "object",
            properties: (t.parametersSchema as any).shape ? extractZodProperties(t.parametersSchema) : {},
          },
        },
      }));

      const chatHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-6).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: chatHistory,
        tools: openAiTools,
        tool_choice: "auto",
        temperature: 0.2,
        max_tokens: 600,
      });

      const choice = completion.choices[0];
      const responseMessage = choice.message;

      // Check if tool was called
      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        const toolCall = responseMessage.tool_calls[0];
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments || "{}");

        const toolResult = await executeAiTool(toolName, toolArgs, context);

        // Synthesize grounded explanation
        const followup = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            ...chatHistory,
            responseMessage,
            {
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult),
            },
          ],
          temperature: 0.3,
        });

        return {
          message: followup.choices[0].message.content || "Here are the matching options from our current inventory.",
          matchedVehicles: toolResult.vehicles || (toolResult.id ? [toolResult] : undefined),
          suggestedActions: [
            { label: "Book Test Drive", action: "OPEN_TEST_DRIVE" },
            { label: "Check Financing", action: "OPEN_FINANCE" },
            { label: "Compare Models", action: "OPEN_COMPARE" },
          ],
        };
      }

      return {
        message: responseMessage.content || "How can I assist you with Northstar Motors inventory today?",
      };
    } catch (err) {
      console.error("OpenAI API call failed, falling back to deterministic AI engine:", err);
    }
  }

  // 3. High-Precision Deterministic Engine (Zero external dependency fallback)
  return await runDeterministicAiEngine(cleanQuery, messages, context);
}

/**
 * Intelligent deterministic intent extractor and tool orchestrator
 */
async function runDeterministicAiEngine(
  query: string,
  _history: ChatMessage[],
  context: AiExecutionContext
): Promise<AiResponsePayload> {
  const lower = query.toLowerCase();

  // A. Admin Co-pilot Queries (Staff Only)
  if (context.userRole && ["SUPER_ADMIN", "DEALERSHIP_ADMIN", "SALES_MANAGER", "SALES_AGENT"].includes(context.userRole)) {
    if (lower.includes("sales") || lower.includes("overview") || lower.includes("how many leads") || lower.includes("summary")) {
      const summary = await executeAiTool("getSalesSummary", {}, context);
      return {
        message: `📊 **Showroom Performance Summary**:\n- **Total Inventory**: ${summary.totalVehicles} vehicles (${summary.availableVehicles} ready for delivery)\n- **Active Leads**: ${summary.leadsCount} inquiries (${summary.highIntentLeads} high-intent)\n- **Test Drives Scheduled**: ${summary.upcomingAppointments} upcoming\n- **Estimated Pipeline Value**: ₹${(summary.pipelineValue / 10000000).toFixed(2)} Crore\n- **Closing Conversion Rate**: ${summary.conversionRate}%`,
      };
    }
    if (lower.includes("follow") || lower.includes("urgent") || lower.includes("high-intent") || lower.includes("hot lead")) {
      const followups = await executeAiTool("getPendingFollowups", {}, context);
      const list = followups.leads
        .map((l: any) => `• **${l.customer}** (${l.vehicle}) - Intent: ${l.intentScore}/100 [${l.stage}]\n  *Note:* ${l.aiSummary || "Awaiting callback"}`)
        .join("\n\n");
      return {
        message: `⚡ **High-Priority Leads Needing Follow-up (${followups.count}):**\n\n${list}`,
      };
    }
    if (lower.includes("funnel") || lower.includes("pipeline") || lower.includes("stages")) {
      const funnel = await executeAiTool("getLeadFunnel", {}, context);
      return {
        message: `📈 **Current CRM Lead Funnel:**\n- **New Inquiries**: ${funnel.funnel.NEW}\n- **Contacted**: ${funnel.funnel.CONTACTED}\n- **Qualified**: ${funnel.funnel.QUALIFIED}\n- **Test Drive Done/Scheduled**: ${funnel.funnel.TEST_DRIVE}\n- **Active Negotiation**: ${funnel.funnel.NEGOTIATION}\n- **Closed / Won**: ${funnel.funnel.WON}`,
      };
    }
  }

  // B. Dealership Information / Location / Address / Contact
  if (lower.includes("where") || lower.includes("location") || lower.includes("address") || lower.includes("phone") || lower.includes("timing") || lower.includes("hours")) {
    const info = await executeAiTool("getDealershipInfo", {}, context);
    return {
      message: `📍 **${info.name} Showroom Information**\n\n- **Address**: ${info.address}, ${info.city}, ${info.state}\n- **Phone**: ${info.phone}\n- **WhatsApp**: ${info.whatsapp}\n- **Timings**: Mon–Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 6:00 PM\n\nWould you like to schedule a showroom visit or book a doorstep test drive in Dehradun?`,
      suggestedActions: [
        { label: "Book Test Drive", action: "OPEN_TEST_DRIVE" },
        { label: "Contact Showroom", action: "OPEN_CONTACT" },
      ],
    };
  }

  // C. EMI / Financing Calculations
  if (lower.includes("emi") || lower.includes("finance") || lower.includes("down payment") || lower.includes("loan")) {
    // Extract price number if mentioned
    let price = 1800000;
    const priceMatch = lower.match(/(\d+(\.\d+)?)\s*(lakh|lac|l)/);
    if (priceMatch) {
      price = parseFloat(priceMatch[1]) * 100000;
    }
    const downPayment = Math.round(price * 0.20);
    const emiRes = await executeAiTool("calculateEMI", {
      vehiclePrice: price,
      downPayment,
      interestRate: 8.99,
      tenureMonths: 60,
    }, context);

    return {
      message: `💰 **Estimated EMI Breakdown** for ₹${(price / 100000).toFixed(2)} Lakh:\n\n- **Monthly EMI**: ${emiRes.formattedEmi}\n- **Down Payment (20%)**: ₹${(downPayment / 100000).toFixed(2)} Lakh\n- **Tenure**: 5 Years (60 months) @ 8.99% p.a.\n- **Principal Loan**: ₹${(emiRes.principalAmount / 100000).toFixed(2)} Lakh\n\nYou can customize your loan tenure and interest rates using our interactive financing calculator!`,
      suggestedActions: [
        { label: "Open EMI Calculator", action: "OPEN_FINANCE" },
        { label: "Apply Pre-Approval", action: "OPEN_FINANCE_APPLY" },
      ],
    };
  }

  // D. Specific Vehicle Deep Dive (e.g. "Tell me about Creta", "Why should I buy Creta?")
  const models = ["creta", "thar", "scorpio", "xuv700", "nexon", "harrier", "fortuner", "hycross", "city", "verna", "virtus", "swift", "brezza", "bmw", "seltos", "sonet", "elevate", "taigun", "atto", "hyryder", "a4", "xc60", "3xo"];
  const matchedModel = models.find((m) => lower.includes(m));

  if (matchedModel && (lower.includes("about") || lower.includes("why") || lower.includes("specs") || lower.includes("detail") || lower.includes("features"))) {
    const searchRes = await executeAiTool("searchInventory", { keyword: matchedModel }, context);
    if (searchRes.vehicles && searchRes.vehicles.length > 0) {
      const car = searchRes.vehicles[0];
      return {
        message: `### Why choose the ${car.name}?\n\n- **Price**: ${car.formattedPrice} (Ex-showroom Dehradun)\n- **Performance**: ${car.powerBhp} BHP with ${car.transmission} transmission\n- **Key Highlight**: ${car.matchReason}\n- **Fuel Economy / Range**: Ideal for Uttarakhand mountain roads and highway cruising.\n\nHere is the verified vehicle record from our database:`,
        matchedVehicles: [car],
        suggestedActions: [
          { label: `Book Test Drive`, action: "OPEN_TEST_DRIVE", payload: { vehicleId: car.id } },
          { label: `Calculate EMI`, action: "OPEN_FINANCE", payload: { vehiclePrice: car.price } },
          { label: `Compare with rivals`, action: "OPEN_COMPARE", payload: { vehicleId: car.id } },
        ],
      };
    }
  }

  // E. Inventory Search Intent Parser
  // Extract parameters:
  let vehicleType: string | undefined = undefined;
  if (lower.includes("suv")) vehicleType = "SUV";
  else if (lower.includes("sedan")) vehicleType = "Sedan";
  else if (lower.includes("hatchback")) vehicleType = "Hatchback";
  else if (lower.includes("ev") || lower.includes("electric")) vehicleType = "EV";
  else if (lower.includes("luxury")) vehicleType = "Luxury";
  else if (lower.includes("7 seater") || lower.includes("family")) vehicleType = undefined;

  let transmission: string | undefined = undefined;
  if (lower.includes("automatic") || lower.includes("auto") || lower.includes("dct") || lower.includes("cvt") || lower.includes("amt")) {
    transmission = "Automatic";
  } else if (lower.includes("manual")) {
    transmission = "Manual";
  }

  let fuelType: string | undefined = undefined;
  if (lower.includes("diesel")) fuelType = "Diesel";
  else if (lower.includes("petrol")) fuelType = "Petrol";
  else if (lower.includes("electric") || lower.includes("ev")) fuelType = "Electric";
  else if (lower.includes("hybrid")) fuelType = "Hybrid";

  let maxPrice: number | undefined = undefined;
  let minPrice: number | undefined = undefined;

  // Check budget patterns: "under 18 lakh", "below 15 lac", "under ₹20L", "between 10 and 15 lakh"
  const underMatch = lower.match(/(under|below|less than|max)\s*₹?\s*(\d+(\.\d+)?)\s*(lakh|lac|l)?/);
  if (underMatch) {
    const val = parseFloat(underMatch[2]);
    maxPrice = val < 100 ? val * 100000 : val;
  }

  const seatingCapacity = (lower.includes("7 seater") || lower.includes("7-seater") || lower.includes("seven seater")) ? 7 : undefined;

  const searchResults = await executeAiTool("searchInventory", {
    vehicleType,
    transmission,
    fuelType,
    maxPrice,
    minPrice,
    seatingCapacity,
    keyword: matchedModel || undefined,
    useCase: lower.includes("family") ? "family" : lower.includes("hill") ? "hill driving" : undefined,
  }, context);

  if (searchResults.vehicles && searchResults.vehicles.length > 0) {
    const count = searchResults.vehicles.length;
    let intro = `Here are the top **${count} matching vehicles** currently available in Northstar Motors inventory:`;
    if (maxPrice) {
      intro = `I searched our database for vehicles under **₹${(maxPrice / 100000).toFixed(1)} Lakh**${transmission ? ` with **${transmission}** transmission` : ""}. Here are the best available matches:`;
    }

    return {
      message: intro,
      matchedVehicles: searchResults.vehicles,
      suggestedActions: [
        { label: "Book a Test Drive", action: "OPEN_TEST_DRIVE" },
        { label: "Explore All Inventory", action: "OPEN_INVENTORY" },
      ],
    };
  }

  // Fallback if no exact match
  const fallbackResults = await executeAiTool("searchInventory", { limit: 3 }, context);
  return {
    message: `We currently don't have an exact match for those specific parameters in our showroom inventory today. However, here are our closest popular alternatives in stock at Dehradun:`,
    matchedVehicles: fallbackResults.vehicles,
    suggestedActions: [
      { label: "View All Cars", action: "OPEN_INVENTORY" },
      { label: "Request Custom Car Alert", action: "OPEN_LEAD_FORM" },
    ],
  };
}

function extractZodProperties(schema: any): Record<string, any> {
  const shape = schema.shape || {};
  const props: Record<string, any> = {};
  for (const [key, val] of Object.entries(shape)) {
    props[key] = {
      type: (val as any)._def.typeName === "ZodNumber" ? "number" : "string",
      description: (val as any).description || key,
    };
  }
  return props;
}
