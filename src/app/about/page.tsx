import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Users, MapPin, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Us | Northstar Motors Dehradun",
  description:
    "Learn about Northstar Motors, Dehradun's premier smart automotive dealership. Transparent pricing, AI-guided purchasing, and 150-point certified used vehicles in Uttarakhand.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">About Northstar Motors</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Redefining How Dehradun Drives</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Founded with a mission to bring world-class automotive transparency, certified quality, and AI-powered convenience to Uttarakhand.
        </p>
      </div>

      {/* Showroom Visual & Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-96 w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
            alt="Northstar Motors Facility"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">A Dealership Built on Trust & Modern Engineering</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Located on prime Rajpur Road in Dehradun, Northstar Motors is more than a showroom—it is an intelligent automotive destination. We combine an expansive physical inventory of new and certified pre-owned vehicles with advanced digital technology.
          </p>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full vehicle history transparency with zero odometer rollback tolerance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>150-point mechanical inspection by certified automotive engineers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant AI vehicle matching tailored to your budget and mountain driving needs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <Award className="w-8 h-8 text-brand-400" />
          <h3 className="font-bold text-lg text-white">Uncompromising Quality</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every vehicle in our certified pre-owned fleet undergoes exhaustive structural, powertrain, and electrical audits before being offered to customers.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <Users className="w-8 h-8 text-amber-400" />
          <h3 className="font-bold text-lg text-white">Customer-First Philosophy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            From doorstep test drives in Dehradun to seamless RC ownership transfer, our dedicated staff provides white-glove advisory support.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <h3 className="font-bold text-lg text-white">Guaranteed Peace of Mind</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our vehicles come with warranty options, 7-day exchange policies, and emergency 24/7 roadside assistance across Uttarakhand.
          </p>
        </div>
      </div>
    </div>
  );
}
