"use client";

export type AmbientAudioToggleProps = {
  isNight: boolean;
  isEnabled: boolean;
  onToggle: () => void;
};

function VolumeOnIcon({ className }: { className?: string }) {
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
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VolumeOffIcon({ className }: { className?: string }) {
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
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

export default function AmbientAudioToggle({
  isNight,
  isEnabled,
  onToggle,
}: AmbientAudioToggleProps) {
  const shell = isNight
    ? "rounded-xl border border-white/[0.09] bg-slate-950/[0.16] shadow-[0_8px_22px_-14px_rgba(0,0,0,0.48)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-slate-950/[0.1]"
    : "rounded-xl border border-slate-900/8 bg-white/40 shadow-[0_8px_22px_-14px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/8 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/28";
  const iconBtn = isNight
    ? "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/[0.88] transition-[color,background-color,transform] duration-200 ease-out hover:bg-white/[0.09] active:scale-[0.97] active:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/80"
    : "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-950 transition-[color,background-color,transform] duration-200 ease-out hover:bg-white/90 active:scale-[0.97] active:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500/60";

  return (
    <div className="pointer-events-auto w-max">
      <div className={`${shell} p-1`}>
        <button
          type="button"
          className={iconBtn}
          onClick={onToggle}
          aria-pressed={isEnabled}
          aria-label={
            isEnabled ? "Disable ambient audio" : "Enable ambient audio"
          }
        >
          {isEnabled ? (
            <VolumeOnIcon className="h-4.5 w-4.5" />
          ) : (
            <VolumeOffIcon className="h-4.5 w-4.5" />
          )}
        </button>
      </div>
    </div>
  );
}
