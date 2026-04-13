"use client";

export type PlayModePanelProps = {
  isNight: boolean;
};

/** Placeholder region for future Play-only UI (games, interactions beyond the tank). */
export default function PlayModePanel({ isNight }: PlayModePanelProps) {
  const card = isNight
    ? "rounded-xl border border-white/[0.1] bg-slate-950/[0.28] text-white/80 backdrop-blur-xl"
    : "rounded-xl border border-slate-900/10 bg-white/65 text-slate-800 shadow-sm backdrop-blur-xl";

  return (
    <section
      className={`pointer-events-none max-w-sm px-3 py-2 text-sm leading-snug ${card}`}
      aria-label="Play mode"
    >
      <h2 className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-current/90">
        Play
      </h2>
      <p className="mt-1 mb-0 text-xs text-current/75">
        Interactive layers and playful controls. Feed mode stays in the tank toolbar.
      </p>
    </section>
  );
}
