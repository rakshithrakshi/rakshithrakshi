import { Composition, Folder } from "remotion";
import "./fonts";
import { Deepavali } from "./Deepavali";
import { DeepavaliVertical } from "./vertical/Vertical";
import { FPS, HEIGHT, SCENES, TOTAL, WIDTH } from "./timeline";
import { S1Title } from "./scenes/S1Title";
import { S2Demon } from "./scenes/S2Demon";
import { S3Darkness } from "./scenes/S3Darkness";
import { S4Call } from "./scenes/S4Call";
import { S5Battle } from "./scenes/S5Battle";
import { S6Wish } from "./scenes/S6Wish";
import { S7Light } from "./scenes/S7Light";
import { S8Message } from "./scenes/S8Message";

const base = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Deepavali" component={Deepavali} durationInFrames={TOTAL} {...base} />
    <Composition id="DeepavaliVertical" component={DeepavaliVertical} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Folder name="Scenes">
      <Composition id="Title" component={S1Title} durationInFrames={SCENES.title} {...base} />
      <Composition id="Narakasura" component={S2Demon} durationInFrames={SCENES.demon} {...base} />
      <Composition id="Darkness" component={S3Darkness} durationInFrames={SCENES.darkness} {...base} />
      <Composition id="Call" component={S4Call} durationInFrames={SCENES.call} {...base} />
      <Composition id="Battle" component={S5Battle} durationInFrames={SCENES.battle} {...base} />
      <Composition id="Wish" component={S6Wish} durationInFrames={SCENES.wish} {...base} />
      <Composition id="Light" component={S7Light} durationInFrames={SCENES.light} {...base} />
      <Composition id="Message" component={S8Message} durationInFrames={SCENES.message} {...base} />
    </Folder>
  </>
);
