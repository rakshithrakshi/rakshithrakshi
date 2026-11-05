import React from "react";
import { useCurrentFrame } from "remotion";
import { ein, eio, eout, tw } from "../anim";
import { DEVA, NARAKA, PRINCESS } from "../puppets/cast";
import { Bars, Kundalas } from "../puppets/Props";
import { Puppet } from "../puppets/Puppet";
import { Embers, Layer, Screen, Stage, TINTS } from "../stage";
import { SCENES } from "../timeline";

// 0:16 — three beats: the devas flee, Aditi's earrings are seized, princesses imprisoned.
// The lamp drains with each beat until the world is nearly dark.
export const S3Darkness: React.FC = () => {
  const f = useCurrentFrame();
  const D = SCENES.darkness;
  const beat = f < 100 ? 0 : f < 200 ? 1 : 2;
  const local = f - beat * 100;
  // lamp dips between beats, and drains overall
  const dip = Math.min(tw(local, 0, 12, 0, 1, eio), beat === 2 ? 1 : tw(local, 88, 100, 1, 0, eio));
  const drain = tw(f, 0, D, 1, 0.55, eio) * (beat === 2 ? tw(local, 50, 98, 1, 0.35, ein) : 1);
  const fade = Math.min(tw(f, 0, 14, 0, 1, eio), tw(f, D - 14, D, 1, 0, eio));
  const camX = [tw(local, 0, 100, -80, 80), tw(local, 0, 100, 0, 0), tw(local, 0, 100, 60, -60)][beat];
  const zoom = [1.05, tw(local, 0, 100, 1.0, 1.25, eio), tw(local, 0, 100, 1.15, 1.0, eio)][beat];

  return (
    <Stage cam={{ x: camX, y: 0, zoom }} fade={fade * dip}>
      <Screen tint={beat === 2 ? TINTS.night : TINTS.ember} level={drain} />

      {beat === 0 && (
        <>
          {/* Naraka's looming shadow, far from the screen: huge and soft */}
          <Layer depth={3} blend="multiply" opacity={0.75}>
            <Puppet look={NARAKA} x={1500} y={1500} h={1700} pose={{ front: [120, 30], sticks: false }} facing={-1} />
          </Layer>
          <Layer depth={1} blend="multiply">
            {[0, 1, 2].map((i) => {
              const x = tw(local, 0, 100, 1500 + i * 220, -300 + i * 220, eio);
              return (
                <Puppet
                  key={i}
                  look={DEVA}
                  x={x}
                  y={960}
                  h={430}
                  facing={-1}
                  hop={Math.abs(Math.sin(local / 4 + i)) * 26}
                  pose={{ front: [60 + Math.sin(local / 4 + i) * 30, 30], back: [-50, 20], stride: Math.sin(local / 4 + i) * 16, headTilt: 8 }}
                />
              );
            })}
          </Layer>
        </>
      )}

      {beat === 1 && (
        <>
          <Layer depth={1} blend="multiply">
            {/* the earrings rise away as a huge clawed hand closes on them */}
            <div style={{ position: "absolute", left: 960 - 260, top: tw(local, 40, 96, 380, -400, ein), width: 520, height: 340 }}>
              <Kundalas glow={tw(local, 30, 60, 1, 0.2)} />
            </div>
            <svg viewBox="0 0 600 900" width={600} height={900} style={{ position: "absolute", left: 660, top: tw(local, 0, 40, -900, -330, eout) + tw(local, 40, 96, 0, -700, ein) }}>
              <path
                d="M220 0 L380 0 L390 520 Q470 560 480 640 L520 760 L490 770 L450 680 L440 800 L408 806 L400 690 L370 820 L336 818 L340 690 L300 800 L268 790 L290 660 Q200 600 210 520 Z"
                fill="#3d5a2c"
                stroke="#1b0c05"
                strokeWidth={5}
              />
              <rect x={214} y={430} width={180} height={30} fill="#e0a12a" stroke="#1b0c05" strokeWidth={4} />
              {[240, 280, 320, 360].map((x) => (
                <circle key={x} cx={x} cy={445} r={5} fill="#fff6dc" />
              ))}
            </svg>
          </Layer>
          {/* their golden light */}
          <Layer depth={1} blend="screen">
            <div
              style={{
                position: "absolute",
                left: 960 - 400,
                top: tw(local, 40, 96, 380, -400, ein) - 230,
                width: 800,
                height: 800,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,210,110,0.85) 0%, rgba(255,160,60,0.25) 35%, rgba(255,140,40,0) 65%)",
                opacity: tw(local, 0, 20, 0, 1) * tw(local, 50, 96, 1, 0.2),
              }}
            />
          </Layer>
        </>
      )}

      {beat === 2 && (
        <Layer depth={1} blend="multiply">
          {[0, 1, 2, 3, 4].map((i) => (
            <Puppet
              key={i}
              look={PRINCESS}
              x={560 + i * 200}
              y={900}
              h={380}
              facing={i % 2 ? -1 : 1}
              pose={{ front: [20, 70], back: [-10, 40], headTilt: 14, stride: 2, sticks: false }}
              rot={Math.sin(local / 18 + i) * 1.5}
            />
          ))}
          <div style={{ position: "absolute", left: 360, top: 330, width: 1200, height: 600 }}>
            <Bars />
          </div>
        </Layer>
      )}

      <Embers count={30} seed={7} color="255,140,70" rise={0.6} />
    </Stage>
  );
};

