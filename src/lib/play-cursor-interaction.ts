export const PLAY_INTERACTION_MODES = ["attract", "repel"] as const;

export type PlayInteractionMode = (typeof PLAY_INTERACTION_MODES)[number];

type PlayCursorInteractionConfig = {
  ringSoftness: number;
  attract: {
    influenceRadius: number;
    maxForce: number;
    smoothingPerSec: number;
    comfortRadius: number;
    tangentialStrength: number;
    falloffPower: number;
    nearFieldBoost: number;
    maxSteerRatio: number;
  };
  repel: {
    influenceRadius: number;
    maxForce: number;
    smoothingPerSec: number;
    impulseRadius: number;
    impulseBoost: number;
  };
};

/**
 * Shared cursor interaction tuning for Play mode (CSS px, CSS px/s).
 * Keep all values centralized so behavior can be tuned quickly.
 */
export const PLAY_CURSOR_INTERACTION: PlayCursorInteractionConfig = {
  ringSoftness: 0.16,
  attract: {
    influenceRadius: 1200,
    maxForce: 48,
    smoothingPerSec: 8.6,
    comfortRadius: 54,
    tangentialStrength: 0.28,
    falloffPower: 0.62,
    nearFieldBoost: 1.26,
    maxSteerRatio: 0.88,
  },
  repel: {
    influenceRadius: 520,
    maxForce: 58,
    smoothingPerSec: 9.8,
    impulseRadius: 42,
    impulseBoost: 1.32,
  },
};

export function smoothstep01(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

