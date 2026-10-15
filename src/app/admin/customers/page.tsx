import React from "react";
import { getLeads } from "@/lib/db";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";
import { Users2, Phone, Mail, Calendar, MessageSquare, Car } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customers Directory | Northstar Motors Admin",
};

export default async function AdminCustomersPage() {
  const leads = await getLeads(DEMO_DEALERSHIP.id);

  // Group leads into unique customers
  const customersMap = new Map<string, any>();
  leads.forEach((l) => {
    const key = l.customerPhone || l.customerEmail;
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        name: l.customerName,
        phone: l.customerPhone,
        email: l.customerEmail,
        createdAt: l.createdAt,
        inquiriesCount: 1,
        vehicles: l.vehicle ? [l.vehicle] : [],
        lastStatus: l.status,
      });
    } else {
      const existing = customersMap.get(key);
      existing.inquiriesCount += 1;
      if (l.vehicle && !existing.vehicles.find((v: any) => v.id === l.vehicle.id)) {
        existing.vehicles.push(l.vehicle);
      }
    }
  });

  const customers = Array.from(customersMap.values());

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Customer Relationship Directory</h1>
        <p className="text-xs text-slate-400 mt-1">
          Unified customer profiles aggregated from website chats, appointments, and finance applications.
        </p>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 uppercase tracking-wider text-[11px] text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Vehicles of Interest</th>
                <th className="py-3.5 px-4">Total Interactions</th>
                <th className="py-3.5 px-4">Latest Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {customers.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white text-sm">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <a href={`tel:${c.phone}`} className="text-emerald-400 hover:underline">
                      {c.phone}
                    </a>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <a href={`mailto:${c.email}`} className="text-sky-400 hover:underline">
                      {c.email}
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    {c.vehicles.length > 0 ? (
                      c.vehicles.map((v: any) => (
                        <span key={v.id} className="block text-slate-200 font-medium">
                          {v.year} {v.make} {v.model}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">General Catalog</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {c.inquiriesCount} Inquiries
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-brand-300">
                      {c.lastStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
