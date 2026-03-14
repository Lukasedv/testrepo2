"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-6xl font-bold text-gray-900">500</h1>
      <h2 className="text-2xl font-semibold text-gray-700">
        Something Went Wrong
      </h2>
      <p className="max-w-md text-gray-500">
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
