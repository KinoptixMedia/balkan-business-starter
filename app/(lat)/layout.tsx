import type { ReactNode } from "react";
import { Shell } from "../../components/Shell.tsx";

export default function LatinLayout({ children }: { children: ReactNode }) {
  return <Shell lang="sr-Latn">{children}</Shell>;
}
