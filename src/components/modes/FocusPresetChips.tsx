import { FOCUS_PRESET_MINUTES } from "@/src/hooks/use-focus-timer";
import { modeHudPresetChip } from "@/src/components/modes/mode-ui-tokens";
import { useUiSound } from "@/src/hooks/use-ui-sound";
import {
  useFocusTimerActions,
  useFocusTimerMode,
} from "@/src/state/focus-timer-context";

export type FocusPresetChipsProps = {
  isNight: boolean;
};

export default function FocusPresetChips({ isNight }: FocusPresetChipsProps) {
  const { presetMinutes } = useFocusTimerMode();
  const { setPresetMinutes } = useFocusTimerActions();
  const { playUiSound } = useUiSound();

  return (
    <div
      className="flex flex-wrap items-center gap-1"
      role="group"
      aria-label="Minutes"
    >
      {FOCUS_PRESET_MINUTES.map((m) => (
        <button
          key={m}
          type="button"
          className={modeHudPresetChip(isNight, m === presetMinutes)}
          onClick={() => {
            if (m === presetMinutes) return;
            playUiSound();
            setPresetMinutes(m);
          }}
          aria-label={`${m} minutes`}
          aria-pressed={m === presetMinutes}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
