import { MetadataRoute } from "next";
import { DEMO_VEHICLES } from "@/lib/data/seedData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://northstarmotors.in";

  const staticRoutes = [
    "",
    "/inventory",
    "/compare",
    "/finance",
    "/trade-in",
    "/test-drive",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const vehicleRoutes = DEMO_VEHICLES.map((vehicle) => ({
    url: `${baseUrl}/inventory/${vehicle.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
