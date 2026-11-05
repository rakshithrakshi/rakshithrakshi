import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { eback, eio, eout, noise, tw } from "../anim";
import { Scenes, Soundtrack } from "../Deepavali";
import { display, sans, serif } from "../fonts";
import { Grain } from "../stage";
import { LINES, START, TOTAL, WIDTH } from "../timeline";
import { BATTLE } from "../scenes/S5Battle";
import { Bell, C, FestiveBackground, GOLD_FILL, Garland, Mandala, Petals, Progress, Twinkles } from "./Ornaments";

// ---------------------------------------------------------------- layout (1080x1920)

const WIN = { x: 60, y: 610, w: 960, h: 729 }; // the puppet-stage window
const SCALE = 1296 / WIDTH; // scene drawn at 1296x729, sides cropped to 960
const CROP = (1296 - WIN.w) / 2;

const CHAPTERS: { at: number; n: string; title: string }[] = [
  { at: START.demon, n: "೧", title: "ನರಕಾಸುರ" },
  { at: START.darkness, n: "೨", title: "ಕತ್ತಲೆ" },
  { at: START.call, n: "೩", title: "ಕೃಷ್ಣನ ಕರೆ" },
  { at: START.battle, n: "೪", title: "ಯುದ್ಧ" },
  { at: START.wish, n: "೫", title: "ಕೊನೆಯ ಆಸೆ" },
  { at: START.light, n: "೬", title: "ಬೆಳಕು" },
  { at: START.message, n: "೭", title: "ಸಂದೇಶ" },
];

const SPEAKER: Record<string, string> = {
  ನಿರೂಪಕ: C.gold,
  ಇಂದ್ರ: "#fff0c0",
  ಸತ್ಯಭಾಮೆ: "#ff5a6a",
  ನರಕಾಸುರ: "#7ad06a",
  ಕೃಷ್ಣ: "#6aa8ff",
};

const IMPACT = START.battle + BATTLE.impact;
const BLESSING = START.wish + 225;

// ---------------------------------------------------------------- header

const Header: React.FC = () => {
  const f = useCurrentFrame();
  const logo = tw(f, 150, 176, 0, 1, eback);
  return (
    <>
      <Mandala size={620} x={540} y={250} opacity={0.55} />
      <div style={{ position: "absolute", left: 540 - 300, top: 250 - 300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,90,0.55) 0%, rgba(255,150,60,0) 60%)", mixBlendMode: "screen" }} />
      <Twinkles area={[40, 120, 1000, 300]} count={20} seed={3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: display,
            fontWeight: 800,
            fontSize: 168,
            lineHeight: 1.2,
            backgroundImage: GOLD_FILL,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 22px rgba(255,170,60,0.75)) drop-shadow(0 6px 2px rgba(60,10,0,0.7))",
            scale: String(0.6 + 0.4 * logo),
            opacity: Math.min(1, logo * 1.4),
          }}
        >
          ದೀಪಾವಳಿ
        </div>
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 40, color: "#ffe9c2", marginTop: -14, opacity: tw(f, 170, 190, 0, 1), textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
          ✦ ಬೆಳಕಿನ ಹಬ್ಬದ ಕಥೆ ✦
        </div>
      </div>
      <Garland y={0} />
      <Bell x={70} y={6} phase={0} />
      <Bell x={1010} y={6} phase={1.7} />
    </>
  );
};

// ---------------------------------------------------------------- stage frame

const Pillar: React.FC<{ x: number }> = ({ x }) => (
  <svg viewBox="0 0 60 840" width={60} height={840} style={{ position: "absolute", left: x, top: 520 }}>
    <defs>
      <linearGradient id={`pil${x}`} x1="0" x2="1">
        <stop offset="0" stopColor="#8a4a0a" />
        <stop offset="0.5" stopColor="#ffd86a" />
        <stop offset="1" stopColor="#9a5a0c" />
      </linearGradient>
    </defs>
    <rect x={6} y={60} width={48} height={720} fill={`url(#pil${x})`} />
    {Array.from({ length: 12 }, (_, i) => (
      <g key={i}>
        <rect x={16} y={90 + i * 58} width={28} height={40} rx={14} fill={i % 2 ? C.teal : C.magenta} />
        <circle cx={30} cy={110 + i * 58} r={5} fill="#fff2c0" />
      </g>
    ))}
    <path d="M0 60 L60 60 L52 30 L8 30 Z M10 30 Q30 -6 50 30 Z" fill={`url(#pil${x})`} stroke="#6a3a05" strokeWidth={2} />
    <path d="M0 780 L60 780 L56 820 L4 820 Z" fill={`url(#pil${x})`} stroke="#6a3a05" strokeWidth={2} />
  </svg>
);

