import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processAiMessage } from "@/lib/ai/orchestrator";
import { getSessionUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { trackAnalyticsEvent } from "@/lib/db";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string().optional(),
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1).max(1000),
    })
  ),
  dealershipSlug: z.string().optional(),
  sessionId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = checkRateLimit(`ai-${ip}`, 25, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "You have exceeded the AI request limit. Please wait a moment before asking again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat payload.", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { messages, sessionId } = parsed.data;
    const sessionUser = await getSessionUser();

    const dealershipId = DEMO_DEALERSHIP.id;

    // Execute through backend AI Orchestrator
    const result = await processAiMessage(messages as any, {
      dealershipId,
      userRole: sessionUser?.role,
      userId: sessionUser?.id,
      sessionId,
    });

    // Record analytics event
    const lastMsg = messages[messages.length - 1];
    trackAnalyticsEvent(
      dealershipId,
      "AI_QUERY",
      { query: lastMsg.content, toolResultsCount: result.matchedVehicles?.length || 0 },
      sessionId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      {
        message: "I encountered an issue retrieving the latest inventory data. Please try again or browse our inventory catalog directly.",
      },
      { status: 500 }
    );
  }
}
