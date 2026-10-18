"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlobalAiAssistant } from "../ai/GlobalAiAssistant";
import { Compass } from "lucide-react";
import { usePathname } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [initialAiQuery, setInitialAiQuery] = useState<string | undefined>(undefined);
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");

  const openAiWithQuery = (query?: string) => {
    setInitialAiQuery(query);
    setAiAssistantOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#06080d] text-slate-100">
      {!isAdminRoute && (
        <Navbar onOpenAi={() => openAiWithQuery()} />
      )}

      <main className="flex-1">{children}</main>

      {!isAdminRoute && <Footer />}

      {/* Understated Showroom Concierge Trigger (Public pages only) */}
      {!isAdminRoute && (
        <button
          onClick={() => openAiWithQuery()}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#0e1420] text-slate-200 hover:text-white font-semibold text-xs tracking-wider uppercase border border-[#232d42] hover:border-brand-500/50 shadow-2xl transition-all hover:-translate-y-0.5 active:translate-y-0"
          aria-label="Open Showroom Concierge"
        >
          <Compass className="w-4 h-4 text-brand-400" />
          <span className="hidden sm:inline">Showroom Concierge</span>
        </button>
      )}

      {/* Global Concierge Dialog */}
      <GlobalAiAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        initialQuery={initialAiQuery}
      />
    </div>
  );
}
