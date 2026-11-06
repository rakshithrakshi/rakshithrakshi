import React from "react";
import { AbsoluteFill, Sequence, Series, getStaticFiles, interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { LINES, SCENES } from "./timeline";
import { Grain, Vignette } from "./stage";
import { Subtitles } from "./text";
import { S1Title } from "./scenes/S1Title";
import { S2Demon } from "./scenes/S2Demon";
import { S3Darkness } from "./scenes/S3Darkness";
import { S4Call } from "./scenes/S4Call";
import { S5Battle } from "./scenes/S5Battle";
import { S6Wish } from "./scenes/S6Wish";
import { S7Light } from "./scenes/S7Light";
import { S8Message } from "./scenes/S8Message";

const voFile = (n: number) => `vo/${String(n).padStart(2, "0")}.mp3`;

// Duck the score under the voice: ease down just before each line, back up after it
const duck = (frame: number, lines: typeof LINES) =>
  Math.min(
    1,
    ...lines.map((l) =>
      interpolate(frame, [l.at - 10, l.at, l.to, l.to + 14], [1, 0.42, 0.42, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ),
  );

// The eight scenes back to back, drawn on a 1920x1080 canvas
export const Scenes: React.FC = () => (
  <Series>
    <Series.Sequence name="Title" durationInFrames={SCENES.title}>
      <S1Title />
    </Series.Sequence>
    <Series.Sequence name="Narakasura" durationInFrames={SCENES.demon}>
      <S2Demon />
    </Series.Sequence>
    <Series.Sequence name="Darkness" durationInFrames={SCENES.darkness}>
      <S3Darkness />
    </Series.Sequence>
    <Series.Sequence name="Call to Krishna" durationInFrames={SCENES.call}>
      <S4Call />
    </Series.Sequence>
    <Series.Sequence name="Battle" durationInFrames={SCENES.battle}>
      <S5Battle />
    </Series.Sequence>
    <Series.Sequence name="Last wish" durationInFrames={SCENES.wish}>
      <S6Wish />
    </Series.Sequence>
    <Series.Sequence name="Light returns" durationInFrames={SCENES.light}>
      <S7Light />
    </Series.Sequence>
    <Series.Sequence name="Message" durationInFrames={SCENES.message}>
      <S8Message />
    </Series.Sequence>
  </Series>
);

// Music, SFX and every voice line present in public/vo, with the score ducked under speech
export const Soundtrack: React.FC = () => {
  const present = new Set(getStaticFiles().map((f) => f.name));
  const voiced = LINES.filter((l) => present.has(voFile(l.n)));
  return (
    <>
      <Audio name="Music" src={staticFile("audio/music.wav")} volume={(f) => duck(f, voiced)} />
      <Audio name="SFX" src={staticFile("audio/sfx.wav")} volume={(f) => 0.6 + 0.4 * duck(f, voiced)} />
      {voiced.map((l) => (
        <Sequence key={l.n} name={`VO ${l.n} · ${l.who}`} from={l.at}>
          <Audio src={staticFile(voFile(l.n))} />
        </Sequence>
      ))}
    </>
  );
};

export const Deepavali: React.FC = () => (
  <AbsoluteFill style={{ background: "#050201" }}>
    <Scenes />
    <Vignette />
    <Grain />
    <Subtitles />
    <Soundtrack />
  </AbsoluteFill>
);
