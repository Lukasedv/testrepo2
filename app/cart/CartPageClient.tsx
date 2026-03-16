"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/shop/cart-context";

export default function CartPage() {
  const { items, summary, updateQuantity, removeItem, setDiscount, discountCode } =
    useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/shop/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.error ?? "Invalid discount code.");
        setDiscount(null);
      } else {
        setDiscount(data.discount);
        setCouponError("");
      }
    } catch {
      setCouponError("Failed to validate code. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setDiscount(null);
    setCouponInput("");
    setCouponError("");
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <svg
            className="mx-auto h-20 w-20 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-xl font-semibold text-gray-400 mb-2">Your cart is empty</p>
          <p className="text-gray-500 mb-6">Add some products to get started.</p>
          <Link
            href="/shop"
            className="inline-block bg-indigo-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                {/* Thumbnail */}
                <Link
                  href={`/shop/products/${product.id}`}
                  className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100"
                >
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/products/${product.id}`}
                    className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2 block"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">
                    ${product.price.toFixed(2)} each
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={product.stock}
                        value={quantity}
                        onChange={(e) =>
                          updateQuantity(
                            product.id,
                            Math.min(product.stock, Math.max(1, Number(e.target.value)))
                          )
                        }
                        className="w-12 text-center text-sm py-1 border-x border-gray-300 focus:outline-none"
                        aria-label={`Quantity for ${product.name}`}
                      />
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                        disabled={quantity >= product.stock}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="text-right flex-shrink-0 flex flex-col justify-between">
                  <span className="font-bold text-gray-900">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">
                    ${summary.subtotal.toFixed(2)}
                  </dd>
                </div>

                {summary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <dt>
                      Discount
                      {discountCode && (
                        <span className="ml-1 text-xs bg-green-100 px-1.5 py-0.5 rounded font-mono">
                          {discountCode.code}
                        </span>
                      )}
                    </dt>
                    <dd>−${summary.discount.toFixed(2)}</dd>
                  </div>
                )}

                <div className="flex justify-between">
                  <dt className="text-gray-600">Estimated tax (10%)</dt>
                  <dd className="font-medium text-gray-900">
                    ${summary.tax.toFixed(2)}
                  </dd>
                </div>

                <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold">
                  <dt>Total</dt>
                  <dd>${summary.total.toFixed(2)}</dd>
                </div>
              </dl>

              {/* Discount code */}
              <div className="mt-5">
                <p className="text-sm font-medium text-gray-700 mb-2">Discount Code</p>
                {discountCode ? (
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-sm font-mono bg-green-50 border border-green-200 rounded px-3 py-1.5 text-green-700">
                      {discountCode.code}
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                      aria-label="Remove discount code"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Enter code"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Discount code"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="bg-gray-900 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? "…" : "Apply"}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-red-500 mt-1" role="alert">
                    {couponError}
                  </p>
                )}
              </div>

              <Link
                href="/checkout"
                className={`block w-full text-center mt-6 py-3 rounded-xl font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  items.length > 0
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-300 pointer-events-none"
                }`}
                aria-disabled={items.length === 0}
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="block text-center text-sm text-indigo-600 hover:underline mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
