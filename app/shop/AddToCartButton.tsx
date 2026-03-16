"use client";

import { useState } from "react";
import { useCart } from "@/lib/shop/cart-context";
import type { Product } from "@/lib/shop/types";

interface Props {
  product: Product;
  showQuantity?: boolean;
}

export default function AddToCartButton({ product, showQuantity }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock === 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (outOfStock) {
    return (
      <button
        disabled
        aria-disabled="true"
        className="bg-gray-200 text-gray-400 rounded-lg px-4 py-2 text-sm font-medium cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {showQuantity && (
        <input
          type="number"
          min={1}
          max={product.stock}
          value={qty}
          onChange={(e) =>
            setQty(Math.min(product.stock, Math.max(1, Number(e.target.value))))
          }
          className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Quantity"
        />
      )}
      <button
        onClick={handleAdd}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          added
            ? "bg-green-600 text-white"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
        aria-label={`Add ${product.name} to cart`}
      >
        {added ? "Added ✓" : "Add to Cart"}
      </button>
    </div>
  );
}
