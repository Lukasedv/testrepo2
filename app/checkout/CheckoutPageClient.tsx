"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/shop/cart-context";
import type { ShippingAddress } from "@/lib/shop/types";

type CheckoutStep = "address" | "review" | "payment" | "done";

const INITIAL_ADDRESS: ShippingAddress = {
  name: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items, summary, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<ShippingAddress>(INITIAL_ADDRESS);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to cart if empty
  if (items.length === 0 && step !== "done") {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link
          href="/shop"
          className="inline-block bg-indigo-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  function validateAddress(): boolean {
    const e: Partial<ShippingAddress> = {};
    if (!address.name.trim()) e.name = "Name is required";
    if (!address.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email))
      e.email = "Valid email is required";
    if (!address.line1.trim()) e.line1 = "Address is required";
    if (!address.city.trim()) e.city = "City is required";
    if (!address.state.trim()) e.state = "State is required";
    if (!address.postalCode.trim()) e.postalCode = "Postal code is required";
    if (!address.country.trim()) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validateAddress()) setStep("review");
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setPaymentError("");

    // Client-side validation
    if (!cardNumber.replace(/\s/g, "") || cardNumber.replace(/\s/g, "").length < 13) {
      setPaymentError("Please enter a valid card number.");
      return;
    }
    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setPaymentError("Please enter a valid expiry date (MM/YY).");
      return;
    }
    if (!cardCvc || cardCvc.length < 3) {
      setPaymentError("Please enter a valid CVC.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.product.name,
            unitPrice: i.product.price,
            quantity: i.quantity,
          })),
          address,
          summary,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPaymentError(data.error ?? "Payment failed. Please try again.");
      } else {
        clearCart();
        router.push(`/orders/${data.orderId}/confirmation`);
      }
    } catch {
      setPaymentError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: "address", label: "Shipping" },
    { id: "review", label: "Review" },
    { id: "payment", label: "Payment" },
  ];
  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Step indicator */}
      <ol className="flex items-center gap-0 mb-10">
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 ${
                i < stepIndex
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : i === stepIndex
                  ? "border-indigo-600 text-indigo-600"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {i < stepIndex ? "✓" : i + 1}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                i <= stepIndex ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-12 sm:w-24 ${
                  i < stepIndex ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            )}
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === "address" && (
            <form onSubmit={handleAddressSubmit} noValidate className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact &amp; Shipping Address
              </h2>

              {(
                [
                  { id: "name", label: "Full Name", type: "text", autoComplete: "name" },
                  { id: "email", label: "Email Address", type: "email", autoComplete: "email" },
                  { id: "line1", label: "Address Line 1", type: "text", autoComplete: "address-line1" },
                  { id: "line2", label: "Address Line 2 (optional)", type: "text", autoComplete: "address-line2" },
                  { id: "city", label: "City", type: "text", autoComplete: "address-level2" },
                  { id: "state", label: "State / Province", type: "text", autoComplete: "address-level1" },
                  { id: "postalCode", label: "Postal Code", type: "text", autoComplete: "postal-code" },
                  { id: "country", label: "Country", type: "text", autoComplete: "country" },
                ] as const
              ).map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    value={address[field.id] ?? ""}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, [field.id]: e.target.value }))
                    }
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors[field.id]
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[field.id] && (
                    <p className="text-xs text-red-500 mt-1" role="alert">
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
              >
                Continue to Review →
              </button>
            </form>
          )}

          {/* Step 2: Review */}
          {step === "review" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Order</h2>

              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Shipping to</h3>
                <address className="text-sm text-gray-600 not-italic space-y-0.5">
                  <p>{address.name}</p>
                  <p>{address.email}</p>
                  <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p>{address.country}</p>
                </address>
                <button
                  onClick={() => setStep("address")}
                  className="mt-3 text-sm text-indigo-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-700">
                      {product.name}{" "}
                      <span className="text-gray-400">×{quantity}</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep("address")}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep("payment")}
                  className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <form onSubmit={handlePayment} noValidate className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800 mb-4">
                <strong>Demo mode:</strong> Enter any test card number (e.g. 4242 4242 4242 4242), any future expiry, and any 3-digit CVC.
              </div>

              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  inputMode="numeric"
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                    setCardNumber(raw.replace(/(.{4})/g, "$1 ").trim());
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoComplete="cc-number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    id="cardExpiry"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "");
                      if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                      setCardExpiry(v);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoComplete="cc-exp"
                  />
                </div>
                <div>
                  <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    id="cardCvc"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) =>
                      setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoComplete="cc-csc"
                  />
                </div>
              </div>

              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700" role="alert">
                  {paymentError}
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setStep("review")}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                >
                  {loading ? "Processing…" : `Pay $${summary.total.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: order summary */}
        <div>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Order Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium">${summary.subtotal.toFixed(2)}</dd>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Discount</dt>
                  <dd>−${summary.discount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Tax (10%)</dt>
                <dd className="font-medium">${summary.tax.toFixed(2)}</dd>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
                <dt>Total</dt>
                <dd>${summary.total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-xs text-gray-500">
                  <span className="truncate mr-2">{product.name}</span>
                  <span>×{quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
