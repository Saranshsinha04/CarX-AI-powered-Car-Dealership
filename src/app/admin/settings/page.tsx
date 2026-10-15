import React from "react";
import { getDealership, getDealershipSettings } from "@/lib/db";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dealership Settings & White-Label | Northstar Motors Admin",
};

export default async function AdminSettingsPage() {
  const dealership = await getDealership(DEMO_DEALERSHIP.slug);
  const settings = await getDealershipSettings(DEMO_DEALERSHIP.id);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dealership Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure showroom branding, physical location details, financing parameters, and SEO tags.
        </p>
      </div>

      <AdminSettingsClient dealership={dealership} initialSettings={settings} />
    </div>
  );
}
