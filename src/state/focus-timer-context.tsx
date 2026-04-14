"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  useFocusTimer,
  type FocusPresetMinutes,
  type FocusTimerStatus,
} from "@/src/hooks/use-focus-timer";

export type FocusTimerMode = {
  presetMinutes: FocusPresetMinutes;
  status: FocusTimerStatus;
};

export type FocusTimerActions = {
  setPresetMinutes: (m: FocusPresetMinutes) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

const RemainingContext = createContext<number | null>(null);
const ModeContext = createContext<FocusTimerMode | null>(null);
const ActionsContext = createContext<FocusTimerActions | null>(null);

export function FocusTimerProvider({ children }: { children: ReactNode }) {
  const timer = useFocusTimer();

  const mode = useMemo(
    (): FocusTimerMode => ({
      presetMinutes: timer.presetMinutes,
      status: timer.status,
    }),
    [timer.presetMinutes, timer.status],
  );

  const actions = useMemo(
    (): FocusTimerActions => ({
      setPresetMinutes: timer.setPresetMinutes,
      start: timer.start,
      pause: timer.pause,
      resume: timer.resume,
      reset: timer.reset,
    }),
    [
      timer.setPresetMinutes,
      timer.start,
      timer.pause,
      timer.resume,
      timer.reset,
    ],
  );

  return (
    <ActionsContext.Provider value={actions}>
      <ModeContext.Provider value={mode}>
        <RemainingContext.Provider value={timer.remainingMs}>
          {children}
        </RemainingContext.Provider>
      </ModeContext.Provider>
    </ActionsContext.Provider>
  );
}

export function useFocusTimerRemaining(): number {
  const v = useContext(RemainingContext);
  if (v === null) {
    throw new Error("useFocusTimerRemaining must be used within FocusTimerProvider");
  }
  return v;
}

export function useFocusTimerMode(): FocusTimerMode {
  const v = useContext(ModeContext);
  if (!v) {
    throw new Error("useFocusTimerMode must be used within FocusTimerProvider");
  }
  return v;
}

export function useFocusTimerActions(): FocusTimerActions {
  const v = useContext(ActionsContext);
  if (!v) {
    throw new Error("useFocusTimerActions must be used within FocusTimerProvider");
  }
  return v;
}
