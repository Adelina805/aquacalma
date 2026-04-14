import type { FocusTimerStatus } from "@/src/hooks/use-focus-timer";
import { modeHudTransportIconBtn } from "@/src/components/modes/mode-ui-tokens";
import { PauseIcon, PlayIcon } from "@/src/components/modes/focus-timer-icons";
import { useFocusTimerActions, useFocusTimerMode } from "@/src/state/focus-timer-context";

export type FocusTimerTransportProps = {
  isNight: boolean;
};

const iconClass = "h-2 w-2";

function FocusTimerTransportIdle({ isNight }: FocusTimerTransportProps) {
  const { start } = useFocusTimerActions();

  return (
    <div
      className="flex shrink-0 items-center gap-0.5"
      role="group"
      aria-label="Timer"
    >
      <button
        type="button"
        className={modeHudTransportIconBtn(isNight)}
        onClick={start}
        aria-label="Start"
      >
        <PlayIcon className={`${iconClass} ml-px`} />
      </button>
    </div>
  );
}

function FocusTimerTransportActive({
  isNight,
  status,
}: FocusTimerTransportProps & { status: Exclude<FocusTimerStatus, "idle"> }) {
  const { pause, resume, start } = useFocusTimerActions();

  return (
    <div
      className="flex shrink-0 items-center gap-0.5"
      role="group"
      aria-label="Timer"
    >
      {status === "running" ? (
        <button
          type="button"
          className={modeHudTransportIconBtn(isNight)}
          onClick={pause}
          aria-label="Pause"
        >
          <PauseIcon className={iconClass} />
        </button>
      ) : null}
      {status === "paused" ? (
        <button
          type="button"
          className={modeHudTransportIconBtn(isNight)}
          onClick={resume}
          aria-label="Resume"
        >
          <PlayIcon className={`${iconClass} ml-px`} />
        </button>
      ) : null}
      {status === "complete" ? (
        <button
          type="button"
          className={modeHudTransportIconBtn(isNight)}
          onClick={start}
          aria-label="Start"
        >
          <PlayIcon className={`${iconClass} ml-px`} />
        </button>
      ) : null}
    </div>
  );
}

export default function FocusTimerTransport({ isNight }: FocusTimerTransportProps) {
  const { status } = useFocusTimerMode();

  if (status === "idle") {
    return <FocusTimerTransportIdle isNight={isNight} />;
  }

  return <FocusTimerTransportActive isNight={isNight} status={status} />;
}
