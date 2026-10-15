"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatKm } from "@/lib/utils";
import { Car, Search, Filter, Plus, Edit3, Trash2, Check, ExternalLink } from "lucide-react";

interface AdminInventoryClientProps {
  initialVehicles: any[];
}

export function AdminInventoryClient({ initialVehicles }: AdminInventoryClientProps) {
  const [vehicles, setVehicles] = useState<any[]>(initialVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.stockNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by model, make, VIN, or stock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="ALL">All Statuses ({vehicles.length})</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 uppercase tracking-wider text-[11px] text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Body / Fuel</th>
                <th className="py-3.5 px-4">Transmission</th>
                <th className="py-3.5 px-4">Odometer</th>
                <th className="py-3.5 px-4">Price (INR)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredVehicles.map((car) => (
                <tr key={car.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                        <Image
                          src={car.images?.[0]?.url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                          alt={car.model}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-sm">
                          {car.year} {car.make} {car.model}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {car.stockNumber || car.vin || "NM-STOCK"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="block font-medium text-slate-200">{car.bodyType}</span>
                    <span className="text-[10px] text-slate-400">{car.fuelType}</span>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-300">
                    {car.transmission}
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    {car.mileageKm ? formatKm(car.mileageKm) : "New"}
                  </td>

                  <td className="py-3 px-4 font-bold text-emerald-400 text-sm">
                    {formatCurrency(car.price)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        car.status === "AVAILABLE"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : car.status === "RESERVED"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {car.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/inventory/${car.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
