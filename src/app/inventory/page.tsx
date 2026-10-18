import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Filter,
  Search,
  Gauge,
  Fuel,
  Settings2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Compass,
} from "lucide-react";
import { getVehicles } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

interface InventoryPageProps {
  searchParams: {
    make?: string;
    bodyType?: string;
    fuelType?: string;
    transmission?: string;
    condition?: string;
    minPrice?: string;
    maxPrice?: string;
    seatingCapacity?: string;
    search?: string;
    sortBy?: string;
    page?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice, 10) : undefined;
  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice, 10) : undefined;

  const data = await getVehicles({
    make: searchParams.make,
    bodyType: searchParams.bodyType,
    fuelType: searchParams.fuelType,
    transmission: searchParams.transmission,
    condition: searchParams.condition,
    minPrice,
    maxPrice,
    search: searchParams.search,
    sortBy: (searchParams.sortBy as any) || "recommended",
    page,
    limit: 9,
    status: "AVAILABLE",
  });

  const makes = ["Hyundai", "Mahindra", "Tata", "Toyota", "Honda", "Volkswagen", "Skoda", "Maruti Suzuki", "BMW", "Kia"];
  const bodyTypes = ["SUV", "Sedan", "Hatchback", "EV", "Luxury", "MUV"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const transmissions = ["Automatic", "Manual", "DCT", "CVT"];
  const conditions = [
    { label: "All Stock", value: "" },
    { label: "Brand New", value: "NEW" },
    { label: "Certified Pre-Owned", value: "CERTIFIED_PRE_OWNED" },
    { label: "Used", value: "USED" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">Showroom</Link>
          <span>/</span>
          <span className="text-white font-semibold">Inventory</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182133] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Showroom Inventory</h1>
            <p className="text-slate-400 text-sm mt-1">
              Showing {data.vehicles.length} of {data.total} vehicles currently available at Northstar Motors, Dehradun.
            </p>
          </div>

          {/* Quick Concierge Trigger */}
          <Link
            href="/?askAi=true"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#111724] hover:bg-[#182133] text-slate-200 hover:text-white text-xs font-semibold uppercase tracking-wider border border-[#243048] transition-colors"
          >
            <Compass className="w-4 h-4 text-brand-400" />
            <span>Digital Concierge Search</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FILTERS SIDEBAR */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-[#090d15] border border-[#1b2334] rounded-xl p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#182133] pb-3">
              <div className="flex items-center gap-2 font-bold text-white text-xs uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-brand-400" />
                <span>Filter Inventory</span>
              </div>
              <Link
                href="/inventory"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </Link>
            </div>

            {/* Condition Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Condition</label>
              <div className="space-y-1">
                {conditions.map((c) => (
                  <Link
                    key={c.label}
                    href={`/inventory?${new URLSearchParams({
                      ...searchParams,
                      condition: c.value,
                      page: "1",
                    }).toString()}`}
                    className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      (searchParams.condition || "") === c.value
                        ? "bg-brand-600 text-white font-semibold"
                        : "text-slate-300 hover:bg-[#111622] hover:text-white"
                    }`}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Body Type Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Body Type</label>
              <div className="flex flex-wrap gap-1.5">
                {bodyTypes.map((bt) => {
                  const active = searchParams.bodyType === bt;
                  return (
                    <Link
                      key={bt}
                      href={`/inventory?${new URLSearchParams({
                        ...searchParams,
                        bodyType: active ? "" : bt,
                        page: "1",
                      }).toString()}`}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        active
                          ? "bg-brand-600 text-white font-semibold"
                          : "bg-[#0e1420] text-slate-300 hover:bg-[#161f30] border border-[#1e273a]"
                      }`}
                    >
                      {bt}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Transmission Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transmission</label>
              <div className="flex flex-wrap gap-1.5">
                {transmissions.map((tr) => {
                  const active = searchParams.transmission === tr;
                  return (
                    <Link
                      key={tr}
                      href={`/inventory?${new URLSearchParams({
                        ...searchParams,
                        transmission: active ? "" : tr,
                        page: "1",
                      }).toString()}`}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        active
                          ? "bg-brand-600 text-white font-semibold"
                          : "bg-[#0e1420] text-slate-300 hover:bg-[#161f30] border border-[#1e273a]"
                      }`}
                    >
                      {tr}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Fuel Type Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fuel Type</label>
              <div className="flex flex-wrap gap-1.5">
                {fuelTypes.map((ft) => {
                  const active = searchParams.fuelType === ft;
                  return (
                    <Link
                      key={ft}
                      href={`/inventory?${new URLSearchParams({
                        ...searchParams,
                        fuelType: active ? "" : ft,
                        page: "1",
                      }).toString()}`}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        active
                          ? "bg-brand-600 text-white font-semibold"
                          : "bg-[#0e1420] text-slate-300 hover:bg-[#161f30] border border-[#1e273a]"
                      }`}
                    >
                      {ft}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Make Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Manufacturer</label>
              <div className="flex flex-wrap gap-1.5">
                {makes.map((mk) => {
                  const active = searchParams.make === mk;
                  return (
                    <Link
                      key={mk}
                      href={`/inventory?${new URLSearchParams({
                        ...searchParams,
                        make: active ? "" : mk,
                        page: "1",
                      }).toString()}`}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        active
                          ? "bg-brand-600 text-white font-semibold"
                          : "bg-[#0e1420] text-slate-400 hover:text-white hover:bg-[#161f30] border border-[#1c2436]"
                      }`}
                    >
                      {mk}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* INVENTORY LISTING COLUMN */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Search & Sort Bar */}
          <div className="bg-[#090d15] border border-[#1b2334] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <form action="/inventory" method="GET" className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search}
                placeholder="Search Creta, Thar, EV, 7-seater..."
                className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              {searchParams.bodyType && <input type="hidden" name="bodyType" value={searchParams.bodyType} />}
              {searchParams.fuelType && <input type="hidden" name="fuelType" value={searchParams.fuelType} />}
              {searchParams.condition && <input type="hidden" name="condition" value={searchParams.condition} />}
            </form>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-400">
              <span className="uppercase tracking-wider text-[11px] font-semibold">Sort:</span>
              <div className="flex items-center gap-1">
                {[
                  { label: "Recommended", val: "recommended" },
                  { label: "Price: Low to High", val: "price_asc" },
                  { label: "Price: High to Low", val: "price_desc" },
                  { label: "Newest", val: "year_desc" },
                ].map((s) => {
                  const active = (searchParams.sortBy || "recommended") === s.val;
                  return (
                    <Link
                      key={s.val}
                      href={`/inventory?${new URLSearchParams({
                        ...searchParams,
                        sortBy: s.val,
                        page: "1",
                      }).toString()}`}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        active
                          ? "bg-[#161f30] text-white border border-[#2b3a56]"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          {data.vehicles.length === 0 ? (
            <div className="bg-[#090d15] border border-[#1b2334] rounded-xl p-12 text-center space-y-4">
              <Car className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-xl font-bold text-white">No vehicles match those criteria</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try widening your search terms or clearing specific filters to view available showroom stock.
              </p>
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider"
              >
                Clear All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.vehicles.map((car: any) => (
                <div
                  key={car.id}
                  className="bg-[#0b0f17] border border-[#1b2334] hover:border-[#2b374e] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 shadow-md"
                >
                  <div>
                    {/* 1. Large Vehicle Image */}
                    <div className="relative h-48 w-full bg-[#111622] overflow-hidden">
                      <Image
                        src={car.images?.[0]?.url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                        alt={`${car.year} ${car.make} ${car.model}`}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 350px"
                      />

                      {/* Genuine Status Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                            car.condition === "NEW"
                              ? "bg-emerald-600 text-white"
                              : car.condition === "CERTIFIED_PRE_OWNED"
                              ? "bg-[#182338] text-brand-300 border border-[#2b3a59]"
                              : "bg-slate-800 text-slate-200"
                          }`}
                        >
                          {car.condition === "CERTIFIED_PRE_OWNED" ? "Certified" : car.condition}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#06080d]/90 text-slate-300 border border-slate-700/50">
                          {car.fuelType}
                        </span>
                      </div>
                    </div>

                    {/* 2. Make, Model, Variant & Pricing */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-white">
                          {car.year} {car.make} {car.model}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{car.trim || car.bodyType}</p>
                      </div>

                      {/* Bold Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-white tracking-tight">
                          {formatCurrency(car.price, true)}
                        </span>
                        {car.originalPrice && car.originalPrice > car.price && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatCurrency(car.originalPrice, true)}
                          </span>
                        )}
                      </div>

                      {/* Key Specifications Row */}
                      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[#182133] text-[11px] text-slate-300">
                        <div className="flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{car.mileageKm ? `${car.mileageKm.toLocaleString()} km` : "New (0 km)"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Fuel className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{car.fuelEfficiencyKmpl ? `${car.fuelEfficiencyKmpl} km/l` : car.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Settings2 className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{car.powerBhp} BHP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary & Secondary Actions */}
                  <div className="px-4 pb-4 pt-0 flex items-center gap-2">
                    <Link
                      href={`/inventory/${car.id}`}
                      className="flex-1 text-center py-2 rounded-lg bg-[#111724] hover:bg-[#182133] text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-[#202a3d]"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/test-drive?vehicleId=${car.id}`}
                      className="py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <CalendarCheck className="w-3 h-3" />
                      <span>Test Drive</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#182133] pt-6">
              <p className="text-xs text-slate-400">
                Page {data.page} of {data.totalPages} ({data.total} total vehicles)
              </p>
              <div className="flex items-center gap-2">
                {data.page > 1 && (
                  <Link
                    href={`/inventory?${new URLSearchParams({
                      ...searchParams,
                      page: (data.page - 1).toString(),
                    }).toString()}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0e1420] text-slate-300 hover:text-white border border-[#1e273a] text-xs font-semibold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </Link>
                )}
                {data.page < data.totalPages && (
                  <Link
                    href={`/inventory?${new URLSearchParams({
                      ...searchParams,
                      page: (data.page + 1).toString(),
                    }).toString()}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
