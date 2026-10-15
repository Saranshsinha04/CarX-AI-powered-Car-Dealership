import React from "react";
import { DEMO_USERS } from "@/lib/data/seedData";
import { ShieldCheck, UserCheck, Key, Lock, Plus } from "lucide-react";

export const metadata = {
  title: "Staff Users & RBAC Roles | Northstar Motors Admin",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Staff & Access Control (RBAC)</h1>
        <p className="text-xs text-slate-400 mt-1">
          Role-Based Access Control enforcing strict separation of privileges across dealership employees.
        </p>
      </div>

      {/* Staff List */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Active Showroom Staff Accounts</h3>
          <span className="text-xs text-slate-400">Total: {DEMO_USERS.length} Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 uppercase tracking-wider text-[11px] text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {DEMO_USERS.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block text-sm">{usr.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: {usr.id}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{usr.email}</td>
                  <td className="py-3.5 px-4 text-slate-400">{usr.phone}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        usr.role === "DEALERSHIP_ADMIN"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : usr.role === "SALES_MANAGER"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : usr.role === "SALES_AGENT"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {usr.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{usr.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Permissions Matrix */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white">Role-Based Access Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-bold text-purple-400 uppercase text-[10px] tracking-wider block">
              Dealership Admin
            </span>
            <ul className="space-y-1 text-slate-300">
              <li>✓ Full inventory CRUD & pricing controls</li>
              <li>✓ Manage CRM stages & reassign leads</li>
              <li>✓ Full dealership settings & white-label edit</li>
              <li>✓ Access AI Copilot analytics & financial data</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">
              Sales Manager
            </span>
            <ul className="space-y-1 text-slate-300">
              <li>✓ Full CRM lead pipeline management</li>
              <li>✓ Assign leads to agents & track followups</li>
              <li>✓ Schedule & reassign test drive appointments</li>
              <li>✓ AI Copilot sales funnel analytics</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider block">
              Sales Agent
            </span>
            <ul className="space-y-1 text-slate-300">
              <li>✓ View assigned customer leads</li>
              <li>✓ Add notes & update lead deal stages</li>
              <li>✓ Execute scheduled test drives</li>
              <li>✓ View inventory stock & live specifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
