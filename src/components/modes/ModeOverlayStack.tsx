"use client";

import { useAppMode } from "@/src/state/app-mode-context";
import FocusModePanel from "@/src/components/modes/FocusModePanel";
import PlayModePanel from "@/src/components/modes/PlayModePanel";
import RelaxModePanel from "@/src/components/modes/RelaxModePanel";

export type ModeOverlayStackProps = {
  isNight: boolean;
};

/**
 * Renders the active mode’s placeholder panel. Non-interactive so the canvas keeps
 * receiving pointer events except where future controls opt in.
 */
export default function ModeOverlayStack({ isNight }: ModeOverlayStackProps) {
  const { mode } = useAppMode();

  switch (mode) {
    case "relax":
      return <RelaxModePanel isNight={isNight} />;
    case "focus":
      return <FocusModePanel isNight={isNight} />;
    case "play":
      return <PlayModePanel isNight={isNight} />;
  }
}
