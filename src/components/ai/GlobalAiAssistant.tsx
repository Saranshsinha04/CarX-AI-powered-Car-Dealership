"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Send,
  X,
  Minimize2,
  Maximize2,
  Car,
  Calendar,
  CheckCircle2,
  Compass,
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
  "Automatic SUV under ₹20 Lakh",
  "Best vehicle for Dehradun & mountain roads",
  "Electric vehicles with 400+ km range",
  "Calculate EMI for ₹25 Lakh loan",
  "Showroom location & visiting hours",
];

export function GlobalAiAssistant({ isOpen, onClose, initialQuery }: GlobalAiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to **Northstar Motors**. I am your showroom digital concierge. Ask me anything regarding our live Dehradun inventory, vehicle specifications, comparisons, test drive scheduling, or financing terms.",
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
        content: data.message || "I found these relevant details from our inventory database.",
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
            "I encountered a temporary connection issue. Please browse our showroom catalog directly or call our sales desk at 0135-2748900.",
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
          source: "CONCIERGE_CHAT",
          aiSummary: `Digital Concierge test drive request for ${leadModalVehicle ? leadModalVehicle.name : "Showroom vehicle"}`,
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
            content: `Thank you **${leadForm.name}**! Your request for the **${leadModalVehicle?.name || "vehicle"}** has been scheduled. A sales manager from our Rajpur Road showroom will contact you at **${leadForm.phone}** to finalize your test drive timing.`,
          },
        ]);
      }, 1200);
    } catch (err) {
      alert("Failed to submit request.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full bg-[#080c14] border border-[#1c2436] rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-w-5xl h-[90vh]" : "max-w-2xl h-[650px] max-h-[88vh]"
        }`}
      >
        {/* Header - Luxury Showroom Styling */}
        <div className="px-5 py-4 border-b border-[#182133] flex items-center justify-between bg-[#0b0f17]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#111724] border border-[#243048] flex items-center justify-center">
              <Compass className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Showroom Concierge</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#111724] text-slate-300 border border-[#20293a]">
                  PostgreSQL Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Natural-language inventory verification & consultation</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-[#141b2a] hover:text-white transition-colors"
              title={isExpanded ? "Standard Size" : "Expand Size"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#141b2a] hover:text-white transition-colors"
              aria-label="Close Concierge"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat message flow */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#080c14]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-600 text-white rounded-br-none shadow-sm"
                    : "bg-[#0d131f] text-slate-200 border border-[#1c2436] rounded-bl-none shadow-sm"
                }`}
              >
                <div className="whitespace-pre-line prose prose-invert prose-sm max-w-none">
                  {msg.content}
                </div>

                {/* Render Matched Vehicle Cards */}
                {msg.matchedVehicles && msg.matchedVehicles.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#1c2436] space-y-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-brand-400" />
                      <span>Verified Showroom Inventory</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.matchedVehicles.map((car: any) => (
                        <div
                          key={car.id}
                          className="bg-[#0b0f17] border border-[#1b2334] rounded-lg overflow-hidden flex flex-col group hover:border-[#2b374e] transition-colors"
                        >
                          <div className="relative h-28 w-full bg-[#111622] overflow-hidden">
                            <Image
                              src={car.imageUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                              alt={car.name}
                              fill
                              className="object-cover"
                              sizes="300px"
                            />
                            <div className="absolute top-2 right-2 bg-[#06080d]/90 px-2 py-0.5 rounded text-[10px] font-bold text-white border border-slate-700">
                              {car.matchScore ? `${car.matchScore}% Match` : "In Stock"}
                            </div>
                          </div>

                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-white text-xs line-clamp-1">{car.name}</h4>
                              <p className="text-white font-extrabold text-xs mt-0.5">
                                {car.formattedPrice || formatCurrency(car.price)}
                              </p>
                              {car.matchReason && (
                                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                                  {car.matchReason}
                                </p>
                              )}
                            </div>

                            <div className="mt-3 pt-2 border-t border-[#182133] flex items-center gap-2">
                              <Link
                                href={`/inventory/${car.id}`}
                                onClick={onClose}
                                className="flex-1 text-center py-1.5 px-2 rounded bg-[#111724] hover:bg-[#182133] text-[11px] font-semibold text-slate-200 transition-colors border border-[#202a3d]"
                              >
                                View Specs
                              </Link>
                              <button
                                onClick={() => setLeadModalVehicle(car)}
                                className="py-1.5 px-2.5 rounded bg-brand-600 hover:bg-brand-500 text-[11px] font-semibold text-white transition-colors"
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
              <div className="px-4 py-3 rounded-xl bg-[#0d131f] border border-[#1c2436] text-slate-400 text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                <span>Searching PostgreSQL inventory & calculating specifications...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-[#182133] bg-[#090d15] overflow-x-auto flex items-center gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-[#0e1420] hover:bg-[#161f30] text-slate-300 hover:text-white border border-[#1e273a] whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat input box */}
        <div className="p-4 border-t border-[#182133] bg-[#0b0f17]">
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
              placeholder="e.g. Show automatic SUVs under 20 lakh or schedule Creta test drive..."
              className="flex-1 bg-[#06080d] border border-[#1b2334] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center transition-colors uppercase tracking-wider"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Test Drive Scheduling Modal */}
      {leadModalVehicle && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#090d15] border border-[#1b2334] rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setLeadModalVehicle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {leadSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Test Drive Scheduled</h4>
                <p className="text-xs text-slate-300">
                  Our sales manager will contact you to finalize appointment time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-brand-400 font-semibold text-xs tracking-wider uppercase">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Showroom / Doorstep Test Drive</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {leadModalVehicle.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Showroom: Rajpur Road, Dehradun
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98970 12345"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
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
