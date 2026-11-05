import React from "react";

// Flat, softly shaded character. Drawn in a 200x420 box with feet at y=400.
// Arm angles are "raise" degrees: 0 = hanging down, 90 = straight out, 160 = up.

export type HairStyle = "bob" | "short" | "bun" | "curly" | "ponytail" | "pigtails";

export type PersonProps = {
  id: string;
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  top: string;
  topShade: string;
  bottom: string;
  skirt?: boolean;
  shoes?: string;
  armL?: number;
  armR?: number;
  legSwing?: number; // running: legs rotate +/- this many degrees
  backpack?: string;
  glasses?: boolean;
  lanyard?: string;
  smile?: number; // 0..1 how open the smile is
  blink?: boolean;
  headTilt?: number;
};

const Arm: React.FC<{
  side: -1 | 1;
  raise: number;
  color: string;
  shade: string;
  skin: string;
}> = ({ side, raise, color, shade, skin }) => {
  const px = side * 46;
  const py = 128;
  // Left arm (side -1) raises outward with positive rotation, right arm with negative
  const angle = side === -1 ? raise : -raise;
  return (
    <g transform={`rotate(${angle} ${px} ${py})`}>
      <rect x={px - 11} y={py - 8} width={22} height={70} rx={11} fill={color} />
      <rect x={px - 9} y={py + 50} width={18} height={62} rx={9} fill={shade} />
      <circle cx={px} cy={py + 116} r={12} fill={skin} />
    </g>
  );
};

const Hair: React.FC<{ style: HairStyle; color: string; back: boolean }> = ({
  style,
  color,
  back,
}) => {
  if (back) {
    // Layers behind the head
    if (style === "bob")
      return <path d="M-50 60 Q-52 4 0 2 Q52 4 50 60 L50 112 Q30 118 22 104 L-22 104 Q-30 118 -50 112 Z" fill={color} />;
    if (style === "ponytail")
      return <path d="M30 40 Q78 50 66 120 Q60 150 44 160 Q52 120 34 84 Z" fill={color} />;
    if (style === "pigtails")
      return (
        <>
          <ellipse cx={-54} cy={92} rx={16} ry={26} fill={color} />
          <ellipse cx={54} cy={92} rx={16} ry={26} fill={color} />
        </>
      );
    if (style === "bun") return <circle cx={0} cy={18} r={24} fill={color} />;
    return null;
  }
  switch (style) {
    case "bob":
      return <path d="M-46 66 Q-50 18 0 16 Q50 18 46 66 Q38 40 10 36 Q-6 52 -46 66 Z" fill={color} />;
    case "short":
      return <path d="M-44 64 Q-50 22 -10 18 Q44 12 46 60 Q40 44 26 40 Q0 46 -30 40 Q-40 50 -44 64 Z" fill={color} />;
    case "bun":
      return <path d="M-44 66 Q-46 26 0 24 Q46 26 44 66 Q30 42 0 42 Q-30 42 -44 66 Z" fill={color} />;
    case "curly":
      return (
        <g fill={color}>
          {[-40, -24, -8, 8, 24, 40].map((x, i) => (
            <circle key={i} cx={x} cy={34 + Math.abs(x) * 0.35} r={17} />
          ))}
          <circle cx={-46} cy={62} r={13} />
          <circle cx={46} cy={62} r={13} />
        </g>
      );
    case "ponytail":
    case "pigtails":
      return <path d="M-44 66 Q-48 22 0 20 Q48 22 44 66 Q36 40 4 40 Q-20 50 -44 66 Z" fill={color} />;
  }
};

