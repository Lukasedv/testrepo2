import { NextRequest, NextResponse } from "next/server";
import { validateDiscountCode } from "@/lib/shop/data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, error: "Discount code is required." },
        { status: 400 }
      );
    }

    const result = validateDiscountCode(code.trim());
    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: 200 }
      );
    }

    return NextResponse.json({ valid: true, discount: result.discount });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
