"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { estimateTradeInValue } from "@/lib/tradeIn";
import { RefreshCw, CheckCircle2, ShieldAlert, ArrowRight, Gauge, Check } from "lucide-react";

export function TradeInEstimatorClient() {
  const [make, setMake] = useState("Hyundai");
  const [model, setModel] = useState("Creta");
  const [year, setYear] = useState(2021);
  const [mileageKm, setMileageKm] = useState(38000);
  const [condition, setCondition] = useState<"EXCELLENT" | "GOOD" | "FAIR" | "POOR">("GOOD");
  const [ownersCount, setOwnersCount] = useState(1);
  const [accidentHistory, setAccidentHistory] = useState(false);

  // Contact form
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate live estimate
  const valuation = estimateTradeInValue({
    make,
    model,
    year,
    mileageKm,
    condition,
    ownersCount,
    accidentHistory,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/trade-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail: customerEmail || "tradein@northstarmotors.in",
          make,
          model,
          year,
          mileageKm,
          condition,
          ownersCount,
          accidentHistory,
          fuelType: "Petrol",
          transmission: "Manual",
          notes,
        }),
      });

      setIsSubmitted(true);
    } catch (err) {
      alert("Failed to submit trade-in request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left: Input Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Car Valuation Estimator</h2>
              <p className="text-xs text-slate-400">Real-time market algorithmic calculation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Brand / Manufacturer
              </label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Hyundai">Hyundai</option>
                <option value="Mahindra">Mahindra</option>
                <option value="Tata">Tata Motors</option>
                <option value="Maruti Suzuki">Maruti Suzuki</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Kia">Kia</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="BMW">BMW</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Model Name
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Creta, Thar, Swift, City"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Registration Year: {year}
              </label>
              <input
                type="range"
                min="2012"
                max="2024"
                step="1"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Kilometers Driven: {mileageKm.toLocaleString()} km
              </label>
              <input
                type="range"
                min="5000"
                max="160000"
                step="5000"
                value={mileageKm}
                onChange={(e) => setMileageKm(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>
          </div>

          {/* Condition Select */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Vehicle Overall Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Excellent", val: "EXCELLENT", desc: "No dents, perfect engine" },
                { label: "Good", val: "GOOD", desc: "Minor scratch, well maintained" },
                { label: "Fair", val: "FAIR", desc: "Noticeable wear, needs service" },
                { label: "Poor", val: "POOR", desc: "Major repair needed" },
              ].map((c) => (
                <button
                  key={c.val}
                  type="button"
                  onClick={() => setCondition(c.val as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    condition === c.val
                      ? "bg-brand-600/20 border-brand-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <p className="font-bold text-xs">{c.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Number of Previous Owners
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, "4+"].map((num, i) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setOwnersCount(i + 1)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                      ownersCount === i + 1
                        ? "bg-brand-600 border-brand-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={accidentHistory}
                  onChange={(e) => setAccidentHistory(e.target.checked)}
                  className="rounded text-brand-500 accent-brand-500 w-4 h-4"
                />
                <span className="text-xs text-slate-300 font-medium">Major Accident or Insurance Claim History</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Live Valuation Card & Inspection Booking */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Instant Algorithmic Valuation
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
              {formatCurrency(valuation.estimatedMin, true)} – {formatCurrency(valuation.estimatedMax, true)}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Estimated Market Value Range ({year} {make} {model})
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Valuation Confidence</span>
            <span className="font-bold text-emerald-400">{valuation.confidenceScore}% (High)</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
            ⚠️ <strong>Estimate Disclaimer:</strong> {valuation.disclaimer}
          </p>
        </div>

        {/* Schedule Physical Doorstep Inspection Form */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          {isSubmitted ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-xl font-bold text-white">Valuation Request Booked!</h4>
              <p className="text-xs text-slate-300">
                A Northstar automotive evaluator will contact you at {customerPhone} to schedule your free physical inspection in Dehradun.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Lock In Your Trade-In Value</h3>
                <p className="text-xs text-slate-400 mt-0.5">Book free doorstep evaluation anywhere in Dehradun</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (Required)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98970 12345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-500/25"
              >
                {isSubmitting ? "Booking Evaluation..." : "Book Free Inspection & Sell Car"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
