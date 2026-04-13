"use client";

import type { ReactNode } from "react";
import ModeToggle from "@/src/components/mode/ModeToggle";
import ModeOverlayStack from "@/src/components/modes/ModeOverlayStack";

export type AppShellProps = {
  isNight: boolean;
  sceneVisible: boolean;
  controlsVisible: boolean;
  /** Simulation + LCP layer (absolute inset-0). */
  tankLayer: ReactNode;
  /** Top-right aquarium controls (fish, feed, day/night). */
  aquariumControls: ReactNode;
};

/**
 * Composes the full-screen experience: tank (z-0), mode overlay stub (z-15),
 * chrome and controls above. Keeps feature areas separate for per-mode growth.
 */
export default function AppShell({
  isNight,
  sceneVisible,
  controlsVisible,
  tankLayer,
  aquariumControls,
}: AppShellProps) {
  const rootBg = isNight
    ? "relative h-dvh w-full overflow-hidden bg-slate-950"
    : "relative h-dvh w-full overflow-hidden bg-linear-to-b from-sky-50/95 via-cyan-50/55 to-slate-100/90";

  return (
    <div className={rootBg}>
      <h1 className="sr-only">
        Aquacalma — a soothing, interactive aquarium with gentle motion and
        responsive life, a space to rest, return, and breathe. Comfortable on
        phones and desktops.
      </h1>

      {tankLayer}

      <div
        className={`pointer-events-none absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-30 w-full max-w-[min(100vw-1.5rem,28rem)] -translate-x-1/2 px-2 transition-[opacity,transform] duration-700 ease-out sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:max-w-none ${
          sceneVisible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
        }`}
      >
        <div className="pointer-events-auto mx-auto flex justify-center">
          <ModeToggle isNight={isNight} />
        </div>
      </div>

      <div
        className={`pointer-events-none absolute top-[max(0.75rem,env(safe-area-inset-top))] left-[max(0.75rem,env(safe-area-inset-left))] z-15 max-w-[min(100vw-1.5rem,20rem)] transition-[opacity,transform] duration-700 ease-out sm:top-[max(1rem,env(safe-area-inset-top))] sm:left-[max(1rem,env(safe-area-inset-left))] ${
          sceneVisible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        }`}
      >
        <ModeOverlayStack isNight={isNight} />
      </div>

      <a
        href="https://github.com/Adelina805/virtual-fishtank"
        target="_blank"
        rel="noopener noreferrer"
        className={`pointer-events-auto absolute left-[max(1.25rem,env(safe-area-inset-left))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-20 text-base leading-none no-underline transition-[opacity,color] duration-700 ease-out sm:left-[max(1.75rem,env(safe-area-inset-left))] sm:bottom-[max(1.75rem,env(safe-area-inset-bottom))] ${
          sceneVisible ? "opacity-100" : "opacity-0"
        } ${
          isNight
            ? "text-slate-400 hover:text-rose-500"
            : "text-slate-400 hover:text-rose-500"
        }`}
        aria-label="Aquacalma on GitHub"
      >
        <span aria-hidden className="select-none">
          &#9829;
        </span>
      </a>

      <aside
        className={`pointer-events-none absolute inset-e-[max(1.25rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] z-10 w-max max-w-[min(100vw-2rem,20rem)] transition-[opacity,transform] duration-700 ease-out sm:inset-e-[max(1.75rem,env(safe-area-inset-right))] sm:top-[max(1rem,env(safe-area-inset-top))] ${
          controlsVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-1.5 opacity-0"
        }`}
      >
        {aquariumControls}
      </aside>
    </div>
  );
}
