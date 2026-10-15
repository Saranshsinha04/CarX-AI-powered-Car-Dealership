import React from "react";
import { getAnalyticsSummary } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";
import { BarChart3, TrendingUp, Sparkles, Car, Users2, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analytics & Intelligence | Northstar Motors Admin",
};

export default async function AdminAnalyticsPage() {
  const summary = await getAnalyticsSummary(DEMO_DEALERSHIP.id);

  const eventMetrics = [
    { label: "Vehicle Detail Page Views", count: "1,840", change: "+18% this week" },
    { label: "AI Search & Queries", count: "482", change: "+42% this week" },
    { label: "Test Drives Booked", count: "68", change: "+24% this week" },
    { label: "Financing Calculations", count: "215", change: "+12% this week" },
    { label: "Trade-in Valuations", count: "94", change: "+8% this week" },
    { label: "Qualified CRM Leads", count: "45", change: "+15% this week" },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dealership Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          PostgreSQL-logged customer behavior, search analytics, and conversion funnels.
        </p>
      </div>

      {/* Top Event Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {eventMetrics.map((m) => (
          <div key={m.label} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block line-clamp-1">
              {m.label}
            </span>
            <p className="text-2xl font-black text-white">{m.count}</p>
            <span className="text-[10px] text-emerald-400 font-medium block">{m.change}</span>
          </div>
        ))}
      </div>

      {/* Top Performing Vehicles & Inquiries Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top In-Demand Vehicles */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Top Viewed Vehicles</h3>
            <span className="text-xs text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-3">
            {summary.topViewedVehicles.map((car: any, idx: number) => (
              <div
                key={car.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 font-black text-slate-500">#{idx + 1}</span>
                  <div>
                    <span className="font-bold text-white block">
                      {car.year} {car.make} {car.model}
                    </span>
                    <span className="text-[11px] text-slate-400">{car.trim || car.bodyType}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-emerald-400 block">{formatCurrency(car.price)}</span>
                  <span className="text-[10px] text-slate-500">140+ views</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Conversion Funnel */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-white">Customer Acquisition Funnel</h3>

          <div className="space-y-3 pt-2">
            {[
              { stage: "Website Visitors & Catalog Browsers", pct: 100, count: "8,400" },
              { stage: "AI Vehicle Finder Engagements", pct: 45, count: "3,780" },
              { stage: "Vehicle Detail Page Views", pct: 30, count: "2,520" },
              { stage: "Test Drive / Lead Inquiries", pct: 12, count: "1,008" },
              { stage: "Showroom Negotiation", pct: 6, count: "504" },
              { stage: "Car Purchases Delivered", pct: 3.5, count: "294" },
            ].map((f) => (
              <div key={f.stage} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{f.stage}</span>
                  <span className="text-slate-400">{f.count} ({f.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full"
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
