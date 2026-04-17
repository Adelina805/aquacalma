"use client";

import { useEffect, useRef } from "react";
import { useFocusTimerMode } from "@/src/state/focus-timer-context";
import { useFocusTimerRemaining } from "@/src/state/focus-timer-context";

const FOCUS_COMPLETE_SOUND_SRC = "/audio/focus-complete.mp3";
const DEFAULT_COMPLETION_VOLUME = 0.5;

export type UseFocusCompletionSoundOptions = {
  src?: string;
  volume?: number;
};

/**
 * Plays a short, gentle cue once when Focus timer enters "complete".
 */
export function useFocusCompletionSound({
  src = FOCUS_COMPLETE_SOUND_SRC,
  volume = DEFAULT_COMPLETION_VOLUME,
}: UseFocusCompletionSoundOptions = {}): void {
  const { status } = useFocusTimerMode();
  const remainingMs = useFocusTimerRemaining();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousStatusRef = useRef(status);
  const completionTimeoutRef = useRef<number | null>(null);
  const hasPlayedForRunRef = useRef(false);
  const lastScheduledRemainingRef = useRef<number | null>(null);
  const isPrimedRef = useRef(false);

  const clearCompletionTimeout = () => {
    if (completionTimeoutRef.current === null) return;
    window.clearTimeout(completionTimeoutRef.current);
    completionTimeoutRef.current = null;
  };

  const playCompletionSound = () => {
    const audio = audioRef.current;
    if (!audio || hasPlayedForRunRef.current) return;
    hasPlayedForRunRef.current = true;
    clearCompletionTimeout();
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  };

  const scheduleCompletionSound = (delayMs: number) => {
    clearCompletionTimeout();
    const normalizedDelayMs = Math.max(0, delayMs);
    lastScheduledRemainingRef.current = normalizedDelayMs;
    completionTimeoutRef.current = window.setTimeout(() => {
      playCompletionSound();
    }, normalizedDelayMs);
  };

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = false;
    audio.preload = "auto";
    audio.volume = Math.min(Math.max(volume, 0), 1);
    audioRef.current = audio;

    return () => {
      clearCompletionTimeout();
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const primeAudio = () => {
      if (isPrimedRef.current) return;
      isPrimedRef.current = true;
      audio.muted = true;
      audio.currentTime = 0;
      void audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      }).catch(() => {
        audio.muted = false;
      });
    };

    window.addEventListener("pointerdown", primeAudio, { once: true, capture: true });
    window.addEventListener("keydown", primeAudio, { once: true, capture: true });

    return () => {
      window.removeEventListener("pointerdown", primeAudio, true);
      window.removeEventListener("keydown", primeAudio, true);
    };
  }, []);

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    previousStatusRef.current = status;

    if (status === "running" && previousStatus !== "running") {
      hasPlayedForRunRef.current = false;
      scheduleCompletionSound(remainingMs);
      return;
    }

    if (status === "running" && previousStatus === "running") {
      const previousScheduled = lastScheduledRemainingRef.current;
      if (
        previousScheduled === null ||
        Math.abs(previousScheduled - remainingMs) > 1_500
      ) {
        scheduleCompletionSound(remainingMs);
      }
      return;
    }

    if (previousStatus === "running" && status === "complete") {
      playCompletionSound();
      return;
    }

    clearCompletionTimeout();
  }, [status, remainingMs]);
}
