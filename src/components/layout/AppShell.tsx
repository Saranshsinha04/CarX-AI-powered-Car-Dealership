"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlobalAiAssistant } from "../ai/GlobalAiAssistant";
import { Sparkles } from "lucide-react";
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
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && (
        <Navbar onOpenAi={() => openAiWithQuery()} />
      )}

      <main className="flex-1">{children}</main>

      {!isAdminRoute && <Footer />}

      {/* Floating AI Button (Public pages only) */}
      {!isAdminRoute && (
        <button
          onClick={() => openAiWithQuery()}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-2xl shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all border border-white/20 group"
          aria-label="Open Northstar AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Ask AI Car Finder</span>
        </button>
      )}

      {/* Global AI Dialog */}
      <GlobalAiAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        initialQuery={initialAiQuery}
      />
    </div>
  );
}
