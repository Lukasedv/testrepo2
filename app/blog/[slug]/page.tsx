import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Post {
  slug: string;
  title: string;
  content: string;
  date: string;
}

const POSTS: Post[] = [
  {
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js 14",
    date: "2026-03-01",
    content: `Next.js 14 introduces powerful new features including the stable App Router, Server Actions, and Partial Prerendering. This guide walks you through setting up your first Next.js project and understanding the key concepts.

## App Router

The App Router is the recommended way to build Next.js applications. It uses React Server Components by default, enabling better performance and a simpler mental model for data fetching.

## File-Based Routing

All routes are defined by the file structure under the \`app/\` directory. Each folder corresponds to a URL segment, and files named \`page.tsx\` define the UI for that segment.`,
  },
  {
    slug: "server-components-explained",
    title: "React Server Components Explained",
    date: "2026-03-07",
    content: `React Server Components (RSC) allow you to render components on the server, reducing the JavaScript bundle sent to the browser and enabling direct database/file system access.

## Key Benefits

- **Zero client-side JS:** Server Components produce no JavaScript in the client bundle.
- **Direct data access:** Query databases or file systems directly in the component.
- **Streaming:** Render components progressively with React Suspense.

## When to Use Client Components

Use the \`"use client"\` directive when you need interactivity, browser APIs, or React hooks like \`useState\` and \`useEffect\`.`,
  },
  {
    slug: "optimizing-images-nextjs",
    title: "Optimizing Images in Next.js",
    date: "2026-03-14",
    content: `The Next.js \`<Image>\` component automatically optimizes images for faster load times and better Core Web Vitals scores.

## Features

- **Automatic format conversion:** Serves WebP or AVIF when supported.
- **Lazy loading:** Images are loaded only when they enter the viewport.
- **Responsive sizes:** Generates multiple sizes for different screen densities.

## Usage

Replace standard \`<img>\` tags with the Next.js \`<Image>\` component, providing \`width\`, \`height\`, and \`alt\` props. Use the \`priority\` prop for above-the-fold images to avoid layout shifts.`,
  },
];

export async function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.content.split("\n")[0].slice(0, 160),
  };
}

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to Blog
        </Link>

        <article className="mt-6">
          <time className="text-xs text-gray-400">{post.date}</time>
          <h1 className="mt-2 text-3xl font-bold">{post.title}</h1>
          <div className="prose prose-gray mt-6 max-w-none">
            {post.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="mt-6 text-xl font-semibold">
                    {paragraph.slice(3)}
                  </h2>
                );
              }
              return (
                <p key={i} className="mt-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>
      </div>
    </main>
  );
}
