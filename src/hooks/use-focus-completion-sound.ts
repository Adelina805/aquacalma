"use client";

import { useEffect, useRef } from "react";
import { useFocusTimerMode } from "@/src/state/focus-timer-context";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousStatusRef = useRef(status);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = false;
    audio.preload = "auto";
    audio.volume = Math.min(Math.max(volume, 0), 1);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    const previousStatus = previousStatusRef.current;
    previousStatusRef.current = status;

    if (!audio) return;
    if (status !== "complete" || previousStatus === "complete") return;

    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, [status]);
}
