# ದೀಪಾವಳಿ: ಬೆಳಕಿನ ಹಬ್ಬದ ಕಥೆ

A 78-second Kannada story film in the style of Karnataka's shadow-puppet theatre
(Togalu Gombeyaata), built with Remotion. Translucent leather puppets on a backlit
cloth screen, a 2.5D camera moving through depth layers, and a synthesized score
with sound effects.

## Commands

```bash
npm i
npm run dev                         # Remotion Studio
python3 scripts/make-audio.py       # rebuild music + SFX (needs numpy, scipy)
npx remotion render Deepavali out/deepavali.mp4
```

`remotion.config.ts` points at the cloud sandbox's preinstalled Chromium; delete
that line to let Remotion download its own browser on your machine.

## Adding the voice-over

1. Export each ElevenLabs line as `01.mp3` … `12.mp3` (numbering matches the script).
2. Put them in `public/vo/`. They play automatically, no code change needed.
3. If a line runs longer or shorter than its slot, adjust its `at`/`to` frames in
   `src/timeline.ts` (30 fps). Subtitles follow the same numbers.

## Layout

- `src/timeline.ts`: scene lengths, voice-over lines and subtitle timing
- `src/stage.tsx`: 2.5D camera (`Stage`, `Layer`), the lit screen, foreground and light effects
- `src/puppets/`: the jointed puppet (`Figure`), cast colours, Garuda and props
- `src/scenes/`: the eight scenes
- `scripts/make-audio.py`: tanpura, bansuri, veena, mridangam, conch, bells and all SFX
