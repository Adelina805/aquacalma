/**
 * Typography colors for the “Aquacalma” title + tagline (tank poetry + canvas caption).
 * Reused by Relax breathe ring so HUD matches title UI.
 */

export type AquariumPoetryTheme = "night" | "day";

const TITLE = {
  night: { r: 255, g: 250, b: 245, a: 0.62 },
  day: { r: 18, g: 50, b: 70, a: 0.72 },
} as const;

const TAGLINE = {
  night: { r: 200, g: 228, b: 248, a: 0.38 },
  day: { r: 26, g: 68, b: 86, a: 0.48 },
} as const;

function rgba(
  c: Readonly<{ r: number; g: number; b: number; a: number }>,
): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
}

export function aquariumPoetryTitleColor(theme: AquariumPoetryTheme): string {
  return rgba(TITLE[theme]);
}

export function aquariumPoetryTaglineColor(theme: AquariumPoetryTheme): string {
  return rgba(TAGLINE[theme]);
}

/** Bubble fill + glow — same hue as title, tuned for small dots. */
export function relaxBreathRingParticleAppearance(
  theme: AquariumPoetryTheme,
): { backgroundColor: string; boxShadow: string } {
  const { r, g, b, a } = TITLE[theme];
  const backgroundColor =
    theme === "night"
      ? `rgba(${r}, ${g}, ${b}, ${a * 0.92})`
      : `rgba(${r}, ${g}, ${b}, ${a * 0.8})`;
  if (theme === "night") {
    return {
      backgroundColor,
      boxShadow: `0 0 9px 2px rgba(${r}, ${g}, ${b}, 0.16), 0 0 18px 6px rgba(${r}, ${g}, ${b}, 0.08)`,
    };
  }
  return {
    backgroundColor,
    boxShadow: `0 0 8px 1px rgba(${r}, ${g}, ${b}, 0.15), 0 0 16px 4px rgba(${r}, ${g}, ${b}, 0.08)`,
  };
}

/** Soft radial wash behind ring particles (title chroma, low alpha). */
export function relaxBreathMistRadialGradient(
  theme: AquariumPoetryTheme,
): string {
  const { r, g, b } = TITLE[theme];
  if (theme === "night") {
    return `radial-gradient(circle at 50% 48%, rgba(${r},${g},${b},0.07) 0%, rgba(${r},${g},${b},0.045) 26%, rgba(${r},${g},${b},0.025) 46%, rgba(${r},${g},${b},0.01) 60%, transparent 74%)`;
  }
  return `radial-gradient(circle at 50% 48%, rgba(${r},${g},${b},0.08) 0%, rgba(${r},${g},${b},0.052) 26%, rgba(${r},${g},${b},0.03) 46%, rgba(${r},${g},${b},0.012) 60%, transparent 74%)`;
}

/**
 * Day-mode orbit hint — title-hue glow only (no border).
 */
export function relaxBreathGuideCircleStyle(
  theme: AquariumPoetryTheme,
): {
  borderWidth: number;
  borderStyle: "solid";
  borderColor: string;
  boxShadow: string;
} {
  const { r, g, b } = TITLE[theme];
  return {
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    boxShadow: `0 0 28px rgba(${r}, ${g}, ${b}, 0.05), 0 0 48px rgba(${r}, ${g}, ${b}, 0.03)`,
  };
}
