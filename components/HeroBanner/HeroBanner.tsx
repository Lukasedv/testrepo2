import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroBannerConfig } from "@/content/home.config";

type HeroBannerProps = HeroBannerConfig;

/**
 * HeroBanner — the primary above-the-fold section on the home page.
 *
 * Accessibility:
 *  - The section is labelled via aria-label="Hero banner".
 *  - The headline is an <h1>.
 *  - Background decorative elements are aria-hidden.
 *  - All interactive elements are keyboard-navigable.
 *  - Focus indicators are provided by Tailwind's focus-visible utilities.
 */
export default function HeroBanner({
  headline,
  subheading,
  primaryCta,
  secondaryCta,
  backgroundImage,
  overlayOpacity = 0.55,
}: HeroBannerProps) {
  const overlayStyle: CSSProperties = { opacity: overlayOpacity };

  return (
    <section
      aria-label="Hero banner"
      className="relative flex min-h-[320px] items-center overflow-hidden md:min-h-[480px]"
    >
      {/* ── Background layer ── */}
      <div className="absolute inset-0" aria-hidden="true">
        {backgroundImage ? (
          <Image
            src={backgroundImage.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          /* Gradient fallback when no image is provided */
          <div className="h-full w-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />
        )}

        {/* Semi-transparent overlay for text legibility */}
        <div
          className="absolute inset-0 bg-black"
          style={overlayStyle}
        />
      </div>

      {/* ── Content layer ── */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 text-white sm:px-6 md:py-24 lg:px-8">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {headline}
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
          {subheading}
        </p>

        {/* ── Call-to-action buttons ── */}
        <div className="mt-8 flex flex-wrap gap-4">
          {primaryCta.url && (
            <Link
              href={primaryCta.url}
              className="inline-block rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-900 transition-colors hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {primaryCta.label}
            </Link>
          )}

          {secondaryCta?.url && (
            <Link
              href={secondaryCta.url}
              className="inline-block rounded-lg border border-white/70 px-6 py-3 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
