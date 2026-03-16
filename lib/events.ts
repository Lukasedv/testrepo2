/**
 * In-memory event store.
 *
 * In a production app this would be backed by a database (see the SQL schema
 * in the PRD). For this demo we use module-level state so the store persists
 * for the lifetime of the Node.js process.
 */

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;
  startAt: string; // ISO 8601 UTC
  endAt?: string; // ISO 8601 UTC
  location?: string;
  virtualUrl?: string;
  coverImage?: string;
  category?: string;
  visibility: "public" | "private";
  status: "active" | "cancelled";
  maxAttendees?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventRsvp {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  location?: string;
  virtualUrl?: string;
  coverImage?: string;
  category?: string;
  visibility?: "public" | "private";
  maxAttendees?: number;
  organizerId: string;
  organizerName: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  location?: string;
  virtualUrl?: string;
  coverImage?: string;
  category?: string;
  visibility?: "public" | "private";
  status?: "active" | "cancelled";
  maxAttendees?: number;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const EVENTS: Event[] = [
  {
    id: "evt-001",
    slug: "nextjs-conf-2026-a1b2",
    title: "Next.js Conf 2026",
    description:
      "The annual conference for the Next.js community. Join us for talks, workshops, and networking with developers from around the world.\n\n## What to Expect\n\nDeep-dive sessions on the App Router, Server Components, and the latest Next.js features.\n\n## Who Should Attend\n\nFull-stack developers, frontend engineers, and anyone building with React.",
    organizerId: "user-demo",
    organizerName: "Jane Doe",
    startAt: "2026-06-15T09:00:00.000Z",
    endAt: "2026-06-15T18:00:00.000Z",
    location: "San Francisco, CA",
    category: "Technology",
    visibility: "public",
    status: "active",
    maxAttendees: 500,
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "evt-002",
    slug: "react-workshop-beginners-c3d4",
    title: "React Workshop for Beginners",
    description:
      "A hands-on workshop designed for developers just getting started with React. Bring your laptop!\n\n## Topics Covered\n\n- JSX and components\n- State and props\n- Hooks (useState, useEffect)\n- Fetching data",
    organizerId: "user-demo",
    organizerName: "Jane Doe",
    startAt: "2026-04-20T14:00:00.000Z",
    endAt: "2026-04-20T17:00:00.000Z",
    location: "Online",
    virtualUrl: "https://meet.example.com/react-workshop",
    category: "Workshop",
    visibility: "public",
    status: "active",
    maxAttendees: 50,
    createdAt: "2026-03-05T08:00:00.000Z",
    updatedAt: "2026-03-05T08:00:00.000Z",
  },
  {
    id: "evt-003",
    slug: "open-source-hackathon-e5f6",
    title: "Open Source Hackathon",
    description:
      "48 hours of open-source contribution, mentorship, and fun. Teams of 2–5 people. All skill levels welcome.\n\n## Prizes\n\nTop three teams win swag bags and conference tickets.",
    organizerId: "user-other",
    organizerName: "John Smith",
    startAt: "2026-05-10T08:00:00.000Z",
    endAt: "2026-05-12T08:00:00.000Z",
    location: "New York, NY",
    category: "Hackathon",
    visibility: "public",
    status: "active",
    createdAt: "2026-03-10T12:00:00.000Z",
    updatedAt: "2026-03-10T12:00:00.000Z",
  },
  {
    id: "evt-004",
    slug: "typescript-deep-dive-g7h8",
    title: "TypeScript Deep Dive",
    description:
      "Advanced TypeScript patterns for real-world applications. We'll cover generics, conditional types, mapped types, and more.\n\n## Prerequisites\n\nBasic TypeScript knowledge required.",
    organizerId: "user-demo",
    organizerName: "Jane Doe",
    startAt: "2026-07-05T10:00:00.000Z",
    endAt: "2026-07-05T13:00:00.000Z",
    location: "Online",
    virtualUrl: "https://meet.example.com/ts-deep-dive",
    category: "Workshop",
    visibility: "public",
    status: "active",
    maxAttendees: 100,
    createdAt: "2026-03-12T09:00:00.000Z",
    updatedAt: "2026-03-12T09:00:00.000Z",
  },
];

const RSVPS: EventRsvp[] = [
  {
    id: "rsvp-001",
    eventId: "evt-001",
    userId: "user-a",
    userName: "Alice",
    createdAt: "2026-03-02T10:00:00.000Z",
  },
  {
    id: "rsvp-002",
    eventId: "evt-001",
    userId: "user-b",
    userName: "Bob",
    createdAt: "2026-03-03T11:00:00.000Z",
  },
  {
    id: "rsvp-003",
    eventId: "evt-002",
    userId: "user-a",
    userName: "Alice",
    createdAt: "2026-03-06T09:00:00.000Z",
  },
  {
    id: "rsvp-004",
    eventId: "evt-003",
    userId: "user-demo",
    userName: "Jane Doe",
    createdAt: "2026-03-11T14:00:00.000Z",
  },
];

// ─── Slug generation ──────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

function generateId(prefix = "evt"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Event queries ────────────────────────────────────────────────────────────

export function getAllEvents(): Event[] {
  return EVENTS;
}

export function getPublicEvents(): Event[] {
  return EVENTS.filter((e) => e.visibility === "public");
}

export function getEventBySlug(slug: string): Event | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export function getEventById(id: string): Event | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function getEventsByOrganizer(organizerId: string): Event[] {
  return EVENTS.filter((e) => e.organizerId === organizerId);
}

// ─── Event mutations ──────────────────────────────────────────────────────────

export function createEvent(input: CreateEventInput): Event {
  const now = new Date().toISOString();
  const event: Event = {
    id: generateId("evt"),
    slug: generateSlug(input.title),
    title: input.title,
    description: input.description ?? "",
    organizerId: input.organizerId,
    organizerName: input.organizerName,
    startAt: input.startAt,
    endAt: input.endAt,
    location: input.location,
    virtualUrl: input.virtualUrl,
    coverImage: input.coverImage,
    category: input.category,
    visibility: input.visibility ?? "public",
    status: "active",
    maxAttendees: input.maxAttendees,
    createdAt: now,
    updatedAt: now,
  };
  EVENTS.push(event);
  return event;
}

export function updateEvent(
  slug: string,
  input: UpdateEventInput
): Event | null {
  const index = EVENTS.findIndex((e) => e.slug === slug);
  if (index === -1) return null;
  const updated: Event = {
    ...EVENTS[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  EVENTS[index] = updated;
  return updated;
}

export function deleteEvent(slug: string): boolean {
  const index = EVENTS.findIndex((e) => e.slug === slug);
  if (index === -1) return false;
  // Capture the event id before removing it from the array
  const eventId = EVENTS[index].id;
  EVENTS.splice(index, 1);
  // Remove associated RSVPs
  const rsvpIndices = RSVPS.reduce<number[]>((acc, r, i) => {
    if (r.eventId === eventId) acc.push(i);
    return acc;
  }, []);
  for (let i = rsvpIndices.length - 1; i >= 0; i--) {
    RSVPS.splice(rsvpIndices[i], 1);
  }
  return true;
}

// ─── RSVP queries ─────────────────────────────────────────────────────────────

export function getRsvpsForEvent(eventId: string): EventRsvp[] {
  return RSVPS.filter((r) => r.eventId === eventId);
}

export function getRsvpCount(eventId: string): number {
  return RSVPS.filter((r) => r.eventId === eventId).length;
}

export function getUserRsvp(
  eventId: string,
  userId: string
): EventRsvp | undefined {
  return RSVPS.find((r) => r.eventId === eventId && r.userId === userId);
}

export function getRsvpsByUser(userId: string): EventRsvp[] {
  return RSVPS.filter((r) => r.userId === userId);
}

// ─── RSVP mutations ───────────────────────────────────────────────────────────

export function addRsvp(
  eventId: string,
  userId: string,
  userName: string
): EventRsvp | null {
  // Prevent duplicates
  if (getUserRsvp(eventId, userId)) return null;

  const event = getEventById(eventId);
  if (!event) return null;

  // Check capacity
  if (event.maxAttendees !== undefined) {
    const count = getRsvpCount(eventId);
    if (count >= event.maxAttendees) return null;
  }

  const rsvp: EventRsvp = {
    id: generateId("rsvp"),
    eventId,
    userId,
    userName,
    createdAt: new Date().toISOString(),
  };
  RSVPS.push(rsvp);
  return rsvp;
}

export function removeRsvp(eventId: string, userId: string): boolean {
  const index = RSVPS.findIndex(
    (r) => r.eventId === eventId && r.userId === userId
  );
  if (index === -1) return false;
  RSVPS.splice(index, 1);
  return true;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
  "Technology",
  "Workshop",
  "Hackathon",
  "Networking",
  "Conference",
  "Meetup",
  "Other",
] as const;