// Cusped temple arch over the stage, with the chapter medallion at its crown
const Arch: React.FC = () => {
  const f = useCurrentFrame();
  const ch = [...CHAPTERS].reverse().find((c) => f >= c.at - 6);
  const enter = ch ? tw(f, ch.at - 6, ch.at + 18, 0, 1, eback) : 0;
  return (
    <>
      <svg viewBox="0 0 1080 200" width={1080} height={200} style={{ position: "absolute", left: 0, top: 418 }}>
        <defs>
          <linearGradient id="archGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff1b8" />
            <stop offset="0.5" stopColor="#f6c54a" />
            <stop offset="1" stopColor="#a8640e" />
          </linearGradient>
        </defs>
        <path
          d="M40 200 L40 150 Q90 150 110 120 Q150 130 180 96 Q230 110 270 70 Q330 84 380 46 Q450 60 500 20 L540 0 L580 20 Q630 60 700 46 Q750 84 810 70 Q850 110 900 96 Q930 130 970 120 Q990 150 1040 150 L1040 200 Z"
          fill="url(#archGold)"
          stroke="#6a3a05"
          strokeWidth={3}
        />
        <path
          d="M70 200 L70 168 Q110 168 128 142 Q166 150 192 120 Q238 132 276 96 Q332 108 380 74 Q446 86 494 50 L540 30 L586 50 Q634 86 700 74 Q748 108 804 96 Q842 132 888 120 Q914 150 952 142 Q970 168 1010 168 L1010 200 Z"
          fill={C.ruby}
        />
        {Array.from({ length: 21 }, (_, i) => (
          <circle key={i} cx={90 + i * 45} cy={186} r={6} fill="#ffe08a" />
        ))}
      </svg>
      {/* chapter medallion */}
      {ch && (
        <div
          style={{
            position: "absolute",
            left: 540 - 210,
            top: 446,
            width: 420,
            height: 92,
            borderRadius: 46,
            background: "linear-gradient(180deg, #4a0f4f 0%, #2a0a3a 100%)",
            border: "4px solid #f6c54a",
            boxShadow: "0 0 30px rgba(255,180,60,0.6), inset 0 0 18px rgba(255,180,60,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            scale: String(0.5 + 0.5 * enter),
            opacity: Math.min(1, enter * 1.5),
          }}
        >
          <div style={{ width: 60, height: 60, borderRadius: 30, background: GOLD_FILL, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontWeight: 800, fontSize: 40, color: "#4a0f0f" }}>
            {ch.n}
          </div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 50, color: "#fff1cc", textShadow: "0 0 14px rgba(255,170,60,0.8)" }}>{ch.title}</div>
        </div>
      )}
    </>
  );
};

// Velvet curtains: closed at the start, then drawn back to tied swags
const Curtains: React.FC = () => {
  const f = useCurrentFrame();
  const open = tw(f, 6, 52, 0, 1, eio);
  const panel = (side: "left" | "right") => {
    const w = 480 * (1 - open) + 70;
    return (
      <div
        style={{
          position: "absolute",
          top: WIN.y - 4,
          [side]: WIN.x - 4,
          width: w,
          height: WIN.h + 8,
          background: `repeating-linear-gradient(90deg, #7a0a1a 0px, #c21a32 22px, #7a0a1a 44px)`,
          clipPath: open < 1 ? undefined : side === "left" ? "polygon(0 0, 100% 0, 30% 55%, 0 100%)" : "polygon(0 0, 100% 0, 100% 100%, 70% 55%)",
          boxShadow: "inset 0 -30px 40px rgba(0,0,0,0.4)",
          borderBottom: "8px solid #f6c54a",
        }}
      />
    );
  };
  return (
    <>
      {panel("left")}
      {panel("right")}
      {/* valance */}
      <svg viewBox="0 0 960 70" width={WIN.w + 8} height={70} style={{ position: "absolute", left: WIN.x - 4, top: WIN.y - 4 }}>
        <path d={`M0 0 L960 0 L960 30 ${Array.from({ length: 8 }, (_, i) => `Q${960 - i * 120 - 60} 70 ${960 - (i + 1) * 120} 30`).join(" ")} Z`} fill="#a8122a" stroke="#f6c54a" strokeWidth={4} />
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={i * 120} cy={34} r={8} fill="#f6c54a" />
        ))}
      </svg>
    </>
  );
};

