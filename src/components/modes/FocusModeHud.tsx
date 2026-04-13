"use client";

import { FOCUS_PRESET_MINUTES, formatFocusCountdown } from "@/src/hooks/use-focus-timer";
import { useFocusTimerContext } from "@/src/state/focus-timer-context";
import {
  modeHudIconBtn,
  modeHudMicroPill,
  modeHudMutedText,
  modeHudPresetBtn,
} from "@/src/components/modes/mode-ui-tokens";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="4" height="16" x="6" y="4" rx="1" />
      <rect width="4" height="16" x="14" y="4" rx="1" />
    </svg>
  );
}

function RotateCcwIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export type FocusModeHudProps = {
  isNight: boolean;
};

export default function FocusModeHud({ isNight }: FocusModeHudProps) {
  const {
    presetMinutes,
    setPresetMinutes,
    status,
    remainingMs,
    presetsLocked,
    start,
    pause,
    resume,
    reset,
  } = useFocusTimerContext();

  const display = formatFocusCountdown(remainingMs);
  const subtle = modeHudMutedText(isNight);

  return (
    <div
      className="flex w-full max-w-[min(100vw-2rem,24rem)] flex-col items-center gap-2 sm:max-w-none"
      aria-label="Focus timer"
    >
      <p
        className={
          isNight
            ? "m-0 text-5xl font-light tabular-nums tracking-tight text-white/95 sm:text-6xl"
            : "m-0 text-5xl font-light tabular-nums tracking-tight text-slate-950 sm:text-6xl"
        }
        aria-live="polite"
        aria-atomic
      >
        {display}
      </p>

      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-1"
          role="group"
          aria-label="Timer controls"
        >
          {status === "running" ? (
            <button
              type="button"
              className={modeHudIconBtn(isNight)}
              onClick={pause}
              aria-label="Pause timer"
            >
              <PauseIcon className="h-2.5 w-2.5" />
            </button>
          ) : null}
          {status === "paused" ? (
            <button
              type="button"
              className={modeHudIconBtn(isNight)}
              onClick={resume}
              aria-label="Resume timer"
            >
              <PlayIcon className="ml-px h-2.5 w-2.5" />
            </button>
          ) : null}
          {status === "idle" || status === "complete" ? (
            <button
              type="button"
              className={modeHudIconBtn(isNight)}
              onClick={start}
              aria-label="Start timer"
            >
              <PlayIcon className="ml-px h-2.5 w-2.5" />
            </button>
          ) : null}

          <p
            className={`m-0 text-[0.65rem] font-medium uppercase tracking-[0.22em] ${subtle}`}
          >
            {presetMinutes} min
          </p>

          <button
            type="button"
            className={modeHudIconBtn(isNight)}
            onClick={reset}
            disabled={
              status === "idle" &&
              Math.abs(remainingMs - presetMinutes * 60_000) < 1
            }
            aria-label="Reset timer to selected duration"
          >
            <RotateCcwIcon className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-1"
        role="group"
        aria-label="Duration presets in minutes"
      >
        {FOCUS_PRESET_MINUTES.map((m) => (
          <button
            key={m}
            type="button"
            className={modeHudPresetBtn(isNight, m === presetMinutes)}
            disabled={presetsLocked}
            onClick={() => setPresetMinutes(m)}
            aria-label={`${m} minutes`}
            aria-pressed={m === presetMinutes}
          >
            {m}
          </button>
        ))}
      </div>

      {status === "complete" ? (
        <span className={`${modeHudMicroPill(isNight)} text-[0.65rem]`}>
          Complete
        </span>
      ) : null}
    </div>
  );
}
