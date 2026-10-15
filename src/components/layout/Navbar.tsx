"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  Sparkles,
  Layers,
  Calculator,
  RefreshCw,
  CalendarCheck,
  ShieldAlert,
  Menu,
  X,
  PhoneCall,
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
    { label: "Compare", href: "/compare", icon: Layers },
    { label: "Financing", href: "/finance", icon: Calculator },
    { label: "Trade-In", href: "/trade-in", icon: RefreshCw },
    { label: "Test Drive", href: "/test-drive", icon: CalendarCheck },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              <span>{dealershipName.split(" ")[0]}</span>
              <span className="text-brand-400 font-semibold">{dealershipName.split(" ")[1] || "Motors"}</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Dehradun • Rajpur Road</p>
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "text-brand-400 bg-brand-500/10 border border-brand-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-brand-400" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Ask AI Pill Button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Ask Northstar AI</span>
          </button>

          {/* Call Showroom */}
          <a
            href="tel:+911352748900"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>0135-2748900</span>
          </a>

          {/* Admin link */}
          <Link
            href="/admin"
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800/60 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            <span>Staff Portal</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAi}
            className="p-2 rounded-lg bg-brand-600 text-white text-xs font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  active ? "text-brand-400 bg-brand-500/10" : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-5 h-5 text-slate-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAi) onOpenAi();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-medium text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask Northstar AI Vehicle Finder</span>
            </button>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Dealership Staff Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
