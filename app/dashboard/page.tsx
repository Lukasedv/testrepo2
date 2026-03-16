import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

interface UserData {
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

// Simulate fetching user-specific data (SSR – always fresh)
async function getUserData(): Promise<UserData> {
  // In a real app, this would call an authenticated API or database
  return {
    name: "Jane Doe",
    email: "jane@example.com",
    role: "Admin",
    lastLogin: new Date().toISOString(),
  };
}

// This page is server-side rendered on every request (SSR)
export default async function DashboardPage() {
  let user: UserData;
  try {
    user = await getUserData();
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-semibold">Profile</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium">{user.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Role</dt>
                <dd className="font-medium">{user.role}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Last Login</dt>
                <dd className="font-medium">
                  {new Date(user.lastLogin).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-semibold">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-blue-600 hover:underline"
                >
                  View Blog Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/api/health"
                  className="text-blue-600 hover:underline"
                >
                  API Health Check
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
