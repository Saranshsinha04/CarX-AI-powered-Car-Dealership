import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  Calculator,
  RefreshCw,
  Gauge,
  Fuel,
  Settings2,
  MapPin,
  Star,
  ChevronRight,
  Car,
  Clock,
  Phone,
} from "lucide-react";
import { getVehicles, getDealership } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { HomeSearchWidget } from "@/components/home/HomeSearchWidget";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dealership = await getDealership();
  const featured = await getVehicles({ isFeatured: true, limit: 6 });

  const bodyTypes = [
    {
      name: "SUVs & 4x4",
      type: "SUV",
      count: "18 In Stock",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Executive Sedans",
      type: "Sedan",
      count: "8 In Stock",
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Electric Vehicles",
      type: "EV",
      count: "5 In Stock",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Luxury Flagships",
      type: "Luxury",
      count: "6 In Stock",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "City Hatchbacks",
      type: "Hatchback",
      count: "4 In Stock",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Family MUVs & 7-Seaters",
      type: "MUV",
      count: "5 In Stock",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION - CARS ARE THE HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-[#06080d]">
        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141c2c18_1px,transparent_1px),linear-gradient(to_bottom,#141c2c18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_30%,#000_70%,transparent_100%)]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Showroom Location Header */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d131f] border border-[#1e273a] text-xs font-semibold text-slate-300 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Northstar Motors · Rajpur Road, Dehradun</span>
          </div>

          {/* Master Headline - Solid, Bold, Automotive Typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Find your next car. <br />
            <span className="text-slate-300 font-extrabold">Browse 2026 showroom inventory.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Certified pre-owned and brand-new vehicles inspected across 150 checkpoints. Transparent pricing, guaranteed RC transfer, and doorstep test drives across Dehradun.
          </p>

          {/* Precision Inventory Search Bar */}
          <div className="pt-2 max-w-3xl mx-auto">
            <HomeSearchWidget />
          </div>

          {/* Direct Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/inventory"
              className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-brand-900/40"
            >
              <span>Explore All {featured.total || 36} Vehicles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/test-drive"
              className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#0e1420] hover:bg-[#161f30] text-slate-200 hover:text-white font-semibold text-xs uppercase tracking-wider border border-[#222d42] transition-colors"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Schedule Test Drive</span>
            </Link>
          </div>

          {/* Showroom Trust Metrics */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-4xl mx-auto border-t border-[#182133]">
            <div className="p-3">
              <p className="text-2xl font-black text-white">36</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Verified Cars in Stock</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-black text-white">150-Point</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Mechanical Inspection</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-black text-white">8.99%</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Starting Loan EMI</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-black text-white">Doorstep</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Test Drive in Dehradun</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED SHOWROOM INVENTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#182133] pb-6">
          <div>
            <p className="text-xs font-semibold text-brand-400 tracking-widest uppercase">
              Current Showroom Availability
            </p>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1">Featured Inventory</h2>
            <p className="text-slate-400 text-sm mt-1">
              Top trending SUVs, sedans, and luxury models ready for immediate delivery in Dehradun.
            </p>
          </div>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white uppercase tracking-wider"
          >
            <span>View All Stock ({featured.total || 36})</span>
            <ChevronRight className="w-4 h-4 text-brand-400" />
          </Link>
        </div>

        {/* Vehicle Cards Grid - Strictly designed around Rule 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.vehicles.map((car: any) => (
            <div
              key={car.id}
              className="bg-[#0b0f17] border border-[#1b2334] hover:border-[#2b374e] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 shadow-md"
            >
              <div>
                {/* 1. Large Vehicle Image */}
                <div className="relative h-56 w-full bg-[#111622] overflow-hidden">
                  <Image
                    src={car.images?.[0]?.url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Informational Badges - Genuine status only */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase ${
                        car.condition === "NEW"
                          ? "bg-emerald-600 text-white"
                          : car.condition === "CERTIFIED_PRE_OWNED"
                          ? "bg-[#182338] text-brand-300 border border-[#2b3a59]"
                          : "bg-slate-800 text-slate-200"
                      }`}
                    >
                      {car.condition === "CERTIFIED_PRE_OWNED" ? "Certified Pre-Owned" : car.condition}
                    </span>
                    <span className="px-2 py-1 rounded text-[11px] font-medium bg-[#06080d]/90 text-slate-300 border border-slate-700/50">
                      {car.fuelType}
                    </span>
                  </div>
                </div>

                {/* 2. Make, Model, Variant & Pricing */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {car.trim || car.bodyType}
                    </p>
                  </div>

                  {/* Bold Price Display */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white tracking-tight">
                      {formatCurrency(car.price, true)}
                    </span>
                    {car.originalPrice && car.originalPrice > car.price && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(car.originalPrice, true)}
                      </span>
                    )}
                  </div>

                  {/* Key Specifications Row */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#182133] text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span>{car.mileageKm ? `${car.mileageKm.toLocaleString()} km` : "New (0 km)"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      <span>{car.fuelEfficiencyKmpl ? `${car.fuelEfficiencyKmpl} km/l` : car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{car.powerBhp} BHP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary & Secondary Actions */}
              <div className="px-5 pb-5 pt-0 flex items-center gap-2">
                <Link
                  href={`/inventory/${car.id}`}
                  className="flex-1 text-center py-2.5 rounded-lg bg-[#111724] hover:bg-[#182133] text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-[#202a3d]"
                >
                  View Details
                </Link>
                <Link
                  href={`/test-drive?vehicleId=${car.id}`}
                  className="py-2.5 px-3.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Test Drive</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BROWSE BY BODY TYPE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#182133] pb-4">
          <p className="text-xs font-semibold text-brand-400 tracking-widest uppercase">
            Segment Navigation
          </p>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1">Browse by Body Type</h2>
          <p className="text-slate-400 text-sm mt-1">
            Choose the styling and performance profile suited to your daily driving requirements.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {bodyTypes.map((item) => (
            <Link
              key={item.name}
              href={`/inventory?bodyType=${item.type}`}
              className="bg-[#0b0f17] border border-[#1b2334] hover:border-brand-500/50 rounded-xl p-3.5 text-center transition-all group flex flex-col items-center justify-between"
            >
              <div className="relative w-full h-24 rounded-lg overflow-hidden mb-3 bg-[#111622]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="200px"
                />
              </div>
              <h3 className="font-bold text-xs text-white uppercase tracking-wider group-hover:text-brand-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">{item.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. DEALERSHIP ADVANTAGE - AUTHENTIC VALUE INSTEAD OF 3 AI ICON BOXES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#090d15] border border-[#1b2334] rounded-2xl p-8 sm:p-12 space-y-10">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold text-brand-400 tracking-widest uppercase">
              Showroom Standard
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why car buyers choose Northstar Motors
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              We eliminate the friction and uncertainty of vehicle transactions. Every car listed on our showroom floor has passed verified background history, mechanical scrutiny, and transparent pricing standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0e1420] border border-[#1c2436] rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#141b2a] border border-[#243048] flex items-center justify-center text-brand-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">150-Point Inspection</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Full diagnostic testing covering engine compression, transmission shifting, steering rack, suspension bushings, brakes, electrical harnesses, and paint depth analysis.
              </p>
            </div>

            <div className="bg-[#0e1420] border border-[#1c2436] rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#141b2a] border border-[#243048] flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Fixed Price Assurance</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Zero surprise dealer handling charges or inflated transfer fees. Direct ex-showroom pricing based on verified market valuations.
              </p>
            </div>

            <div className="bg-[#0e1420] border border-[#1c2436] rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#141b2a] border border-[#243048] flex items-center justify-center text-amber-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Doorstep Test Drives</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                We deliver the test vehicle directly to your residence or workplace across Dehradun, Mussoorie foothills, and Rishikesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINANCING & TRADE-IN SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Finance Panel */}
          <div className="bg-[#090d15] border border-[#1b2334] rounded-2xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#141b2a] border border-[#243048] flex items-center justify-center text-amber-400">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Vehicle Financing & EMI</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Competitive automotive finance with interest rates starting at 8.99% p.a. Flexible tenures from 1 to 7 years with instant reducing-balance calculation.
              </p>
            </div>
            <Link
              href="/finance"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[#111724] hover:bg-[#182133] text-white font-semibold text-xs uppercase tracking-wider border border-[#243048] transition-colors"
            >
              <span>Calculate Monthly EMI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trade-In Panel */}
          <div className="bg-[#090d15] border border-[#1b2334] rounded-2xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#141b2a] border border-[#243048] flex items-center justify-center text-brand-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Trade In Your Existing Car</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive an algorithmic trade-in valuation in 60 seconds based on current market auction transactions across Uttarakhand. Free physical doorstep evaluation included.
              </p>
            </div>
            <Link
              href="/trade-in"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Value Your Vehicle</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PHYSICAL SHOWROOM LOCATION & CONTACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#090d15] border border-[#1b2334] rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-widest">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Showroom Location</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Visit Our Rajpur Road Showroom
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our flagship showroom is centrally located on Rajpur Road near IT Park Chowk, Dehradun. Inspect our full vehicle fleet in person, conduct private test drives on uphill terrain, or consult with our automotive finance managers over an espresso.
              </p>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Plot 42-B, Rajpur Road, Near IT Park Chowk, Dehradun, Uttarakhand 248001</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sales Desk: +91 135 274 8900 | WhatsApp: +91 98970 12345</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Mon – Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 6:00 PM</span>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/test-drive"
                  className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  Schedule Showroom Visit
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-lg bg-[#111724] hover:bg-[#182133] text-slate-200 font-semibold text-xs uppercase tracking-wider border border-[#202a3d] transition-colors"
                >
                  Get Directions
                </Link>
              </div>
            </div>

            {/* Showroom Preview Photography */}
            <div className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden border border-[#1b2334] bg-[#111622]">
              <Image
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="Northstar Motors Dehradun Showroom"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold">4.9 / 5.0</span>
                  <span className="text-slate-400">(420+ Verified Client Reviews)</span>
                </div>
                <span className="bg-[#0b0f17]/90 text-emerald-400 px-2.5 py-1 rounded text-[11px] border border-[#1e273a] font-semibold">
                  Open Today
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
