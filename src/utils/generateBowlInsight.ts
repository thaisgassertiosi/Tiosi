import type { Bowl } from "../types/bowl";
import { getNoteBySymbol } from "../data/notes";
import { interpretTuning } from "./interpretTuning";
import { interpretSize } from "./interpretSize";
import { matchAlchemy } from "./matchAlchemy";

export type BowlInsight = {
  summary: string;
  note: string;
  tuning: string;
  alchemy: string;
  size: string;
  overallFeel: string;
  /** Short line for library cards */
  descriptor: string;
};

function capitalizeSentence(s: string): string {
  const t = s.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function generateBowlInsight(bowl: Bowl): BowlInsight {
  const noteEntry = getNoteBySymbol(bowl.note);
  const tuning = interpretTuning(bowl.tagNumber);
  const size = interpretSize(bowl.size);
  const alchemy = matchAlchemy(bowl.name);

  const note = noteEntry
    ? `${capitalizeSentence(noteEntry.description)} It opens space for ${noteEntry.keywords}.`
    : capitalizeSentence(
        `the ${bowl.note} note carries its own teaching; stay soft and curious as you listen.`,
      );

  let tuningText: string;
  if (tuning.distance <= 5) {
    tuningText = `Close to ${tuning.centerName}, giving it a ${tuning.description} quality.`;
  } else if (tuning.distance <= 15) {
    tuningText = `The tag ${tuning.relationLabel} ${tuning.centerName}, leaning into something ${tuning.description}.`;
  } else {
    tuningText = `Relative to the reference map, this tag ${tuning.relationLabel} ${tuning.centerName} — a wider, more stretching relationship to the usual centers.`;
  }

  const alchemyText =
    alchemy.kind === "fallback"
      ? `Your bowl carries the alchemy “${alchemy.displayName}.” When a name is rare in our starter library, trust your hands and ears as the final word.`
      : capitalizeSentence(alchemy.description) + ".";

  const sizeText = capitalizeSentence(size.body) + ".";

  const firstNoteKeyword = noteEntry?.keywords.split(",")[0]?.trim() ?? bowl.note;
  const firstAlchemyKeyword =
    alchemy.kind === "fallback"
      ? "its own signature"
      : alchemy.keywords.split(",")[0]?.trim() ?? "distinct presence";

  let summary: string;
  if (size.category === "mid") {
    summary = `A balancing and centering bowl that supports ${firstAlchemyKeyword} and ${firstNoteKeyword}, helping you feel more gathered and clear.`;
  } else if (size.category === "high") {
    summary = `A bright, lifting bowl that invites ${firstNoteKeyword} while ${alchemy.kind === "fallback" ? "carrying its own alchemy story" : `carries tones of ${firstAlchemyKeyword}`}.`;
  } else if (size.category === "low") {
    summary = `A deep, anchoring bowl that steadies the field, weaving ${firstNoteKeyword} with ${alchemy.kind === "fallback" ? "the mystery of your chosen alchemy" : firstAlchemyKeyword}.`;
  } else {
    summary = `A unique bowl that asks for listening more than labeling — ${firstNoteKeyword} meets ${alchemy.displayName} in your own way.`;
  }

  const overallFeel = [
    noteEntry
      ? `Through the ${bowl.note} note, it invites ${noteEntry.keywords}.`
      : `The ${bowl.note} note holds space for your intention.`,
    size.title + " — " + size.body,
    tuningText,
    alchemy.kind === "fallback"
      ? ""
      : capitalizeSentence(alchemy.description) + ".",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const sizeWord =
    size.category === "high"
      ? "lifting"
      : size.category === "low"
        ? "grounding"
        : size.category === "mid"
          ? "centering"
          : "unique";

  const descriptor = `${firstNoteKeyword} · ${bowl.size}" · ${sizeWord}`;

  return {
    summary,
    note,
    tuning: capitalizeSentence(tuningText),
    alchemy: alchemyText,
    size: sizeText,
    overallFeel:
      overallFeel ||
      "Hold this bowl lightly: let silence finish the sentence.",
    descriptor,
  };
}
