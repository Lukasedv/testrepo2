import type { Metadata } from "next";
import Link from "next/link";
import { getOrders } from "@/lib/shop/data";

export const metadata: Metadata = { title: "My Orders" };

// In production this would filter by the authenticated user
export const dynamic = "force-dynamic";

export default function AccountOrdersPage() {
  // Demo: show all orders (in production, filter by session user)
  const orders = getOrders();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl font-semibold text-gray-400 mb-2">
            No orders yet
          </p>
          <p className="text-gray-500 mb-6">
            Once you place an order, it will appear here.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-indigo-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-indigo-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Order ID
                  </p>
                  <p className="font-mono font-semibold text-gray-900">{order.id}</p>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Date</p>
                    <p className="font-medium text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Total</p>
                    <p className="font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/orders/${order.id}/confirmation`}
                  className="text-sm font-medium text-indigo-600 hover:underline whitespace-nowrap"
                >
                  View details →
                </Link>
              </div>

              {/* Items preview */}
              <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
                <p className="text-xs text-gray-500">
                  {order.items
                    .map((i) => `${i.productName} ×${i.quantity}`)
                    .join(" · ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function statusColors(status: string): string {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "fulfilled":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "refunded":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
