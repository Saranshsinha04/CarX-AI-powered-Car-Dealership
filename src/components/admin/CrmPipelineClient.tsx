"use client";

import React, { useState } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Users2,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ChevronRight,
  Plus,
  X,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface CrmPipelineClientProps {
  initialLeads: any[];
}

const STAGES = [
  { id: "NEW", label: "New Leads", color: "border-blue-500 text-blue-400" },
  { id: "CONTACTED", label: "Contacted", color: "border-sky-500 text-sky-400" },
  { id: "QUALIFIED", label: "Qualified", color: "border-emerald-500 text-emerald-400" },
  { id: "TEST_DRIVE", label: "Test Drive", color: "border-purple-500 text-purple-400" },
  { id: "NEGOTIATION", label: "Negotiation", color: "border-amber-500 text-amber-400" },
  { id: "WON", label: "Won / Delivered", color: "border-teal-500 text-teal-400" },
  { id: "LOST", label: "Lost", color: "border-rose-500 text-rose-400" },
];

export function CrmPipelineClient({ initialLeads }: CrmPipelineClientProps) {
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const [activeLead, setActiveLead] = useState<any | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(leadId: string, newStatus: string) {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (activeLead && activeLead.id === leadId) {
          setActiveLead((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim() || !activeLead) return;

    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: activeLead.id,
          status: activeLead.status,
          note: newNote.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        const addedNoteObj = {
          id: `note-${Date.now()}`,
          content: newNote.trim(),
          createdAt: new Date().toISOString(),
          isAiGenerated: false,
        };

        const updatedLeadNotes = [addedNoteObj, ...(activeLead.notes || [])];
        setActiveLead({ ...activeLead, notes: updatedLeadNotes });
        setLeads((prev) =>
          prev.map((l) => (l.id === activeLead.id ? { ...l, notes: updatedLeadNotes } : l))
        );
        setNewNote("");
      }
    } catch (err) {
      alert("Failed to add note.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Columns Container (Kanban) */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          return (
            <div
              key={stage.id}
              className="w-80 shrink-0 glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full border-2 ${stage.color}`} />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                    {stage.label}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] font-bold text-slate-400">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {stageLeads.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-xl">
                    No leads in this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setActiveLead(lead)}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all space-y-2 group shadow-sm hover:shadow-brand-500/10"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white group-hover:text-brand-300 transition-colors">
                          {lead.customerName}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                          {lead.intentScore}%
                        </span>
                      </div>

                      <p className="text-[11px] text-brand-400 font-medium line-clamp-1">
                        {lead.vehicle
                          ? `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}`
                          : "General Inquiry"}
                      </p>

                      {lead.aiSummary && (
                        <p className="text-[10px] text-slate-400 line-clamp-2 italic bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                          {lead.aiSummary}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                        <span>{lead.source}</span>
                        <span>{new Date(lead.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Detail & Notes Drawer Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveLead(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Lead #{activeLead.id.slice(-6)}
                </span>
                <span className="text-xs text-slate-400">Source: {activeLead.source}</span>
              </div>
              <h3 className="text-2xl font-black text-white">{activeLead.customerName}</h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <a href={`tel:${activeLead.customerPhone}`} className="flex items-center gap-1.5 text-emerald-400 hover:underline">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{activeLead.customerPhone}</span>
                </a>
                <a href={`mailto:${activeLead.customerEmail}`} className="flex items-center gap-1.5 text-sky-400 hover:underline">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{activeLead.customerEmail}</span>
                </a>
              </div>
            </div>

            {/* Vehicle Interest & AI Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Vehicle</span>
                <p className="text-sm font-bold text-white">
                  {activeLead.vehicle ? `${activeLead.vehicle.year} ${activeLead.vehicle.make} ${activeLead.vehicle.model}` : "General Stock"}
                </p>
                {activeLead.vehicle && (
                  <p className="text-xs text-emerald-400 font-semibold">
                    {formatCurrency(activeLead.vehicle.price)}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Buyer Intent & Timeline</span>
                <p className="text-sm font-bold text-amber-400">
                  Intent Score: {activeLead.intentScore}/100
                </p>
                <p className="text-xs text-slate-400">
                  Timeline: {activeLead.preferredTimeline || "Immediate within 30 days"}
                </p>
              </div>
            </div>

            {/* AI Synthesized Summary */}
            {activeLead.aiSummary && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI Conversation & Intent Summary</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{activeLead.aiSummary}</p>
              </div>
            )}

            {/* Stage Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Move Pipeline Stage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(activeLead.id, s.id)}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                      activeLead.status === s.id
                        ? "bg-brand-600 border-brand-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Staff Notes Thread */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="font-bold text-sm text-white">Staff Activity & Notes</h4>

              {/* Add Note Input */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add note: e.g. Customer visited showroom, offered ₹20,000 corporate discount..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold"
                >
                  Add Note
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeLead.notes && activeLead.notes.length > 0 ? (
                  activeLead.notes.map((n: any) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 space-y-1"
                    >
                      <p>{n.content}</p>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                        {n.isAiGenerated && " • Generated by Northstar AI"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No notes recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
