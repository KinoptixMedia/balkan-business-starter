import type { ReactNode } from "react";
import { site } from "../site.config.ts";
import "@fontsource/alegreya/500.css";
import "@fontsource/alegreya/700.css";
import "@fontsource/alegreya/500-italic.css";
import "@fontsource/alegreya-sans/400.css";
import "@fontsource/alegreya-sans/500.css";
import "@fontsource/alegreya-sans/700.css";
import "../app/globals.css";

/** Shared <html> shell. Latin and Cyrillic each get their own root layout so `lang` is correct. */
export function Shell({ lang, children }: { lang: "sr-Latn" | "sr-Cyrl"; children: ReactNode }) {
  return (
    <html lang={lang}>
      <body
        style={{
          ["--accent" as string]: site.colors.accent,
          ["--surface" as string]: site.colors.surface,
          ["--ink" as string]: site.colors.ink,
          ["--cloth" as string]: site.colors.cloth,
        }}
      >{children}</body>
    </html>
  );
}
