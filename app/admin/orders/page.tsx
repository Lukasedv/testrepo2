import type { Metadata } from "next";
import Link from "next/link";
import { getOrders } from "@/lib/shop/data";
import AdminOrderActions from "./AdminOrderActions";

export const metadata: Metadata = { title: "Admin — Orders" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

const STATUSES = ["all", "pending", "paid", "fulfilled", "cancelled", "refunded"] as const;

function statusColors(status: string): string {
  switch (status) {
    case "paid": return "bg-green-100 text-green-700";
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "fulfilled": return "bg-blue-100 text-blue-700";
    case "cancelled": return "bg-red-100 text-red-700";
    case "refunded": return "bg-gray-100 text-gray-600";
    default: return "bg-gray-100 text-gray-600";
  }
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status && params.status !== "all" ? params.status : undefined;
  const orders = getOrders(statusFilter ? { status: statusFilter } : undefined);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
            {statusFilter ? ` with status: ${statusFilter}` : ""}
          </p>
        </div>
        <Link href="/admin/products" className="text-sm text-indigo-600 hover:underline">
          ← Products
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map((s) => {
          const active = (statusFilter ?? "all") === s;
          return (
            <Link
              key={s}
              href={s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {["Order ID", "Customer", "Date", "Total", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{order.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/orders/${order.id}/confirmation`}
                        className="text-indigo-600 hover:underline"
                      >
                        View
                      </Link>
                      <AdminOrderActions orderId={order.id} currentStatus={order.status} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
