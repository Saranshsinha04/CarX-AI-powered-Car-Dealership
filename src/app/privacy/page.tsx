import React from "react";

export const metadata = {
  title: "Privacy Policy | Northstar Motors Dehradun",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
      <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
      <p className="text-slate-400">Effective Date: October 2024 • Northstar Motors Pvt. Ltd.</p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
        <p>
          Northstar Motors collects information you provide directly through our website, AI concierge, test drive scheduling, and financing application forms, including your full name, phone number, email address, physical location in Dehradun, and vehicle preferences.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">2. Use of Information</h2>
        <p>
          We use your information solely to schedule test drives, deliver vehicle valuations, process pre-approved loan inquiries with banking partners, and provide AI automotive recommendations. We do not sell or rent customer data to third-party marketing brokers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">3. Data Security & Storage</h2>
        <p>
          All customer interactions, test-drive appointments, and financial inquiries are securely stored in our encrypted PostgreSQL database with strict server-side authorization and access control.
        </p>
      </section>
    </div>
  );
}
