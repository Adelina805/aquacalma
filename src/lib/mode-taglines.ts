import type { AppMode } from "@/src/lib/app-mode";

/** Single caption under the Aquacalma title — keyed by experience mode. */
export const MODE_TAGLINES: Record<AppMode, string> = {
  relax: "a space to rest, breathe, and be",
  focus: "a space where presence brings life",
  play: "a living space that responds to you",
};