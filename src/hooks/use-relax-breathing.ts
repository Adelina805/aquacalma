"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const RELAX_BREATH_PHASE_SEC = 4;

export type RelaxBreathPhase = "inhale" | "exhale";

export type UseRelaxBreathingResult = {
  active: boolean;
  setActive: (next: boolean) => void;
  phase: RelaxBreathPhase;
  /** Whole seconds left in the current phase (1 … RELAX_BREATH_PHASE_SEC). */
  secondsLeft: number;
  phaseLabel: string;
  /** Target visual scale for the breathing disc (inhale large, exhale small). */
  discScale: number;
};

/**
 * Alternating inhale / exhale phases with deadline-based timing (no interval drift).
 * When `sessionActive` is false (e.g. leaving Relax mode), the animation loop stops;
 * the user's on/off preference is kept for when they return.
 */
export function useRelaxBreathing(sessionActive: boolean): UseRelaxBreathingResult {
  const [active, setActiveState] = useState(false);
  const [phase, setPhase] = useState<RelaxBreathPhase>("inhale");
  const [secondsLeft, setSecondsLeft] = useState(RELAX_BREATH_PHASE_SEC);

  const phaseEndsAtRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  const setActive = useCallback((next: boolean) => {
    setActiveState(next);
    if (!next) {
      phaseEndsAtRef.current = null;
      setPhase("inhale");
      setSecondsLeft(RELAX_BREATH_PHASE_SEC);
    }
  }, []);

  useEffect(() => {
    if (!active || !sessionActive) return;

    const phaseMs = RELAX_BREATH_PHASE_SEC * 1000;
    const lastSecondRef = { current: RELAX_BREATH_PHASE_SEC };

    const tick = () => {
      let end = phaseEndsAtRef.current;
      if (end === null) return;

      const now = performance.now();

      let guard = 0;
      while (now >= end && guard++ < 64) {
        setPhase((p) => (p === "inhale" ? "exhale" : "inhale"));
        end += phaseMs;
        lastSecondRef.current = RELAX_BREATH_PHASE_SEC;
        setSecondsLeft(RELAX_BREATH_PHASE_SEC);
      }
      phaseEndsAtRef.current = end;

      const leftMs = end - now;
      const nextSec = Math.min(
        RELAX_BREATH_PHASE_SEC,
        Math.max(1, Math.ceil(leftMs / 1000)),
      );
      if (nextSec !== lastSecondRef.current) {
        lastSecondRef.current = nextSec;
        setSecondsLeft(nextSec);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // Defer state updates out of the effect body (react-hooks/set-state-in-effect).
    rafRef.current = requestAnimationFrame(() => {
      const now = performance.now();
      phaseEndsAtRef.current = now + phaseMs;
      setPhase("inhale");
      setSecondsLeft(RELAX_BREATH_PHASE_SEC);
      lastSecondRef.current = RELAX_BREATH_PHASE_SEC;
      rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, sessionActive]);

  const phaseLabel = phase === "inhale" ? "Inhale" : "Exhale";
  const discScale = phase === "inhale" ? 1.1 : 0.9;

  return {
    active,
    setActive,
    phase,
    secondsLeft,
    phaseLabel,
    discScale,
  };
}
