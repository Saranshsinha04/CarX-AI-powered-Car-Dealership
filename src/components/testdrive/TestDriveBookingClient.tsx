"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { CalendarCheck, CheckCircle2, Clock, MapPin, Sparkles, ShieldCheck } from "lucide-react";

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
      // Create scheduled ISO date
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

  // Calculate default min date (tomorrow)
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Booking Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Schedule Test Drive</h2>
              <p className="text-xs text-slate-400">Experience your favorite car on Dehradun roads</p>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-white">Test Drive Confirmed!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your test drive appointment for the <strong>{selectedVehicle?.year} {selectedVehicle?.make} {selectedVehicle?.model}</strong> has been booked for <strong>{date} at {timeSlot}</strong>.
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-sm mx-auto text-xs text-slate-400 text-left space-y-1">
                <p>📍 <strong>Location:</strong> {locationType === "DOORSTEP" ? doorstepAddress : "Northstar Motors Showroom, Rajpur Road, Dehradun"}</p>
                <p>👤 <strong>Driver:</strong> {customerName} ({customerPhone})</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Select Vehicle to Test Drive
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500"
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
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    min={tomorrow}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Drive Location
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLocationType("SHOWROOM")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      locationType === "SHOWROOM"
                        ? "bg-brand-600/20 border-brand-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    <p className="font-bold text-xs">Showroom Visit</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Rajpur Road, Dehradun</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationType("DOORSTEP")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      locationType === "DOORSTEP"
                        ? "bg-brand-600/20 border-brand-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    <p className="font-bold text-xs">Doorstep Delivery</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Anywhere in Dehradun</p>
                  </button>
                </div>

                {locationType === "DOORSTEP" && (
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="Enter your home or office address in Dehradun"
                      value={doorstepAddress}
                      onChange={(e) => setDoorstepAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                )}
              </div>

              {/* Driver Details */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Driver Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number (Required)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98970 12345"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="rahul@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-500/25"
              >
                {isSubmitting ? "Booking Your Slot..." : "Confirm Test Drive Booking"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Selected Vehicle Preview Sidebar */}
      <div className="lg:col-span-5 space-y-6">
        {selectedVehicle && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 shadow-2xl">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Selected Vehicle
            </span>
            <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-slate-900">
              <Image
                src={selectedVehicle.images?.[0]?.url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                alt={selectedVehicle.model}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedVehicle.trim || selectedVehicle.bodyType}</p>
              <p className="text-2xl font-black text-emerald-400 mt-2">
                {formatCurrency(selectedVehicle.price)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
              <div>
                <span className="text-slate-500">Transmission:</span>{" "}
                <span className="font-semibold text-white">{selectedVehicle.transmission}</span>
              </div>
              <div>
                <span className="text-slate-500">Fuel:</span>{" "}
                <span className="font-semibold text-white">{selectedVehicle.fuelType}</span>
              </div>
              <div>
                <span className="text-slate-500">Power:</span>{" "}
                <span className="font-semibold text-white">{selectedVehicle.powerBhp} BHP</span>
              </div>
              <div>
                <span className="text-slate-500">Torque:</span>{" "}
                <span className="font-semibold text-white">{selectedVehicle.torqueNm} Nm</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sanitized vehicle prepared 30 mins prior</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Valid driving license required for test drive</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
