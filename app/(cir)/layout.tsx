import type { ReactNode } from "react";
import { Shell } from "../../components/Shell.tsx";

export default function CyrillicLayout({ children }: { children: ReactNode }) {
  return <Shell lang="sr-Cyrl">{children}</Shell>;
}
