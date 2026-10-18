"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { estimateTradeInValue } from "@/lib/tradeIn";
import { RefreshCw, CheckCircle2 } from "lucide-react";

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
        <div className="bg-[#090d15] border border-[#1b2334] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#182133] pb-4">
            <div className="w-10 h-10 rounded-lg bg-[#111724] border border-[#243048] flex items-center justify-center text-brand-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Car Valuation Estimator</h2>
              <p className="text-xs text-slate-400">Real-time market algorithmic calculation based on Uttarakhand auction data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Brand / Manufacturer
              </label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
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
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Model Name
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Creta, Thar, Swift, City"
                className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
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
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Kilometers Driven: {mileageKm.toLocaleString()} km
              </label>
              <input
                type="range"
                min="5000"
                max="180000"
                step="2500"
                value={mileageKm}
                onChange={(e) => setMileageKm(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>
          </div>

          {/* Condition Selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Overall Vehicle Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { val: "EXCELLENT", label: "Excellent", desc: "No scratch, flawless service record" },
                { val: "GOOD", label: "Good", desc: "Minor wear, well maintained" },
                { val: "FAIR", label: "Fair", desc: "Visible wear, periodic service due" },
                { val: "POOR", label: "Poor", desc: "Needs mechanical/body work" },
              ].map((c) => (
                <button
                  key={c.val}
                  type="button"
                  onClick={() => setCondition(c.val as any)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    condition === c.val
                      ? "bg-brand-600 text-white border-brand-500"
                      : "bg-[#0e1420] text-slate-300 border-[#1e273a] hover:bg-[#161f30]"
                  }`}
                >
                  <p className="font-bold">{c.label}</p>
                  <p className="text-[10px] opacity-80 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Number of Previous Owners
              </label>
              <select
                value={ownersCount}
                onChange={(e) => setOwnersCount(Number(e.target.value))}
                className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value={1}>1st Owner</option>
                <option value={2}>2nd Owner</option>
                <option value={3}>3rd Owner</option>
                <option value={4}>4+ Owners</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-5">
              <input
                type="checkbox"
                id="accidentHistory"
                checked={accidentHistory}
                onChange={(e) => setAccidentHistory(e.target.checked)}
                className="w-4 h-4 rounded bg-[#06080d] border-[#1b2334] text-brand-500 focus:ring-0"
              />
              <label htmlFor="accidentHistory" className="text-xs text-slate-300">
                Major accident history or structural damage
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Estimated Value & Appointment Booking */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#090d15] border border-[#1b2334] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Estimated Showroom Valuation
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
              {formatCurrency(valuation.estimatedMin)} – {formatCurrency(valuation.estimatedMax)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mid-point baseline: <strong>{formatCurrency(Math.round((valuation.estimatedMin + valuation.estimatedMax) / 2))}</strong>
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#182133] text-xs">
            <div className="flex justify-between py-1 border-b border-[#182133]">
              <span className="text-slate-400">Total Depreciation</span>
              <span className="font-semibold text-slate-200">{valuation.depreciationRate}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#182133]">
              <span className="text-slate-400">Condition Rating</span>
              <span className="font-semibold text-slate-200">{condition}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#182133]">
              <span className="text-slate-400">Confidence Score</span>
              <span className="font-semibold text-emerald-400">{valuation.confidenceScore}%</span>
            </div>
          </div>
        </div>

        {/* Schedule Physical Doorstep Inspection */}
        <div className="bg-[#090d15] border border-[#1b2334] rounded-xl p-6 sm:p-8 space-y-4 shadow-xl">
          {isSubmitted ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Valuation Request Registered</h4>
              <p className="text-xs text-slate-300">
                Our trade-in evaluator in Dehradun will call you at {customerPhone} to schedule a free physical inspection.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-white">Lock This Offer & Book Free Doorstep Inspection</h3>
                <p className="text-xs text-slate-400 mt-0.5">Free doorstep physical evaluation anywhere across Dehradun & Mussoorie</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98970 12345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Additional Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Any service history, insurance status, tire condition..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Schedule Free Physical Inspection"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
