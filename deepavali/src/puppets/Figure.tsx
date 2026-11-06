import React from "react";

// A Togalu Gombe leather puppet, drawn facing right in a 400x800 box with the
// feet at y≈775. Colours are meant to be shown on a multiply-blended layer so
// they read as translucent dyed leather lit from behind; the pale "holes" are
// the punched perforations that let lamp light through.

export const INK = "#1b0c05";
export const HOLE = "#fff6dc";

export type Crown = "kirita" | "horned" | "feather" | "tiara" | "indra" | "none";
export type Face = "hero" | "demon" | "female" | "child";
export type Weapon = "sword" | "bow" | "chakra" | "vajra" | "diya" | "none";

export type Look = {
  skin: string;
  garment: string;
  garmentDark: string;
  accent: string;
  crown: Crown;
  face: Face;
  weapon: Weapon;
  female?: boolean;
};

export type Pose = {
  front?: [number, number]; // shoulder, elbow (deg; 0 = hanging down, + swings forward/up)
  back?: [number, number];
  headTilt?: number;
  bodyTilt?: number; // whole figure, around the feet
  stride?: number; // legs apart (deg)
  chakraSpin?: number;
  bowDraw?: number; // 0..1
  arrowGlow?: number; // 0..1
  sticks?: boolean;
};

const L1 = 118;
const L2 = 112;
const FRONT_SHOULDER: [number, number] = [244, 314];
const BACK_SHOULDER: [number, number] = [160, 314];

const holes = (pts: [number, number][], r = 3.2) =>
  pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill={HOLE} />);

const row = (x0: number, x1: number, y: number, step: number, curve = 0): [number, number][] => {
  const out: [number, number][] = [];
  for (let x = x0; x <= x1; x += step) {
    const t = (x - x0) / Math.max(1, x1 - x0);
    out.push([x, y + Math.sin(t * Math.PI) * curve]);
  }
  return out;
};

// Hand position in figure space, for the control stick
const handAt = (p: [number, number], a1: number, a2: number) => {
  const r1 = (a1 * Math.PI) / 180;
  const r2 = ((a1 + a2) * Math.PI) / 180;
  return [p[0] + L1 * Math.sin(r1) + (L2 + 12) * Math.sin(r2), p[1] + L1 * Math.cos(r1) + (L2 + 12) * Math.cos(r2)];
};

const WeaponArt: React.FC<{ look: Look; pose: Pose }> = ({ look, pose }) => {
  const y = L2 + 12;
  switch (look.weapon) {
    case "sword":
      return (
        <g>
          <path d={`M-7 ${y - 6} L7 ${y - 6} L5 ${y + 190} L0 ${y + 214} L-5 ${y + 190} Z`} fill="#d9d2c0" stroke={INK} strokeWidth={3} />
          <rect x={-22} y={y - 10} width={44} height={10} rx={4} fill={look.accent} stroke={INK} strokeWidth={3} />
          {holes(row(0, 0, y + 30, 40).concat([[0, y + 70], [0, y + 110], [0, y + 150]]), 2.4)}
        </g>
      );
    case "bow": {
      // Limbs lie across the forearm; the arrow points along it (local +y),
      // and drawing pulls the string back toward the body.
      const draw = pose.bowDraw ?? 0;
      const pull = y - 16 - draw * 80;
      const arc = `M-130 ${y + 6} Q0 ${y + 80} 130 ${y + 6}`;
      return (
        <g>
          <path d={arc} stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d={arc} stroke={look.accent} strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d={`M-130 ${y + 6} L0 ${pull} L130 ${y + 6}`} stroke={INK} strokeWidth={2.5} fill="none" />
          {draw > 0.02 && (
            <g>
              <line x1={0} y1={pull} x2={0} y2={y + 150} stroke={INK} strokeWidth={5} />
              <path d={`M-12 ${y + 150} L0 ${y + 178} L12 ${y + 150} Z`} fill={look.accent} stroke={INK} strokeWidth={3} />
            </g>
          )}
        </g>
      );
    }
    case "chakra": {
      const spin = pose.chakraSpin ?? 0;
      return (
        <g transform={`translate(0 ${y + 4}) rotate(${spin})`}>
          <circle r={40} fill={look.accent} stroke={INK} strokeWidth={4} />
          <circle r={16} fill={HOLE} stroke={INK} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M0 -40 L6 -54 L0 -50 L-6 -54 Z" fill={INK} transform={`rotate(${i * 30})`} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={Math.cos((i * Math.PI) / 4) * 28} cy={Math.sin((i * Math.PI) / 4) * 28} r={3.5} fill={HOLE} />
          ))}
        </g>
      );
    }
    case "vajra":
      return (
        <g transform={`translate(0 ${y})`}>
          <path d="M-8 -60 L8 -60 L5 60 L-5 60 Z" fill={look.accent} stroke={INK} strokeWidth={3} />
          <path d="M0 -60 Q-26 -80 -10 -110 M0 -60 Q26 -80 10 -110 M0 -60 L0 -118 M0 60 Q-26 80 -10 110 M0 60 Q26 80 10 110 M0 60 L0 118" stroke={INK} strokeWidth={6} fill="none" />
        </g>
      );
    case "diya":
      return (
        <g transform={`translate(0 ${y + 6})`}>
          <path d="M-34 0 Q0 30 34 0 L26 -6 L-26 -6 Z" fill="#a8562a" stroke={INK} strokeWidth={3} />
        </g>
      );
    default:
      return null;
  }
};

