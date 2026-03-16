import { NextRequest, NextResponse } from "next/server";
import { getEventBySlug, addRsvp, removeRsvp, getRsvpCount } from "@/lib/events";

type RouteContext = { params: Promise<{ slug: string }> };

/**
 * POST /api/events/:slug/rsvp
 * RSVP to an event (auth required).
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  const sessionToken = request.cookies.get("session_token")?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.status === "cancelled") {
    return NextResponse.json(
      { error: "Cannot RSVP to a cancelled event" },
      { status: 422 }
    );
  }

  const userId = `user-${sessionToken.slice(0, 8)}`;
  const userName = "Jane Doe"; // Demo: in prod decoded from token

  const rsvp = addRsvp(event.id, userId, userName);

  if (!rsvp) {
    // Could be duplicate or full
    const count = getRsvpCount(event.id);
    if (event.maxAttendees !== undefined && count >= event.maxAttendees) {
      return NextResponse.json({ error: "Event is full" }, { status: 422 });
    }
    return NextResponse.json(
      { error: "Already attending this event" },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { rsvp, attendeeCount: getRsvpCount(event.id) },
    { status: 201 }
  );
}

/**
 * DELETE /api/events/:slug/rsvp
 * Cancel RSVP (auth required).
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  const sessionToken = request.cookies.get("session_token")?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const userId = `user-${sessionToken.slice(0, 8)}`;
  const removed = removeRsvp(event.id, userId);

  if (!removed) {
    return NextResponse.json(
      { error: "No RSVP found for this event" },
      { status: 404 }
    );
  }

  return NextResponse.json({ attendeeCount: getRsvpCount(event.id) });
}
