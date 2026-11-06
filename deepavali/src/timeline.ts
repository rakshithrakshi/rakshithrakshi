// Single source of truth for timing. scripts/make-audio.py mirrors the scene
// starts and cue frames, so change both together.
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const SCENES = {
  title: 180, // 0:00 ದೀಪಾವಳಿ title
  demon: 340, // 0:06 Narakasura's fortress
  darkness: 370, // 0:17 the world falls into darkness
  call: 300, // 0:30 Indra calls Krishna, Garuda flight
  battle: 485, // 0:40 the battle
  wish: 300, // 0:56 Naraka's last wish
  light: 365, // 1:06 light returns
  message: 345, // 1:18 ತಮಸೋ ಮಾ ಜ್ಯೋತಿರ್ಗಮಯ
  // Scene lengths are fitted to the recorded voice-over in public/vo.
} as const;

const order = Object.keys(SCENES) as (keyof typeof SCENES)[];
export const START = Object.fromEntries(
  order.map((k, i) => [k, order.slice(0, i).reduce((s, key) => s + SCENES[key], 0)]),
) as Record<keyof typeof SCENES, number>;
export const TOTAL = order.reduce((s, k) => s + SCENES[k], 0); // 2685 ≈ 89.5s

// Voice-over lines. Drop ElevenLabs exports into public/vo as 01.mp3 … 12.mp3
// and they play at `at`. Subtitles show from `at` to `to` (absolute frames).
export type Line = { n: number; who: string; at: number; to: number; text: string; subtitle?: boolean };
export const LINES: Line[] = [
  { n: 1, who: "ನಿರೂಪಕ", at: START.demon + 8, to: START.demon + 324, text: "ಬಹಳ ಹಿಂದೆ… ಪ್ರಾಗ್ಜ್ಯೋತಿಷಪುರದಲ್ಲಿ, ನರಕಾಸುರ ಎಂಬ ಅಹಂಕಾರಿ ರಾಕ್ಷಸ ರಾಜನಿದ್ದನು. ಬ್ರಹ್ಮನ ವರದಿಂದ, ಅವನು ಮಹಾಬಲಿಷ್ಠನಾಗಿದ್ದನು." },
  { n: 2, who: "ನಿರೂಪಕ", at: START.darkness + 12, to: START.darkness + 356, text: "ಅವನು ದೇವತೆಗಳನ್ನು ಸೋಲಿಸಿದನು. ಅದಿತಿ ದೇವಿಯ ಕುಂಡಲಗಳನ್ನು ಕದ್ದನು. ಹದಿನಾರು ಸಾವಿರ ರಾಜಕುಮಾರಿಯರನ್ನು ಸೆರೆಯಲ್ಲಿಟ್ಟನು. ಲೋಕವೆಲ್ಲ… ಕತ್ತಲಲ್ಲಿ ಮುಳುಗಿತು." },
  { n: 3, who: "ಇಂದ್ರ", at: START.call + 28, to: START.call + 106, text: "ಕೃಷ್ಣಾ… ಲೋಕವನ್ನು ಕಾಪಾಡು!" },
  { n: 4, who: "ಸತ್ಯಭಾಮೆ", at: START.call + 132, to: START.call + 241, text: "ಸ್ವಾಮಿ, ಈ ಯುದ್ಧಕ್ಕೆ ನಾನೂ ನಿಮ್ಮೊಂದಿಗೆ ಬರುತ್ತೇನೆ." },
  { n: 5, who: "ನಿರೂಪಕ", at: START.battle + 5, to: START.battle + 196, text: "ಯುದ್ಧದಲ್ಲಿ, ನರಕಾಸುರನ ಬಾಣ ಕೃಷ್ಣನಿಗೆ ತಾಗಿತು. ಆಗ… ಸತ್ಯಭಾಮೆ ಬಿಲ್ಲು ಎತ್ತಿದಳು!" },
  { n: 6, who: "ಸತ್ಯಭಾಮೆ", at: START.battle + 202, to: START.battle + 278, text: "ಅಧರ್ಮಕ್ಕೆ… ಇಂದು ಅಂತ್ಯ!" },
  { n: 7, who: "ನಿರೂಪಕ", at: START.battle + 318, to: START.battle + 472, text: "ಭೂದೇವಿಯ ಅವತಾರವಾದ ಸತ್ಯಭಾಮೆಯ ಬಾಣಕ್ಕೆ, ನರಕಾಸುರ ಕೆಳಗುರುಳಿದನು." },
  { n: 8, who: "ನರಕಾಸುರ", at: START.wish + 22, to: START.wish + 205, text: "ತಾಯಿ… ನನ್ನನ್ನು ಕ್ಷಮಿಸು. ನನ್ನ ಅಂತ್ಯದ ದಿನವನ್ನು, ಜನರು ದೀಪ ಹಚ್ಚಿ ಸಂಭ್ರಮಿಸಲಿ." },
  { n: 9, who: "ಕೃಷ್ಣ", at: START.wish + 225, to: START.wish + 290, text: "ತಥಾಸ್ತು." },
  { n: 10, who: "ನಿರೂಪಕ", at: START.light + 8, to: START.light + 352, text: "ಸೆರೆಯಲ್ಲಿದ್ದವರು ಬಿಡುಗಡೆಯಾದರು. ಕತ್ತಲೆ ಕರಗಿ… ಬೆಳಕು ಮೂಡಿತು. ಅಂದಿನಿಂದ, ನರಕ ಚತುರ್ದಶಿಯಂದು ನಾವು ಎಣ್ಣೆ ಸ್ನಾನ ಮಾಡಿ, ಮನೆಮನೆಯಲ್ಲಿ ದೀಪ ಹಚ್ಚುತ್ತೇವೆ." },
  { n: 11, who: "ನಿರೂಪಕ", at: START.message + 12, to: START.message + 211, text: "ತಮಸೋ ಮಾ ಜ್ಯೋತಿರ್ಗಮಯ… ಕತ್ತಲಿನಿಂದ ಬೆಳಕಿನೆಡೆಗೆ… ಅಹಂಕಾರದಿಂದ ಧರ್ಮದೆಡೆಗೆ.", subtitle: false },
  { n: 12, who: "ನಿರೂಪಕ", at: START.message + 218, to: START.message + 326, text: "ನಿಮ್ಮೆಲ್ಲರಿಗೂ, ದೀಪಾವಳಿಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು!", subtitle: false },
];
