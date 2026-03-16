import { NextRequest, NextResponse } from "next/server";
import { createOrder, getProductById } from "@/lib/shop/data";
import type { OrderItem, ShippingAddress } from "@/lib/shop/types";

export const dynamic = "force-dynamic";

interface CheckoutItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

interface CheckoutBody {
  items: CheckoutItem[];
  address: ShippingAddress;
  summary: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json();
    const { items, address, summary } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }
    if (!address?.email || !address?.name || !address?.line1 || !address?.city) {
      return NextResponse.json(
        { error: "Shipping address is incomplete." },
        { status: 400 }
      );
    }

    // Server-side: re-verify stock and pricing
    const verifiedItems: OrderItem[] = [];
    for (const item of items) {
      const product = getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.productName}" is no longer available.` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${product.name}". Only ${product.stock} left.`,
          },
          { status: 400 }
        );
      }
      verifiedItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        orderId: "",
        productId: product.id,
        productName: product.name,
        unitPrice: product.price, // always use server-side price
        quantity: item.quantity,
      });
    }

    // Re-compute totals server-side (ignoring client-supplied summary for security)
    const subtotal = verifiedItems.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );
    const discount = Math.min(summary?.discount ?? 0, subtotal);
    const afterDiscount = subtotal - discount;
    const tax = Math.round(afterDiscount * 0.1 * 100) / 100;
    const total = Math.round((afterDiscount + tax) * 100) / 100;

    // Create order (in production, also process payment via Stripe here)
    const order = createOrder({
      email: address.email,
      status: "paid", // simulated successful payment
      subtotal: Math.round(subtotal * 100) / 100,
      discount,
      tax,
      total,
      shippingAddress: address,
      items: verifiedItems,
    });

    // Update item orderId references
    order.items = order.items.map((i) => ({ ...i, orderId: order.id }));

    return NextResponse.json({ orderId: order.id, order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
