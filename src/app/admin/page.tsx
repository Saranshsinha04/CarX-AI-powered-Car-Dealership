import React from "react";
import Link from "next/link";
import {
  Car,
  Users2,
  Calendar,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Phone,
  BarChart3,
} from "lucide-react";
import { getAnalyticsSummary } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const summary = await getAnalyticsSummary(DEMO_DEALERSHIP.id);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick AI Copilot trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dealership Command Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live PostgreSQL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Northstar Motors (Rajpur Road, Dehradun) • Real-time inventory & lead pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/ai-copilot"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Open AI Copilot</span>
          </Link>
          <Link
            href="/admin/inventory"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200"
          >
            Manage Inventory
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Vehicles */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Inventory Stock</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{summary.totalVehicles} Vehicles</div>
            <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">
              {summary.availableVehicles} Available for immediate delivery
            </p>
          </div>
        </div>

        {/* CRM Leads */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{summary.leadsCount} Leads</div>
            <p className="text-[11px] text-amber-400 mt-0.5 font-medium">
              {summary.highIntentLeads} High Intent (Score 80+)
            </p>
          </div>
        </div>

        {/* Test Drives */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Test Drives</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{summary.appointmentsCount} Total</div>
            <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">
              {summary.upcomingAppointments} Scheduled upcoming
            </p>
          </div>
        </div>

        {/* Pipeline Value & Conversion */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Est. Pipeline Value</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              ₹{(summary.pipelineValue / 10000000).toFixed(2)} Cr
            </div>
            <p className="text-[11px] text-brand-400 mt-0.5 font-medium">
              {summary.conversionRate}% Conversion closing rate
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: CRM Leads on Left, Test Drive Schedule on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent High-Intent Leads */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Active CRM Lead Pipeline</h3>
              <p className="text-xs text-slate-400 mt-0.5">Prioritized by AI intent scoring and engagement</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>View Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {summary.recentLeads.map((lead: any) => (
              <div
                key={lead.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{lead.customerName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lead.status === "QUALIFIED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : lead.status === "TEST_DRIVE"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : lead.status === "NEGOTIATION"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {lead.status}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Score: {lead.intentScore}/100
                    </span>
                  </div>

                  <p className="text-xs text-brand-300 font-medium">
                    Interest: {lead.vehicle ? `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}` : "General Inventory Inquiry"}
                  </p>

                  {lead.aiSummary && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                      AI Note: {lead.aiSummary}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs self-end sm:self-auto">
                  <a
                    href={`tel:${lead.customerPhone}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                  >
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>Call</span>
                  </a>
                  <Link
                    href={`/admin/leads?id=${lead.id}`}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Upcoming Drives</h3>
              <p className="text-xs text-slate-400 mt-0.5">Showroom & Doorstep Slots</p>
            </div>
            <Link
              href="/admin/appointments"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300"
            >
              All Slots
            </Link>
          </div>

          <div className="space-y-3">
            {summary.recentAppointments.map((apt: any) => (
              <div
                key={apt.id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white">{apt.customerName}</span>
                  <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                    {apt.status}
                  </span>
                </div>
                <p className="text-slate-300 font-medium">
                  {apt.vehicle ? `${apt.vehicle.make} ${apt.vehicle.model}` : "Vehicle"}
                </p>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{new Date(apt.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
