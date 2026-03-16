// This root layout is required by Next.js but the actual HTML/body structure
// is provided by app/[locale]/layout.tsx which handles locale-specific rendering.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