const Arm: React.FC<{ at: [number, number]; a: [number, number]; look: Look; pose: Pose; front: boolean }> = ({
  at,
  a,
  look,
  pose,
  front,
}) => (
  // SVG rotate is clockwise; our angles swing the arm forward (to +x), so negate.
  <g transform={`translate(${at[0]} ${at[1]}) rotate(${-a[0]})`} opacity={front ? 1 : 0.92}>
    <path d={`M-17 -10 Q-22 60 -12 ${L1} L12 ${L1} Q22 60 17 -10 Z`} fill={look.skin} stroke={INK} strokeWidth={4} />
    <rect x={-17} y={36} width={34} height={12} rx={5} fill={look.accent} stroke={INK} strokeWidth={3} />
    {holes([[0, 42]], 2.6)}
    <g transform={`translate(0 ${L1}) rotate(${-a[1]})`}>
      <circle r={13} fill={look.skin} stroke={INK} strokeWidth={4} />
      <path d={`M-12 0 L-9 ${L2} L9 ${L2} L12 0 Z`} fill={look.skin} stroke={INK} strokeWidth={4} />
      <rect x={-11} y={L2 - 22} width={22} height={7} rx={3} fill={look.accent} stroke={INK} strokeWidth={2} />
      <rect x={-11} y={L2 - 12} width={22} height={7} rx={3} fill={look.accent} stroke={INK} strokeWidth={2} />
      <ellipse cx={0} cy={L2 + 12} rx={14} ry={18} fill={look.skin} stroke={INK} strokeWidth={4} />
      {front && <WeaponArt look={look} pose={pose} />}
    </g>
  </g>
);

