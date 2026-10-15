import React from "react";
import { getAppointments } from "@/lib/db";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Test Drive Appointments | Northstar Motors Admin",
};

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments(DEMO_DEALERSHIP.id);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Test Drive Appointments</h1>
        <p className="text-xs text-slate-400 mt-1">
          Showroom and doorstep test drives scheduled across Dehradun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {appointments.map((apt: any) => (
          <div
            key={apt.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-base">{apt.customerName}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    apt.status === "UPCOMING"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : apt.status === "COMPLETED"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Vehicle</span>
                <p className="text-xs font-bold text-white">
                  {apt.vehicle ? `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}` : "Vehicle"}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    {new Date(apt.scheduledAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{apt.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a href={`tel:${apt.customerPhone}`} className="hover:underline">
                    {apt.customerPhone}
                  </a>
                </div>
              </div>

              {apt.notes && (
                <p className="text-[11px] text-slate-400 italic bg-slate-950 p-2 rounded-lg border border-slate-800">
                  {apt.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[10px]">ID: {apt.id.slice(-6)}</span>
              <a
                href={`tel:${apt.customerPhone}`}
                className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
              >
                Contact Customer
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
