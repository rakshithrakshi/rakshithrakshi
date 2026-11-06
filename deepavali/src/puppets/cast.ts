import type { Look } from "./Figure";

// Dyed-leather palette: saturated but translucent, as they'll be multiplied
// onto the glowing screen.
export const NARAKA: Look = {
  skin: "#3d5a2c",
  garment: "#b3241a",
  garmentDark: "#6e120c",
  accent: "#e0a12a",
  crown: "horned",
  face: "demon",
  weapon: "sword",
};

export const KRISHNA: Look = {
  skin: "#3f74d6",
  garment: "#f2c12e",
  garmentDark: "#c98a12",
  accent: "#e8a92a",
  crown: "feather",
  face: "hero",
  weapon: "chakra",
};

export const SATYABHAMA: Look = {
  skin: "#e8a477",
  garment: "#d4302a",
  garmentDark: "#8f1a1a",
  accent: "#efb43a",
  crown: "tiara",
  face: "female",
  weapon: "bow",
  female: true,
};

export const INDRA: Look = {
  skin: "#f0c27a",
  garment: "#ffffff",
  garmentDark: "#c9b98a",
  accent: "#e8a92a",
  crown: "indra",
  face: "hero",
  weapon: "vajra",
};

export const DEVA: Look = {
  skin: "#f0c27a",
  garment: "#e8d7a0",
  garmentDark: "#b8a060",
  accent: "#e0a12a",
  crown: "kirita",
  face: "hero",
  weapon: "none",
};

export const PRINCESS: Look = {
  skin: "#e8a477",
  garment: "#8a4fc8",
  garmentDark: "#5a2e8a",
  accent: "#efb43a",
  crown: "none",
  face: "female",
  weapon: "none",
  female: true,
};

export const CHILD: Look = {
  skin: "#c98a5a",
  garment: "#2f9a6a",
  garmentDark: "#1c6a48",
  accent: "#efb43a",
  crown: "none",
  face: "child",
  weapon: "diya",
};
