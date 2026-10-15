"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Car,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  User,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface GlobalAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  matchedVehicles?: any[];
  suggestedActions?: any[];
  leadCaptured?: boolean;
}

const QUICK_PROMPTS = [
  "Automatic SUV under ₹18 Lakh",
  "Best car for mountain & highway driving",
  "Electric cars with 400+ km range",
  "Calculate EMI for ₹20 Lakh car",
  "Showroom location & timing",
];

export function GlobalAiAssistant({ isOpen, onClose, initialQuery }: GlobalAiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm **Northstar AI**, your smart automotive advisor at Northstar Motors Dehradun. Tell me what kind of vehicle you're looking for, your budget, or any questions about specifications, test drives, and financing!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [leadModalVehicle, setLeadModalVehicle] = useState<any | null>(null);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", email: "" });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  async function handleSendMessage(textToSend?: string) {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.message || "I found these relevant details from our database.",
        matchedVehicles: data.matchedVehicles,
        suggestedActions: data.suggestedActions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content:
            "I encountered a temporary connection issue. Please feel free to browse our inventory catalog directly or call our Dehradun showroom.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) return;

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: leadForm.name,
          customerPhone: leadForm.phone,
          customerEmail: leadForm.email || "customer@northstarmotors.in",
          vehicleId: leadModalVehicle?.id,
          source: "AI_CHAT",
          aiSummary: `AI Consultation inquiry for ${leadModalVehicle ? leadModalVehicle.name : "Inventory inquiry"}`,
        }),
      });

      setLeadSubmitted(true);
      setTimeout(() => {
        setLeadModalVehicle(null);
        setLeadSubmitted(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `lead-ack-${Date.now()}`,
            role: "assistant",
            content: `Thank you **${leadForm.name}**! Your request for the **${leadModalVehicle?.name || "vehicle"}** has been assigned to our Dehradun sales team. A specialist will call you at **${leadForm.phone}** shortly to arrange your test drive.`,
          },
        ]);
      }, 1500);
    } catch (err) {
      alert("Failed to submit inquiry. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full glass-panel bg-slate-950/95 border border-slate-700/80 rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-w-5xl h-[90vh]" : "max-w-2xl h-[650px] max-h-[88vh]"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Northstar AI Concierge</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live DB Grounded
                </span>
              </div>
              <p className="text-xs text-slate-400">Natural-language inventory search & automotive advisor</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              title={isExpanded ? "Standard Size" : "Expand Size"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat message flow */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-600/20"
                    : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm"
                }`}
              >
                <div className="whitespace-pre-line prose prose-invert prose-sm max-w-none">
                  {msg.content}
                </div>

                {/* Render Matched Vehicle Cards if present */}
                {msg.matchedVehicles && msg.matchedVehicles.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                    <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider flex items-center gap-1">
                      <Car className="w-3.5 h-3.5" />
                      <span>Verified Showroom Inventory</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.matchedVehicles.map((car: any) => (
                        <div
                          key={car.id}
                          className="bg-slate-950/90 border border-slate-800 rounded-xl overflow-hidden hover:border-brand-500/40 transition-all flex flex-col group"
                        >
                          <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                            <Image
                              src={car.imageUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                              alt={car.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 600px) 100vw, 300px"
                            />
                            <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-amber-400 border border-amber-400/20">
                              {car.matchScore ? `${car.matchScore}% Match` : "In Stock"}
                            </div>
                          </div>

                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-white text-sm line-clamp-1">{car.name}</h4>
                              <p className="text-emerald-400 font-extrabold text-sm mt-0.5">
                                {car.formattedPrice || formatCurrency(car.price)}
                              </p>
                              {car.matchReason && (
                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                  {car.matchReason}
                                </p>
                              )}
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center gap-2">
                              <Link
                                href={`/inventory/${car.id}`}
                                onClick={onClose}
                                className="flex-1 text-center py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                              >
                                View Specs
                              </Link>
                              <button
                                onClick={() => setLeadModalVehicle(car)}
                                className="py-1.5 px-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-colors"
                              >
                                Test Drive
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 rounded-bl-none text-slate-400 text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                <span>Searching real PostgreSQL inventory & verifying specs...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/70 overflow-x-auto flex items-center gap-2 no-scrollbar">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat input box */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. Show me automatic SUVs under 18 lakh or book Creta test drive..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center transition-all shadow-md shadow-brand-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Test Drive / Lead Capture Modal */}
      {leadModalVehicle && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setLeadModalVehicle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {leadSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold text-white">Inquiry Received!</h4>
                <p className="text-sm text-slate-300">
                  Our Northstar automotive specialist will contact you shortly to confirm your slot.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-brand-400 font-semibold text-xs tracking-wider uppercase">
                  <Calendar className="w-4 h-4" />
                  <span>Book Doorstep or Showroom Test Drive</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {leadModalVehicle.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Location: Northstar Motors Showroom, Rajpur Road, Dehradun
                </p>

                <form onSubmit={handleLeadSubmit} className="mt-5 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (Required)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98970 12345"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
                  >
                    Confirm Test Drive Booking
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
