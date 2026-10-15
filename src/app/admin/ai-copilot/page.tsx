import React from "react";
import { AdminCopilotClient } from "@/components/admin/AdminCopilotClient";

export const metadata = {
  title: "Admin AI Copilot | Northstar Motors",
};

export default function AdminCopilotPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dealership AI Copilot</h1>
        <p className="text-xs text-slate-400 mt-1">
          Authorized database assistant for sales reps, managers, and dealership admins.
        </p>
      </div>

      <AdminCopilotClient />
    </div>
  );
}
