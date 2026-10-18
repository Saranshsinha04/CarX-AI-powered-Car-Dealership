"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HomeSearchWidget() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/inventory?search=${encodeURIComponent(query.trim())}`);
  }

  const chips = [
    { label: "Automatic SUV under ₹20 Lakh", query: "automatic SUV under 20 lakh" },
    { label: "Mahindra Thar 4x4", query: "Mahindra Thar" },
    { label: "Hyundai Creta Turbo", query: "Hyundai Creta" },
    { label: "Electric Vehicles", query: "EV" },
    { label: "7-Seater Family", query: "7-seater" },
  ];

  return (
    <div className="space-y-3.5">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-[#0b0f17] p-2 rounded-xl border border-[#20293a] focus-within:border-brand-500/60 shadow-xl transition-all"
      >
        <div className="pl-3 pr-2 text-slate-400">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search make, model, body type, or transmission (e.g. 'Creta DCT', 'Thar 4x4', 'EV')..."
          className="w-full bg-transparent border-none text-white text-sm sm:text-base placeholder-slate-500 focus:outline-none px-2"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm whitespace-nowrap uppercase tracking-wider transition-colors"
        >
          <span>Search Stock</span>
        </button>
      </form>

      {/* Suggested chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold tracking-wider text-[11px] uppercase">Trending Searches:</span>
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => {
              setQuery(chip.query);
              router.push(`/inventory?search=${encodeURIComponent(chip.query)}`);
            }}
            className="px-3 py-1 rounded-md bg-[#0f1420] hover:bg-[#161e30] text-slate-300 hover:text-white border border-[#202a3d] transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
