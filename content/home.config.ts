export interface CtaConfig {
  label: string;
  url: string;
}

export interface BackgroundImageConfig {
  src: string;
  alt: string;
}

export interface HeroBannerConfig {
  /** Primary heading displayed as <h1> */
  headline: string;
  /** Supporting copy displayed below the headline */
  subheading: string;
  /** Primary call-to-action button — hidden if url is empty */
  primaryCta: CtaConfig;
  /** Secondary call-to-action link — omitted entirely if not provided */
  secondaryCta?: CtaConfig;
  /**
   * Optional background image. When omitted the banner falls back to a
   * CSS gradient background.
   */
  backgroundImage?: BackgroundImageConfig;
  /**
   * Opacity of the semi-transparent overlay applied over the background
   * to ensure text legibility. Value between 0 and 1. Defaults to 0.5.
   */
  overlayOpacity?: number;
}

/**
 * Default hero banner content.
 * Edit these values (or replace with a CMS fetch) to update the banner
 * without touching component code.
 */
export const heroBannerConfig: HeroBannerConfig = {
  headline: "Build something great",
  subheading:
    "My App brings modern tooling together so you can focus on what matters most — shipping fast, staying reliable, and delighting your users.",
  primaryCta: {
    label: "Get started",
    url: "/login",
  },
  secondaryCta: {
    label: "Learn more",
    url: "/blog",
  },
};
