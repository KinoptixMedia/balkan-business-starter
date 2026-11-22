"use client";

import { useEffect, useState } from "react";
import { DAY_ACC_SR, status, type Status } from "../lib/hours.ts";
import type { Hours } from "../site.config.ts";
import { scriptT, type Script } from "../lib/translit.ts";

/** Live status line: "Otvoreno do 22:00" / "Zatvoreno, otvaramo u ponedeljak u 08:00". */
export function OpenNow({ hours, script }: { hours: Hours; script: Script }) {
  const [s, setS] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () => setS(status(hours));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (!s) return <p className="status" aria-hidden>&nbsp;</p>;
  const t = scriptT(script);
  let text: string;
  if (s.open) text = `Otvoreno do ${s.closesAt}`;
  else if ("never" in s) text = "Trenutno ne radimo";
  else if (s.today) text = `Zatvoreno, otvaramo danas u ${s.opensAt}`;
  else text = `Zatvoreno, otvaramo u ${DAY_ACC_SR[s.opensDay]} u ${s.opensAt}`;

  return (
    <p className={`status ${s.open ? "is-open" : "is-closed"}`} role="status">
      <span className="status-dot" aria-hidden /> {t(text)}
    </p>
  );
}

/** Marks today's row in the opening-hours table (Belgrade time). */
export function TodayMarker() {
  useEffect(() => {
    const day = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Belgrade", weekday: "short" })
      .format(new Date()).toLowerCase().slice(0, 3);
    document.querySelector(`[data-day="${day}"]`)?.setAttribute("aria-current", "date");
  }, []);
  return null;
}
