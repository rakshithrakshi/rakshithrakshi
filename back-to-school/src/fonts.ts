import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (Fraunces, Outfit, Caveat — all SIL OFL)
// so rendering never depends on reaching Google Fonts.
const faces: [string, string, string, "normal" | "italic"][] = [
  ["Fraunces", "fraunces-600.woff2", "600", "normal"],
  ["Fraunces", "fraunces-700.woff2", "700", "normal"],
  ["Fraunces", "fraunces-900.woff2", "900", "normal"],
  ["Fraunces", "fraunces-600i.woff2", "600", "italic"],
  ["Fraunces", "fraunces-700i.woff2", "700", "italic"],
  ["Outfit", "outfit-400.woff2", "400", "normal"],
  ["Outfit", "outfit-500.woff2", "500", "normal"],
  ["Caveat", "caveat-700.woff2", "700", "normal"],
];

for (const [family, file, weight, style] of faces) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, style });
}

export const serif = "Fraunces";
export const sans = "Outfit";
export const hand = "Caveat";
