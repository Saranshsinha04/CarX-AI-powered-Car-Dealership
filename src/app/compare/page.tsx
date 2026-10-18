import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getVehicles, getVehiclesForComparison } from "@/lib/db";
import { formatCurrency, formatKm } from "@/lib/utils";
import { CalendarCheck } from "lucide-react";

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
    vehicleIds = [allVehicles[0]?.id, allVehicles[1]?.id].filter(Boolean);
  }

  const comparedVehicles = await getVehiclesForComparison(vehicleIds);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">Showroom</Link>
          <span>/</span>
          <span className="text-white font-semibold">Compare</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Compare Vehicles</h1>
        <p className="text-slate-400 text-sm mt-1">
          Detailed side-by-side technical evaluation across powertrain, dimensions, comfort, and real pricing.
        </p>
      </div>

      {/* Comparison Selector / Quick Switcher */}
      <div className="bg-[#090d15] border border-[#1b2334] rounded-xl p-4 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Compare:</span>
        <Link
          href={`/compare?ids=${allVehicles[0]?.id},${allVehicles[1]?.id}`}
          className="text-xs px-3 py-1.5 rounded-md bg-[#0e1420] hover:bg-[#161f30] text-slate-200 border border-[#1e273a] transition-colors"
        >
          Hyundai Creta vs Mahindra Thar
        </Link>
        <Link
          href={`/compare?ids=${allVehicles[2]?.id},${allVehicles[3]?.id}`}
          className="text-xs px-3 py-1.5 rounded-md bg-[#0e1420] hover:bg-[#161f30] text-slate-200 border border-[#1e273a] transition-colors"
        >
          Scorpio-N vs XUV700
        </Link>
        <Link
          href={`/compare?ids=${allVehicles[4]?.id},${allVehicles[8]?.id}`}
          className="text-xs px-3 py-1.5 rounded-md bg-[#0e1420] hover:bg-[#161f30] text-slate-200 border border-[#1e273a] transition-colors"
        >
          Tata Nexon.ev vs Honda City Hybrid
        </Link>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-[#090d15] border border-[#1b2334] rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs sm:text-sm text-slate-200 min-w-[700px]">
          <thead>
            <tr className="border-b border-[#182133] bg-[#0b0f17]">
              <th className="p-5 text-slate-400 font-bold uppercase text-xs w-1/4">Specification</th>
              {comparedVehicles.map((car: any) => (
                <th key={car.id} className="p-5 w-1/3 align-top">
                  <div className="space-y-3">
                    <div className="relative h-40 w-full rounded-lg overflow-hidden bg-[#111622]">
                      <Image
                        src={car.images?.[0]?.url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                        alt={car.model}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-white">
                        {car.year} {car.make} {car.model}
                      </h2>
                      <p className="text-xs text-slate-400">{car.trim}</p>
                      <p className="text-xl font-black text-white mt-1">
                        {formatCurrency(car.price)}
                      </p>
                    </div>
                    <Link
                      href={`/test-drive?vehicleId=${car.id}`}
                      className="block text-center py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                    >
                      Test Drive
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#182133] text-xs">
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Condition</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 font-semibold text-white">
                  {c.condition === "CERTIFIED_PRE_OWNED" ? "Certified Pre-Owned" : c.condition}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Body Type</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 text-slate-200">{c.bodyType}</td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Mileage (Odometer)</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 text-slate-200 font-medium">
                  {c.mileageKm ? formatKm(c.mileageKm) : "Brand New (0 km)"}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Fuel Type</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 text-slate-200">{c.fuelType}</td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Transmission</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 text-slate-200">{c.transmission}</td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Engine Output</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 text-slate-200 font-medium">
                  {c.powerBhp} BHP {c.engineCapacityCc ? `(${c.engineCapacityCc} cc)` : ""}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Torque</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 text-slate-200">{c.torqueNm} Nm</td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Fuel Economy / Range</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 text-slate-200">
                  {c.fuelEfficiencyKmpl ? `${c.fuelEfficiencyKmpl} km/l` : "Electric Certified"}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Drivetrain</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 text-slate-200">{c.drivetrain || "Front-Wheel Drive"}</td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Seating Capacity</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 text-slate-200">{c.seatingCapacity} Passengers</td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Warranty</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4 text-slate-200">{c.warranty || "Standard 1-Year"}</td>
              ))}
            </tr>
            <tr className="hover:bg-[#0e1420]">
              <td className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Action</td>
              {comparedVehicles.map((c: any) => (
                <td key={c.id} className="p-4">
                  <Link
                    href={`/inventory/${c.id}`}
                    className="inline-block py-1.5 px-3 rounded-md bg-[#111724] hover:bg-[#182133] text-white font-semibold text-xs border border-[#243048] transition-colors uppercase tracking-wider"
                  >
                    View Full Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
