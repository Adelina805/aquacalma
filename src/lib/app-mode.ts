/**
 * Top-level experience mode — single source of truth for Relax / Focus / Play.
 * Values are lowercase literals for URLs, storage, and analytics consistency.
 */
export const APP_MODES = ["relax", "focus", "play"] as const;

export type AppMode = (typeof APP_MODES)[number];

export function isAppMode(value: unknown): value is AppMode {
  return typeof value === "string" && (APP_MODES as readonly string[]).includes(value);
}

export const DEFAULT_APP_MODE: AppMode = "relax";

export const APP_MODE_STORAGE_KEY = "aquacalma-app-mode";
