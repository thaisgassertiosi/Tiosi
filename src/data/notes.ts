export type NoteEntry = {
  symbol: string;
  keywords: string;
  description: string;
};

export const noteOrder: string[] = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
];

export const notes: NoteEntry[] = [
  {
    symbol: "A",
    keywords: "awareness, intuition",
    description:
      "supports inner listening and intuitive awareness",
  },
  {
    symbol: "A#",
    keywords: "restoration, higher consciousness",
    description:
      "supports deep rest, restoration, and higher connection",
  },
  {
    symbol: "B",
    keywords: "expansion, connection",
    description: "supports expansion and higher connection",
  },
  {
    symbol: "C",
    keywords: "grounding, physical presence",
    description:
      "supports feeling rooted, safe, and fully in the body",
  },
  {
    symbol: "C#",
    keywords: "creation, sexuality, life force",
    description:
      "activates creative energy and connection to desire and vitality",
  },
  {
    symbol: "D",
    keywords: "power, will, activation",
    description:
      "stimulates motivation, confidence, and forward movement",
  },
  {
    symbol: "D#",
    keywords: "regulation, balance, stability",
    description:
      "supports emotional and physical regulation",
  },
  {
    symbol: "E",
    keywords: "warmth, sincerity, relational truth",
    description:
      "supports heartfelt sincerity, relational truth, and gentle courage in connection",
  },
  {
    symbol: "F",
    keywords: "heart, love, connection",
    description:
      "opens the heart space and supports compassion and emotional flow",
  },
  {
    symbol: "F#",
    keywords: "healing, integration, immune support",
    description: "supports healing and energetic integration",
  },
  {
    symbol: "G",
    keywords: "expression, truth",
    description: "supports communication and authentic expression",
  },
  {
    symbol: "G#",
    keywords: "clarity, alignment",
    description: "helps bring mental clarity and energetic alignment",
  },
];

export function getNoteBySymbol(symbol: string): NoteEntry | undefined {
  return notes.find((n) => n.symbol === symbol);
}
