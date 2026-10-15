import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Northstar Motors | Premium & Certified Used Cars in Dehradun",
  description:
    "Explore Uttarakhand's premier car showroom on Rajpur Road, Dehradun. AI-powered vehicle finder, 150-point certified used cars, luxury SUVs, instant financing, and doorstep test drives.",
  keywords: [
    "car dealership dehradun",
    "buy suv dehradun",
    "used cars in dehradun",
    "certified pre-owned cars uttarakhand",
    "hyundai creta dehradun",
    "mahindra thar dehradun",
    "northstar motors",
    "car loan emi calculator dehradun",
  ],
  authors: [{ name: "Northstar Motors Dehradun" }],
  openGraph: {
    title: "Northstar Motors | Drive What Moves You",
    description:
      "Find your next car with AI-guided recommendations, real-time inventory, and doorstep test drives in Dehradun.",
    url: "https://northstarmotors.in",
    siteName: "Northstar Motors",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Northstar Motors Dehradun Showroom",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Northstar Motors Dehradun",
    description: "Uttarakhand's smart automotive destination.",
    images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "Northstar Motors",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    "@id": "https://northstarmotors.in",
    url: "https://northstarmotors.in",
    telephone: "+911352748900",
    priceRange: "₹₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot 42-B, Rajpur Road, Near IT Park Chowk",
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      postalCode: "248001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.3479,
      longitude: 78.0716,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "18:00",
      },
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans bg-slate-950 text-slate-100 antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
