"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";

export default function LanguageSelector() {
  const t = useTranslations("settings.language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value;
    // Replace the current locale prefix in the pathname with the new locale
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const nextPath = segments.join("/") || "/";
    startTransition(() => {
      router.replace(nextPath);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="language-selector"
        className="text-sm text-gray-500"
      >
        {t("label")}:
      </label>
      <select
        id="language-selector"
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50"
        aria-label={t("label")}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc)}
          </option>
        ))}
      </select>
    </div>
  );
}
