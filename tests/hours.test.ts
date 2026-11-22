import { test } from "node:test";
import assert from "node:assert/strict";
import { isOpen, localNow } from "../lib/hours.ts";
import type { Hours } from "../site.config.ts";

const hours: Hours = {
  mon: ["08:00", "22:00"], tue: ["08:00", "22:00"], wed: ["08:00", "22:00"],
  thu: ["08:00", "22:00"], fri: ["08:00", "00:30"], sat: ["09:00", "00:30"], sun: null,
};

// Belgrade is UTC+1 in winter. 2026-11-23 is a Monday.
const at = (iso: string) => new Date(iso);

test("localNow uses Belgrade time", () => {
  assert.deepEqual(localNow(at("2026-11-23T07:30:00Z")), { day: "mon", minutes: 8 * 60 + 30 });
});

test("open and closed during a normal day", () => {
  assert.equal(isOpen(hours, at("2026-11-23T10:00:00Z")), true); // Mon 11:00
  assert.equal(isOpen(hours, at("2026-11-23T06:30:00Z")), false); // Mon 07:30
  assert.equal(isOpen(hours, at("2026-11-23T21:00:00Z")), false); // Mon 22:00
});

test("after-midnight closing carries into the next day", () => {
  assert.equal(isOpen(hours, at("2026-11-27T23:15:00Z")), true); // Sat 00:15, from Fri
  assert.equal(isOpen(hours, at("2026-11-28T23:15:00Z")), true); // Sun 00:15, from Sat
  assert.equal(isOpen(hours, at("2026-11-28T23:45:00Z")), false); // Sun 00:45
});

test("closed all day", () => {
  assert.equal(isOpen(hours, at("2026-11-29T12:00:00Z")), false); // Sun 13:00
});

test("status tells when it closes or opens next", async () => {
  const { status } = await import("../lib/hours.ts");
  assert.deepEqual(status(hours, at("2026-11-23T10:00:00Z")), { open: true, closesAt: "22:00" });
  assert.deepEqual(status(hours, at("2026-11-23T06:00:00Z")), { open: false, opensDay: "mon", opensAt: "08:00", today: true });
  assert.deepEqual(status(hours, at("2026-11-29T12:00:00Z")), { open: false, opensDay: "mon", opensAt: "08:00", today: false });
  assert.deepEqual(status(hours, at("2026-11-28T23:15:00Z")), { open: true, closesAt: "00:30" });
});