export const Person: React.FC<PersonProps> = ({
  id,
  skin,
  hair,
  hairStyle,
  top,
  topShade,
  bottom,
  skirt,
  shoes = "#3b2f2f",
  armL = 0,
  armR = 0,
  legSwing = 0,
  backpack,
  glasses,
  lanyard,
  smile = 0.6,
  blink,
  headTilt = 0,
}) => {
  const gTop = `top-${id}`;
  const gSkin = `skin-${id}`;
  return (
    <svg viewBox="-100 -20 200 440" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gTop} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={topShade} />
        </linearGradient>
        <radialGradient id={gSkin} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor={skin} />
          <stop offset="1" stopColor={skin} stopOpacity={0.92} />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx={0} cy={402} rx={58} ry={9} fill="#000" opacity={0.16} />

      {/* legs */}
      <g transform={`rotate(${legSwing} -14 250)`}>
        <rect x={-30} y={240} width={24} height={150} rx={12} fill={bottom} />
        <ellipse cx={-20} cy={394} rx={20} ry={9} fill={shoes} />
      </g>
      <g transform={`rotate(${-legSwing} 14 250)`}>
        <rect x={6} y={240} width={24} height={150} rx={12} fill={bottom} />
        <ellipse cx={20} cy={394} rx={20} ry={9} fill={shoes} />
      </g>
      {skirt && <path d="M-46 220 L46 220 L62 312 Q0 326 -62 312 Z" fill={bottom} />}

      {/* backpack behind body */}
      {backpack && (
        <g>
          <rect x={-54} y={128} width={108} height={130} rx={30} fill={backpack} />
          <rect x={-40} y={196} width={80} height={48} rx={16} fill="#000" opacity={0.12} />
        </g>
      )}

      <Arm side={-1} raise={armL} color={`url(#${gTop})`} shade={topShade} skin={skin} />
      <Arm side={1} raise={armR} color={`url(#${gTop})`} shade={topShade} skin={skin} />

      {/* torso */}
      <path d="M-48 132 Q-50 116 -30 112 L30 112 Q50 116 48 132 L44 252 Q0 262 -44 252 Z" fill={`url(#${gTop})`} />
      <path d="M-14 112 L0 134 L14 112 Z" fill="#fff" opacity={0.85} />
      {backpack && (
        <>
          <rect x={-40} y={116} width={10} height={110} rx={5} fill={backpack} />
          <rect x={30} y={116} width={10} height={110} rx={5} fill={backpack} />
        </>
      )}
      {lanyard && (
        <>
          <path d="M-16 116 L0 176 L16 116" stroke={lanyard} strokeWidth={4} fill="none" />
          <rect x={-12} y={174} width={24} height={30} rx={4} fill="#fff" />
          <rect x={-8} y={182} width={16} height={4} rx={2} fill={lanyard} />
        </>
      )}

      {/* head */}
      <g transform={`rotate(${headTilt} 0 104)`}>
        <Hair style={hairStyle} color={hair} back />
        <rect x={-10} y={96} width={20} height={20} rx={6} fill={skin} />
        <circle cx={0} cy={66} r={44} fill={`url(#${gSkin})`} />
        <ellipse cx={-44} cy={70} rx={7} ry={10} fill={skin} />
        <ellipse cx={44} cy={70} rx={7} ry={10} fill={skin} />
        <Hair style={hairStyle} color={hair} back={false} />
        {/* face */}
        {blink ? (
          <>
            <path d="M-21 70 Q-15 74 -9 70" stroke="#2a1d1a" strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d="M9 70 Q15 74 21 70" stroke="#2a1d1a" strokeWidth={3} fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx={-15} cy={70} rx={4.5} ry={5.5} fill="#2a1d1a" />
            <ellipse cx={15} cy={70} rx={4.5} ry={5.5} fill="#2a1d1a" />
            <circle cx={-13.5} cy={68} r={1.5} fill="#fff" />
            <circle cx={16.5} cy={68} r={1.5} fill="#fff" />
          </>
        )}
        <path d="M-25 59 Q-15 54 -6 58" stroke="#2a1d1a" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.7} />
        <path d="M6 58 Q15 54 25 59" stroke="#2a1d1a" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.7} />
        {glasses && (
          <g stroke="#2a1d1a" strokeWidth={2.5} fill="none">
            <circle cx={-15} cy={70} r={11} />
            <circle cx={15} cy={70} r={11} />
            <path d="M-4 70 L4 70" />
          </g>
        )}
        <circle cx={-25} cy={84} r={7} fill="#ff7b7b" opacity={0.35} />
        <circle cx={25} cy={84} r={7} fill="#ff7b7b" opacity={0.35} />
        <path
          d={`M-13 86 Q0 ${88 + smile * 12} 13 86 Q0 ${90 + smile * 4} -13 86 Z`}
          fill="#8a2f2f"
          stroke="#2a1d1a"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
