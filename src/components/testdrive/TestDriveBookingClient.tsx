"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { CalendarCheck, CheckCircle2, Clock, MapPin } from "lucide-react";

interface TestDriveBookingClientProps {
  vehicles: any[];
  preselectedVehicleId?: string;
}

export function TestDriveBookingClient({
  vehicles,
  preselectedVehicleId = "",
}: TestDriveBookingClientProps) {
  const [vehicleId, setVehicleId] = useState(preselectedVehicleId || vehicles[0]?.id || "");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("11:30 AM");
  const [locationType, setLocationType] = useState<"SHOWROOM" | "DOORSTEP">("SHOWROOM");
  const [doorstepAddress, setDoorstepAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) || vehicles[0];

  const timeSlots = [
    "10:00 AM",
    "11:30 AM",
    "01:30 PM",
    "03:00 PM",
    "04:30 PM",
    "06:00 PM",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName || !customerPhone || !date || !vehicleId) return;

    setIsSubmitting(true);
    try {
      const scheduledDateTime = new Date(`${date} ${timeSlot}`).toISOString();

      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          customerName,
          customerPhone,
          customerEmail: customerEmail || "testdrive@northstarmotors.in",
          scheduledAt: scheduledDateTime,
          location:
            locationType === "DOORSTEP"
              ? `Doorstep: ${doorstepAddress || "Dehradun address"}`
              : "Northstar Motors Showroom, Rajpur Road, Dehradun",
          notes: notes ? `Notes: ${notes}` : undefined,
        }),
      });

      setIsSuccess(true);
    } catch (err) {
      alert("Failed to book test drive appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Booking Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-[#090d15] border border-[#1b2334] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#182133] pb-4">
            <div className="w-10 h-10 rounded-lg bg-[#111724] border border-[#243048] flex items-center justify-center text-brand-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Schedule Test Drive</h2>
              <p className="text-xs text-slate-400">Experience your favorite vehicle on Dehradun roads</p>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-black text-white">Test Drive Scheduled</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your appointment for the <strong>{selectedVehicle?.year} {selectedVehicle?.make} {selectedVehicle?.model}</strong> is confirmed for <strong>{date} at {timeSlot}</strong>.
              </p>
              <div className="p-4 rounded-lg bg-[#0e1420] border border-[#1c2436] max-w-sm mx-auto text-xs text-slate-400 text-left space-y-1">
                <p>Location: {locationType === "DOORSTEP" ? doorstepAddress : "Northstar Motors Showroom, Rajpur Road, Dehradun"}</p>
                <p>Customer: {customerName} ({customerPhone})</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-lg bg-[#111724] hover:bg-[#182133] text-xs font-semibold text-white border border-[#243048] uppercase tracking-wider"
              >
                Schedule Another Test Drive
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle Selection */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Vehicle to Test Drive
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.trim || v.bodyType}) - {v.transmission}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    min={tomorrow}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>
                        {ts}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Type */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Test Drive Location
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLocationType("SHOWROOM")}
                    className={`p-3.5 rounded-lg border text-left transition-all ${
                      locationType === "SHOWROOM"
                        ? "bg-brand-600 text-white border-brand-500"
                        : "bg-[#0e1420] text-slate-300 border-[#1e273a] hover:bg-[#161f30]"
                    }`}
                  >
                    <p className="font-bold text-xs">At Showroom</p>
                    <p className="text-[10px] opacity-80 mt-0.5">Plot 42-B, Rajpur Road, Dehradun</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLocationType("DOORSTEP")}
                    className={`p-3.5 rounded-lg border text-left transition-all ${
                      locationType === "DOORSTEP"
                        ? "bg-brand-600 text-white border-brand-500"
                        : "bg-[#0e1420] text-slate-300 border-[#1e273a] hover:bg-[#161f30]"
                    }`}
                  >
                    <p className="font-bold text-xs">Doorstep Delivery</p>
                    <p className="text-[10px] opacity-80 mt-0.5">Delivered to your home/office in Dehradun</p>
                  </button>
                </div>
              </div>

              {locationType === "DOORSTEP" && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Doorstep Address in Dehradun
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14 Subhash Nagar, Saharanpur Road, Dehradun"
                    value={doorstepAddress}
                    onChange={(e) => setDoorstepAddress(e.target.value)}
                    className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#182133]">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98970 12345"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#06080d] border border-[#1b2334] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-brand-900/30"
              >
                {isSubmitting ? "Booking Appointment..." : "Confirm Test Drive Booking"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Selected Vehicle Preview Sidebar */}
      <div className="lg:col-span-5 space-y-6">
        {selectedVehicle && (
          <div className="bg-[#090d15] border border-[#1b2334] rounded-xl overflow-hidden shadow-xl">
            <div className="relative h-48 w-full bg-[#111622]">
              <Image
                src={selectedVehicle.images?.[0]?.url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                alt={selectedVehicle.model}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#06080d]/90 px-2.5 py-1 rounded text-[10px] font-bold text-white border border-[#1e273a] uppercase">
                {selectedVehicle.condition === "CERTIFIED_PRE_OWNED" ? "Certified" : selectedVehicle.condition}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </h3>
                <p className="text-xs text-slate-400">{selectedVehicle.trim || selectedVehicle.bodyType}</p>
                <p className="text-xl font-black text-white mt-1">
                  {formatCurrency(selectedVehicle.price)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#182133] text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Transmission</span>
                  <p className="font-semibold text-white">{selectedVehicle.transmission}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Fuel Type</span>
                  <p className="font-semibold text-white">{selectedVehicle.fuelType}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Engine Output</span>
                  <p className="font-semibold text-white">{selectedVehicle.powerBhp} BHP</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Seating</span>
                  <p className="font-semibold text-white">{selectedVehicle.seatingCapacity} Seater</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#0e1420] border border-[#1c2436] space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid Driver&apos;s License Required</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5">
                  Please bring your original driving license for insurance compliance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
