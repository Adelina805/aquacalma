"use client";

import { FOCUS_PRESET_MINUTES, formatFocusCountdown } from "@/src/hooks/use-focus-timer";
import { useFocusTimerContext } from "@/src/state/focus-timer-context";
import {
  modeHudActionBtn,
  modeHudMicroPill,
  modeHudMutedText,
  modeHudPresetBtn,
} from "@/src/components/modes/mode-ui-tokens";

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
            ? "m-0 text-4xl font-light tabular-nums tracking-tight text-white/95 sm:text-5xl"
            : "m-0 text-4xl font-light tabular-nums tracking-tight text-slate-950 sm:text-5xl"
        }
        aria-live="polite"
        aria-atomic
      >
        {display}
      </p>

      <p className={`m-0 text-[0.65rem] font-medium uppercase tracking-[0.22em] ${subtle}`}>
        {presetMinutes} min
      </p>

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

      <div className="flex flex-wrap items-center justify-center gap-2">
        {status === "running" ? (
          <button
            type="button"
            className={modeHudActionBtn(isNight)}
            onClick={pause}
          >
            Pause
          </button>
        ) : null}
        {status === "paused" ? (
          <button
            type="button"
            className={modeHudActionBtn(isNight)}
            onClick={resume}
          >
            Resume
          </button>
        ) : null}
        {status === "idle" || status === "complete" ? (
          <button
            type="button"
            className={modeHudActionBtn(isNight)}
            onClick={start}
          >
            Start
          </button>
        ) : null}
        <button
          type="button"
          className={modeHudActionBtn(isNight)}
          onClick={reset}
          disabled={
            status === "idle" &&
            Math.abs(remainingMs - presetMinutes * 60_000) < 1
          }
          aria-label="Reset timer to selected duration"
        >
          Reset
        </button>
      </div>

      {status === "complete" ? (
        <span className={`${modeHudMicroPill(isNight)} text-[0.65rem]`}>
          Complete
        </span>
      ) : null}
    </div>
  );
}
