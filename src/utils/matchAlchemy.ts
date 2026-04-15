import { alchemies } from "../data/alchemies";

export type AlchemyMatch = {
  displayName: string;
  keywords: string;
  description: string;
  kind: "exact" | "partial" | "fallback";
};

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function matchAlchemy(rawName: string): AlchemyMatch {
  const trimmed = rawName.trim();
  const n = normalize(trimmed);
  if (!n) {
    return {
      displayName: trimmed,
      keywords: "",
      description: "",
      kind: "fallback",
    };
  }

  for (const a of alchemies) {
    if (normalize(a.name) === n) {
      return {
        displayName: a.name,
        keywords: a.keywords,
        description: a.description,
        kind: "exact",
      };
    }
  }

  const byLength = [...alchemies].sort((a, b) => b.name.length - a.name.length);
  for (const a of byLength) {
    const an = normalize(a.name);
    if (n.includes(an) || an.includes(n)) {
      return {
        displayName: a.name,
        keywords: a.keywords,
        description: a.description,
        kind: "partial",
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