const CrownArt: React.FC<{ look: Look }> = ({ look }) => {
  const g = look.accent;
  switch (look.crown) {
    case "kirita":
    case "horned":
      return (
        <g>
          {look.crown === "horned" && (
            <>
              <path d="M176 142 Q132 112 146 52 Q160 104 190 126 Z" fill="#e8e0c8" stroke={INK} strokeWidth={4} />
              <path d="M232 142 Q276 112 264 52 Q250 104 220 126 Z" fill="#e8e0c8" stroke={INK} strokeWidth={4} />
            </>
          )}
          <path d="M166 162 L242 162 L236 120 L220 74 L204 26 L188 74 L172 120 Z" fill={look.crown === "horned" ? "#8a1d14" : g} stroke={INK} strokeWidth={4} />
          <rect x={160} y={150} width={88} height={18} rx={4} fill={g} stroke={INK} strokeWidth={4} />
          <path d="M162 160 L134 140 L156 174 Z" fill={g} stroke={INK} strokeWidth={3} />
          {holes([[204, 60], [196, 92], [212, 92], [188, 124], [204, 124], [220, 124], [176, 159], [192, 159], [208, 159], [224, 159], [240, 159]], 3.4)}
        </g>
      );
    case "feather":
      return (
        <g>
          {/* peacock feather leaning back */}
          <path d="M206 92 Q186 42 150 14" stroke={INK} strokeWidth={4} fill="none" />
          <g transform="rotate(-34 150 18)">
            <ellipse cx={150} cy={18} rx={26} ry={38} fill="#2f8f5a" stroke={INK} strokeWidth={3} />
            <ellipse cx={150} cy={22} rx={15} ry={22} fill="#2b5fc4" stroke={INK} strokeWidth={2} />
            <ellipse cx={150} cy={24} rx={7} ry={10} fill={g} />
            {holes([[150, -10], [136, 4], [164, 4]], 2.5)}
          </g>
          <path d="M168 162 L240 162 L232 122 L216 96 L204 80 L192 96 L176 122 Z" fill={g} stroke={INK} strokeWidth={4} />
          <rect x={162} y={150} width={84} height={16} rx={4} fill={g} stroke={INK} strokeWidth={4} />
          {holes([[204, 104], [192, 128], [216, 128], [180, 158], [204, 158], [228, 158]], 3.4)}
        </g>
      );
    case "tiara":
      return (
        <g>
          <circle cx={160} cy={196} r={26} fill={look.garmentDark} stroke={INK} strokeWidth={4} />
          {holes([[150, 186], [166, 182], [158, 204], [170, 200]], 4)}
          <path d="M172 160 L238 160 L230 132 L216 112 L205 100 L194 112 L180 132 Z" fill={g} stroke={INK} strokeWidth={4} />
          <rect x={168} y={150} width={74} height={14} rx={4} fill={g} stroke={INK} strokeWidth={3} />
          {holes([[205, 118], [194, 138], [216, 138], [184, 157], [204, 157], [224, 157]], 3)}
        </g>
      );
    case "indra":
      return (
        <g>
          {Array.from({ length: 11 }, (_, i) => {
            const a = (-150 + i * 12) * (Math.PI / 180);
            return <path key={i} d={`M204 170 L${204 + Math.cos(a) * 120} ${170 + Math.sin(a) * 120}`} stroke={g} strokeWidth={7} strokeLinecap="round" opacity={0.9} />;
          })}
          <path d="M164 162 L244 162 L238 116 L222 66 L204 16 L186 66 L170 116 Z" fill="#f6e7b8" stroke={INK} strokeWidth={4} />
          <rect x={158} y={150} width={92} height={18} rx={4} fill={g} stroke={INK} strokeWidth={4} />
          {holes([[204, 50], [196, 84], [212, 84], [186, 118], [204, 118], [222, 118]], 3.4)}
        </g>
      );
    default:
      return null;
  }
};

