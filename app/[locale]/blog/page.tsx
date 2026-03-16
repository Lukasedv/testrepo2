import type { Metadata } from "next";
import { useTranslations, useFormatter } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import LanguageSelector from "@/app/components/LanguageSelector";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const description =
    "Read our latest articles on Next.js, React, and modern web development.";
  return {
    title: t("title"),
    description,
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      title: `${t("title")} | My App`,
      description,
      url: "/blog",
      type: "website",
    },
    twitter: {
      title: `${t("title")} | My App`,
      description,
    },
  };
}

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

// Simulate fetching blog posts (ISR – revalidates every 60 seconds)
async function getPosts(): Promise<Post[]> {
  return [
    {
      slug: "getting-started-with-nextjs",
      title: "Getting Started with Next.js 14",
      excerpt:
        "Learn how to build modern web applications with Next.js 14 and the App Router.",
      date: "2026-03-01",
    },
    {
      slug: "server-components-explained",
      title: "React Server Components Explained",
      excerpt:
        "Understand how React Server Components work and when to use them.",
      date: "2026-03-07",
    },
    {
      slug: "optimizing-images-nextjs",
      title: "Optimizing Images in Next.js",
      excerpt:
        "Improve performance by using the Next.js Image component for automatic optimization.",
      date: "2026-03-14",
    },
  ];
}

// ISR: revalidate every 60 seconds
export const revalidate = 60;

function BlogList({ posts }: { posts: Post[] }) {
  const t = useTranslations("blog");
  const nav = useTranslations("nav");
  const format = useFormatter();

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
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

        <ul className="space-y-6">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="rounded-xl border border-gray-200 p-6 hover:border-gray-400 transition-colors"
            >
              <time className="text-xs text-gray-400">
                {format.dateTime(new Date(post.date), { dateStyle: "long" })}
              </time>
              <h2 className="mt-1 text-xl font-semibold">
                <Link href={`blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-gray-600">{post.excerpt}</p>
              <Link
                href={`blog/${post.slug}`}
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                {t("readMore")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}
