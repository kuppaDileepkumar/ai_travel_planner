"use client";

interface PackingItem {
  _id?: string;
  item: string;
  category: string;
  isPacked: boolean;
}

interface PackingListProps {
  items: PackingItem[];
  onToggle: (id: string) => void;
}

export default function PackingList({
  items,
  onToggle,
}: PackingListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold">
          Weather Packing Assistant
        </h2>

        <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center">
          <p className="text-slate-400">
            No packing list available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-4 text-xl font-bold">
        Weather Packing Assistant
      </h2>

      <div className="space-y-3">
        {items.map((item, index) => (
          <label
            key={item._id ?? `${item.item}-${index}`}
            className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-800 p-3 transition hover:bg-slate-700"
          >
            <input
              type="checkbox"
              checked={item.isPacked}
              onChange={() => {
                if (item._id) {
                  onToggle(item._id);
                }
              }}
              className="h-4 w-4"
            />

            <span
              className={`flex-1 ${
                item.isPacked
                  ? "text-slate-500 line-through"
                  : "text-white"
              }`}
            >
              {item.item}
            </span>

            <span className="rounded bg-slate-700 px-2 py-1 text-xs">
              {item.category}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}