import React from "react";
import Link from "next/link";
import { Car, MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Address */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="font-extrabold text-xl tracking-tight text-white">
                <span>Northstar</span> <span className="text-brand-400">Motors</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Uttarakhand&apos;s premier smart car dealership. Experience transparent pricing, verified pre-owned certification, instant AI vehicle recommendations, and tailored automotive financing in Dehradun.
            </p>
            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Plot 42-B, Rajpur Road, Near IT Park Chowk, Dehradun, Uttarakhand 248001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 135 274 8900 / +91 98970 12345</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>contact@northstarmotors.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/inventory" className="hover:text-brand-400 transition-colors">
                  All Inventory
                </Link>
              </li>
              <li>
                <Link href="/inventory?bodyType=SUV" className="hover:text-brand-400 transition-colors">
                  SUVs & 4x4 Off-Road
                </Link>
              </li>
              <li>
                <Link href="/inventory?bodyType=EV" className="hover:text-brand-400 transition-colors">
                  Electric Vehicles (EVs)
                </Link>
              </li>
              <li>
                <Link href="/inventory?condition=CERTIFIED_PRE_OWNED" className="hover:text-brand-400 transition-colors">
                  Certified Pre-Owned
                </Link>
              </li>
              <li>
                <Link href="/inventory?bodyType=Luxury" className="hover:text-brand-400 transition-colors">
                  Luxury Collection
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-brand-400 transition-colors">
                  Compare Vehicles
                </Link>
              </li>
            </ul>
          </div>

          {/* Ownership & Finance */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/finance" className="hover:text-brand-400 transition-colors">
                  EMI Calculator & Loans
                </Link>
              </li>
              <li>
                <Link href="/trade-in" className="hover:text-brand-400 transition-colors">
                  Instant Car Valuation
                </Link>
              </li>
              <li>
                <Link href="/test-drive" className="hover:text-brand-400 transition-colors">
                  Book Doorstep Test Drive
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  About Northstar
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  Contact & Showroom Tour
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Hours & Assurance */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Operating Hours</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Mon – Fri: 9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Saturday: 9:00 AM – 8:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Sunday: 10:00 AM – 6:00 PM</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>150-Point Quality Inspection</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>7-Day Return & Exchange Promise</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-400 font-medium">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Guaranteed Title & RC Transfer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Local SEO keywords */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Northstar Motors Pvt. Ltd. All rights reserved. Dehradun, Uttarakhand.
          </p>
          <div className="flex items-center gap-6 text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Terms & Conditions
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
