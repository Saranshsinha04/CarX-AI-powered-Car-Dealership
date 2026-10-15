import React from "react";
import Link from "next/link";
import { TradeInEstimatorClient } from "@/components/tradein/TradeInEstimatorClient";

export const metadata = {
  title: "Car Trade-In & Valuation | Northstar Motors Dehradun",
  description:
    "Get an instant algorithmic market valuation for your used car in Dehradun. Sell or trade in for a new SUV, sedan, or EV with seamless RC transfer.",
};

export default function TradeInPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-brand-400">Trade-In</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Car Trade-In & Valuation</h1>
        <p className="text-slate-400 text-sm mt-1">
          Instant algorithmic price estimates based on historical sales and market demand in Uttarakhand.
        </p>
      </div>

      <TradeInEstimatorClient />
    </div>
  );
}
