import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to My App – a Next.js 15 application.",
};

// This page is statically generated at build time (SSG)
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to My App</h1>
        <p className="mt-4 text-lg text-gray-600">
          Built with Next.js 15, TypeScript, and Tailwind CSS.
        </p>
      </div>

      <nav className="flex flex-wrap justify-center gap-4">
        <Link
          href="/blog"
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Blog
        </Link>
        <Link
          href="/events"
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Events
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
    </main>
  );
}
