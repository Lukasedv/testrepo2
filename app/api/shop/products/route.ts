import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct, categories } from "@/lib/shop/data";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const categoryId = searchParams.get("category") ?? undefined;
  const sort = (searchParams.get("sort") ?? "newest") as
    | "price-asc"
    | "price-desc"
    | "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10))
  );

  const result = getProducts({ search, categoryId, sort, page, pageSize });

  return NextResponse.json({
    ...result,
    totalPages: Math.max(1, Math.ceil(result.total / pageSize)),
    categories,
  });
}

export async function POST(request: NextRequest) {
  // In production, verify admin session here
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId, images, status } = body;

    // Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number." },
        { status: 400 }
      );
    }
    if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
      return NextResponse.json(
        { error: "Stock must be a non-negative integer." },
        { status: 400 }
      );
    }

    const product = createProduct({
      name: name.trim(),
      description: (description ?? "").trim(),
      price,
      stock,
      categoryId: categoryId ?? "",
      images: Array.isArray(images) ? images : [],
      status: status === "archived" ? "archived" : "active",
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
