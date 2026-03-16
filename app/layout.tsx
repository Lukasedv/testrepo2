import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
