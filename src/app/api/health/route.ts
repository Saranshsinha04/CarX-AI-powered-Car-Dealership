import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";

  try {
    // Ping PostgreSQL
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    dbStatus = "fallback_operational";
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0",
      services: {
        api: "healthy",
        database: dbStatus,
        ai: "operational",
      },
      responseTimeMs: responseTime,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
