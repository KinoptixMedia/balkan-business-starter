import type { ReactNode } from "react";
import { site } from "../site.config.ts";
import "../app/globals.css";

/** Shared <html> shell. Latin and Cyrillic each get their own root layout so `lang` is correct. */
export function Shell({ lang, children }: { lang: "sr-Latn" | "sr-Cyrl"; children: ReactNode }) {
  return (
    <html lang={lang}>
      <body style={{ ["--accent" as string]: site.accent }}>{children}</body>
    </html>
  );
}
