import type { Metadata } from "next";
import { useTranslations, useFormatter } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import LanguageSelector from "@/app/components/LanguageSelector";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return {
    title: t("title"),
    description: t("profile.title"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

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

function DashboardContent({ user }: { user: UserData }) {
  const t = useTranslations("dashboard");
  const nav = useTranslations("nav");
  const format = useFormatter();

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {nav("backToHome")}
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-semibold">{t("profile.title")}</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">{t("profile.name")}</dt>
                <dd className="font-medium">{user.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t("profile.email")}</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t("profile.role")}</dt>
                <dd className="font-medium">{user.role}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t("profile.lastLogin")}</dt>
                <dd className="font-medium">
                  {format.dateTime(new Date(user.lastLogin), {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {t("quickLinks.title")}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-blue-600 hover:underline">
                  {t("quickLinks.blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/api/health"
                  className="text-blue-600 hover:underline"
                >
                  {t("quickLinks.health")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

// This page is server-side rendered on every request (SSR)
export default async function DashboardPage() {
  let user: UserData;
  try {
    user = await getUserData();
  } catch {
    notFound();
  }

  return <DashboardContent user={user} />;
}
