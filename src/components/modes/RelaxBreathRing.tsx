"use client";

import {
  relaxBreathRingParticleAppearance,
  type AquariumPoetryTheme,
} from "@/src/lib/aquarium-poetry-colors";
import {
  RELAX_BREATH_RING_PARTICLE_COUNT,
  relaxBreathRingParticleJitterDeg,
  relaxBreathRingParticleSizePx,
} from "@/src/lib/relax-breath-ring-layout";

export type RelaxBreathRingProps = {
  isNight: boolean;
};

const BASE_STEP = 360 / RELAX_BREATH_RING_PARTICLE_COUNT;

/**
 * Static radial “bubble” dots; expansion/contraction comes from the parent transform (rAF).
 */
export default function RelaxBreathRing({ isNight }: RelaxBreathRingProps) {
  const theme: AquariumPoetryTheme = isNight ? "night" : "day";
  const bubble = relaxBreathRingParticleAppearance(theme);

  return (
    <>
      {Array.from({ length: RELAX_BREATH_RING_PARTICLE_COUNT }, (_, i) => {
        const angle = i * BASE_STEP + relaxBreathRingParticleJitterDeg(i);
        const size = relaxBreathRingParticleSizePx(i);
        const radius = "min(26.5vw, 6.625rem)";
        return (
          <span
            key={i}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: bubble.backgroundColor,
              boxShadow: bubble.boxShadow,
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * ${radius}))`,
            }}
            aria-hidden
          />
        );
      })}
    </>
  );
}
