"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUDIO_STORAGE_KEY = "aquacalma-ambient-audio-enabled";
const DEFAULT_VOLUME = 0.2;
const FADE_IN_MS = 400;
const INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
  "pointerdown",
  "keydown",
  "touchstart",
];

export type UseAmbientAudioOptions = {
  src: string;
  volume?: number;
  fadeInMs?: number;
  storageKey?: string;
};

export type AmbientAudioState = {
  isEnabled: boolean;
  setEnabled: (next: boolean) => void;
  toggleEnabled: () => void;
};

export function useAmbientAudio({
  src,
  volume = DEFAULT_VOLUME,
  fadeInMs = FADE_IN_MS,
  storageKey = AUDIO_STORAGE_KEY,
}: UseAmbientAudioOptions): AmbientAudioState {
  const [isEnabled, setIsEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const hasUserInteractedRef = useRef(false);

  const clearFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const playWithFade = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();
    const targetVolume = Math.min(Math.max(volume, 0), 1);
    if (fadeInMs <= 0) {
      audio.volume = targetVolume;
      void audio.play().catch(() => undefined);
      return;
    }

    audio.volume = 0;
    const startedAt = performance.now();
    const step = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / fadeInMs);
      audio.volume = targetVolume * progress;
      if (progress < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
      }
    };

    void audio.play().then(() => {
      fadeFrameRef.current = requestAnimationFrame(step);
    }).catch(() => undefined);
  }, [clearFade, fadeInMs, volume]);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = Math.min(Math.max(volume, 0), 1);
    audioRef.current = audio;

    return () => {
      clearFade();
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [clearFade, src, volume]);

  useEffect(() => {
    setIsEnabled(window.localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(isEnabled));
  }, [isEnabled, storageKey]);

  useEffect(() => {
    const onInteraction = () => {
      hasUserInteractedRef.current = true;
      if (isEnabled) {
        playWithFade();
      }
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, onInteraction);
      }
    };

    for (const eventName of INTERACTION_EVENTS) {
      window.addEventListener(eventName, onInteraction, { once: true });
    }

    return () => {
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, onInteraction);
      }
    };
  }, [isEnabled, playWithFade]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isEnabled) {
      clearFade();
      audio.pause();
      return;
    }

    if (hasUserInteractedRef.current) {
      playWithFade();
    }
  }, [clearFade, isEnabled, playWithFade]);

  const setEnabled = useCallback((next: boolean) => {
    setIsEnabled(next);
  }, []);

  const toggleEnabled = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  return {
    isEnabled,
    setEnabled,
    toggleEnabled,
  };
}
