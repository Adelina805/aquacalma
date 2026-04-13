"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useFocusTimer, type UseFocusTimerResult } from "@/src/hooks/use-focus-timer";

const FocusTimerContext = createContext<UseFocusTimerResult | null>(null);

export function FocusTimerProvider({ children }: { children: ReactNode }) {
  const api = useFocusTimer();
  return (
    <FocusTimerContext.Provider value={api}>
      {children}
    </FocusTimerContext.Provider>
  );
}

export function useFocusTimerContext(): UseFocusTimerResult {
  const ctx = useContext(FocusTimerContext);
  if (!ctx) {
    throw new Error("useFocusTimerContext must be used within FocusTimerProvider");
  }
  return ctx;
}