// The 16:9 film, scaled into the stage window with a gentle punch on big moments
const StageWindow: React.FC = () => {
  const f = useCurrentFrame();
  const punch = 1 + tw(f, IMPACT, IMPACT + 4, 0, 0.05, eout) * tw(f, IMPACT + 4, IMPACT + 30, 1, 0, eio) + tw(f, BLESSING, BLESSING + 10, 0, 0.025) * tw(f, BLESSING + 10, BLESSING + 50, 1, 0);
  return (
    <div
      style={{
        position: "absolute",
        left: WIN.x,
        top: WIN.y,
        width: WIN.w,
        height: WIN.h,
        overflow: "hidden",
        borderRadius: 6,
        boxShadow: "0 0 0 10px #f6c54a, 0 0 0 16px #6a3a05, 0 0 0 22px #c9861a, 0 30px 60px rgba(0,0,0,0.6), 0 0 80px rgba(255,170,60,0.35)",
      }}
    >
      <div style={{ position: "absolute", left: -CROP, top: 0, width: WIDTH, height: 1080, scale: String(SCALE), transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", inset: 0, scale: String(punch), transformOrigin: "50% 50%" }}>
          <Scenes />
        </div>
      </div>
      {/* inner glass sheen */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 30%)", pointerEvents: "none" }} />
    </div>
  );
};

// ---------------------------------------------------------------- captions

const CaptionCard: React.FC = () => {
  const f = useCurrentFrame();
  const line = LINES.find((l) => f >= l.at - 6 && f <= l.to + 10);
  const lotus = (
    <svg viewBox="-60 -30 120 40" width={180} height={60} style={{ position: "absolute", left: 540 - 90, top: 1382 }}>
      {[-40, -20, 0, 20, 40].map((x, i) => (
        <path key={i} d={`M${x} 6 Q${x - 10} -10 ${x} -26 Q${x + 10} -10 ${x} 6 Z`} fill={i % 2 ? C.magenta : C.saffron} transform={`rotate(${x * 0.8} ${x} 6)`} />
      ))}
      <rect x={-50} y={6} width={100} height={4} rx={2} fill={C.gold} />
    </svg>
  );
  if (!line) {
    const intro = f < START.demon ? tw(f, 110, 140, 0, 1) * tw(f, START.demon - 20, START.demon, 1, 0) : 0;
    return (
      <>
        {lotus}
        {intro > 0 && (
          <div style={{ position: "absolute", left: 80, right: 80, top: 1470, textAlign: "center", fontFamily: serif, fontWeight: 700, fontSize: 54, color: "#fff1cc", opacity: intro, textShadow: "0 0 18px rgba(255,170,60,0.8)" }}>
            ಒಂದು ಪುರಾಣ ಕಥೆ
          </div>
        )}
      </>
    );
  }
  const a = interpolate(f, [line.at - 6, line.at + 8, line.to, line.to + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pop = tw(f, line.at - 6, line.at + 12, 0.9, 1, eback);
  const big = line.n >= 11; // the closing lines get the gold treatment
  const color = SPEAKER[line.who] ?? C.gold;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: 1440,
          opacity: a,
          scale: String(pop),
          padding: 4,
          borderRadius: 34,
          background: `linear-gradient(135deg, ${C.gold}, ${C.magenta}, ${C.teal}, ${C.gold})`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(255,150,60,0.35)",
        }}
      >
        <div style={{ borderRadius: 30, padding: "52px 40px 34px", background: "linear-gradient(180deg, rgba(42,10,58,0.94), rgba(20,4,30,0.94))", textAlign: "center", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: -30,
              translate: "-50% 0",
              padding: "6px 30px 2px",
              borderRadius: 30,
              background: color,
              color: "#2a0a1a",
              fontFamily: display,
              fontWeight: 800,
              fontSize: 34,
              boxShadow: `0 0 20px ${color}`,
            }}
          >
            {line.who}
          </div>
          <div
            style={
              big
                ? { fontFamily: serif, fontWeight: 700, fontSize: 48, lineHeight: 1.5, backgroundImage: GOLD_FILL, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 12px rgba(255,170,60,0.7))" }
                : { fontFamily: sans, fontWeight: 500, fontSize: 40, lineHeight: 1.5, color: "#fff6e4", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }
            }
          >
            {line.text}
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- footer

const DiyaRow: React.FC = () => {
  const f = useCurrentFrame();
  const xs = [150, 300, 450, 630, 780, 930];
  return (
    <>
      {xs.map((x, i) => (
        <div key={i} style={{ position: "absolute", left: x - 50, top: 1790, width: 100, height: 80 }}>
          <svg viewBox="-50 -10 100 50" width={100} height={50} style={{ position: "absolute", top: 34 }}>
            <path d="M-46 0 Q0 44 46 0 L36 -6 L-36 -6 Z" fill="#c2601e" stroke="#6a2a05" strokeWidth={3} />
            <path d="M-30 8 Q0 26 30 8" stroke={i % 2 ? C.teal : C.magenta} strokeWidth={4} fill="none" />
            {[-18, 0, 18].map((d) => (
              <circle key={d} cx={d} cy={18} r={3} fill="#ffe08a" />
            ))}
          </svg>
          <div style={{ position: "absolute", left: 50 - 90, top: -60, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,90,0.6) 0%, rgba(255,140,50,0) 65%)", mixBlendMode: "screen" }} />
          <div
            style={{
              position: "absolute",
              left: 50 - 13,
              top: -4,
              width: 26,
              height: 44,
              borderRadius: "50% 50% 45% 45% / 70% 70% 30% 30%",
              background: "radial-gradient(ellipse at 50% 75%, #fff 0%, #fff0b0 30%, #ffb040 65%, rgba(255,120,30,0) 100%)",
              transformOrigin: "50% 100%",
              rotate: `${noise(f / 2.6, i) * 6}deg`,
              scale: `1 ${1 + noise(f / 3.1, i + 9) * 0.18}`,
            }}
          />
        </div>
      ))}
    </>
  );
};

const RangoliArc: React.FC = () => {
  const f = useCurrentFrame();
  const colors = [C.magenta, C.saffron, C.teal, C.gold, "#ff5a7a", "#7a5aff"];
  return (
    <svg viewBox="-300 -300 600 600" width={900} height={900} style={{ position: "absolute", left: 540 - 450, top: 1920 - 260, opacity: 0.85 }}>
      <g transform={`rotate(${f * 0.2})`}>
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M0 -120 Q40 -200 0 -290 Q-40 -200 0 -120 Z" fill={colors[i % colors.length]} transform={`rotate(${i * 15})`} />
        ))}
      </g>
      <g transform={`rotate(${-f * 0.35})`}>
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d="M0 -50 Q26 -90 0 -118 Q-26 -90 0 -50 Z" fill={colors[(i + 2) % colors.length]} transform={`rotate(${i * 22.5})`} />
        ))}
      </g>
      <circle r={46} fill={C.gold} />
      <circle r={24} fill={C.magenta} />
    </svg>
  );
};

// ---------------------------------------------------------------- composition

export const DeepavaliVertical: React.FC = () => {
  const f = useCurrentFrame();
  const flash = Math.max(
    interpolate(f, [IMPACT, IMPACT + 2, IMPACT + 20], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [BLESSING, BLESSING + 8, BLESSING + 40], [0, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const fadeOut = tw(f, TOTAL - 20, TOTAL, 1, 0, eio);
  return (
    <AbsoluteFill style={{ background: C.plum, opacity: fadeOut }}>
      <FestiveBackground />
      <RangoliArc />
      <Header />
      <Pillar x={4} />
      <Pillar x={1016} />
      <StageWindow />
      <Curtains />
      <Arch />
      <CaptionCard />
      <DiyaRow />
      <Progress y={1878} />
      <Petals />
      <AbsoluteFill style={{ background: "#fff3d0", opacity: flash, mixBlendMode: "screen", pointerEvents: "none" }} />
      <Grain opacity={0.06} />
      <Soundtrack />
    </AbsoluteFill>
  );
};
