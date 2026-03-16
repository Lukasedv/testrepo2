import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getEventsByOrganizer, getRsvpsForEvent, getRsvpCount } from "@/lib/events";

export const metadata: Metadata = {
  title: "My Events",
  description: "Manage your events and view RSVPs.",
};

export const dynamic = "force-dynamic";

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrganizerDashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const userId = sessionToken ? `user-${sessionToken.slice(0, 8)}` : "user-demo";

  const events = getEventsByOrganizer(userId);

  // Sort: upcoming first, then past
  const now = new Date().toISOString();
  const upcoming = events
    .filter((e) => e.startAt >= now && e.status !== "cancelled")
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
  const past = events
    .filter((e) => e.startAt < now)
    .sort((a, b) => b.startAt.localeCompare(a.startAt));
  const cancelled = events.filter((e) => e.status === "cancelled");

  const allGroups = [
    { label: "Upcoming", items: upcoming },
    { label: "Past", items: past },
    { label: "Cancelled", items: cancelled },
  ].filter((g) => g.items.length > 0);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="mt-1 text-gray-500">Manage your events and RSVPs.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors self-center"
            >
              ← Dashboard
            </Link>
            <Link
              href="/events/new"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              + Create Event
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl">🎉</p>
            <p className="mt-4 text-lg font-medium text-gray-700">
              No events yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              <Link href="/events/new" className="text-blue-600 hover:underline">
                Create your first event
              </Link>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {allGroups.map((group) => (
              <section key={group.label}>
                <h2 className="mb-4 text-lg font-semibold text-gray-700">
                  {group.label}
                </h2>
                <div className="space-y-4">
                  {group.items.map((event) => {
                    const rsvps = getRsvpsForEvent(event.id);
                    const count = getRsvpCount(event.id);

                    return (
                      <div
                        key={event.id}
                        className="rounded-xl border border-gray-200 p-6"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-semibold">
                                <Link
                                  href={`/events/${event.slug}`}
                                  className="hover:underline"
                                >
                                  {event.title}
                                </Link>
                              </h3>
                              {event.status === "cancelled" && (
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                  Cancelled
                                </span>
                              )}
                              {event.visibility === "private" && (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                  Private
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              🗓 {formatDate(event.startAt)}
                              {event.location && ` · 📍 ${event.location}`}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-gray-800">
                              {count}
                            </span>
                            <span className="text-sm text-gray-400">
                              {event.maxAttendees
                                ? `/ ${event.maxAttendees} RSVPs`
                                : "RSVPs"}
                            </span>
                          </div>
                        </div>

                        {/* RSVP list */}
                        {rsvps.length > 0 && (
                          <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                                  <th className="pb-2 font-medium">Name</th>
                                  <th className="pb-2 font-medium">RSVP Date</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {rsvps.map((rsvp) => (
                                  <tr key={rsvp.id}>
                                    <td className="py-2 font-medium">
                                      {rsvp.userName}
                                    </td>
                                    <td className="py-2 text-gray-500">
                                      {formatDate(rsvp.createdAt)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Actions */}
                        {event.status !== "cancelled" && (
                          <div className="mt-4 flex gap-2">
                            <Link
                              href={`/events/${event.slug}/edit`}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/events/${event.slug}`}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
