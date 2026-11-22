import { test } from "node:test";
import assert from "node:assert/strict";
import { toCyrillic, toLatin } from "../lib/translit.ts";

test("basic Latin -> Cyrillic", () => {
  assert.equal(toCyrillic("Dobro došli u Beograd"), "Добро дошли у Београд");
  assert.equal(toCyrillic("Ćevapi, ražnjići i čorba"), "Ћевапи, ражњићи и чорба");
});

test("digraphs lj, nj, dž in every casing", () => {
  assert.equal(toCyrillic("ljubav njiva džem"), "љубав њива џем");
  assert.equal(toCyrillic("Ljubav Njiva Džem"), "Љубав Њива Џем");
  assert.equal(toCyrillic("LJUBAV NJIVA DŽEM"), "ЉУБАВ ЊИВА ЏЕМ");
});

test("digraph exceptions are split", () => {
  assert.equal(toCyrillic("konjugacija"), "конјугација");
  assert.equal(toCyrillic("injekcija"), "инјекција");
  assert.equal(toCyrillic("nadživeti"), "надживети");
  assert.equal(toCyrillic("Podžanr"), "Поджанр");
});

test("foreign words, emails and URLs are preserved", () => {
  assert.equal(toCyrillic("Pišite na WhatsApp"), "Пишите на WhatsApp");
  assert.equal(toCyrillic("info@bistrolipa.rs"), "info@bistrolipa.rs");
  assert.equal(toCyrillic("https://example.com"), "https://example.com");
});

test("numbers and punctuation pass through", () => {
  assert.equal(toCyrillic("Pon–Pet 08:00–22:00"), "Пон–Пет 08:00–22:00");
});

test("Cyrillic -> Latin, including title and all caps", () => {
  assert.equal(toLatin("Добро дошли"), "Dobro došli");
  assert.equal(toLatin("Љубав"), "Ljubav");
  assert.equal(toLatin("ЉУБАВ"), "LJUBAV");
  assert.equal(toLatin("Џем и њива"), "Džem i njiva");
});

test("round trip", () => {
  const s = "Ražnjići sa kajmakom, ljuta paprika i domaći džem od šljiva";
  assert.equal(toLatin(toCyrillic(s)), s);
});
