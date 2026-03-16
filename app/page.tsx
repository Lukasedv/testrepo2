import type { Metadata } from "next";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import { heroBannerConfig } from "@/content/home.config";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to My App – a Next.js 15 application.",
};

// This page is statically generated at build time (SSG)
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero banner — first visible section above the fold */}
      <HeroBanner {...heroBannerConfig} />

      {/* Secondary navigation / content below the fold */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
        <nav className="flex flex-wrap justify-center gap-4">
          <Link
            href="/blog"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Log in
          </Link>
        </nav>
      </div>
    </main>
  );
}
