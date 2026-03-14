import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 – Page Not Found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="max-w-md text-gray-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        Return Home
      </Link>
    </main>
  );
}
