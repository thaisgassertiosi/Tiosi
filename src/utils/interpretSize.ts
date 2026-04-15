export type SizeCategory = "high" | "mid" | "low" | "other";

export type SizeInterpretation = {
  category: SizeCategory;
  title: string;
  body: string;
};

const highSizes = new Set([5, 6]);
const midSizes = new Set([8, 9]);
const lowSizes = new Set([10, 12]);

export function interpretSize(size: number): SizeInterpretation {
  if (size === 7) {
    return {
      category: "mid",
      title: "Centering",
      body: "The 7\" size is read as centering — supporting embodiment, integration, and a steady sense of presence in the body.",
    };
  }
  if (highSizes.has(size)) {
    return {
      category: "high",
      title: "High octave",
      body: "A smaller, higher bowl — uplifting and activating, with a sense of movement above the body.",
    };
  }
  if (midSizes.has(size)) {
    return {
      category: "mid",
      title: "Mid octave",
      body: "A mid-sized bowl that supports centering, integrating, and presence in the body.",
    };
  }
  if (lowSizes.has(size)) {
    return {
      category: "low",
      title: "Low octave",
      body: "A larger, lower bowl — grounding and stabilizing, with deep anchoring below the body.",
    };
  }
  return {
    category: "other",
    title: "Unique sizing",
    body: "This size sits outside the usual map; let your ear and body teach you how it wants to be met.",
  };
}
