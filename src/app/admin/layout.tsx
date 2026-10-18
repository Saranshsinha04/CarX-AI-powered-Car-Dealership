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
  UserCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render clean container
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#06080d]">{children}</div>;
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
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-[#090d15] border-b border-[#182133] p-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#111724] border border-[#243048] flex items-center justify-center">
            <Car className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-xs uppercase tracking-wider">Northstar Console</span>
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#090d15] border-r border-[#182133] flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#182133]">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-[#111724] border border-[#243048] flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-black text-xs uppercase tracking-wider text-white block">Northstar Motors</span>
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? "bg-[#111724] text-white border border-[#243048]"
                      : "text-slate-400 hover:text-white hover:bg-[#0e1420]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-brand-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-[#182133] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-[#0e1420] transition-colors"
          >
            <span>View Public Showroom</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
