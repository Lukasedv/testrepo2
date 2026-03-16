"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import type { CartItem, CartSummary, DiscountCode, Product } from "./types";

// ---------------------------------------------------------------------------
// State & actions
// ---------------------------------------------------------------------------
interface CartState {
  items: CartItem[];
  discountCode: DiscountCode | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "SET_DISCOUNT"; discount: DiscountCode | null }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; state: CartState };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.product.id
      );
      if (existing) {
        const newQty = Math.min(
          existing.quantity + action.quantity,
          action.product.stock
        );
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.product.id ? { ...i, quantity: newQty } : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: action.product.id,
            product: action.product,
            quantity: Math.min(action.quantity, action.product.stock),
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.productId),
      };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId
            ? {
                ...i,
                quantity: Math.min(action.quantity, i.product.stock),
              }
            : i
        ),
      };
    }
    case "SET_DISCOUNT":
      return { ...state, discountCode: action.discount };
    case "CLEAR_CART":
      return { items: [], discountCode: null };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface CartContextValue {
  items: CartItem[];
  discountCode: DiscountCode | null;
  summary: CartSummary;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDiscount: (discount: DiscountCode | null) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "shop_cart";
const TAX_RATE = 0.1; // 10%

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discountCode: null,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        dispatch({ type: "HYDRATE", state: parsed });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore write errors
    }
  }, [state]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", product, quantity });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  }, []);

  const setDiscount = useCallback((discount: DiscountCode | null) => {
    dispatch({ type: "SET_DISCOUNT", discount });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  // Derived summary
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  let discountAmount = 0;
  if (state.discountCode) {
    if (state.discountCode.type === "percent") {
      discountAmount = (subtotal * state.discountCode.value) / 100;
    } else {
      discountAmount = Math.min(state.discountCode.value, subtotal);
    }
  }

  const afterDiscount = subtotal - discountAmount;
  const tax = afterDiscount * TAX_RATE;
  const total = afterDiscount + tax;

  const summary: CartSummary = {
    subtotal,
    discount: discountAmount,
    tax,
    total,
    discountCode: state.discountCode ?? undefined,
  };

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        discountCode: state.discountCode,
        summary,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        setDiscount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}
