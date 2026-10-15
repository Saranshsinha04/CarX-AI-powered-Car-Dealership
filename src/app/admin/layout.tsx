"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users2,
  Calendar,
  BarChart3,
  Bot,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  UserCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render clean container
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  const menuItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Inventory", href: "/admin/inventory", icon: Car },
    { label: "CRM Leads", href: "/admin/leads", icon: Users2 },
    { label: "Appointments", href: "/admin/appointments", icon: Calendar },
    { label: "Customers", href: "/admin/customers", icon: UserCheck },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "AI Copilot", href: "/admin/ai-copilot", icon: Bot },
    { label: "Dealership Settings", href: "/admin/settings", icon: Settings },
    { label: "Staff & RBAC", href: "/admin/users", icon: ShieldCheck },
  ];

  async function handleLogout() {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Navigation */}
      <div className="md:hidden glass-panel border-b border-slate-800 p-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Car className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">Northstar Staff Portal</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop / Collapsible Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel bg-slate-950/95 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white block">Northstar Motors</span>
                <span className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Session & Quick links */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div>
              <p className="font-bold text-white">Vikram Malhotra</p>
              <p className="text-[11px] text-emerald-400">Dealership Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 transition-colors"
          >
            <span>View Live Customer Website</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">{children}</div>
      </div>
    </div>
  );
}
