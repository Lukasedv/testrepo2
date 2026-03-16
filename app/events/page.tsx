import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPublicEvents, getRsvpCount } from "@/lib/events";
import EventCard from "@/components/events/EventCard";
import EventsFilter from "@/components/events/EventsFilter";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming events – discover what's happening near you.",
};

// Always server-side render so filters work with searchParams
export const dynamic = "force-dynamic";

interface SearchParams {
  search?: string;
  category?: string;
  location?: string;
  showPast?: string;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const category = params.category ?? "";
  const location = params.location ?? "";
  const showPast = params.showPast === "true";

  const now = new Date().toISOString();

  let events = getPublicEvents();

  if (!showPast) {
    events = events.filter((e) => e.startAt >= now);
  }

  if (category) {
    events = events.filter(
      (e) => e.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (location) {
    events = events.filter((e) =>
      e.location?.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }

  // Sort by start date ascending
  events.sort((a, b) => a.startAt.localeCompare(b.startAt));

  // Pagination (page size: 20)
  const PAGE_SIZE = 20;
  const displayedEvents = events.slice(0, PAGE_SIZE);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="mt-1 text-gray-500">
              Discover upcoming events and experiences.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors self-center"
            >
              ← Home
            </Link>
            <Link
              href="/events/new"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              + Create Event
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <EventsFilter />
          </Suspense>
        </div>

        {/* Event list */}
        {displayedEvents.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-4 text-lg font-medium text-gray-700">
              No events found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters or{" "}
              <Link href="/events/new" className="text-blue-600 hover:underline">
                create the first one
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <ul className="grid gap-6 sm:grid-cols-2">
              {displayedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  attendeeCount={getRsvpCount(event.id)}
                />
              ))}
            </ul>
            {events.length > PAGE_SIZE && (
              <p className="mt-6 text-center text-sm text-gray-500">
                Showing {PAGE_SIZE} of {events.length} events.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
