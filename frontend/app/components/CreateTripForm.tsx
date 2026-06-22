"use client";

import { useState } from "react";

// Strictly matching the allowed schema fields and database enum
interface Props {
  onSubmit: (trip: {
    destination: string;
    durationDays: number;
    budgetTier: "Low" | "Medium" | "High";
    interests: string[];
  }) => void;
}

export default function CreateTripForm({ onSubmit }: Props) {
  const [destination, setDestination] = useState("");
  const [durationDays, setDurationDays] = useState(3);
  const [budgetTier, setBudgetTier] = useState<"Low" | "Medium" | "High">("Medium");
  const [interests, setInterests] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if empty or invalid
    if (!destination.trim() || durationDays < 1) return;

    onSubmit({
      destination: destination.trim(),
      durationDays,
      budgetTier,
      interests: interests
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl"
    >
      <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
        Create New Trip
      </h2>

      {/* Destination - marked as required in the schema */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">
          Destination
        </label>
        <input
          required
          type="text"
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition"
          placeholder="e.g., Tokyo, Paris, Bali"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      {/* Duration - protected against negative values */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">
          Duration (Days)
        </label>
        <input
          required
          type="number"
          min="1"
          max="30"
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition"
          placeholder="e.g., 5"
          value={durationDays}
          onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
        />
      </div>

      {/* Budget Tier - explicit value assignments */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">
          Budget Tier
        </label>
        <select
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500 text-sm transition cursor-pointer"
          value={budgetTier}
          onChange={(e) => setBudgetTier(e.target.value as "Low" | "Medium" | "High")}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">
          Interests (comma separated)
        </label>
        <input
          type="text"
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition"
          placeholder="e.g., Food, Art, Nature"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-500 transition text-white px-6 py-3 rounded-xl w-full text-sm font-semibold shadow-md mt-2"
      >
        Generate Trip
      </button>
    </form>
  );
}