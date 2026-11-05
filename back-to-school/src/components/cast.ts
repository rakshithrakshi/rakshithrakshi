import type { PersonProps } from "./Person";

type Look = Omit<PersonProps, "id" | "armL" | "armR" | "legSwing" | "blink" | "headTilt">;

export const TEACHERS: Record<"maya" | "arjun" | "grace", Look> = {
  maya: {
    skin: "#e8b48f",
    hair: "#3a2318",
    hairStyle: "bob",
    top: "#f4b73a",
    topShade: "#d9902a",
    bottom: "#2f3b66",
    skirt: true,
    lanyard: "#e9573f",
    smile: 0.9,
  },
  arjun: {
    skin: "#a8714f",
    hair: "#1f1612",
    hairStyle: "short",
    top: "#7fb3e8",
    topShade: "#5a8fcc",
    bottom: "#3b3a4a",
    glasses: true,
    lanyard: "#3fb6a8",
    smile: 1,
  },
  grace: {
    skin: "#f0c9a8",
    hair: "#d9d4ce",
    hairStyle: "bun",
    top: "#3fb6a8",
    topShade: "#2b8f84",
    bottom: "#5b3f6b",
    skirt: true,
    glasses: true,
    smile: 0.8,
  },
};

export const KIDS: Look[] = [
  { skin: "#c68b63", hair: "#2a1a12", hairStyle: "pigtails", top: "#f28fb5", topShade: "#d96a95", bottom: "#3a4a8a", skirt: true, backpack: "#5b8def", smile: 1 },
  { skin: "#f1c7a3", hair: "#c9772e", hairStyle: "short", top: "#5b8def", topShade: "#3f6cc9", bottom: "#2f3b4a", backpack: "#e9573f", smile: 1 },
  { skin: "#8d5a3b", hair: "#1a110c", hairStyle: "curly", top: "#f4b73a", topShade: "#d9902a", bottom: "#3b3a4a", backpack: "#3fb6a8", smile: 1 },
  { skin: "#e5ae86", hair: "#4a2c1c", hairStyle: "ponytail", top: "#8e6cf0", topShade: "#6d4dd1", bottom: "#2f3b66", backpack: "#f4b73a", smile: 1 },
];
