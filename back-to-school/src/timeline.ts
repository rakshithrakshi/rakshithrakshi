// Single source of truth for timing. The audio script (scripts/make-audio.py)
// mirrors these numbers, so change both together.
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const S1 = 135; // Sunrise over the school
export const S2 = 165; // Teachers welcoming
export const S3 = 165; // Children running back
export const S4 = 180; // Finale title
export const T = 15; // transition length

export const TOTAL = S1 + S2 + S3 + S4 - 3 * T; // 600 frames = 20s

// Absolute start frame of each scene on the master timeline
export const START = {
  s1: 0,
  s2: S1 - T,
  s3: S1 + S2 - 2 * T,
  s4: S1 + S2 + S3 - 3 * T,
};

// Ease curves
export const EASE_IO = [0.65, 0, 0.35, 1] as const; // smooth ease-in-out
export const EASE_OUT = [0.16, 1, 0.3, 1] as const; // expo ease-out
