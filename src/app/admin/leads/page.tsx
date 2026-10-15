import React from "react";
import { getLeads } from "@/lib/db";
import { CrmPipelineClient } from "@/components/admin/CrmPipelineClient";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CRM Leads Pipeline | Northstar Motors Admin",
};

export default async function AdminLeadsPage() {
  const leads = await getLeads(DEMO_DEALERSHIP.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">CRM Lead Pipeline</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline across 7 deal stages from website inquiries, AI chats, and test drives.
          </p>
        </div>
      </div>

      <CrmPipelineClient initialLeads={leads} />
    </div>
  );
}
