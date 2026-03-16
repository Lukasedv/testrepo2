import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getEventBySlug } from "@/lib/events";
import EditEventForm from "@/components/events/EditEventForm";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  return { title: `Edit – ${event.title}` };
}

export default async function EditEventPage({ params }: PageProps) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const userId = sessionToken ? `user-${sessionToken.slice(0, 8)}` : null;

  const event = getEventBySlug(slug);
  if (!event) notFound();

  // Only the organizer may edit (middleware ensures session exists)
  if (event.organizerId !== userId) {
    // Return 403-like page
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Forbidden</h2>
        <p className="max-w-md text-gray-500">
          You do not have permission to edit this event.
        </p>
        <Link
          href={`/events/${slug}`}
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Back to Event
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href={`/events/${slug}`}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back to Event
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Edit Event</h1>
          <p className="mt-2 text-gray-500">
            Update your event details below.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-8">
          <EditEventForm event={event} />
        </div>
      </div>
    </main>
  );
}
