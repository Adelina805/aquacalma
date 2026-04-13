"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  APP_MODE_STORAGE_KEY,
  DEFAULT_APP_MODE,
  isAppMode,
  type AppMode,
} from "@/src/lib/app-mode";

export type AppModeContextValue = {
  mode: AppMode;
  setMode: (next: AppMode) => void;
};

const AppModeContext = createContext<AppModeContextValue | null>(null);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(DEFAULT_APP_MODE);

  useEffect(() => {
    const raw = window.localStorage.getItem(APP_MODE_STORAGE_KEY);
    if (isAppMode(raw)) {
      // Intentional post-hydration read: initial render matches SSR; then align with saved mode.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only exists after mount
      setModeState(raw);
    }
  }, []);

  const setMode = useCallback((next: AppMode) => {
    setModeState(next);
    window.localStorage.setItem(APP_MODE_STORAGE_KEY, next);
  }, []);

  const value = useMemo<AppModeContextValue>(
    () => ({ mode, setMode }),
    [mode, setMode],
  );

  return (
    <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
  );
}

export function useAppMode(): AppModeContextValue {
  const ctx = useContext(AppModeContext);
  if (!ctx) {
    throw new Error("useAppMode must be used within AppModeProvider");
  }
  return ctx;
}
