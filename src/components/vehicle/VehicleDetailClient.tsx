"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck,
  Phone,
  Calculator,
  Layers,
  ShieldCheck,
  Share2,
  Heart,
  CheckCircle2,
  Clock,
  Car,
  Compass,
  X,
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
          notesSummary: `Customer requested immediate callback for ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
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
    <div className="space-y-10">
      {/* Top Header: Title, Price & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#182133] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold tracking-wide uppercase ${
                vehicle.condition === "NEW"
                  ? "bg-emerald-600 text-white"
                  : vehicle.condition === "CERTIFIED_PRE_OWNED"
                  ? "bg-[#182338] text-brand-300 border border-[#2b3a59]"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {vehicle.condition === "CERTIFIED_PRE_OWNED" ? "Northstar Certified Pre-Owned" : vehicle.condition}
            </span>
            <span className="text-xs text-slate-400 font-medium">Stock #{vehicle.stockNumber || "NM-2024"}</span>
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
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatCurrency(vehicle.price)}
              </span>
              {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                <span className="text-sm text-slate-400 line-through">
                  {formatCurrency(vehicle.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 sm:text-right mt-0.5">Ex-Showroom Price · Dehradun</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                isSaved
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-[#0e1420] border-[#1e273a] text-slate-300 hover:text-white"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-rose-500" : ""}`} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <Link
              href={`/compare?add=${vehicle.id}`}
              className="p-2.5 rounded-lg bg-[#0e1420] border border-[#1e273a] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
            >
              <Layers className="w-3.5 h-3.5" />
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
              className="p-2.5 rounded-lg bg-[#0e1420] border border-[#1e273a] text-slate-300 hover:text-white transition-colors text-xs font-semibold"
              title="Share Vehicle"
            >
              <Share2 className="w-3.5 h-3.5" />
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
            <div className="relative h-96 sm:h-[480px] w-full rounded-2xl overflow-hidden bg-[#111622] border border-[#1b2334] shadow-xl">
              <Image
                src={images[selectedImageIndex]?.url}
                alt={images[selectedImageIndex]?.caption || vehicle.model}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 800px"
              />
              <div className="absolute bottom-4 left-4 bg-[#06080d]/90 border border-[#1e273a] px-3 py-1.5 rounded-md text-xs font-medium text-slate-300">
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
                    className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx ? "border-brand-500" : "border-[#1e273a] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt="thumbnail" fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div className="bg-[#090d15] border border-[#1b2334] rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-brand-400" />
              <span>Core Specifications</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-[#0e1420] p-4 rounded-xl border border-[#1c2436] space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Mileage</span>
                <p className="text-white font-bold text-sm">
                  {vehicle.mileageKm ? formatKm(vehicle.mileageKm) : "Brand New (0 km)"}
                </p>
              </div>

              <div className="bg-[#0e1420] p-4 rounded-xl border border-[#1c2436] space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Transmission</span>
                <p className="text-white font-bold text-sm">{vehicle.transmission}</p>
              </div>

              <div className="bg-[#0e1420] p-4 rounded-xl border border-[#1c2436] space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Fuel Type</span>
                <p className="text-white font-bold text-sm">{vehicle.fuelType}</p>
              </div>

              <div className="bg-[#0e1420] p-4 rounded-xl border border-[#1c2436] space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Engine / Power</span>
                <p className="text-white font-bold text-sm">
                  {vehicle.powerBhp} BHP {vehicle.engineCapacityCc ? `(${vehicle.engineCapacityCc} cc)` : ""}
                </p>
              </div>

              <div className="bg-[#0e1420] p-4 rounded-xl border border-[#1c2436] space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Torque</span>
                <p className="text-white font-bold text-sm">{vehicle.torqueNm} Nm</p>
              </div>

              <div className="bg-[#0e1420] p-4 rounded-xl border border-[#1c2436] space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Fuel Economy</span>
                <p className="text-white font-bold text-sm">
                  {vehicle.fuelEfficiencyKmpl ? `${vehicle.fuelEfficiencyKmpl} km/l` : "Electric Certified"}
                </p>
              </div>

              <div className="bg-[#0e1420] p-4 rounded-xl border border-[#1c2436] space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Seating</span>
                <p className="text-white font-bold text-sm">{vehicle.seatingCapacity} Passengers</p>
              </div>

              <div className="bg-[#0e1420] p-4 rounded-xl border border-[#1c2436] space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Drivetrain</span>
                <p className="text-white font-bold text-sm">{vehicle.drivetrain || "Front-Wheel Drive"}</p>
              </div>
            </div>

            {/* Colors & Ownership */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#182133] text-xs text-slate-300">
              <div>
                <span className="text-slate-400">Exterior Color:</span>{" "}
                <span className="font-semibold text-white">{vehicle.exteriorColor}</span>
              </div>
              <div>
                <span className="text-slate-400">Interior Theme:</span>{" "}
                <span className="font-semibold text-white">{vehicle.interiorColor || "Premium Dual Tone"}</span>
              </div>
              <div>
                <span className="text-slate-400">Ownership:</span>{" "}
                <span className="font-semibold text-white">{vehicle.ownershipHistory || "1st Owner"}</span>
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="bg-[#090d15] border border-[#1b2334] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white">Vehicle Overview</h2>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
            {vehicle.warranty && (
              <div className="pt-3 border-t border-[#182133] flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Warranty: {vehicle.warranty}</span>
              </div>
            )}
          </div>

          {/* Installed Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="bg-[#090d15] border border-[#1b2334] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Installed Equipment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.features.map((feat: any) => (
                  <div
                    key={feat.id || feat.name}
                    className="flex items-center gap-2 p-3 rounded-xl bg-[#0e1420] border border-[#1c2436] text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive EMI Calculator */}
          <div className="bg-[#090d15] border border-[#1b2334] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <span>Financing & EMI Breakdown</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Reducing balance calculation at {interestRate}% p.a.</p>
              </div>
              <span className="text-2xl font-black text-white">
                {formatCurrency(emiResult.monthlyEmi)} / mo
              </span>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Down Payment ({downPaymentPercent}%): {formatCurrency(downPaymentAmount)}</span>
                  <span>Principal Loan: {formatCurrency(emiResult.principalLoanAmount)}</span>
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
                  <span>Tenure: {tenureYears} Years ({tenureYears * 12} Months)</span>
                  <span>Interest Rate: {interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#0e1420] border border-[#1c2436] text-xs">
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
                <p className="font-bold text-emerald-400 mt-0.5">Zero (Showroom Offer)</p>
              </div>
            </div>

            <Link
              href={`/finance?price=${vehicle.price}&vehicleId=${vehicle.id}`}
              className="block w-full text-center py-3 rounded-lg bg-[#111724] hover:bg-[#182133] text-white font-semibold text-xs uppercase tracking-wider border border-[#243048] transition-colors"
            >
              Apply for Pre-Approved Financing on this Car
            </Link>
          </div>
        </div>

        {/* Right Column: Sticky Action & Test Drive Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#090d15] border border-[#1b2334] rounded-2xl p-6 sm:p-8 sticky top-28 space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Showroom Status</span>
              <h2 className="text-xl font-bold text-white mt-1">Ready for Immediate Delivery</h2>
              <p className="text-xs text-slate-400 mt-1">
                Located at Northstar Motors, Rajpur Road, Dehradun.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href={`/test-drive?vehicleId=${vehicle.id}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-brand-900/30"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Test Drive</span>
              </Link>

              <button
                onClick={() => setShowCallbackModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0e1420] hover:bg-[#161f30] text-slate-200 hover:text-white font-semibold text-xs uppercase tracking-wider border border-[#1e273a] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Request Immediate Callback</span>
              </button>

              <Link
                href={`/trade-in?targetVehicleId=${vehicle.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0e1420] hover:bg-[#161f30] text-slate-200 hover:text-white font-semibold text-xs uppercase tracking-wider border border-[#1e273a] transition-colors"
              >
                <span>Trade In Your Current Car</span>
              </Link>
            </div>

            {/* Quick Consultation Advisor */}
            <div className="p-4 rounded-xl bg-[#0e1420] border border-[#1c2436] space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4 text-brand-400" />
                <span>Vehicle Consultation</span>
              </div>
              <p className="text-xs text-slate-400">
                Compare this model against rival vehicles, verify hill-climbing performance, or check running costs.
              </p>
              <Link
                href={`/?askAi=Tell me about the ${encodeURIComponent(vehicle.make + " " + vehicle.model)}`}
                className="inline-block text-xs font-semibold text-brand-400 hover:text-brand-300 pt-1"
              >
                Consult Digital Concierge →
              </Link>
            </div>

            {/* Showroom Perks */}
            <div className="border-t border-[#182133] pt-4 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>150-Point Inspection Certificate Included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Clean Title Guarantee & RC Transfer Service</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>7-Day Showroom Exchange Assurance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Callback Modal */}
      {showCallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#090d15] border border-[#1b2334] rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCallbackModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {callbackSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Callback Scheduled</h4>
                <p className="text-xs text-slate-300">
                  A sales consultant from our Dehradun showroom will contact you shortly.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Direct Sales Desk</span>
                  <h3 className="text-lg font-bold text-white mt-1">Request Callback</h3>
                  <p className="text-xs text-slate-400">
                    For {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                </div>

                <form onSubmit={handleCallbackSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      value={callbackForm.name}
                      onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                      className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98970 12345"
                      value={callbackForm.phone}
                      onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                      className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    Confirm Callback Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
