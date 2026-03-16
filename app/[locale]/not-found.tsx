import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-gray-600">{t("description")}</p>
      <Link
        href="/"
        className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        {t("backToHome")}
      </Link>
    </main>
  );
}
