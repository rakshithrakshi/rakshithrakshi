import React from "react";
import { HOLE, INK } from "./Figure";

// Garuda, the eagle mount, in flight: drawn facing right in a 900x600 box.
// `flap` is a phase in radians; riders are passed as children and positioned
// on his back by the caller.
const Wing: React.FC<{ angle: number; back?: boolean }> = ({ angle, back }) => (
  <g transform={`rotate(${angle} 430 300)`} opacity={back ? 0.9 : 1}>
    <path
      d="M430 300 Q300 110 70 60 Q130 120 104 140 Q170 162 156 186 Q222 196 212 222 Q282 232 280 258 Q340 264 352 298 Z"
      fill={back ? "#a8301e" : "#d4482a"}
      stroke={INK}
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path d="M430 300 Q320 170 150 110" stroke="#efb43a" strokeWidth={10} fill="none" />
    {[[200, 128], [250, 150], [300, 178], [350, 210], [180, 160], [240, 186], [300, 214], [360, 248]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={5} fill={HOLE} />
    ))}
  </g>
);

export const Garuda: React.FC<{ flap: number; children?: React.ReactNode }> = ({ flap, children }) => {
  const a = Math.sin(flap) * 22;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg viewBox="0 0 900 600" width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <Wing angle={a - 8} back />
        {/* tail fan */}
        <path d="M330 360 L170 330 L190 360 L160 380 L196 398 L176 424 L330 400 Z" fill="#efb43a" stroke={INK} strokeWidth={4} />
        {/* body */}
        <path d="M330 320 Q450 270 600 300 Q640 330 600 380 Q470 420 330 400 Z" fill="#e8a92a" stroke={INK} strokeWidth={4} />
        {[380, 420, 460, 500, 540].map((x) => (
          <circle key={x} cx={x} cy={350} r={5} fill={HOLE} />
        ))}
        {/* legs tucked */}
        <path d="M470 400 L490 450 L520 456 M520 396 L540 444 L572 450" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
        {/* eagle head */}
        {/* neck ruff */}
        <path d="M570 290 Q600 250 640 262 L660 300 Q640 350 590 360 Z" fill="#d4482a" stroke={INK} strokeWidth={4} />
        {[588, 610, 632].map((x) => (
          <circle key={x} cx={x} cy={310} r={4.5} fill={HOLE} />
        ))}
        {/* eagle head with a heavy hooked beak */}
        <path d="M610 280 Q620 214 690 210 Q736 212 748 250 Q790 252 812 280 Q818 300 800 318 Q796 296 760 292 Q744 318 700 324 Q640 326 610 280 Z" fill="#f0c27a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M748 250 Q790 252 812 280 Q818 300 800 318 Q796 296 760 292 Z" fill="#efb43a" stroke={INK} strokeWidth={3} />
        <path d="M660 236 Q700 226 732 246" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
        <ellipse cx={712} cy={256} rx={13} ry={9} fill={HOLE} stroke={INK} strokeWidth={3} />
        <circle cx={716} cy={256} r={4} fill={INK} />
        {/* crown and crest feathers */}
        <path d="M632 226 Q612 180 640 150 Q644 190 660 214 Z M650 218 Q640 168 676 138 Q672 182 680 210 Z" fill="#d4482a" stroke={INK} strokeWidth={3} />
        <path d="M664 214 L724 210 L716 172 L696 140 L678 172 Z" fill="#e8a92a" stroke={INK} strokeWidth={4} />
        <circle cx={696} cy={180} r={5} fill={HOLE} />
      </svg>
      {children}
      <svg viewBox="0 0 900 600" width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <Wing angle={a + 6} />
      </svg>
    </div>
  );
};
