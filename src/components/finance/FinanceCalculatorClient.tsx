"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { calculateEmi } from "@/lib/finance";
import { Calculator, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface FinanceCalculatorClientProps {
  initialPrice?: number;
  initialVehicleId?: string;
  vehicles: any[];
}

export function FinanceCalculatorClient({
  initialPrice = 1800000,
  initialVehicleId = "",
  vehicles,
}: FinanceCalculatorClientProps) {
  const [vehiclePrice, setVehiclePrice] = useState(initialPrice);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureYears, setTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(8.99);

  // Application state
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [employmentType, setEmploymentType] = useState("Salaried");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const downPaymentAmount = Math.round((vehiclePrice * downPaymentPercent) / 100);

  const emiResult = calculateEmi({
    vehiclePrice,
    downPayment: downPaymentAmount,
    interestRateAnnual: interestRate,
    tenureMonths: tenureYears * 12,
  });

  function handleVehicleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setSelectedVehicleId(id);
    const car = vehicles.find((v) => v.id === id);
    if (car) {
      setVehiclePrice(car.price);
    }
  }

  async function handleApplicationSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!applicantName || !applicantPhone) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/financing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selectedVehicleId || vehicles[0]?.id || "general-loan",
          customerName: applicantName,
          customerPhone: applicantPhone,
          customerEmail: applicantEmail || "loan-applicant@northstarmotors.in",
          vehiclePrice,
          downPayment: downPaymentAmount,
          loanAmount: emiResult.principalLoanAmount,
          interestRate,
          tenureMonths: tenureYears * 12,
          calculatedEmi: emiResult.monthlyEmi,
          employmentType,
        }),
      });

      setIsSubmitted(true);
    } catch (err) {
      alert("Failed to submit loan pre-approval request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left: Interactive Calculator */}
      <div className="lg:col-span-7 space-y-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Car Loan EMI Calculator</h2>
              <p className="text-xs text-slate-400">Deterministic reducing balance loan amortization</p>
            </div>
          </div>

          {/* Vehicle Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Vehicle from Showroom
            </label>
            <select
              value={selectedVehicleId}
              onChange={handleVehicleSelect}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500"
            >
              <option value="">Custom Vehicle Price</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model} - {formatCurrency(v.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Price Input */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <label className="font-semibold uppercase tracking-wider">Vehicle Ex-Showroom Price</label>
              <span className="font-bold text-emerald-400 text-sm">{formatCurrency(vehiclePrice)}</span>
            </div>
            <input
              type="range"
              min="500000"
              max="9000000"
              step="50000"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Down Payment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <label className="font-semibold uppercase tracking-wider">
                Down Payment: {downPaymentPercent}%
              </label>
              <span className="font-bold text-white">{formatCurrency(downPaymentAmount)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          {/* Loan Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <label className="font-semibold uppercase tracking-wider">
                Loan Tenure: {tenureYears} Years ({tenureYears * 12} Months)
              </label>
              <span className="font-bold text-white">{tenureYears * 12} Months</span>
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

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <label className="font-semibold uppercase tracking-wider">
                Annual Interest Rate
              </label>
              <span className="font-bold text-white">{interestRate}% p.a.</span>
            </div>
            <input
              type="range"
              min="7.5"
              max="14.0"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        {/* Amortization Schedule Preview */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">First 6 Months Payment Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2">Month</th>
                  <th className="py-2">Principal Paid</th>
                  <th className="py-2">Interest Paid</th>
                  <th className="py-2">Remaining Principal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {emiResult.amortizationPreview.map((row) => (
                  <tr key={row.month}>
                    <td className="py-2.5 font-semibold text-white">Month {row.month}</td>
                    <td className="py-2.5">{formatCurrency(row.principalPaid)}</td>
                    <td className="py-2.5 text-amber-400">{formatCurrency(row.interestPaid)}</td>
                    <td className="py-2.5">{formatCurrency(row.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right: EMI Summary & Pre-approval Form */}
      <div className="lg:col-span-5 space-y-6">
        {/* Result Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Estimated Monthly Payment
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">
              {formatCurrency(emiResult.monthlyEmi)}
              <span className="text-base font-normal text-slate-400"> / month</span>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Principal Loan Amount</span>
              <span className="font-bold text-white">{formatCurrency(emiResult.principalLoanAmount)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Total Interest Payable</span>
              <span className="font-bold text-amber-400">{formatCurrency(emiResult.totalInterest)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Total Amount Repaid</span>
              <span className="font-bold text-white">{formatCurrency(emiResult.totalPayment)}</span>
            </div>
          </div>
        </div>

        {/* Pre-Approval Form */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-xl font-bold text-white">Application Received!</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our finance desk at Northstar Motors will process your pre-approval with our partner banks (HDFC, SBI, ICICI) and contact you at {applicantPhone}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Instant Loan Pre-Approval</h3>
                <p className="text-xs text-slate-400 mt-0.5">Zero impact on credit score inquiry</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (Required)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98970 12345"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Salaried">Salaried Professional</option>
                  <option value="Self-Employed">Self-Employed / Business</option>
                  <option value="Government">Defense / PSU / Government</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
              >
                {isSubmitting ? "Submitting Application..." : "Submit Pre-Approval Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
