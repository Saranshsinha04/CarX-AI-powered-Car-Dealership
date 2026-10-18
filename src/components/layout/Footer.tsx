import React from "react";
import Link from "next/link";
import { Car, MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#05070a] border-t border-[#182133] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Address */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-[#0e1420] border border-[#232d42] flex items-center justify-center transition-colors group-hover:border-brand-500/50">
                <Car className="w-4 h-4 text-white" />
              </div>
              <div className="text-base font-black tracking-wider uppercase text-white">
                <span>Northstar</span> <span className="text-slate-400 font-semibold">Motors</span>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Uttarakhand&apos;s premier automotive showroom. Certified pre-owned inspections, transparent ex-showroom pricing, doorstep test drives, and competitive auto loans across Dehradun.
            </p>
            <div className="pt-2 space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Plot 42-B, Rajpur Road, Near IT Park Chowk, Dehradun, Uttarakhand 248001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sales Desk: +91 135 274 8900 | WhatsApp: +91 98970 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>desk@northstarmotors.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs tracking-wider uppercase">Showroom Inventory</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/inventory" className="hover:text-white transition-colors">
                  All Vehicles (36+)
                </Link>
              </li>
              <li>
                <Link href="/inventory?bodyType=SUV" className="hover:text-white transition-colors">
                  SUVs & 4x4
                </Link>
              </li>
              <li>
                <Link href="/inventory?bodyType=EV" className="hover:text-white transition-colors">
                  Electric Vehicles (EV)
                </Link>
              </li>
              <li>
                <Link href="/inventory?condition=CERTIFIED_PRE_OWNED" className="hover:text-white transition-colors">
                  Certified Pre-Owned
                </Link>
              </li>
              <li>
                <Link href="/inventory?bodyType=Sedan" className="hover:text-white transition-colors">
                  Executive Sedans
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Vehicle Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs tracking-wider uppercase">Dealership Services</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/finance" className="hover:text-white transition-colors">
                  Financing & EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/trade-in" className="hover:text-white transition-colors">
                  Instant Car Valuation
                </Link>
              </li>
              <li>
                <Link href="/test-drive" className="hover:text-white transition-colors">
                  Book Doorstep Test Drive
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Showroom
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Showroom Tour & Directions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Ownership FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Hours */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs tracking-wider uppercase">Showroom Hours</h3>
            <div className="space-y-1.5 text-slate-300">
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

            <div className="pt-3 border-t border-[#182133] space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>150-Point Certified Inspection</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>Guaranteed RC Transfer & Clean Title</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#182133] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Northstar Motors Pvt. Ltd. Rajpur Road, Dehradun.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/admin" className="hover:text-slate-300 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
