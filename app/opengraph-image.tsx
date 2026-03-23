import { createAquariumShareImageResponse } from "@/src/lib/aquarium-share-image";

export const alt =
  "Virtual Fishtank — a calm, browser-born aquarium with soft underwater light and gentle motion.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createAquariumShareImageResponse();
}
