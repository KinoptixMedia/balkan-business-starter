"use client";

import { useEffect, useState } from "react";
import { isOpen } from "../lib/hours.ts";
import type { Hours } from "../site.config.ts";

/** "Open now" badge. Rendered on the client so a static site still shows the live status. */
export function OpenNow({ hours, labels }: { hours: Hours; labels: { open: string; closed: string } }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpen(isOpen(hours));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (open === null) return null;
  return (
    <span className={`badge ${open ? "badge-open" : "badge-closed"}`} role="status">
      <span className="dot" aria-hidden /> {open ? labels.open : labels.closed}
    </span>
  );
}
