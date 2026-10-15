"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2, ShieldCheck, Globe, Palette } from "lucide-react";

interface AdminSettingsClientProps {
  initialSettings: any;
  dealership: any;
}

export function AdminSettingsClient({ initialSettings, dealership }: AdminSettingsClientProps) {
  const [form, setForm] = useState({
    name: dealership.name || "Northstar Motors",
    tagline: dealership.tagline || "Drive what moves you.",
    phone: dealership.phone || "+91 135 274 8900",
    whatsapp: dealership.whatsapp || "+91 98970 12345",
    email: dealership.email || "contact@northstarmotors.in",
    address: dealership.address || "Plot 42-B, Rajpur Road, Near IT Park Chowk, Dehradun",
    primaryColor: initialSettings.primaryColor || "#026ac9",
    metaTitle: initialSettings.metaTitle || "Northstar Motors Dehradun | New & Certified Used Cars",
    seoKeywords: initialSettings.seoKeywords || "car dealership dehradun, used cars dehradun",
    defaultInterestRate: initialSettings.defaultInterestRate || 8.99,
    defaultDownPaymentPercent: initialSettings.defaultDownPaymentPercent || 20,
    aboutText: initialSettings.aboutText || "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save settings. Please verify admin permissions.");
      }
    } catch (err) {
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Dealership branding & white-label settings updated successfully in PostgreSQL!</span>
        </div>
      )}

      {/* General Identity */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>Dealership Branding & Identity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Dealership Business Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">About Text (Mission & Bio)</label>
          <textarea
            rows={3}
            value={form.aboutText}
            onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white"
          />
        </div>
      </div>

      {/* Contact & Physical Showroom */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white">Contact & Physical Location</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Showroom Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Desk</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Public Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Showroom Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
          />
        </div>
      </div>

      {/* SEO & Financing Parameters */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white">SEO & Default Financing Defaults</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">SEO Meta Title</label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">SEO Keywords</label>
            <input
              type="text"
              value={form.seoKeywords}
              onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Default Interest Rate (% p.a.)</label>
            <input
              type="number"
              step="0.01"
              value={form.defaultInterestRate}
              onChange={(e) => setForm({ ...form, defaultInterestRate: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Default Down Payment (%)</label>
            <input
              type="number"
              value={form.defaultDownPaymentPercent}
              onChange={(e) => setForm({ ...form, defaultDownPaymentPercent: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-brand-500/25 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
        </button>
      </div>
    </form>
  );
}
