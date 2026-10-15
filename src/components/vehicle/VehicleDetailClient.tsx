"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck,
  PhoneCall,
  Calculator,
  Layers,
  Sparkles,
  ShieldCheck,
  Share2,
  Heart,
  Gauge,
  Fuel,
  Settings2,
  CheckCircle2,
  MapPin,
  Clock,
  Car,
} from "lucide-react";
import { formatCurrency, formatKm } from "@/lib/utils";
import { calculateEmi } from "@/lib/finance";

interface VehicleDetailClientProps {
  vehicle: any;
}

export function VehicleDetailClient({ vehicle }: VehicleDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureYears, setTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(8.99);
  const [isSaved, setIsSaved] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "" });
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : [{ url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341", caption: "Exterior" }];

  // Dynamic EMI Calculation
  const downPaymentAmount = Math.round((vehicle.price * downPaymentPercent) / 100);
  const emiResult = calculateEmi({
    vehiclePrice: vehicle.price,
    downPayment: downPaymentAmount,
    interestRateAnnual: interestRate,
    tenureMonths: tenureYears * 12,
  });

  async function handleCallbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!callbackForm.name || !callbackForm.phone) return;

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: callbackForm.name,
          customerPhone: callbackForm.phone,
          customerEmail: "callback@northstarmotors.in",
          vehicleId: vehicle.id,
          source: "CALLBACK_REQUEST",
          notesSummary: `Customer requested immediate phone callback for ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        }),
      });
      setCallbackSuccess(true);
      setTimeout(() => {
        setShowCallbackModal(false);
        setCallbackSuccess(false);
      }, 2000);
    } catch (err) {
      alert("Failed to submit request.");
    }
  }

  return (
    <div className="space-y-12">
      {/* Top Header: Title, Price & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold ${
                vehicle.condition === "NEW"
                  ? "bg-emerald-600/90 text-white"
                  : vehicle.condition === "CERTIFIED_PRE_OWNED"
                  ? "bg-purple-600/90 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {vehicle.condition === "CERTIFIED_PRE_OWNED" ? "Northstar Certified Pre-Owned" : vehicle.condition}
            </span>
            <span className="text-xs text-slate-400">Stock #{vehicle.stockNumber || "NM-2024"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1 font-medium">{vehicle.trim || vehicle.bodyType}</p>
        </div>

        {/* Price & Action Buttons */}
        <div className="flex flex-col sm:items-end gap-3">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                {formatCurrency(vehicle.price)}
              </span>
              {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                <span className="text-base text-slate-500 line-through">
                  {formatCurrency(vehicle.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 sm:text-right mt-0.5">Ex-Showroom Price • Dehradun</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isSaved
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500" : ""}`} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <Link
              href={`/compare?add=${vehicle.id}`}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Layers className="w-4 h-4" />
              <span>Compare</span>
            </Link>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Vehicle link copied to clipboard!");
                }
              }}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
              title="Share Vehicle"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Gallery on left, Lead / Action Panel on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery & Specs */}
        <div className="lg:col-span-8 space-y-10">
          {/* Main Photo Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 sm:h-[480px] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              <Image
                src={images[selectedImageIndex]?.url}
                alt={images[selectedImageIndex]?.caption || vehicle.model}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 800px"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200">
                {images[selectedImageIndex]?.caption || `Photo ${selectedImageIndex + 1} of ${images.length}`}
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img: any, idx: number) => (
                  <button
                    key={img.url + idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx ? "border-brand-500 scale-105" : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt="thumbnail" fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-brand-400" />
              <span>Core Specifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Mileage / Odometer</span>
                <p className="text-white font-bold text-sm">
                  {vehicle.mileageKm ? formatKm(vehicle.mileageKm) : "Brand New (0 km)"}
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Transmission</span>
                <p className="text-white font-bold text-sm">{vehicle.transmission}</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Fuel Type</span>
                <p className="text-white font-bold text-sm">{vehicle.fuelType}</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Engine / Power</span>
                <p className="text-white font-bold text-sm">
                  {vehicle.powerBhp} BHP {vehicle.engineCapacityCc ? `(${vehicle.engineCapacityCc} cc)` : ""}
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Torque</span>
                <p className="text-white font-bold text-sm">{vehicle.torqueNm} Nm</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Fuel Economy / Range</span>
                <p className="text-white font-bold text-sm">
                  {vehicle.fuelEfficiencyKmpl ? `${vehicle.fuelEfficiencyKmpl} km/l` : "Electric Range Certified"}
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Seating Capacity</span>
                <p className="text-white font-bold text-sm">{vehicle.seatingCapacity} Passengers</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Drivetrain</span>
                <p className="text-white font-bold text-sm">{vehicle.drivetrain || "Front-Wheel Drive"}</p>
              </div>
            </div>

            {/* Colors & Ownership */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
              <div>
                <span className="text-slate-500">Exterior Color:</span>{" "}
                <span className="font-semibold text-white">{vehicle.exteriorColor}</span>
              </div>
              <div>
                <span className="text-slate-500">Interior Theme:</span>{" "}
                <span className="font-semibold text-white">{vehicle.interiorColor || "Premium Dual Tone"}</span>
              </div>
              <div>
                <span className="text-slate-500">Ownership:</span>{" "}
                <span className="font-semibold text-white">{vehicle.ownershipHistory || "1st Owner"}</span>
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white">Vehicle Overview</h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
            {vehicle.warranty && (
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-brand-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Warranty: {vehicle.warranty}</span>
              </div>
            )}
          </div>

          {/* Categorized Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-white">Installed Features & Equipment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.features.map((feat: any) => (
                  <div
                    key={feat.id || feat.name}
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Vehicle-Specific EMI Calculator */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <span>Financing & EMI Breakdown</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Calculated in real-time with deterministic reducing balance formula</p>
              </div>
              <span className="text-2xl font-black text-amber-400">
                {formatCurrency(emiResult.monthlyEmi)} / mo
              </span>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Down Payment ({downPaymentPercent}%): {formatCurrency(downPaymentAmount)}</span>
                  <span>Loan Principal: {formatCurrency(emiResult.principalLoanAmount)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Loan Duration: {tenureYears} Years ({tenureYears * 12} Months)</span>
                  <span>Interest Rate: {interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Total Interest</span>
                <p className="font-bold text-slate-200 mt-0.5">{formatCurrency(emiResult.totalInterest)}</p>
              </div>
              <div>
                <span className="text-slate-400">Total Repayment</span>
                <p className="font-bold text-slate-200 mt-0.5">{formatCurrency(emiResult.totalPayment)}</p>
              </div>
              <div>
                <span className="text-slate-400">Processing Fee</span>
                <p className="font-bold text-emerald-400 mt-0.5">Zero (Limited Offer)</p>
              </div>
            </div>

            <Link
              href={`/finance?price=${vehicle.price}&vehicleId=${vehicle.id}`}
              className="block w-full text-center py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Apply for Pre-Approved Financing on this Car
            </Link>
          </div>
        </div>

        {/* Right Column: Sticky Action & Test Drive Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 sticky top-28 space-y-6 shadow-2xl">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Showroom Availability</span>
              <h3 className="text-xl font-bold text-white mt-1">Ready for Immediate Delivery</h3>
              <p className="text-xs text-slate-400 mt-1">
                Located at Northstar Motors, Rajpur Road, Dehradun.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href={`/test-drive?vehicleId=${vehicle.id}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition-all"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Doorstep Test Drive</span>
              </Link>

              <button
                onClick={() => setShowCallbackModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass-panel hover:bg-slate-900 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Request Immediate Callback</span>
              </button>

              <Link
                href={`/trade-in?targetVehicleId=${vehicle.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass-panel hover:bg-slate-900 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <span>Trade In Your Current Car</span>
              </Link>
            </div>

            {/* Quick Consultation Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Have questions about this vehicle?</span>
              </div>
              <p className="text-xs text-slate-400">
                Ask our AI Car Concierge why this model fits your needs or how it compares with other cars.
              </p>
              <Link
                href={`/?askAi=Tell me about the ${encodeURIComponent(vehicle.make + " " + vehicle.model)}`}
                className="inline-block text-xs font-semibold text-brand-400 hover:text-brand-300 pt-1"
              >
                Chat with Northstar AI →
              </Link>
            </div>

            {/* Showroom Perks */}
            <div className="border-t border-slate-800/80 pt-4 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>150-Point Certified Inspection Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Clean Title Guarantee & RC Transfer Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>7-Day Vehicle Exchange Promise</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Callback Request Modal */}
      {showCallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
            {callbackSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Callback Request Confirmed</h4>
                <p className="text-xs text-slate-400">An advisor will call you within 15 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-4">
                <h4 className="text-lg font-bold text-white">Request Callback for {vehicle.model}</h4>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={callbackForm.name}
                    onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={callbackForm.phone}
                    onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCallbackModal(false)}
                    className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
