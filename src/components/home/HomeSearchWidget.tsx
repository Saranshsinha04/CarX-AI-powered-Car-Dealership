"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Search, ArrowRight } from "lucide-react";

export function HomeSearchWidget() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if query is standard search or natural language AI query
    const lower = query.toLowerCase();
    if (lower.includes("under") || lower.includes("suv") || lower.includes("automatic") || lower.includes("best") || lower.includes("lakh")) {
      // Redirect to inventory with search or pass to AI
      router.push(`/inventory?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/inventory?search=${encodeURIComponent(query.trim())}`);
    }
  }

  const chips = [
    { label: "Automatic SUV under ₹18 Lakh", query: "automatic SUV under 18 lakh" },
    { label: "Used Thar 4x4", query: "Mahindra Thar" },
    { label: "Creta Turbo DCT", query: "Hyundai Creta" },
    { label: "Electric Cars", query: "EV" },
  ];

  return (
    <div className="space-y-3">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center glass-panel p-2 rounded-2xl border border-slate-700/80 shadow-2xl focus-within:border-brand-500 transition-all"
      >
        <div className="pl-3 pr-2 text-brand-400">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI: e.g. 'Show me automatic SUVs under 18 lakh' or 'family 7-seater'..."
          className="w-full bg-transparent border-none text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none px-2"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-md shadow-brand-500/25 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </form>

      {/* Suggested chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
        <span className="text-slate-400">Popular:</span>
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => {
              setQuery(chip.query);
              router.push(`/inventory?search=${encodeURIComponent(chip.query)}`);
            }}
            className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
