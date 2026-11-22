/**
 * Serbian Latin <-> Cyrillic transliteration.
 *
 * Serbian is fully digraphic: every Latin letter maps 1:1 to a Cyrillic letter,
 * except three digraphs (lj, nj, dž) that each map to a single Cyrillic letter.
 * The hard part is words where those letter pairs are NOT digraphs, e.g.
 * "konjugacija" (кон-југација) or "nadživeti" (над-живети).
 */

const LAT_TO_CYR: Record<string, string> = {
  a: "а", b: "б", c: "ц", č: "ч", ć: "ћ", d: "д", đ: "ђ", e: "е", f: "ф",
  g: "г", h: "х", i: "и", j: "ј", k: "к", l: "л", m: "м", n: "н", o: "о",
  p: "п", r: "р", s: "с", š: "ш", t: "т", u: "у", v: "в", z: "з", ž: "ж",
};

const DIGRAPHS: Record<string, string> = { lj: "љ", nj: "њ", dž: "џ" };

const CYR_TO_LAT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ђ: "đ", е: "e", ж: "ž", з: "z",
  и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o",
  п: "p", р: "r", с: "s", т: "t", ћ: "ć", у: "u", ф: "f", х: "h", ц: "c",
  ч: "č", џ: "dž", ш: "š",
};

/**
 * Word stems where lj / nj / dž are two separate letters.
 * Matched against the start of a lowercased word. PRs welcome.
 */
export const DIGRAPH_EXCEPTIONS: string[] = [
  "konjug", "konjunk", "injek", "injunk", "vanjez", "tanjug",
  "nadživ", "nadžnj", "nadždr", "odžal", "odživ", "odžvak",
  "podžan", "podžel", "podžup", "podžnj",
];

/** Tokens containing these letters are foreign (brands, URLs) and are left as-is. */
const FOREIGN = /[qwxy@]|https?:|\.(com|rs|net|org)\b/i;

function isUpper(ch: string): boolean {
  return ch !== ch.toLowerCase() && ch === ch.toUpperCase();
}

function splitIndexes(word: string): Set<number> {
  const lower = word.toLowerCase();
  const out = new Set<number>();
  for (const stem of DIGRAPH_EXCEPTIONS) {
    if (!lower.startsWith(stem)) continue;
    for (let i = 0; i < stem.length - 1; i++) {
      if (DIGRAPHS[stem.slice(i, i + 2)]) out.add(i);
    }
  }
  return out;
}

function wordToCyrillic(word: string): string {
  if (FOREIGN.test(word)) return word;
  const split = splitIndexes(word);
  let out = "";
  for (let i = 0; i < word.length; i++) {
    const pair = word.slice(i, i + 2).toLowerCase();
    if (DIGRAPHS[pair] && !split.has(i)) {
      const cyr = DIGRAPHS[pair];
      out += isUpper(word[i]) ? cyr.toUpperCase() : cyr;
      i++;
      continue;
    }
    const ch = word[i];
    const cyr = LAT_TO_CYR[ch.toLowerCase()];
    out += cyr === undefined ? ch : isUpper(ch) ? cyr.toUpperCase() : cyr;
  }
  return out;
}

/** Convert Serbian Latin text to Cyrillic. Foreign words, emails and URLs are kept. */
export function toCyrillic(text: string): string {
  return text.replace(/[\p{L}@.:/]+/gu, (token) =>
    /[@:/]/.test(token) || FOREIGN.test(token) ? token : wordToCyrillic(token),
  );
}

/** Convert Serbian Cyrillic text to Latin. */
export function toLatin(text: string): string {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const lat = CYR_TO_LAT[ch.toLowerCase()];
    if (lat === undefined) {
      out += ch;
      continue;
    }
    if (!isUpper(ch)) {
      out += lat;
      continue;
    }
    // Uppercase: "Љубав" -> "Ljubav", but "ЉУБАВ" -> "LJUBAV".
    const next = text[i + 1] ?? "";
    const prev = text[i - 1] ?? "";
    const allCaps = isUpper(next) || (next === "" && isUpper(prev));
    out += lat.length > 1 && !allCaps
      ? lat[0].toUpperCase() + lat.slice(1)
      : lat.toUpperCase();
  }
  return out;
}

export type Script = "lat" | "cir";

/** Returns a translator for the given script. Content is authored in Latin. */
export function scriptT(script: Script): (s: string) => string {
  return script === "cir" ? toCyrillic : (s) => s;
}
