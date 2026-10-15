import React from "react";
import { getVehicles } from "@/lib/db";
import { AdminInventoryClient } from "@/components/admin/AdminInventoryClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inventory Management | Northstar Motors Admin",
};

export default async function AdminInventoryPage() {
  const result = await getVehicles({ limit: 100, status: "ALL" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Inventory Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage showroom vehicles, pricing, availability status, and specifications.
          </p>
        </div>
      </div>

      <AdminInventoryClient initialVehicles={result.vehicles} />
    </div>
  );
}
