"use client";

import Link from "next/link";
import { useCart } from "@/lib/shop/cart-context";

export default function ShopNav() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-bold text-xl text-gray-900 hover:text-indigo-600 transition-colors"
          >
            My App
          </Link>
          <Link
            href="/shop"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Blog
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/account/orders"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block"
          >
            Orders
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            aria-label={`Shopping cart, ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white text-xs font-bold">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
