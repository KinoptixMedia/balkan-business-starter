import type { Metadata } from "next";
import { site } from "../site.config.ts";
import { openingHoursSpec } from "./hours.ts";
import { scriptT, type Script } from "./translit.ts";

export const PATHS: Record<Script, string> = { lat: "/", cir: "/cir/" };

export function buildMetadata(script: Script): Metadata {
  const t = scriptT(script);
  const title = t(`${site.name} | ${site.tagline} | ${site.seoKeyword}`);
  const description = t(site.description);
  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: {
      canonical: PATHS[script],
      languages: { "sr-Latn": PATHS.lat, "sr-Cyrl": PATHS.cir },
    },
    openGraph: {
      type: "website",
      locale: script === "cir" ? "sr_RS" : "sr_RS@latin",
      url: PATHS[script],
      siteName: site.name,
      title,
      description,
      images: site.gallery[0] ? [{ url: site.gallery[0].src, alt: t(site.gallery[0].alt) }] : [],
    },
  };
}

/** schema.org LocalBusiness JSON-LD — the single most useful thing for Google Maps / local results. */
export function localBusinessJsonLd() {
  const { address, contact } = site;
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": site.type,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: `+${contact.phone}`,
    email: contact.email,
    image: site.gallery.map((g) => new URL(g.src, site.url).toString()),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    ...(address.geo && {
      geo: { "@type": "GeoCoordinates", latitude: address.geo.lat, longitude: address.geo.lng },
    }),
    openingHoursSpecification: openingHoursSpec(site.hours),
    priceRange: site.currency,
    ...(sameAs.length && { sameAs }),
  };
}