const Head: React.FC<{ look: Look; tilt: number }> = ({ look, tilt }) => {
  const { skin, face } = look;
  const demon = face === "demon";
  const female = face === "female";
  return (
    <g transform={`rotate(${tilt} 202 262)`}>
      {/* hair behind */}
      {female ? (
        <path d="M172 200 Q140 300 156 430 Q170 440 176 420 Q168 320 196 236 Z" fill="#1a0d08" stroke={INK} strokeWidth={3} />
      ) : (
        <path d="M170 196 Q146 236 156 284 Q176 262 184 232 Z" fill="#1a0d08" stroke={INK} strokeWidth={3} />
      )}
      {female && holes([[160, 300], [162, 340], [165, 380], [168, 410]], 4)}
      {/* neck */}
      <path d="M184 254 L222 254 L226 304 L178 304 Z" fill={skin} stroke={INK} strokeWidth={4} />
      {/* profile */}
      <path
        d={
          demon
            ? "M164 202 Q156 146 206 136 Q246 140 250 176 L254 192 L272 216 L254 224 L258 236 L250 242 L254 256 Q244 274 214 274 Q182 270 168 244 Z"
            : "M168 200 Q160 150 205 140 Q240 142 246 175 L250 192 L264 214 L250 220 L252 232 L246 236 L248 246 Q240 262 214 264 Q186 262 172 240 Z"
        }
        fill={skin}
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {/* ear + earring */}
      <ellipse cx={194} cy={210} rx={9} ry={14} fill={skin} stroke={INK} strokeWidth={3} />
      <circle cx={194} cy={234} r={9} fill={look.accent} stroke={INK} strokeWidth={3} />
      <circle cx={194} cy={234} r={3} fill={HOLE} />
      {/* eye */}
      {demon ? (
        <>
          <circle cx={230} cy={196} r={13} fill={HOLE} stroke="#a3140c" strokeWidth={4} />
          <circle cx={235} cy={196} r={5} fill={INK} />
          <path d="M212 178 L250 186" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <path d="M250 244 L256 262 L244 248 Z M236 248 L240 264 L230 250 Z" fill={HOLE} stroke={INK} strokeWidth={2} />
          <path d="M252 230 Q228 240 204 220 Q206 246 236 244" fill="#1a0d08" stroke={INK} strokeWidth={3} />
          <path d="M214 270 L206 292 L222 274 L224 296 L232 272" fill="#1a0d08" />
        </>
      ) : (
        <>
          <path d="M220 198 Q232 189 245 198 Q232 205 220 198 Z" fill={HOLE} stroke={INK} strokeWidth={2.5} />
          <circle cx={235} cy={198} r={3.4} fill={INK} />
          <path d="M216 186 Q232 177 247 186" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M246 236 Q240 240 236 237" stroke="#9a2018" strokeWidth={3} fill="none" />
          {/* tilaka */}
          {!female && <path d="M238 152 L242 172" stroke="#c21f12" strokeWidth={4} strokeLinecap="round" />}
        </>
      )}
      {female && (
        <>
          <circle cx={240} cy={166} r={4} fill="#c21f12" />
          <circle cx={258} cy={224} r={6} fill="none" stroke={look.accent} strokeWidth={3} />
        </>
      )}
      <CrownArt look={look} />
    </g>
  );
};

