import Link from "next/link";
import type { Event } from "@/lib/events";

interface EventCardProps {
  event: Event;
  attendeeCount: number;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default function EventCard({ event, attendeeCount }: EventCardProps) {
  const isCancelled = event.status === "cancelled";

  return (
    <li className="rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 transition-colors">
      {/* Cover image placeholder */}
      <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        {event.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl">📅</span>
        )}
      </div>

      <div className="p-5">
        {isCancelled && (
          <span className="inline-block mb-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            Cancelled
          </span>
        )}
        {event.category && !isCancelled && (
          <span className="inline-block mb-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            {event.category}
          </span>
        )}

        <h2 className="text-lg font-semibold leading-snug">
          <Link href={`/events/${event.slug}`} className="hover:underline">
            {event.title}
          </Link>
        </h2>

        <p className="mt-1 text-sm text-gray-500">{formatDate(event.startAt)}</p>

        {event.location && (
          <p className="mt-1 text-sm text-gray-500">📍 {event.location}</p>
        )}
        {!event.location && event.virtualUrl && (
          <p className="mt-1 text-sm text-gray-500">🌐 Online</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            👥 {attendeeCount}
            {event.maxAttendees ? ` / ${event.maxAttendees}` : ""} attending
          </span>
          <Link
            href={`/events/${event.slug}`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View details →
          </Link>
        </div>
      </div>
    </li>
  );
}
