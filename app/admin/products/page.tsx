import type { Metadata } from "next";
import Link from "next/link";
import { getAllProductsAdmin, categories } from "@/lib/shop/data";

export const metadata: Metadata = { title: "Admin — Products" };
export const dynamic = "force-dynamic";

function getCategoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? "—";
}

export default function AdminProductsPage() {
  const products = getAllProductsAdmin();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          + New Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Category", "Price", "Stock", "Status", "Created", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-[240px] truncate">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {getCategoryName(product.categoryId)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={
                        product.stock === 0
                          ? "text-red-600 font-medium"
                          : product.stock < 10
                          ? "text-yellow-600 font-medium"
                          : "text-gray-700"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        product.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-indigo-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/shop/products/${product.id}`}
                        target="_blank"
                        className="text-gray-500 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Admin nav */}
      <div className="mt-6 flex gap-4 text-sm">
        <Link href="/admin/orders" className="text-indigo-600 hover:underline">
          → Manage Orders
        </Link>
        <Link href="/shop" className="text-gray-500 hover:underline">
          → View Storefront
        </Link>
      </div>
    </main>
  );
}
