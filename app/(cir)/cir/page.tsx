import { HomePage } from "../../../components/HomePage.tsx";
import { buildMetadata } from "../../../lib/seo.ts";

export const metadata = buildMetadata("cir");

export default function Page() {
  return <HomePage script="cir" />;
}
