import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions | Northstar Motors Dehradun",
  description:
    "Find answers to common questions about buying new and used cars in Dehradun, financing, test drives, warranties, and trade-in valuations.",
};

const FAQS = [
  {
    q: "How does Northstar Motors inspect certified pre-owned vehicles?",
    a: "Every certified vehicle undergoes an uncompromising 150-point technical inspection covering chassis alignment, engine compression, transmission shifting, suspension dampers, electronic sensors, brakes, and AC performance. Any worn wear-and-tear components are replaced with genuine OEM parts before display.",
  },
  {
    q: "Can I book a test drive at my home or office in Dehradun?",
    a: "Yes! Northstar Motors offers complimentary doorstep test drives anywhere across Dehradun, including Rajpur Road, Jakhan, Sahastradhara Road, Clement Town, and Prem Nagar. You can book directly online through our Test Drive page.",
  },
  {
    q: "What documents are required for instant car loan pre-approval?",
    a: "For salaried individuals: PAN card, Aadhaar card, last 3 months' salary slips, and 6 months' bank statements. For self-employed/business owners: PAN, Aadhaar, last 2 years' ITR with computation, and 6 months' primary business bank account statement.",
  },
  {
    q: "How does Northstar calculate trade-in vehicle valuations?",
    a: "Our algorithmic trade-in estimator uses actual transaction data from Uttarakhand and national pre-owned market depreciation curves. The online estimate gives you a realistic benchmark range, which is confirmed following a quick 20-minute physical inspection at our showroom.",
  },
  {
    q: "Does Northstar Motors handle the RC ownership transfer?",
    a: "Absolutely. We manage 100% of the RTO documentation and ownership transfer process directly with the Dehradun Transport Authority (UK-07) to ensure guaranteed transfer of title without any legal liability for the seller or buyer.",
  },
  {
    q: "How does the Northstar AI Assistant work?",
    a: "Northstar AI connects directly to our authorized inventory database in real-time. It understands natural language preferences (e.g. 'Show me automatic SUVs under 18 lakh') and provides verified specifications, accurate pricing, and instant comparison without hallucinating stock.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 uppercase tracking-widest">
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge & Policies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Common queries regarding purchasing, warranties, door-step test drives, and financing in Dehradun.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-base text-white">{faq.q}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
        <h3 className="font-bold text-lg text-white">Have a question not listed here?</h3>
        <p className="text-xs text-slate-400">Our showroom advisors are available 7 days a week.</p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
          >
            Contact Showroom Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
