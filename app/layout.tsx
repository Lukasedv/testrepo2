import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "My App",
    template: "%s | My App",
  },
  description: "A Next.js 15 application with App Router",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "My App",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// This root layout is required by Next.js but the actual HTML/body structure
// is provided by app/[locale]/layout.tsx which handles locale-specific rendering.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