export const Figure: React.FC<{ look: Look; pose?: Pose; facing?: 1 | -1 }> = ({ look, pose = {}, facing = 1 }) => {
  const front = pose.front ?? [8, 10];
  const back = pose.back ?? [-6, 8];
  const stride = pose.stride ?? 6;
  const fem = !!look.female;
  const hand = handAt(FRONT_SHOULDER, front[0], front[1]);
  const backHand = handAt(BACK_SHOULDER, back[0], back[1]);

  return (
    <svg viewBox="0 0 400 800" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={facing === -1 ? "translate(400 0) scale(-1 1)" : undefined}>
        <g transform={`rotate(${pose.bodyTilt ?? 0} 200 775)`}>
          {/* control sticks run down to the puppeteer below the screen */}
          {pose.sticks !== false && (
            <g stroke={INK} strokeWidth={3.5} opacity={0.75}>
              <line x1={200} y1={420} x2={206} y2={1400} />
              <line x1={hand[0]} y1={hand[1]} x2={hand[0] + 30} y2={1400} />
              <line x1={backHand[0]} y1={backHand[1]} x2={backHand[0] - 20} y2={1400} />
            </g>
          )}

          <Arm at={BACK_SHOULDER} a={back} look={look} pose={pose} front={false} />

          {/* legs */}
          <g transform={`rotate(${stride} 196 560)`}>
            <path d="M180 560 L170 700 L160 760 L132 774 L182 776 L186 700 L204 560 Z" fill={look.skin} stroke={INK} strokeWidth={4} />
            <rect x={160} y={736} width={30} height={10} rx={4} fill={look.accent} stroke={INK} strokeWidth={2} />
          </g>
          <g transform={`rotate(${-stride} 206 560)`}>
            <path d="M196 560 L222 700 L238 760 L276 774 L226 778 L212 700 L216 560 Z" fill={look.skin} stroke={INK} strokeWidth={4} />
            <rect x={218} y={736} width={30} height={10} rx={4} fill={look.accent} stroke={INK} strokeWidth={2} />
          </g>

          {/* lower garment */}
          {fem ? (
            <g>
              <path d="M156 466 L246 466 L292 744 Q206 768 112 744 Z" fill={look.garment} stroke={INK} strokeWidth={4} />
              <path d="M118 718 Q206 742 288 718 L292 744 Q206 768 112 744 Z" fill={look.accent} stroke={INK} strokeWidth={3} />
              {[0, 1, 2, 3, 4].map((i) => (
                <path key={i} d={`M${196 + i * 6} 480 L${170 + i * 22} 726`} stroke={look.garmentDark} strokeWidth={4} />
              ))}
              {holes(row(124, 284, 730, 14, 6), 3)}
              {holes(row(160, 244, 560, 14, 4), 3)}
              {holes(row(146, 262, 640, 14, 6), 3)}
            </g>
          ) : (
            <g>
              <path d="M152 466 L250 466 L280 612 Q200 636 120 612 Z" fill={look.garment} stroke={INK} strokeWidth={4} />
              <path d="M124 594 Q200 616 276 594 L280 612 Q200 636 120 612 Z" fill={look.accent} stroke={INK} strokeWidth={3} />
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M${190 + i * 10} 480 L${176 + i * 24} 600`} stroke={look.garmentDark} strokeWidth={4} />
              ))}
              {holes(row(130, 270, 604, 14, 5), 3)}
              {holes(row(160, 240, 530, 14, 4), 3)}
            </g>
          )}

          {/* torso */}
          <path
            d={fem ? "M146 304 Q202 290 256 304 L248 380 Q236 440 236 470 L166 470 Q166 440 154 380 Z" : "M138 302 Q202 284 264 302 L252 382 Q240 440 238 470 L162 470 Q160 440 150 382 Z"}
            fill={look.skin}
            stroke={INK}
            strokeWidth={4}
          />
          {fem && (
            <g>
              <path d="M148 306 Q202 292 254 306 L250 372 L152 372 Z" fill={look.garment} stroke={INK} strokeWidth={3} />
              {/* pallu across the body */}
              <path d="M150 304 L186 304 L258 470 L222 470 Z" fill={look.garmentDark} stroke={INK} strokeWidth={3} opacity={0.95} />
              {holes([[176, 330], [196, 372], [214, 414], [232, 452]], 3.2)}
            </g>
          )}
          {!fem && look.face !== "child" && <path d="M162 306 L236 466" stroke={HOLE} strokeWidth={3} />}
          {/* necklaces + belt */}
          <path d="M162 312 Q204 372 242 312" stroke={look.accent} strokeWidth={9} fill="none" />
          <path d="M170 312 Q204 350 234 312" stroke={INK} strokeWidth={2} fill="none" />
          <circle cx={204} cy={354} r={10} fill={look.accent} stroke={INK} strokeWidth={3} />
          {holes(row(170, 236, 330, 11, 16), 2.4)}
          <rect x={158} y={458} width={88} height={18} rx={5} fill={look.accent} stroke={INK} strokeWidth={3} />
          {holes(row(166, 238, 467, 12), 3)}

          <Head look={look} tilt={pose.headTilt ?? 0} />

          <Arm at={FRONT_SHOULDER} a={front} look={look} pose={pose} front />
        </g>
      </g>
    </svg>
  );
};
