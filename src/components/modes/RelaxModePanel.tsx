"use client";

export type RelaxModePanelProps = {
  isNight: boolean;
};

/** Placeholder region for future Relax-only UI (breathing, ambient audio, etc.). */
export default function RelaxModePanel({ isNight }: RelaxModePanelProps) {
  const card = isNight
    ? "rounded-xl border border-white/[0.1] bg-slate-950/[0.28] text-white/80 backdrop-blur-xl"
    : "rounded-xl border border-slate-900/10 bg-white/65 text-slate-800 shadow-sm backdrop-blur-xl";

  return (
    <section
      className={`pointer-events-none max-w-sm px-3 py-2 text-sm leading-snug ${card}`}
      aria-label="Relax mode"
    >
      <h2 className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-current/90">
        Relax
      </h2>
      <p className="mt-1 mb-0 text-xs text-current/75">
        Calm defaults and gentle motion. More Relax tools will live here.
      </p>
    </section>
  );
}
