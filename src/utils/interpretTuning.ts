import { tuningCenters } from "../data/tunings";

export type TuningInterpretation = {
  centerName: string;
  centerValue: number;
  description: string;
  relationLabel: "aligned with" | "leans toward" | "extends beyond";
  distance: number;
};

export function interpretTuning(tagNumber: number): TuningInterpretation {
  let closest = tuningCenters[0];
  let closestDist = Math.abs(tagNumber - tuningCenters[0].center);

  for (const c of tuningCenters) {
    const d = Math.abs(tagNumber - c.center);
    if (d < closestDist) {
      closestDist = d;
      closest = c;
    }
  }

  const diff = Math.abs(tagNumber - closest.center);
  let relationLabel: TuningInterpretation["relationLabel"];
  if (diff <= 5) relationLabel = "aligned with";
  else if (diff <= 15) relationLabel = "leans toward";
  else relationLabel = "extends beyond";

  return {
    centerName: closest.name,
    centerValue: closest.center,
    description: closest.description,
    relationLabel,
    distance: diff,
  };
}
