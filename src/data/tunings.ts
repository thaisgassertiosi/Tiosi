export type TuningCenter = {
  name: string;
  center: number;
  description: string;
};

export const tuningCenters: TuningCenter[] = [
  { name: "432 Hz", center: -30, description: "grounding and deeper" },
  { name: "440 Hz", center: 0, description: "balanced and neutral" },
  { name: "528 Hz", center: 25, description: "uplifting and expansive" },
];
