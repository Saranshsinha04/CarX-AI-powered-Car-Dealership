"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  Layers,
  Calculator,
  RefreshCw,
  CalendarCheck,
  ShieldCheck,
  Menu,
  X,
  Phone,
  Compass,
  Disc,
} from "lucide-react";

interface NavbarProps {
  dealershipName?: string;
  onOpenAi?: () => void;
}

export function Navbar({ dealershipName = "Northstar Motors", onOpenAi }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Inventory", href: "/inventory", icon: Car },
    { label: "Forged Wheels", href: "/wheels", icon: Disc },
    { label: "Compare", href: "/compare", icon: Layers },
    { label: "Financing & EMI", href: "/finance", icon: Calculator },
    { label: "Trade-In", href: "/trade-in", icon: RefreshCw },
    { label: "Book Test Drive", href: "/test-drive", icon: CalendarCheck },
  ];

  const isActive = (path: string) => {
    if (path === "/inventory" && pathname.startsWith("/inventory")) return true;
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1c2436] bg-[#06080d]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Premium Automotive Showroom */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-lg bg-[#0e1420] border border-[#232d42] flex items-center justify-center transition-colors group-hover:border-brand-500/50">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-black tracking-wider uppercase text-white flex items-center gap-1.5">
              <span>{dealershipName.split(" ")[0]}</span>
              <span className="text-slate-400 font-semibold">{dealershipName.split(" ")[1] || "Motors"}</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">
              Showroom · Rajpur Road, Dehradun
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  active
                    ? "text-white bg-[#131b2b] border border-[#24334f]"
                    : "text-slate-400 hover:text-white hover:bg-[#0e1420]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-brand-400" : "text-slate-500"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Showroom Concierge Trigger */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#111724] hover:bg-[#182133] text-slate-200 hover:text-white text-xs font-semibold border border-[#243048] hover:border-brand-500/40 transition-colors"
          >
            <Compass className="w-4 h-4 text-brand-400" />
            <span>Digital Concierge</span>
          </button>

          {/* Showroom Direct Desk */}
          <a
            href="tel:+911352748900"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-300 bg-[#0c1018] hover:bg-[#121824] border border-[#1c2436] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>0135-2748900</span>
          </a>

          {/* Staff Portal */}
          <Link
            href="/admin"
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Staff</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAi}
            className="px-3 py-2 rounded-lg bg-[#111724] border border-[#243048] text-xs font-semibold text-white flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-brand-400" />
            <span>Concierge</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1c2436] bg-[#090d15] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  active ? "text-white bg-[#131b2b] border border-[#24334f]" : "text-slate-400 hover:bg-[#0e1420] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#1c2436] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAi) onOpenAi();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#111724] border border-[#243048] text-white font-semibold text-xs uppercase tracking-wider"
            >
              <Compass className="w-4 h-4 text-brand-400" />
              <span>Launch Showroom Concierge</span>
            </button>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs text-slate-500 hover:text-slate-300"
            >
              Dealership Staff Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
