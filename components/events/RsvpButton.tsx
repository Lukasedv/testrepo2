"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RsvpButtonProps {
  slug: string;
  isAttending: boolean;
  attendeeCount: number;
  isFull: boolean;
  isCancelled: boolean;
  isAuthenticated: boolean;
}

export default function RsvpButton({
  slug,
  isAttending: initialIsAttending,
  attendeeCount: initialCount,
  isFull,
  isCancelled,
  isAuthenticated,
}: RsvpButtonProps) {
  const [isAttending, setIsAttending] = useState(initialIsAttending);
  const [attendeeCount, setAttendeeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${slug}`);
      return;
    }

    setLoading(true);
    setError(null);

    const method = isAttending ? "DELETE" : "POST";
    const res = await fetch(`/api/events/${slug}/rsvp`, { method });

    if (res.ok) {
      const data = await res.json();
      setIsAttending(!isAttending);
      setAttendeeCount(data.attendeeCount);
    } else {
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error ?? "Something went wrong");
    }

    setLoading(false);
  }

  if (isCancelled) {
    return (
      <button
        disabled
        className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
      >
        Event Cancelled
      </button>
    );
  }

  if (isFull && !isAttending) {
    return (
      <button
        disabled
        className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
      >
        Event Full
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
          isAttending
            ? "bg-green-100 text-green-800 hover:bg-red-50 hover:text-red-700 border border-green-200 hover:border-red-200"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {loading
          ? "Updating…"
          : isAttending
          ? "✓ Going – Click to cancel"
          : "Attend"}
      </button>
      <p className="text-center text-sm text-gray-500">
        {attendeeCount} {attendeeCount === 1 ? "person" : "people"} attending
      </p>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}
