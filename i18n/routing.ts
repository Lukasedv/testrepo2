import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fi", "sv"],
  defaultLocale: "en",
  localeDetection: true,
});
