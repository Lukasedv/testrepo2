import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/shop/data";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;

  // In production, require admin authentication here
  const orders = getOrders(status ? { status } : undefined);
  return NextResponse.json({ orders, total: orders.length });
}
