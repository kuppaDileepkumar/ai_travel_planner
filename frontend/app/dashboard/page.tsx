"use client";

import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CreateTripForm from "../components/CreateTripForm";
import ItineraryCard from "../components/ItineraryCard";
import PackingList from "../components/PackingList";

const BASE_URL = "http://localhost:5000/api/trips";

interface Activity {
  _id?: string;
  title: string;
  description: string;
  estimatedCostUSD: number;
  timeOfDay: string;
}

interface ItineraryDay {
  _id?: string;
  dayNumber: number;
  activities: Activity[];
}

interface PackingItem {
  _id?: string;
  item: string;
  category: string;
  isPacked: boolean;
}

interface Hotel {
  _id?: string;
  name: string;
  tier: string;
  estimatedCostNightUSD: number;
  rating: string;
}

interface Trip {
  _id: string;
  destination: string;
  durationDays: number;
  budgetTier: string;
  interests: string[];

  itinerary: ItineraryDay[];

  hotels: Hotel[];

  packingList: PackingItem[];
  estimatedBudget: {
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
  total: number;
};
}

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [creatingTrip, setCreatingTrip] = useState(false);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);



  useEffect(() => {
  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${BASE_URL}/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch trips");
      }

      setTrips(data);
      setSelectedTrip(data.length > 0 ? data[0] : null);
    } catch (err) {
      //console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchTrips();
}, [router]);

  const generateTrip = async (tripData: {
    destination: string;
    durationDays: number;
    budgetTier: "Low" | "Medium" | "High";
    interests: string[];
  }) => {
    try {
      setCreatingTrip(true);

      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/generateNewTrip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tripData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate trip");
      }

      const newTrip: Trip = data.trip;

      setTrips((prev) => [newTrip, ...prev]);
      setSelectedTrip(newTrip);
    } catch (err) {
      console.error(err);
      alert("Failed to generate trip.");
    } finally {
      setCreatingTrip(false);
    }
  };
  const togglePackingItem = async (itemId: string) => {
  if (!selectedTrip) return;

  const updatedPackingList = selectedTrip.packingList.map((item) =>
    item._id === itemId
      ? { ...item, isPacked: !item.isPacked }
      : item
  );

  try {
    const token = localStorage.getItem("token");
   
    const res = await fetch(
      `${BASE_URL}/getUserTrips/${selectedTrip._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packingList: updatedPackingList,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    setSelectedTrip(data);

    setTrips((prev) =>
      prev.map((trip) =>
        trip._id === data._id ? data : trip
      )
    );
  } catch (err) {
    console.error(err);
  }
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

if (loading) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
      <h1 className="text-xl animate-pulse">
        Loading your trips...
      </h1>
    </div>
  );
}
return (
  <div className="min-h-screen bg-slate-950 text-white p-6">
    <header className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
      <div>
        <h1 className="text-3xl font-bold">
          AI Travel Dashboard
        </h1>
        <p className="text-slate-400">
          User Data Enclave Connected
        </p>
      </div>

      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
      >
        Sign Out
      </button>
    </header>

    <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
      {/* LEFT PANEL */}
      <div className="space-y-6">

        {/* Trips */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h2 className="text-xl font-bold mb-4">
            Your Active Trips
          </h2>

          {trips.length === 0 ? (
            <p className="text-slate-400">
              No trips found.
            </p>
          ) : (
            <div className="space-y-3">
              {trips.map((trip, index) => (
                <button
                  key={trip._id || index}
                  onClick={() => setSelectedTrip(trip)}
                  className={`w-full rounded-lg p-4 text-left transition ${
                    selectedTrip?._id === trip._id
                      ? "bg-blue-600"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  <h3 className="font-semibold">
                    {trip.destination}
                  </h3>

                  <p className="text-sm text-slate-300">
                    {trip.durationDays} Days • {trip.budgetTier}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
        {selectedTrip && (selectedTrip.hotels?.length ?? 0) > 0 && (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
    <h2 className="text-xl font-bold mb-4">
      🏨 Recommended Hotels
    </h2>

    <div className="space-y-4">
      {selectedTrip.hotels.map((hotel, index) => (
        <div
          key={hotel._id ?? `${hotel.name}-${index}`}
          className="bg-slate-800 rounded-lg p-4"
        >
          <h3>{hotel.name}</h3>
          <p>Tier: {hotel.tier}</p>
          <p>Rating: ⭐ {hotel.rating}</p>
          <p>${hotel.estimatedCostNightUSD} / night</p>
        </div>
      ))}
    </div>
  </div>
)}

        {/* Budget */}
        {selectedTrip && (
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold mb-4">
              Estimated Budget
            </h2>

            <div className="space-y-2">

              <div className="flex justify-between">
                <span>Accommodation</span>
                <span>
                  $
                  {selectedTrip.estimatedBudget?.accommodation ?? 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Food</span>
                <span>
                  $
                  {selectedTrip.estimatedBudget?.food ?? 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Activities</span>
                <span>
                  $
                  {selectedTrip.estimatedBudget?.activities ?? 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Transport</span>
                <span>
                  $
                  {selectedTrip.estimatedBudget?.transport ?? 0}
                </span>
              </div>

              <hr className="border-slate-700" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>

                <span>
                  $
                  {selectedTrip.estimatedBudget?.total ?? 0}
                </span>
              </div>

            </div>
          </div>
        )}

        <CreateTripForm
          onSubmit={generateTrip}
        />

        {creatingTrip && (
          <div className="bg-blue-900 rounded-lg p-3 text-center">
            Generating AI itinerary...
          </div>
        )}

      </div>

      {/* RIGHT PANEL */}

      <div className="lg:col-span-2 space-y-6">

        {selectedTrip ? (
          <>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

              <h2 className="text-2xl font-bold mb-6">
                Itinerary
              </h2>

              {selectedTrip.itinerary.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  🗓️
                  <br />
                  No itinerary available.
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedTrip.itinerary.map((day, index) => (
                    <ItineraryCard
                      key={day._id || day.dayNumber || index}
                      day={day}
                    />
                  ))}
                </div>
              )}

            </div>

            <PackingList
              items={selectedTrip.packingList}
              onToggle={togglePackingItem}
            />

          </>
        ) : (
          <div className="bg-slate-900 rounded-xl p-12 text-center border border-slate-800">
            <h2 className="text-2xl mb-3">
              ✈️
            </h2>

            <p className="text-slate-400">
              Create your first AI Trip Planner.
            </p>
          </div>
        )}

      </div>

    </div>
  </div>
);
}


