import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (Baloo Tamma 2, Noto Serif/Sans Kannada — SIL OFL)
// so rendering never depends on reaching Google Fonts.
const faces: [string, string, string][] = [
  ["Baloo Tamma 2", "baloo-800", "800"],
  ["Baloo Tamma 2", "baloo-600", "600"],
  ["Noto Serif Kannada", "notoserif-700", "700"],
  ["Noto Sans Kannada", "notosans-500", "500"],
];

// Each family ships as two subset files, so each needs its unicode range
const RANGES = {
  kannada: "U+0951-0952, U+0964-0965, U+0C80-0CF3, U+1CD0, U+1CD2-1CD3, U+1CDA, U+1CF2, U+1CF4, U+200C-200D, U+20B9, U+25CC, U+A830-A835",
  latin: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
};

for (const [family, file, weight] of faces) {
  for (const sub of ["kannada", "latin"] as const) {
    loadFont({ family, url: staticFile(`fonts/${file}-${sub}.woff2`), weight, unicodeRange: RANGES[sub] });
  }
}

export const display = "Baloo Tamma 2";
export const serif = "Noto Serif Kannada";
export const sans = "Noto Sans Kannada";
