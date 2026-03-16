import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  getEventBySlug,
  getRsvpCount,
  getUserRsvp,
  getRsvpsForEvent,
} from "@/lib/events";
import RsvpButton from "@/components/events/RsvpButton";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.description.split("\n")[0].slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.split("\n")[0].slice(0, 160),
      images: event.coverImage ? [{ url: event.coverImage }] : [],
      type: "website",
    },
  };
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function renderDescription(text: string) {
  return text.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-6 text-xl font-semibold">
          {block.slice(3)}
        </h2>
      );
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="mt-4 list-disc pl-5 space-y-1">
          {items.map((item, j) => (
            <li key={j} className="text-gray-700 leading-relaxed">
              {item.slice(2)}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mt-4 text-gray-700 leading-relaxed">
        {block}
      </p>
    );
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const userId = sessionToken ? `user-${sessionToken.slice(0, 8)}` : null;

  const event = getEventBySlug(slug);

  if (!event) notFound();

  // Private event: only organizer can view
  if (event.visibility === "private" && event.organizerId !== userId) {
    notFound();
  }

  const attendeeCount = getRsvpCount(event.id);
  const userRsvp = userId ? getUserRsvp(event.id, userId) : undefined;
  const rsvps = getRsvpsForEvent(event.id);
  const isOrganizer = userId === event.organizerId;
  const isFull =
    event.maxAttendees !== undefined && attendeeCount >= event.maxAttendees;

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/events"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to Events
        </Link>

        {/* Cancelled banner */}
        {event.status === "cancelled" && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            ⚠️ This event has been cancelled.
          </div>
        )}

        {/* Cover image */}
        <div className="mt-6 h-56 sm:h-72 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          {event.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">📅</span>
          )}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {event.category && (
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {event.category}
              </span>
            )}
            <h1 className="mt-3 text-3xl font-bold">{event.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Organized by{" "}
              <span className="font-medium text-gray-700">
                {event.organizerName}
              </span>
            </p>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <div className="flex gap-2">
                <span>🗓</span>
                <span>{formatDate(event.startAt)}</span>
              </div>
              {event.endAt && (
                <div className="flex gap-2">
                  <span>🏁</span>
                  <span>Ends {formatDate(event.endAt)}</span>
                </div>
              )}
              {event.location && (
                <div className="flex gap-2">
                  <span>📍</span>
                  <span>{event.location}</span>
                </div>
              )}
              {event.virtualUrl && (
                <div className="flex gap-2">
                  <span>🌐</span>
                  <a
                    href={event.virtualUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Join online
                  </a>
                </div>
              )}
            </div>

            {event.description && (
              <div className="mt-8 prose prose-gray max-w-none">
                {renderDescription(event.description)}
              </div>
            )}

            {/* Attendee list (public events) */}
            {rsvps.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">Attendees</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {rsvps.slice(0, 50).map((r) => (
                    <span
                      key={r.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm"
                    >
                      <span className="inline-block h-5 w-5 rounded-full bg-gray-300 text-center text-xs leading-5">
                        {r.userName.charAt(0)}
                      </span>
                      {r.userName}
                    </span>
                  ))}
                  {rsvps.length > 50 && (
                    <span className="text-sm text-gray-500 self-center">
                      and {rsvps.length - 50} more…
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* RSVP card */}
            <div className="rounded-xl border border-gray-200 p-5 space-y-4">
              <div className="text-center">
                <span className="text-2xl font-bold">{attendeeCount}</span>
                {event.maxAttendees && (
                  <span className="text-gray-400"> / {event.maxAttendees}</span>
                )}
                <p className="text-sm text-gray-500">attending</p>
              </div>

              <RsvpButton
                slug={event.slug}
                isAttending={!!userRsvp}
                attendeeCount={attendeeCount}
                isFull={isFull}
                isCancelled={event.status === "cancelled"}
                isAuthenticated={!!userId}
              />

              {!userId && (
                <p className="text-center text-xs text-gray-400">
                  <Link href={`/login?redirect=/events/${slug}`} className="text-blue-600 hover:underline">
                    Log in
                  </Link>{" "}
                  to RSVP
                </p>
              )}
            </div>

            {/* Organizer actions */}
            {isOrganizer && (
              <div className="rounded-xl border border-gray-200 p-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Organizer
                </p>
                <Link
                  href={`/events/${event.slug}/edit`}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit Event
                </Link>
                <Link
                  href="/dashboard/events"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  My Events Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
