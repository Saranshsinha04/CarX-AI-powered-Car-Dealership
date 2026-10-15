"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles, TrendingUp, Users2, ShieldCheck, ArrowRight } from "lucide-react";

const COPILOT_PROMPTS = [
  "Show showroom performance overview & sales summary",
  "Which leads need urgent follow-up today?",
  "Show current CRM pipeline stage distribution",
  "What are our top-performing vehicles by interest?",
];

export function AdminCopilotClient() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "👋 Welcome Vikram. I am your **Dealership Staff AI Copilot**. I query our real PostgreSQL database to give you instant intelligence on showroom inventory, high-intent leads, upcoming test drives, and pipeline velocity. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(textToSend?: string) {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || "Query completed against PostgreSQL.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error executing copilot query against database." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 flex flex-col h-[75vh] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base">Northstar Staff AI Copilot</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Staff Scoped
              </span>
            </div>
            <p className="text-xs text-slate-400">Database intelligence & sales assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "bg-brand-600 text-white rounded-br-none"
                  : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <span>Querying PostgreSQL database metrics & lead tables...</span>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950 flex flex-wrap gap-2">
        {COPILOT_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-full text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask employee copilot: e.g. 'Show me high intent leads' or 'Sales summary'..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
