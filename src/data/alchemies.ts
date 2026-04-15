import type { AlchemyEntry } from "../types/alchemyEntry";
import { mixedAlchemyComboEntries } from "./alchemiesMixedCombos";
import { alchemySignatureEntries } from "./alchemiesSignatures";

export type { AlchemyEntry } from "../types/alchemyEntry";

/** Extra names users often type that are not a separate row on the signature sheet. */
const aliasEntries: AlchemyEntry[] = [
  {
    name: "Ruby Mother of Platinum",
    keywords: "vitality, compassion, divine feminine, Venus",
    description:
      "A path where Ruby’s life force and courage meet Mother of Platinum’s Venusian compassion, emotional balance, and gentle divine feminine field.",
  },
];

function mergeByName(...groups: AlchemyEntry[][]): AlchemyEntry[] {
  const map = new Map<string, AlchemyEntry>();
  for (const group of groups) {
    for (const e of group) {
      const k = e.name.trim().toLowerCase();
      if (!map.has(k)) map.set(k, e);
    }
  }
  return [...map.values()];
}

/**
 * Master list for `matchAlchemy`. Order: signature singles first, then mixed
 * combo rows, then aliases (only if name not already present).
 */
export const alchemies: AlchemyEntry[] = mergeByName(
  alchemySignatureEntries,
  mixedAlchemyComboEntries,
  aliasEntries,
);
