import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getVehicleById } from "@/lib/db";
import { VehicleDetailClient } from "@/components/vehicle/VehicleDetailClient";

interface VehiclePageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const vehicle = await getVehicleById(params.id);
  if (!vehicle) {
    return {
      title: "Vehicle Not Found | Northstar Motors",
    };
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ""} | Northstar Motors Dehradun`;
  const description = `${vehicle.year} ${vehicle.make} ${vehicle.model} available at Northstar Motors Dehradun for ₹${(vehicle.price / 100000).toFixed(2)} Lakh. Explore specs, mileage, and book a test drive today.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: vehicle.images?.[0]?.url ? [{ url: vehicle.images[0].url }] : [],
    },
  };
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const vehicle = await getVehicleById(params.id);

  if (!vehicle) {
    notFound();
  }

  // Schema.org Vehicle Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    manufacturer: vehicle.make,
    model: vehicle.model,
    vehicleModelDate: vehicle.year,
    bodyType: vehicle.bodyType,
    fuelType: vehicle.fuelType,
    vehicleTransmission: vehicle.transmission,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileageKm,
      unitCode: "KMT",
    },
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "INR",
      itemCondition: vehicle.condition === "NEW" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: "Northstar Motors",
        telephone: "+911352748900",
        address: "Plot 42-B, Rajpur Road, Dehradun, Uttarakhand",
      },
    },
    image: vehicle.images?.map((img: any) => img.url),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VehicleDetailClient vehicle={vehicle} />
    </div>
  );
}
