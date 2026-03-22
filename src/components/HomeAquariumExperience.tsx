"use client";

import { Dancing_Script } from "next/font/google";
import { useState } from "react";
import AquariumCanvas, {
  DEFAULT_FISH_COUNT,
  MAX_FISH_COUNT,
} from "@/src/components/AquariumCanvas";
import FloatingControlPanel from "@/src/components/FloatingControlPanel";

const poemFont = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function HomeAquariumExperience() {
  const [isNight, setIsNight] = useState(true);
  const [fishCount, setFishCount] = useState(DEFAULT_FISH_COUNT);

  return (
    <div
      className={
        isNight
          ? `relative h-dvh w-full overflow-hidden bg-slate-950 ${poemFont.className}`
          : `relative h-dvh w-full overflow-hidden bg-linear-to-b from-sky-100 via-cyan-50/80 to-slate-200 ${poemFont.className}`
      }
    >
      <h1 className="sr-only">
        Virtual Fishtank — a soothing, interactive aquarium with calm motion
        and gentle taps, comfortable on phones and desktops.
      </h1>

      <div className="absolute inset-0 z-0 min-h-0">
        <AquariumCanvas
          ambience={isNight ? "night" : "day"}
          fishCount={fishCount}
          poemFontFamily={poemFont.style.fontFamily}
        />
      </div>

      <aside className="absolute bottom-5 right-5 z-10 sm:bottom-8 sm:right-8">
        <FloatingControlPanel
          isNight={isNight}
          onToggleDayNight={() => setIsNight((v) => !v)}
          fishCount={fishCount}
          defaultFishCount={DEFAULT_FISH_COUNT}
          maxFishCount={MAX_FISH_COUNT}
          onAddFish={() =>
            setFishCount((c) => Math.min(MAX_FISH_COUNT, c + 1))
          }
          onResetFish={() => setFishCount(DEFAULT_FISH_COUNT)}
        />
      </aside>
    </div>
  );
}
