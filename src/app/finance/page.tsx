import React from "react";
import Link from "next/link";
import { getVehicles } from "@/lib/db";
import { FinanceCalculatorClient } from "@/components/finance/FinanceCalculatorClient";

interface FinancePageProps {
  searchParams: {
    price?: string;
    vehicleId?: string;
  };
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Car Loan & EMI Calculator | Northstar Motors Dehradun",
  description:
    "Calculate instant vehicle loan EMI, down payment requirements, and interest rates. Apply online for pre-approved automotive financing at Northstar Motors.",
};

export default async function FinancePage({ searchParams }: FinancePageProps) {
  const initialPrice = searchParams.price ? parseInt(searchParams.price, 10) : 1800000;
  const initialVehicleId = searchParams.vehicleId || "";

  const vehiclesRes = await getVehicles({ limit: 40 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-brand-400">Financing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Car Loan & EMI Calculator</h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore transparent financing rates starting from 8.99% p.a. with partner banks in Dehradun.
        </p>
      </div>

      <FinanceCalculatorClient
        initialPrice={initialPrice}
        initialVehicleId={initialVehicleId}
        vehicles={vehiclesRes.vehicles}
      />
    </div>
  );
}
