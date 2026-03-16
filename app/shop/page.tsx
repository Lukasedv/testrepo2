import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories, getProducts } from "@/lib/shop/data";
import AddToCartButton from "./AddToCartButton";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our full range of products.",
};

// Revalidate every 60 seconds so new products appear quickly
export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const categoryId = params.category ?? "";
  const sort =
    (params.sort as "price-asc" | "price-desc" | "newest") ?? "newest";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const pageSize = 20;

  const { products, total } = getProducts({
    search: search || undefined,
    categoryId: categoryId || undefined,
    sort,
    page,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const selectedCategory = categories.find((c) => c.id === categoryId);

  function buildQuery(overrides: Record<string, string | undefined>) {
    const merged: Record<string, string> = {};
    if (search) merged.search = search;
    if (categoryId) merged.category = categoryId;
    if (sort !== "newest") merged.sort = sort;
    if (page !== 1) merged.page = String(page);
    Object.entries(overrides).forEach(([k, v]) => {
      if (v == null || v === "") delete merged[k];
      else merged[k] = v;
    });
    const qs = new URLSearchParams(merged).toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shop</h1>

      {/* Filters bar */}
      <form
        method="GET"
        action="/shop"
        className="flex flex-wrap gap-3 mb-8 items-end"
      >
        {/* Search */}
        <div className="flex-1 min-w-[180px]">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <input
            id="search"
            name="search"
            type="search"
            defaultValue={search}
            placeholder="Search products…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={categoryId}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Apply
        </button>

        {(search || categoryId || sort !== "newest") && (
          <Link
            href="/shop"
            className="text-sm text-gray-500 underline self-center hover:text-indigo-600"
          >
            Clear filters
          </Link>
        )}
      </form>

      {/* Active filter labels */}
      {(search || selectedCategory) && (
        <p className="text-sm text-gray-500 mb-4">
          {total} result{total !== 1 ? "s" : ""}
          {search && (
            <>
              {" "}
              for <strong>&ldquo;{search}&rdquo;</strong>
            </>
          )}
          {selectedCategory && (
            <>
              {" "}
              in <strong>{selectedCategory.name}</strong>
            </>
          )}
        </p>
      )}

      {/* Empty state */}
      {products.length === 0 && (
        <div className="text-center py-24">
          <p className="text-2xl font-semibold text-gray-400 mb-2">
            No products found
          </p>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filters.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-indigo-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-indigo-700 transition-colors"
          >
            View all products
          </Link>
        </div>
      )}

      {/* Product grid */}
      {products.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <Link
                href={`/shop/products/${product.id}`}
                className="block relative aspect-square bg-gray-100"
              >
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {product.stock === 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    Out of stock
                  </span>
                )}
              </Link>

              <div className="p-4 flex flex-col flex-1">
                <Link href={`/shop/products/${product.id}`}>
                  <h2 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-indigo-600">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">
                  {product.description.slice(0, 100)}…
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <AddToCartButton product={product} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex justify-center gap-2 mt-10"
        >
          <Link
            href={buildQuery({ page: String(page - 1) })}
            aria-disabled={page <= 1}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              page <= 1
                ? "border-gray-200 text-gray-300 pointer-events-none"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildQuery({ page: String(p) })}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                p === page
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Link>
          ))}

          <Link
            href={buildQuery({ page: String(page + 1) })}
            aria-disabled={page >= totalPages}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              page >= totalPages
                ? "border-gray-200 text-gray-300 pointer-events-none"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </Link>
        </nav>
      )}
    </main>
  );
}
