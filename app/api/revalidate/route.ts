import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * On-demand revalidation endpoint.
 * Protected by a secret token supplied via the REVALIDATE_SECRET environment variable.
 *
 * Usage:
 *   POST /api/revalidate
 *   Headers: { "x-revalidate-secret": "<REVALIDATE_SECRET>" }
 *   Body: { "path": "/blog", "tag": "posts" }   (either path or tag)
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { path?: string; tag?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { path, tag } = body;

  if (!path && !tag) {
    return NextResponse.json(
      { error: "Provide either 'path' or 'tag' in the request body." },
      { status: 400 }
    );
  }

  if (path) {
    revalidatePath(path);
  }
  if (tag) {
    revalidateTag(tag);
  }

  return NextResponse.json({
    revalidated: true,
    path: path ?? null,
    tag: tag ?? null,
    timestamp: new Date().toISOString(),
  });
}
