import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getVehicles, getVehiclesForComparison } from "@/lib/db";
import { formatCurrency, formatKm } from "@/lib/utils";
import { Layers, ArrowRight, Check, X, CalendarCheck } from "lucide-react";

interface ComparePageProps {
  searchParams: {
    ids?: string;
    add?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const allVehiclesRes = await getVehicles({ limit: 40 });
  const allVehicles = allVehiclesRes.vehicles;

  let vehicleIds: string[] = [];
  if (searchParams.ids) {
    vehicleIds = searchParams.ids.split(",").filter(Boolean);
  } else if (searchParams.add) {
    vehicleIds = [searchParams.add, allVehicles[0]?.id].filter(Boolean);
  } else {
    // Default comparison between two popular SUVs: Creta & Thar or XUV700
    vehicleIds = [allVehicles[0]?.id, allVehicles[1]?.id].filter(Boolean);
  }

  const comparedVehicles = await getVehiclesForComparison(vehicleIds);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-brand-400">Compare</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Compare Vehicles</h1>
        <p className="text-slate-400 text-sm mt-1">
          Detailed side-by-side technical evaluation across powertrain, dimensions, comfort, and real pricing.
        </p>
      </div>

      {/* Comparison Selector / Quick Switcher */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-slate-300">Quick Compare:</span>
        <Link
          href={`/compare?ids=${allVehicles[0]?.id},${allVehicles[1]?.id}`}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
        >
          Hyundai Creta vs Mahindra Thar
        </Link>
        <Link
          href={`/compare?ids=${allVehicles[2]?.id},${allVehicles[3]?.id}`}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
        >
          Scorpio-N vs XUV700
        </Link>
        <Link
          href={`/compare?ids=${allVehicles[4]?.id},${allVehicles[8]?.id}`}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
        >
          Tata Nexon.ev vs Honda City Hybrid
        </Link>
      </div>

      {/* Comparison Matrix Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-sm text-slate-200 min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60">
              <th className="p-5 text-slate-400 font-bold uppercase text-xs w-1/4">Feature / Metric</th>
              {comparedVehicles.map((car: any) => (
                <th key={car.id} className="p-5 w-1/3 align-top">
                  <div className="space-y-3">
                    <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900">
                      <Image
                        src={car.images?.[0]?.url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                        alt={car.model}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <p className="text-xs text-slate-400">{car.trim}</p>
                      <p className="text-lg font-black text-emerald-400 mt-1">
                        {formatCurrency(car.price)}
                      </p>
                    </div>
                    <Link
                      href={`/test-drive?vehicleId=${car.id}`}
                      className="block text-center py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
                    >
                      Book Test Drive
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 text-xs">
            {/* Powertrain */}
            <tr className="bg-slate-900/40">
              <td colSpan={comparedVehicles.length + 1} className="p-3 text-xs font-bold text-brand-400 uppercase tracking-wider">
                Powertrain & Performance
              </td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Power Output</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 font-bold text-white">{car.powerBhp} BHP</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Peak Torque</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 font-bold text-white">{car.torqueNm} Nm</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Transmission</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 text-slate-200">{car.transmission}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Fuel Type</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 text-slate-200">{car.fuelType}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Fuel Economy / Range</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 font-semibold text-emerald-400">
                  {car.fuelEfficiencyKmpl ? `${car.fuelEfficiencyKmpl} km/l` : "EV Certified Range"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Drivetrain</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 text-slate-200">{car.drivetrain || "FWD"}</td>
              ))}
            </tr>

            {/* Practicality & Dimensions */}
            <tr className="bg-slate-900/40">
              <td colSpan={comparedVehicles.length + 1} className="p-3 text-xs font-bold text-brand-400 uppercase tracking-wider">
                Dimensions & Practicality
              </td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Seating Capacity</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 font-bold text-white">{car.seatingCapacity} Seater</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Body Type</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 text-slate-200">{car.bodyType}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Odometer / Condition</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 text-slate-200">
                  {car.mileageKm ? formatKm(car.mileageKm) : "Brand New (0 km)"} • {car.condition}
                </td>
              ))}
            </tr>

            {/* Ownership & Warranty */}
            <tr className="bg-slate-900/40">
              <td colSpan={comparedVehicles.length + 1} className="p-3 text-xs font-bold text-brand-400 uppercase tracking-wider">
                Warranty & Ownership
              </td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Warranty Coverage</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 text-slate-300">{car.warranty || "Standard 1-Year Coverage"}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-400">Ownership History</td>
              {comparedVehicles.map((car: any) => (
                <td key={car.id} className="p-4 text-slate-300">{car.ownershipHistory || "1st Owner"}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
