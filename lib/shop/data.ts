import type { Category, DiscountCode, Order, Product } from "./types";

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const categories: Category[] = [
  { id: "cat-1", name: "Electronics", slug: "electronics" },
  { id: "cat-2", name: "Clothing", slug: "clothing" },
  { id: "cat-3", name: "Books", slug: "books" },
  { id: "cat-4", name: "Home & Garden", slug: "home-garden" },
];

// ---------------------------------------------------------------------------
// Global singleton store
// Keeps in-memory data consistent across all Next.js module instances in the
// same Node.js process (avoids duplicated state in dev hot-reload contexts).
// ---------------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var __shopStore:
    | {
        products: Product[];
        orders: Order[];
      }
    | undefined;
}

const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and foldable design. Perfect for travel, work, and everyday listening. Features Bluetooth 5.0, multipoint pairing, and a built-in microphone for hands-free calls.",
    price: 149.99,
    stock: 42,
    categoryId: "cat-1",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
    ],
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "prod-2",
    name: "Mechanical Keyboard – TKL Layout",
    description:
      "Compact tenkeyless mechanical keyboard with Cherry MX Brown switches. RGB backlighting, aluminium top plate, USB-C detachable cable, and N-key rollover. Ideal for typists and gamers who want tactile feedback without the noise.",
    price: 89.99,
    stock: 15,
    categoryId: "cat-1",
    images: [
      "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=600&q=80",
    ],
    status: "active",
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "prod-3",
    name: "4K Portable Monitor",
    description:
      "15.6-inch 4K IPS portable monitor with USB-C and HDMI connectivity. 60 Hz refresh rate, HDR support, and a built-in kickstand. Weighs only 0.9 kg – the perfect companion for remote work or dual-monitor setups on the go.",
    price: 299.99,
    stock: 8,
    categoryId: "cat-1",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
    ],
    status: "active",
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "prod-4",
    name: "Classic Crewneck Sweatshirt",
    description:
      "Heavyweight 400 gsm cotton-fleece sweatshirt in a relaxed fit. Ribbed cuffs, waistband, and collar. Preshrunk to minimise post-wash shrinkage. Available in five colours. Ethically produced in a Fair Trade certified facility.",
    price: 49.99,
    stock: 200,
    categoryId: "cat-2",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    ],
    status: "active",
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "prod-5",
    name: "Running Shoes – Lightweight Edition",
    description:
      "Ultra-lightweight road-running shoe with a breathable mesh upper and responsive foam midsole. Features a heel counter for stability and a durable rubber outsole with multi-directional grip. Available in sizes 36–47.",
    price: 119.99,
    stock: 0,
    categoryId: "cat-2",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    ],
    status: "active",
    createdAt: "2026-01-20T00:00:00.000Z",
    updatedAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "prod-6",
    name: "The Art of Clean Code",
    description:
      "A practical guide to writing readable, maintainable, and testable software. Covers naming conventions, functions, comments, formatting, error handling, unit testing, and refactoring techniques with real-world examples in multiple languages.",
    price: 34.99,
    stock: 75,
    categoryId: "cat-3",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
    ],
    status: "active",
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "prod-7",
    name: "Indoor Plant Starter Kit",
    description:
      "Everything you need to get started with indoor plants: three 4-inch ceramic pots, premium potting mix, drainage trays, bamboo plant labels, and a care guide. Perfect as a gift or for first-time plant parents.",
    price: 39.99,
    stock: 30,
    categoryId: "cat-4",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
    ],
    status: "active",
    createdAt: "2026-02-10T00:00:00.000Z",
    updatedAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "prod-8",
    name: "Smart LED Desk Lamp",
    description:
      "Adjustable colour temperature (2700 K–6500 K) and brightness LED desk lamp with wireless charging pad, USB-A port, and touch controls. Auto-dimming mode syncs to ambient light. Energy-efficient – only 12 W at full brightness.",
    price: 59.99,
    stock: 22,
    categoryId: "cat-4",
    images: [
      "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&q=80",
    ],
    status: "active",
    createdAt: "2026-02-15T00:00:00.000Z",
    updatedAt: "2026-02-15T00:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// Discount codes
