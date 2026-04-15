import { alchemies } from "../data/alchemies";
import type { AlchemyEntry } from "../types/alchemyEntry";

export type AlchemyMatch = {
  displayName: string;
  keywords: string;
  description: string;
  kind: "exact" | "partial" | "multi" | "fallback";
  /** When several catalog names appear in the bowl name */
  components?: AlchemyEntry[];
};

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/** Normalize user-entered bowl / alchemy text for substring matching. */
function normalizeForMatch(raw: string): string {
  return normalize(
    raw
      .replace(/\([^)]*\)/g, " ")
      .replace(/\//g, " ")
      .replace(/,/g, " ")
      .replace(/\s*&\s*/g, " ")
      .replace(/\s*\+\s*/g, " ")
      .replace(/\b(and|with)\b/gi, " ")
      .replace(/\b(bowl|bowls|crystal\s*tones®?|®|™)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

const MIN_ALCHEMY_NAME_LEN = 3;

type Span = { start: number; end: number; entry: AlchemyEntry };

/**
 * Finds every catalog alchemy whose name appears as a substring of `haystack`,
 * using non-overlapping spans (longer names preferred at the same start index).
 */
function findEmbeddedAlchemies(haystackNorm: string): AlchemyEntry[] {
  if (!haystackNorm) return [];

  const candidates: Span[] = [];
  const sorted = [...alchemies].sort((a, b) => b.name.length - a.name.length);

  for (const entry of sorted) {
    const needle = normalize(entry.name);
    if (needle.length < MIN_ALCHEMY_NAME_LEN) continue;

    let from = 0;
    while (from <= haystackNorm.length - needle.length) {
      const idx = haystackNorm.indexOf(needle, from);
      if (idx === -1) break;
      candidates.push({ start: idx, end: idx + needle.length, entry });
      from = idx + 1;
    }
  }

  candidates.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - b.start - (a.end - a.start);
  });

  const chosen: Span[] = [];
  for (const c of candidates) {
    const overlaps = chosen.some(
      (ch) => !(c.end <= ch.start || c.start >= ch.end),
    );
    if (!overlaps) chosen.push(c);
  }

  chosen.sort((a, b) => a.start - b.start);

  const seen = new Set<string>();
  const out: AlchemyEntry[] = [];
  for (const c of chosen) {
    const k = normalize(c.entry.name);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(c.entry);
    }
  }
  return out;
}

function combineMulti(entries: AlchemyEntry[]): Pick<
  AlchemyMatch,
  "displayName" | "keywords" | "description"
> {
  return {
    displayName: entries.map((e) => e.name).join(" · "),
    keywords: entries.map((e) => e.keywords).join(" · "),
    description: entries.map((e) => e.description.trim()).join(" "),
  };
}

export function matchAlchemy(rawName: string): AlchemyMatch {
  const trimmed = rawName.trim();
  const n = normalize(trimmed);
  const haystack = normalizeForMatch(trimmed);

  if (!n) {
    return {
      displayName: trimmed,
      keywords: "",
      description: "",
      kind: "fallback",
    };
  }

  for (const a of alchemies) {
    const an = normalize(a.name);
    if (an === n || an === haystack) {
      return {
        displayName: a.name,
        keywords: a.keywords,
        description: a.description,
        kind: "exact",
        components: [a],
      };
    }
  }

  const embedded = findEmbeddedAlchemies(haystack);
  if (embedded.length >= 2) {
    const merged = combineMulti(embedded);
    return {
      ...merged,
      kind: "multi",
      components: embedded,
    };
  }
  if (embedded.length === 1) {
    const a = embedded[0];
    return {
      displayName: a.name,
      keywords: a.keywords,
      description: a.description,
      kind: "partial",
      components: [a],
    };
  }

  const byLength = [...alchemies].sort((a, b) => b.name.length - a.name.length);
  for (const a of byLength) {
    const an = normalize(a.name);
    if (an.length < MIN_ALCHEMY_NAME_LEN) continue;
    if (haystack.includes(an) || an.includes(haystack)) {
      return {
        displayName: a.name,
        keywords: a.keywords,
        description: a.description,
        kind: "partial",
        components: [a],
      };
    }
  }

  return {
    displayName: trimmed,
    keywords: "",
    description: "",
    kind: "fallback",
  };
}
