import type { Metadata } from "next";
import Link from "next/link";
import CreateEventForm from "@/components/events/CreateEventForm";

export const metadata: Metadata = {
  title: "Create Event",
  description: "Create a new event and share it with others.",
};

export default function CreateEventPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href="/events"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back to Events
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Create Event</h1>
          <p className="mt-2 text-gray-500">
            Fill in the details below to create and publish your event.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-8">
          <CreateEventForm />
        </div>
      </div>
    </main>
  );
}
