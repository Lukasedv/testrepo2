import { NextRequest, NextResponse } from "next/server";
import {
  getPublicEvents,
  createEvent,
  type Event,
} from "@/lib/events";

/**
 * GET /api/events
 * Returns all public upcoming events.
 * Supports query params: category, location, search, showPast
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const search = searchParams.get("search") ?? "";
  const showPast = searchParams.get("showPast") === "true";

  const now = new Date().toISOString();

  let events: Event[] = getPublicEvents();

  if (!showPast) {
    events = events.filter((e) => e.startAt >= now);
  }

  if (category) {
    events = events.filter(
      (e) => e.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (location) {
    events = events.filter((e) =>
      e.location?.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }

  // Sort by start date ascending
  events.sort((a, b) => a.startAt.localeCompare(b.startAt));

  return NextResponse.json({ events });
}

/**
 * POST /api/events
 * Creates a new event. Requires session_token cookie (demo auth).
 */
export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get("session_token")?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length < 3 || title.length > 200) {
    return NextResponse.json(
      { error: "Title must be between 3 and 200 characters" },
      { status: 422 }
    );
  }

  const startAt = typeof body.startAt === "string" ? body.startAt : "";
  if (!startAt) {
    return NextResponse.json(
      { error: "startAt is required" },
      { status: 422 }
    );
  }
  if (new Date(startAt) < new Date()) {
    return NextResponse.json(
      { error: "Start date must be in the future" },
      { status: 422 }
    );
  }

  const endAt = typeof body.endAt === "string" ? body.endAt : undefined;
  if (endAt && new Date(endAt) <= new Date(startAt)) {
    return NextResponse.json(
      { error: "End date must be after start date" },
      { status: 422 }
    );
  }

  const visibility =
    body.visibility === "private" ? "private" : ("public" as const);

  const maxAttendees =
    typeof body.maxAttendees === "number" && body.maxAttendees > 0
      ? body.maxAttendees
      : undefined;

  // Demo: derive userId/userName from session token (in prod: verify JWT)
  const organizerId = `user-${sessionToken.slice(0, 8)}`;
  const organizerName = "Jane Doe"; // In prod: decoded from token

  const event = createEvent({
    title,
    description: typeof body.description === "string" ? body.description : "",
    startAt,
    endAt,
    location: typeof body.location === "string" ? body.location : undefined,
    virtualUrl:
      typeof body.virtualUrl === "string" ? body.virtualUrl : undefined,
    category: typeof body.category === "string" ? body.category : undefined,
    visibility,
    maxAttendees,
    organizerId,
    organizerName,
  });

  return NextResponse.json({ event }, { status: 201 });
}
