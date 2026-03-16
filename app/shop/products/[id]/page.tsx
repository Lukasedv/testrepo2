import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getProducts, categories } from "@/lib/shop/data";
import AddToCartButton from "@/app/shop/AddToCartButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0]
        ? [{ url: product.images[0] }]
        : [],
    },
  };
}

export async function generateStaticParams() {
  const { products } = getProducts({ pageSize: 100 });
  return products.map((p) => ({ id: p.id }));
}

export const revalidate = 60;

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  const category = categories.find((c) => c.id === product.categoryId);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/shop" className="hover:text-indigo-600">Shop</Link>
        <span aria-hidden="true">/</span>
        {category && (
          <>
            <Link
              href={`/shop?category=${category.id}`}
              className="hover:text-indigo-600"
            >
              {category.name}
            </Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="text-gray-900 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div className="space-y-3">
          {product.images.length > 0 ? (
            <>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.slice(1).map((img, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-indigo-500 cursor-pointer"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${i + 2}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          {category && (
            <Link
              href={`/shop?category=${category.id}`}
              className="text-sm font-medium text-indigo-600 hover:underline mb-2 uppercase tracking-wide"
            >
              {category.name}
            </Link>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-indigo-600 mb-4">
            ${product.price.toFixed(2)}
          </p>

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                product.stock > 0 ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {product.stock > 0
                ? `In stock (${product.stock} available)`
                : "Out of stock"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {/* Add to cart */}
          <div className="mt-auto">
            <AddToCartButton product={product} showQuantity />
          </div>

          {/* Back link */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link
              href="/shop"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              ← Back to shop
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
