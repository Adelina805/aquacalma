"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const FOCUS_PRESET_MINUTES = [50, 30, 25, 15, 10, 5] as const;

export type FocusPresetMinutes = (typeof FOCUS_PRESET_MINUTES)[number];

export type FocusTimerStatus = "idle" | "running" | "paused" | "complete";

export type UseFocusTimerResult = {
  presetMinutes: FocusPresetMinutes;
  setPresetMinutes: (m: FocusPresetMinutes) => void;
  status: FocusTimerStatus;
  remainingMs: number;
  presetsLocked: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

const DEFAULT_PRESET: FocusPresetMinutes = 25;

/**
 * Single-session countdown using a performance.now() deadline while running
 * so display stays accurate across background tabs and avoids interval drift.
 */
export function useFocusTimer(): UseFocusTimerResult {
  const [presetMinutes, setPresetMinutesState] =
    useState<FocusPresetMinutes>(DEFAULT_PRESET);
  const [status, setStatus] = useState<FocusTimerStatus>("idle");
  const [remainingMs, setRemainingMs] = useState(
    () => DEFAULT_PRESET * 60_000,
  );

  const deadlinePerfRef = useRef<number | null>(null);

  const presetsLocked = status === "running" || status === "paused";

  useEffect(() => {
    if (status !== "running" || deadlinePerfRef.current === null) return;

    let frame = 0;

    const tick = () => {
      const end = deadlinePerfRef.current;
      if (end === null) return;
      const left = Math.max(0, end - performance.now());
      setRemainingMs(left);
      if (left <= 0) {
        deadlinePerfRef.current = null;
        setStatus("complete");
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status]);

  const setPresetMinutes = useCallback(
    (m: FocusPresetMinutes) => {
      if (status === "running" || status === "paused") return;
      setPresetMinutesState(m);
      setRemainingMs(m * 60_000);
      if (status === "complete") setStatus("idle");
    },
    [status],
  );

  const start = useCallback(() => {
    if (status !== "idle" && status !== "complete") return;
    const ms = presetMinutes * 60_000;
    deadlinePerfRef.current = performance.now() + ms;
    setRemainingMs(ms);
    setStatus("running");
  }, [status, presetMinutes]);

  const pause = useCallback(() => {
    if (status !== "running" || deadlinePerfRef.current === null) return;
    setRemainingMs(Math.max(0, deadlinePerfRef.current - performance.now()));
    deadlinePerfRef.current = null;
    setStatus("paused");
  }, [status]);

  const resume = useCallback(() => {
    if (status !== "paused") return;
    deadlinePerfRef.current = performance.now() + remainingMs;
    setStatus("running");
  }, [status, remainingMs]);

  const reset = useCallback(() => {
    deadlinePerfRef.current = null;
    setStatus("idle");
    setRemainingMs(presetMinutes * 60_000);
  }, [presetMinutes]);

  return {
    presetMinutes,
    setPresetMinutes,
    status,
    remainingMs,
    presetsLocked,
    start,
    pause,
    resume,
    reset,
  };
}

/** Ceil to whole seconds so the last second still reads 0:01 until the run ends. */
export function formatFocusCountdown(ms: number): string {
  if (ms <= 0) return "00:00";
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
