import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/shop/data";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export const metadata: Metadata = { title: "Order Confirmation" };

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = getOrderById(orderId);

  if (!order) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-500">
          Thank you for your purchase. We&apos;ve sent a confirmation to{" "}
          <strong>{order.email}</strong>.
        </p>
      </div>

      {/* Order details card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Order ID</p>
            <p className="font-mono font-semibold text-gray-900">{order.id}</p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              order.status === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Items */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Items Ordered</h2>
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.productName}{" "}
                  <span className="text-gray-400">×{item.quantity}</span>
                </span>
                <span className="font-medium text-gray-900">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-b border-gray-100">
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd>${order.subtotal.toFixed(2)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <dt>Discount</dt>
                <dd>−${order.discount.toFixed(2)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Tax</dt>
              <dd>${order.tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
              <dt>Total</dt>
              <dd>${order.total.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        {/* Shipping address */}
        <div className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Shipping Address
          </h2>
          <address className="text-sm text-gray-600 not-italic space-y-0.5">
            <p>{order.shippingAddress.name}</p>
            <p>
              {order.shippingAddress.line1}
              {order.shippingAddress.line2
                ? `, ${order.shippingAddress.line2}`
                : ""}
            </p>
            <p>
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </address>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          href="/shop"
          className="flex-1 text-center border border-gray-300 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="flex-1 text-center bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-colors"
        >
          View All Orders
        </Link>
      </div>
    </main>
  );
}
