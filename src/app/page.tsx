import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
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
  Layers,
  ChevronRight,
  BadgeCheck,
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
      count: "18+ In Stock",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Executive Sedans",
      type: "Sedan",
      count: "8+ In Stock",
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Electric Vehicles (EV)",
      type: "EV",
      count: "5+ In Stock",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Luxury Flagships",
      type: "Luxury",
      count: "6+ In Stock",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "City Hatchbacks",
      type: "Hatchback",
      count: "4+ In Stock",
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Family MUVs & 7-Seaters",
      type: "MUV",
      count: "5+ In Stock",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Ambient background glow and grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(12,135,235,0.22),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-brand-500/30 text-xs font-semibold text-brand-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Northstar Motors • Rajpur Road, Dehradun</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Find the car that <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              fits your life.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            Explore our curated inventory, compare vehicles side-by-side, and let our AI assistant guide you directly to your ideal drive.
          </p>

          {/* Interactive AI Search Widget */}
          <div className="pt-2 max-w-3xl mx-auto">
            <HomeSearchWidget />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/inventory"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore All Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/test-drive"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl glass-panel text-slate-200 hover:text-white hover:bg-slate-900/90 font-semibold text-sm transition-all"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Book Showroom Test Drive</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-4xl mx-auto border-t border-slate-800/60">
            <div className="p-3">
              <p className="text-2xl font-black text-white">35+</p>
              <p className="text-xs text-slate-400 mt-0.5">Verified Cars in Stock</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-black text-brand-400">150-Point</p>
              <p className="text-xs text-slate-400 mt-0.5">Quality Certification</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-black text-amber-400">8.99%</p>
              <p className="text-xs text-slate-400 mt-0.5">Instant Loan EMI</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-black text-emerald-400">Doorstep</p>
              <p className="text-xs text-slate-400 mt-0.5">Test Drives in Dehradun</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED INVENTORY CAROUSEL/GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Handpicked Vehicles</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white mt-1">Featured Showroom Inventory</h2>
            <p className="text-slate-400 text-sm mt-1">
              Top trending SUVs, sedans, and luxury models ready for immediate delivery in Dehradun.
            </p>
          </div>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300"
          >
            <span>View All {featured.total} Vehicles</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.vehicles.map((car: any) => (
            <div
              key={car.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={car.images?.[0]?.url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold backdrop-blur-md ${
                        car.condition === "NEW"
                          ? "bg-emerald-600/90 text-white"
                          : car.condition === "CERTIFIED_PRE_OWNED"
                          ? "bg-purple-600/90 text-white"
                          : "bg-slate-800/90 text-slate-200"
                      }`}
                    >
                      {car.condition === "CERTIFIED_PRE_OWNED" ? "Certified" : car.condition}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-semibold bg-black/60 text-slate-200 backdrop-blur-md">
                      {car.fuelType}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="text-xl font-extrabold text-white tracking-tight">
                        {formatCurrency(car.price, true)}
                      </p>
                      {car.originalPrice && car.originalPrice > car.price && (
                        <p className="text-xs text-slate-400 line-through">
                          {formatCurrency(car.originalPrice, true)}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-1 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {car.transmission}
                    </span>
                  </div>
                </div>

                {/* Car Title & Specs Grid */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-brand-400 transition-colors">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{car.trim || car.bodyType}</p>
                  </div>

                  {/* Spec pills */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span>{car.mileageKm ? `${car.mileageKm.toLocaleString()} km` : "Brand New"}</span>
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

              {/* Action Buttons */}
              <div className="px-5 pb-5 pt-0 flex items-center gap-2">
                <Link
                  href={`/inventory/${car.id}`}
                  className="flex-1 text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors border border-slate-800"
                >
                  View Full Details
                </Link>
                <Link
                  href={`/test-drive?vehicleId=${car.id}`}
                  className="py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center gap-1"
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
        <div>
          <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 text-brand-400" />
            <span>Tailored Segments</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-1">Browse by Body Type</h2>
          <p className="text-slate-400 text-sm mt-1">
            Choose the styling and performance profile suited to your daily driving needs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {bodyTypes.map((item) => (
            <Link
              key={item.name}
              href={`/inventory?bodyType=${item.type}`}
              className="glass-card rounded-2xl p-4 text-center hover:border-brand-500/50 transition-all group flex flex-col items-center justify-between"
            >
              <div className="relative w-full h-24 rounded-xl overflow-hidden mb-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="200px"
                />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-brand-400 transition-colors">
                {item.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">{item.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE NORTHSTAR MOTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <BadgeCheck className="w-4 h-4" />
              <span>The Northstar Assurance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Dehradun trusts Northstar Motors
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We eliminate the friction and uncertainty of buying cars. Whether you are shopping for a brand-new SUV or a certified pre-owned car, every vehicle meets uncompromising safety and mechanical standards.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">150-Point Quality Inspection</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Every vehicle undergoes thorough diagnostic testing covering engine, transmission, steering, brakes, suspension, electrical systems, and structural integrity.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Transparent & Fixed Pricing</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Zero hidden showroom fees, zero surprise paperwork charges. Honest market pricing backed by verified vehicle history reports.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Doorstep Test Drives</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                We bring the vehicle directly to your home or office anywhere across Dehradun, Mussoorie foothills, and Rishikesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINANCING & TRADE-IN CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Finance Promo */}
          <div className="glass-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Instant Car Loans & Flexible EMI</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Competitive auto financing starting at 8.99% per annum with tenures up to 7 years. Calculate exact monthly payments instantly online.
              </p>
            </div>
            <Link
              href="/finance"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
            >
              <span>Calculate Loan EMI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trade-in Promo */}
          <div className="glass-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Sell or Trade In Your Old Car</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Get an instant algorithmic valuation in 60 seconds based on real sales data across Uttarakhand. Free physical doorstep inspection included.
              </p>
            </div>
            <Link
              href="/trade-in"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all"
            >
              <span>Value Your Vehicle</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. LOCAL DEHRADUN SEO / SHOWROOM LOCATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Visit Us in Dehradun</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Located on Rajpur Road, Dehradun
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our flagship showroom is centrally located on Rajpur Road near IT Park Chowk. Stop by to explore our full inventory in person, consult with our automotive specialists, or enjoy an espresso while we evaluate your trade-in car.
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <p>📍 <strong>Address:</strong> Plot 42-B, Rajpur Road, Near IT Park Chowk, Dehradun, Uttarakhand 248001</p>
                <p>📞 <strong>Sales Desk:</strong> +91 135 274 8900 | WhatsApp: +91 98970 12345</p>
                <p>🕒 <strong>Hours:</strong> Mon – Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 6:00 PM</p>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/test-drive"
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
                >
                  Schedule Showroom Tour
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-800 transition-colors"
                >
                  Get Driving Directions
                </Link>
              </div>
            </div>

            {/* Visual showroom preview card */}
            <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="Northstar Motors Dehradun Showroom"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold">4.9 / 5.0</span>
                  <span className="text-slate-400">(420+ Verified Reviews)</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold">
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
