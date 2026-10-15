import React from "react";
import Link from "next/link";
import { getVehicles } from "@/lib/db";
import { TestDriveBookingClient } from "@/components/testdrive/TestDriveBookingClient";

interface TestDrivePageProps {
  searchParams: {
    vehicleId?: string;
  };
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book a Test Drive in Dehradun | Northstar Motors",
  description:
    "Schedule a test drive on Rajpur Road or at your doorstep in Dehradun. Test our certified SUVs, Sedans, EVs, and Luxury vehicles with expert guidance.",
};

export default async function TestDrivePage({ searchParams }: TestDrivePageProps) {
  const vehiclesRes = await getVehicles({ limit: 40 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-brand-400">Test Drive</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Book a Test Drive</h1>
        <p className="text-slate-400 text-sm mt-1">
          Pick your preferred car, select a convenient date, and choose showroom or doorstep delivery in Dehradun.
        </p>
      </div>

      <TestDriveBookingClient
        vehicles={vehiclesRes.vehicles}
        preselectedVehicleId={searchParams.vehicleId}
      />
    </div>
  );
}
