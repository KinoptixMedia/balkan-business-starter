import { HomePage } from "../../components/HomePage.tsx";
import { buildMetadata } from "../../lib/seo.ts";

export const metadata = buildMetadata("lat");

export default function Page() {
  return <HomePage script="lat" />;
}
