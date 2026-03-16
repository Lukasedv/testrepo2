import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug, getRsvpsForEvent } from "@/lib/events";

type RouteContext = { params: Promise<{ slug: string }> };

/**
 * GET /api/events/:slug/attendees
 * Returns the attendee list for an event.
 * - Public events: visible to everyone.
 * - Private events: visible only to the organizer.
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  const event = getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const sessionToken = request.cookies.get("session_token")?.value;
  const userId = sessionToken ? `user-${sessionToken.slice(0, 8)}` : null;

  if (event.visibility === "private" && event.organizerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rsvps = getRsvpsForEvent(event.id);

  // Return up to 50 attendees with "View all" indicator
  const PAGE_SIZE = 50;
  const attendees = rsvps.slice(0, PAGE_SIZE).map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: r.userName,
    rsvpdAt: r.createdAt,
  }));

  return NextResponse.json({
    attendees,
    total: rsvps.length,
    hasMore: rsvps.length > PAGE_SIZE,
  });
}
