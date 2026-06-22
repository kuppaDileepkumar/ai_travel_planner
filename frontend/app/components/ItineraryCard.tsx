"use client";

interface Activity {
  title: string;
  description: string;
  estimatedCostUSD: number;
  timeOfDay: string;
}

interface Day {
  dayNumber: number;
  activities: Activity[];
}

interface Props {
  day: Day;
}

export default function ItineraryCard({ day }: Props) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-xl font-bold mb-4">
        Day {day.dayNumber}
      </h2>

      <div className="space-y-4">
        {day.activities.map((activity, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-lg p-4"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">
                {activity.title}
              </h3>

              <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                {activity.timeOfDay}
              </span>
            </div>

            <p className="text-gray-400 mt-2">
              {activity.description}
            </p>

            <p className="text-green-400 mt-2">
              ${activity.estimatedCostUSD}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}