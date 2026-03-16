import { NextRequest, NextResponse } from "next/server";
import {
  getEventBySlug,
  updateEvent,
  deleteEvent,
  getRsvpCount,
  getUserRsvp,
} from "@/lib/events";

type RouteContext = { params: Promise<{ slug: string }> };

/**
 * GET /api/events/:slug
 * Returns a single event. Private events are returned only when the
 * requesting user is the organizer (demo: checked via session cookie).
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
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const attendeeCount = getRsvpCount(event.id);
  const userRsvp = userId ? getUserRsvp(event.id, userId) : undefined;

  return NextResponse.json({
    event,
    attendeeCount,
    isAttending: !!userRsvp,
  });
}

/**
 * PATCH /api/events/:slug
 * Updates an event. Only the organizer or admin may update.
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
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
  if (event.organizerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate title if provided
  if (body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (title.length < 3 || title.length > 200) {
      return NextResponse.json(
        { error: "Title must be between 3 and 200 characters" },
        { status: 422 }
      );
    }
  }

  // Validate dates if provided
  const startAt =
    typeof body.startAt === "string" ? body.startAt : event.startAt;
  const endAt =
    body.endAt !== undefined
      ? typeof body.endAt === "string"
        ? body.endAt
        : undefined
      : event.endAt;

  if (endAt && new Date(endAt) <= new Date(startAt)) {
    return NextResponse.json(
      { error: "End date must be after start date" },
      { status: 422 }
    );
  }

  const updated = updateEvent(slug, {
    title: typeof body.title === "string" ? body.title.trim() : undefined,
    description:
      typeof body.description === "string" ? body.description : undefined,
    startAt: typeof body.startAt === "string" ? body.startAt : undefined,
    endAt: body.endAt !== undefined ? endAt : undefined,
    location: typeof body.location === "string" ? body.location : undefined,
    virtualUrl:
      typeof body.virtualUrl === "string" ? body.virtualUrl : undefined,
    category: typeof body.category === "string" ? body.category : undefined,
    visibility:
      body.visibility === "private" || body.visibility === "public"
        ? body.visibility
        : undefined,
    status:
      body.status === "cancelled" || body.status === "active"
        ? body.status
        : undefined,
    maxAttendees:
      typeof body.maxAttendees === "number" ? body.maxAttendees : undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ event: updated });
}

/**
 * DELETE /api/events/:slug
 * Permanently deletes an event. Only the organizer may delete.
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
  if (event.organizerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  deleteEvent(slug);
  return new NextResponse(null, { status: 204 });
}
