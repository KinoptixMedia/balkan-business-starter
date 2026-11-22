import type { DayKey, Hours } from "../site.config.ts";

export const DAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const DAY_NAMES_SR: Record<DayKey, string> = {
  mon: "Ponedeljak", tue: "Utorak", wed: "Sreda", thu: "Četvrtak",
  fri: "Petak", sat: "Subota", sun: "Nedelja",
};

const SCHEMA_DAYS: Record<DayKey, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
  fri: "Friday", sat: "Saturday", sun: "Sunday",
};

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Current weekday and minutes-since-midnight in a given time zone (default Belgrade). */
export function localNow(date = new Date(), timeZone = "Europe/Belgrade"): { day: DayKey; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = get("weekday").toLowerCase().slice(0, 3) as DayKey;
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

/** Is the business open at `date`? Handles closing times after midnight. */
export function isOpen(hours: Hours, date = new Date(), timeZone = "Europe/Belgrade"): boolean {
  const { day, minutes } = localNow(date, timeZone);
  const today = hours[day];
  if (today) {
    const [o, c] = today.map(toMin);
    if (c > o ? minutes >= o && minutes < c : minutes >= o) return true;
  }
  // Still open from yesterday's after-midnight shift?
  const yesterday = hours[DAYS[(DAYS.indexOf(day) + 6) % 7]];
  if (yesterday) {
    const [o, c] = yesterday.map(toMin);
    if (c <= o && minutes < c) return true;
  }
  return false;
}

/** schema.org OpeningHoursSpecification. After-midnight closing is valid as-is per schema.org. */
export function openingHoursSpec(hours: Hours) {
  return DAYS.filter((d) => hours[d]).map((d) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: SCHEMA_DAYS[d],
    opens: hours[d]![0],
    closes: hours[d]![1],
  }));
}