// ---------------------------------------------------------------------------
const discountCodes: DiscountCode[] = [
  {
    id: "disc-1",
    code: "SAVE10",
    type: "percent",
    value: 10,
    usageLimit: 100,
    usedCount: 12,
    expiresAt: "2027-12-31T23:59:59.000Z",
    active: true,
  },
  {
    id: "disc-2",
    code: "WELCOME20",
    type: "fixed",
    value: 20,
    usageLimit: 50,
    usedCount: 5,
    expiresAt: "2027-12-31T23:59:59.000Z",
    active: true,
  },
  {
    id: "disc-3",
    code: "EXPIRED",
    type: "percent",
    value: 15,
    usageLimit: 100,
    usedCount: 100,
    expiresAt: "2020-01-01T00:00:00.000Z",
    active: false,
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: "ord-1001",
    email: "jane@example.com",
    status: "paid",
    subtotal: 149.99,
    discount: 0,
    tax: 15.0,
    total: 164.99,
    shippingAddress: {
      name: "Jane Doe",
      email: "jane@example.com",
      line1: "123 Main St",
      city: "Stockholm",
      state: "Stockholms län",
      postalCode: "11122",
      country: "SE",
    },
    items: [
      {
        id: "oi-1",
        orderId: "ord-1001",
        productId: "prod-1",
        productName: "Wireless Noise-Cancelling Headphones",
        unitPrice: 149.99,
        quantity: 1,
      },
    ],
    createdAt: "2026-03-10T14:00:00.000Z",
    updatedAt: "2026-03-10T14:05:00.000Z",
  },
];

// Initialise global store once per process
if (!globalThis.__shopStore) {
  globalThis.__shopStore = {
    products: SEED_PRODUCTS,
    orders: SEED_ORDERS,
  };
}

// Convenience accessors (mutate through store reference so changes persist)
function getStore() {
  return globalThis.__shopStore!;
}

// ---------------------------------------------------------------------------
// Product helpers
// ---------------------------------------------------------------------------
export function getProducts(filters?: {
  search?: string;
  categoryId?: string;
  sort?: "price-asc" | "price-desc" | "newest";
  page?: number;
  pageSize?: number;
}): { products: Product[]; total: number; page: number; pageSize: number } {
  const { search, categoryId, sort, page = 1, pageSize = 20 } = filters ?? {};

  let result = getStore().products.filter((p) => p.status === "active");

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (categoryId) {
    result = result.filter((p) => p.categoryId === categoryId);
  }

  if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
  else if (sort === "newest")
    result = [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const total = result.length;
  const start = (page - 1) * pageSize;
  return { products: result.slice(start, start + pageSize), total, page, pageSize };
}

export function getProductById(id: string): Product | undefined {
  return getStore().products.find((p) => p.id === id && p.status === "active");
}

export function getAllProductsAdmin(): Product[] {
  return getStore().products;
}

export function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
): Product {
  const now = new Date().toISOString();
  const product: Product = {
    ...data,
    id: `prod-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  getStore().products = [...getStore().products, product];
  return product;
}

export function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt">>
): Product | undefined {
  const store = getStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const updated: Product = {
    ...store.products[idx],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };
  store.products = [
    ...store.products.slice(0, idx),
    updated,
    ...store.products.slice(idx + 1),
  ];
  return updated;
}

export function deleteProduct(id: string): boolean {
  const store = getStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.products = store.products.map((p) =>
    p.id === id ? { ...p, status: "archived" as const } : p
  );
  return true;
}

// ---------------------------------------------------------------------------
// Discount helpers
// ---------------------------------------------------------------------------
export function getDiscountCode(code: string): DiscountCode | undefined {
  return discountCodes.find(
    (d) => d.code.toUpperCase() === code.toUpperCase()
  );
}

export function validateDiscountCode(code: string): {
  valid: boolean;
  discount?: DiscountCode;
  error?: string;
} {
  const discount = getDiscountCode(code);
  if (!discount) return { valid: false, error: "Invalid discount code." };
  if (!discount.active) return { valid: false, error: "This discount code is no longer active." };
  if (new Date(discount.expiresAt) < new Date())
    return { valid: false, error: "This discount code has expired." };
  if (discount.usageLimit > 0 && discount.usedCount >= discount.usageLimit)
    return { valid: false, error: "This discount code has reached its usage limit." };
  return { valid: true, discount };
}

// ---------------------------------------------------------------------------
// Order helpers
// ---------------------------------------------------------------------------
export function getOrders(filters?: { status?: string }): Order[] {
  let result = [...getStore().orders];
  if (filters?.status) {
    result = result.filter((o) => o.status === filters.status);
  }
  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(id: string): Order | undefined {
  return getStore().orders.find((o) => o.id === id);
}

export function getOrdersByEmail(email: string): Order[] {
  return getStore()
    .orders.filter((o) => o.email.toLowerCase() === email.toLowerCase())
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function createOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
  const now = new Date().toISOString();
  const order: Order = {
    ...data,
    id: `ord-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  getStore().orders = [...getStore().orders, order];
  return order;
}

export function updateOrderStatus(
  id: string,
  status: Order["status"]
): Order | undefined {
  const store = getStore();
  const idx = store.orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  const updated: Order = {
    ...store.orders[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  store.orders = [
    ...store.orders.slice(0, idx),
    updated,
    ...store.orders.slice(idx + 1),
  ];
  return updated;
}
