import type { MetadataRoute } from "next";
import { site } from "../site.config.ts";
import { PATHS } from "../lib/seo.ts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    "sr-Latn": new URL(PATHS.lat, site.url).toString(),
    "sr-Cyrl": new URL(PATHS.cir, site.url).toString(),
  };
  return Object.values(languages).map((url) => ({
    url,
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
