const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seeding for Northstar Motors...");

  // 1. Create or update Demo Dealership
  const dealership = await prisma.dealership.upsert({
    where: { slug: "northstar-motors" },
    update: {},
    create: {
      id: "northstar-motors-001",
      name: "Northstar Motors",
      slug: "northstar-motors",
      tagline: "Drive what moves you.",
      email: "contact@northstarmotors.in",
      phone: "+91 135 274 8900",
      whatsapp: "+91 98970 12345",
      address: "Plot 42-B, Rajpur Road, Near IT Park Chowk",
      city: "Dehradun",
      state: "Uttarakhand",
      postalCode: "248001",
      country: "India",
      currency: "INR",
      currencySymbol: "₹",
      logoUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80",
      heroImageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    },
  });

  console.log(`✅ Dealership created: ${dealership.name} (${dealership.id})`);

  // 2. Dealership Settings
  await prisma.dealershipSettings.upsert({
    where: { dealershipId: dealership.id },
    update: {},
    create: {
      dealershipId: dealership.id,
      primaryColor: "#026ac9",
      secondaryColor: "#0f172a",
      accentColor: "#f59e0b",
      aboutText: "Northstar Motors is Uttarakhand's premier automotive destination located in Dehradun. With state-of-the-art facilities on Rajpur Road, an expansive inventory of new and certified pre-owned vehicles, transparent pricing, and instant financing options, we transform how Dehradun drives.",
      openingHours: {
        mon_fri: "9:00 AM - 8:00 PM",
        sat: "9:00 AM - 8:30 PM",
        sun: "10:00 AM - 6:00 PM",
      },
      socialLinks: {
        instagram: "https://instagram.com/northstarmotors",
        facebook: "https://facebook.com/northstarmotors",
        youtube: "https://youtube.com/@northstarmotors",
        twitter: "https://twitter.com/northstarmotors",
      },
      metaTitle: "Northstar Motors Dehradun | New & Certified Used Cars & SUVs",
      metaDescription: "Find your dream car at Northstar Motors Dehradun. Explore certified SUVs, Sedans, EVs & Luxury cars with AI-powered search, test drives & flexible financing.",
      seoKeywords: "car dealership dehradun, used cars in dehradun, buy suv dehradun, northstar motors, hyundai creta dehradun, mahindra thar dehradun, certified pre-owned cars uttarakhand",
      defaultDownPaymentPercent: 20.0,
      defaultInterestRate: 8.99,
      defaultLoanDurationMonths: 60,
      enableAiFinder: true,
      enableTradeInEstimator: true,
      enableEmiCalculator: true,
    },
  });

  // 3. Create Staff & Admin Users
  const passwordHash = await bcrypt.hash("Admin@123456", 10);
  const users = [
    {
      name: "Vikram Malhotra",
      email: "admin@northstarmotors.in",
      role: "DEALERSHIP_ADMIN",
      phone: "+91 98970 11111",
    },
    {
      name: "Pooja Rawat",
      email: "sales@northstarmotors.in",
      role: "SALES_MANAGER",
      phone: "+91 98970 22222",
    },
    {
      name: "Aman Negi",
      email: "agent@northstarmotors.in",
      role: "SALES_AGENT",
      phone: "+91 98970 33333",
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        dealershipId: dealership.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        passwordHash,
        role: u.role,
        status: "ACTIVE",
      },
    });
  }
  console.log(`✅ Seeded staff accounts (Password: Admin@123456)`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
