"use client";

import {
  RELAX_BREATH_PHASE_SEC,
  useRelaxBreathing,
} from "@/src/hooks/use-relax-breathing";
import {
  modeHudActionBtn,
  modeHudMutedText,
} from "@/src/components/modes/mode-ui-tokens";

export type RelaxBreathingHudProps = {
  isNight: boolean;
  visible: boolean;
};

export default function RelaxBreathingHud({
  isNight,
  visible,
}: RelaxBreathingHudProps) {
  const { active, setActive, secondsLeft, phaseLabel, discScale } =
    useRelaxBreathing(visible);

  if (!visible) return null;

  const subtle = modeHudMutedText(isNight);

  return (
    <div className="pointer-events-none flex w-full flex-col items-center px-2">
      {!active ? (
        <div className="pointer-events-auto">
          <button
            type="button"
            className={modeHudActionBtn(isNight)}
            onClick={() => setActive(true)}
            aria-label="Start guided breathing"
          >
            Breathe
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p
            className={`pointer-events-none m-0 text-center text-[0.65rem] font-medium uppercase tracking-[0.2em] ${subtle}`}
          >
            {phaseLabel}
          </p>
          <div
            className={
              isNight
                ? "pointer-events-none flex h-36 w-36 items-center justify-center rounded-full border border-white/[0.14] bg-sky-400/[0.08] shadow-[0_0_52px_-10px_rgba(125,211,252,0.38)]"
                : "pointer-events-none flex h-36 w-36 items-center justify-center rounded-full border border-sky-900/14 bg-sky-100/45 shadow-[0_0_44px_-12px_rgba(14,165,233,0.28)]"
            }
            style={{
              transform: `scale(${discScale})`,
              transition: `transform ${RELAX_BREATH_PHASE_SEC}s cubic-bezier(0.45, 0, 0.55, 1)`,
            }}
          >
            <span
              className={
                isNight
                  ? "text-3xl font-light tabular-nums text-white/92"
                  : "text-3xl font-light tabular-nums text-slate-900"
              }
              aria-live="polite"
            >
              {secondsLeft}
            </span>
          </div>
          <div className="pointer-events-auto pt-1">
            <button
              type="button"
              className={modeHudActionBtn(isNight)}
              onClick={() => setActive(false)}
              aria-label="Stop guided breathing"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
