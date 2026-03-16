"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CATEGORIES } from "@/lib/events";

export default function EventsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const showPast = searchParams.get("showPast") === "true";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/events?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-3">
      {/* Text search */}
      <input
        type="search"
        placeholder="Search events…"
        value={search}
        onChange={(e) => updateParam("search", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black min-w-[180px] flex-1"
      />

      {/* Category filter */}
      <select
        value={category}
        onChange={(e) => updateParam("category", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Location filter */}
      <input
        type="text"
        placeholder="Location…"
        value={location}
        onChange={(e) => updateParam("location", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black min-w-[140px]"
      />

      {/* Show past events toggle */}
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={showPast}
          onChange={(e) =>
            updateParam("showPast", e.target.checked ? "true" : "")
          }
          className="rounded border-gray-300"
        />
        Show past events
      </label>
    </div>
  );
}
