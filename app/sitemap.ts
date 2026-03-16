import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Mirrors the posts defined in app/[locale]/blog/[slug]/page.tsx */
const blogPosts = [
  { slug: "getting-started-with-nextjs", date: "2026-03-01" },
  { slug: "server-components-explained", date: "2026-03-07" },
  { slug: "optimizing-images-nextjs", date: "2026-03-14" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push(
      {
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: locale === routing.defaultLocale ? 1 : 0.9,
      },
      {
        url: `${baseUrl}/${locale}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      ...blogPosts.map((post) => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    );
  }

  return entries;
}
