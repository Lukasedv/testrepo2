"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type Event } from "@/lib/events";

interface EditEventFormProps {
  event: Event;
}

function toDatetimeLocal(isoString?: string): string {
  if (!isoString) return "";
  // Convert ISO to datetime-local format (YYYY-MM-DDTHH:mm)
  return isoString.slice(0, 16);
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const body = {
      title: data.get("title") as string,
      description: data.get("description") as string,
      startAt: new Date(data.get("startAt") as string).toISOString(),
      endAt: data.get("endAt")
        ? new Date(data.get("endAt") as string).toISOString()
        : undefined,
      location: (data.get("location") as string) || undefined,
      virtualUrl: (data.get("virtualUrl") as string) || undefined,
      category: (data.get("category") as string) || undefined,
      visibility: data.get("visibility") as "public" | "private",
      maxAttendees: data.get("maxAttendees")
        ? Number(data.get("maxAttendees"))
        : undefined,
    };

    const res = await fetch(`/api/events/${event.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push(`/events/${event.slug}`);
      router.refresh();
    } else {
      const json = await res.json().catch(() => ({}));
      setError((json as { error?: string }).error ?? "Failed to update event");
      setSubmitting(false);
    }
  }

  async function handleCancel() {
    setCancelling(true);
    setError(null);

    const res = await fetch(`/api/events/${event.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });

    if (res.ok) {
      router.push(`/events/${event.slug}`);
      router.refresh();
    } else {
      const json = await res.json().catch(() => ({}));
      setError((json as { error?: string }).error ?? "Failed to cancel event");
      setCancelling(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    setError(null);

    const res = await fetch(`/api/events/${event.slug}`, {
      method: "DELETE",
    });

    if (res.ok || res.status === 204) {
      router.push("/events");
    } else {
      const json = await res.json().catch(() => ({}));
      setError((json as { error?: string }).error ?? "Failed to delete event");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={3}
            maxLength={200}
            defaultValue={event.title}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={event.description}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Start date */}
        <div>
          <label htmlFor="startAt" className="block text-sm font-medium text-gray-700">
            Start Date &amp; Time <span className="text-red-500">*</span>
          </label>
          <input
            id="startAt"
            name="startAt"
            type="datetime-local"
            required
            defaultValue={toDatetimeLocal(event.startAt)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* End date */}
        <div>
          <label htmlFor="endAt" className="block text-sm font-medium text-gray-700">
            End Date &amp; Time
          </label>
          <input
            id="endAt"
            name="endAt"
            type="datetime-local"
            defaultValue={toDatetimeLocal(event.endAt)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={event.location ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Virtual URL */}
        <div>
          <label htmlFor="virtualUrl" className="block text-sm font-medium text-gray-700">
            Virtual / Livestream Link
          </label>
          <input
            id="virtualUrl"
            name="virtualUrl"
            type="url"
            defaultValue={event.virtualUrl ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={event.category ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Visibility */}
        <div>
          <span className="block text-sm font-medium text-gray-700">Visibility</span>
          <div className="mt-2 flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="public"
                defaultChecked={event.visibility === "public"}
                className="border-gray-300"
              />
              Public
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="private"
                defaultChecked={event.visibility === "private"}
                className="border-gray-300"
              />
              Private
            </label>
          </div>
        </div>

        {/* Max attendees */}
        <div>
          <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">
            Max Attendees
          </label>
          <input
            id="maxAttendees"
            name="maxAttendees"
            type="number"
            min={1}
            defaultValue={event.maxAttendees ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Danger zone */}
      {event.status !== "cancelled" && (
        <div className="rounded-xl border border-red-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wide">
            Danger Zone
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {cancelling ? "Cancelling…" : "Cancel Event"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting
                ? "Deleting…"
                : confirmDelete
                ? "Confirm Delete – This is irreversible"
                : "Delete Event"}
            </button>
          </div>

          {confirmDelete && !deleting && (
            <p className="text-sm text-red-600">
              Click &quot;Confirm Delete&quot; again to permanently remove this event.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
