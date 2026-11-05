"""Synthesize the score and sound effects for the Back to School film.

Writes public/audio/music.wav and public/audio/sfx.wav (48 kHz stereo, 20 s).
Every cue time below is derived from the frame timeline in src/timeline.ts
(30 fps; scene starts at frames 0, 120, 270, 420), so keep the two in sync.
"""

import os

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
DUR = 20.0
N = int(SR * DUR)
FPS = 30
rng = np.random.default_rng(7)

S2, S3, S4 = 120 / FPS, 270 / FPS, 420 / FPS  # scene starts in seconds


def f2s(frame):
    return frame / FPS


def t_axis(sec):
    return np.arange(int(SR * sec)) / SR


def place(buf, sig, at, gain=1.0, pan=0.0):
    """Mix a mono signal into a stereo buffer at time `at` with equal-power pan."""
    i = int(at * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    buf[i : i + len(sig), 0] += sig * gain * l
    buf[i : i + len(sig), 1] += sig * gain * r


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def reverb(stereo, seconds=2.2, wet=0.28, seed=1):
    r = np.random.default_rng(seed)
    t = t_axis(seconds)
    out = stereo.copy()
    for ch in range(2):
        ir = r.standard_normal(len(t)) * np.exp(-t * 6.5 / seconds)
        ir = lp(ir, 7000)
        ir /= np.sqrt(np.sum(ir**2))
        out[:, ch] = stereo[:, ch] * (1 - wet) + fftconvolve(stereo[:, ch], ir)[: len(stereo)] * wet * 2.2
    return out


def env_adsr(n, a, d, s, r_):
    a, d, r_ = int(a * SR), int(d * SR), int(r_ * SR)
    sus = max(0, n - a - d - r_)
    return np.concatenate(
        [np.linspace(0, 1, a, endpoint=False), np.linspace(1, s, d, endpoint=False), np.full(sus, s), np.linspace(s, 0, r_)]
    )[:n]


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- instruments


def pad(freqs, sec):
    t = t_axis(sec)
    sig = np.zeros_like(t)
    for f in freqs:
        for det in (-0.12, 0.0, 0.12):
            ff = f * 2 ** (det / 12)
            for h in range(1, 9):
                sig += np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28)) / h
    sig = lp(sig, 1800)
    return sig * env_adsr(len(t), 0.9, 0.4, 0.85, 1.2) / (len(freqs) * 9)


def piano(f, sec=2.5, vel=1.0):
    t = t_axis(sec)
    sig = np.zeros_like(t)
    for h, amp in enumerate([1, 0.5, 0.28, 0.16, 0.09, 0.05], start=1):
        fh = f * h * (1 + 0.0004 * h * h)
        sig += amp * np.sin(2 * np.pi * fh * t) * np.exp(-t * (1.6 + h * 0.9))
    attack = np.minimum(1, t / 0.004)
    return lp(sig * attack, 5000) * vel * 0.35


def glock(f, sec=2.0, vel=1.0):
    t = t_axis(sec)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.2)
    sig += 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6)
    sig += 0.15 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 11)
    return sig * np.minimum(1, t / 0.002) * vel * 0.3


def bass(f, sec):
    t = t_axis(sec)
    sig = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return lp(sig, 400) * env_adsr(len(t), 0.02, 0.2, 0.7, 0.3) * 0.32


def kick():
    t = t_axis(0.5)
    ph = 2 * np.pi * np.cumsum(45 + 85 * np.exp(-t * 28)) / SR
    return np.sin(ph) * np.exp(-t * 9) * 0.6


def shaker():
    t = t_axis(0.09)
    return hp(rng.standard_normal(len(t)), 6000) * np.exp(-t * 60) * 0.08


# ---------------------------------------------------------------- music

music = np.zeros((N, 2))
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT  # 2 s

# I - V - vi - IV in C, voiced warm and open
CHORDS = [
    (48, [60, 64, 67, 72]),  # C
    (43, [59, 62, 67, 71]),  # G/B
    (45, [57, 60, 64, 69]),  # Am
    (41, [57, 60, 65, 69]),  # F
]

finale = f2s(420 + 40)  # bell/confetti reveal
for bar in range(10):
    t0 = bar * BAR
    root, notes = CHORDS[bar % 4]
    if t0 >= finale - 0.01:
        break
    length = min(BAR + 1.2, finale - t0 + 0.6)
    place(music, pad([midi(n) for n in notes], length), t0, 0.9 if bar >= 2 else 0.6 + bar * 0.15)

    # piano arpeggio: sparse at dawn, fuller once the teachers appear
    pattern = [0, 2, 1, 3, 2, 1, 3, 2] if bar >= 2 else [0, 2, 1, 3]
    step = BAR / len(pattern)
    for k, idx in enumerate(pattern):
        at = t0 + k * step
        if at < finale - 0.05:
            place(music, piano(midi(notes[idx] + 12), vel=0.7 + 0.3 * (k % 2 == 0)), at, 0.8, pan=-0.3 + 0.6 * (k % 2))

    if bar >= 2:
        place(music, bass(midi(root), BAR), t0, 1.0)
        for b in range(4):
            at = t0 + b * BEAT
            if at < finale - 0.3:
                place(music, kick(), at, 0.5 if b % 2 == 0 else 0.25)
        for e in range(8):
            at = t0 + e * BEAT / 2 + 0.01
            if at < finale - 0.3:
                place(music, shaker(), at, 1.0 if e % 2 else 0.6, pan=0.35)

# glockenspiel hook over the middle section
hook = [76, 79, 81, 79, 84, 83, 79, 76]
for i, n in enumerate(hook * 2):
    at = S2 + 0.5 + i * BEAT
    if at < S4 - 0.2:
        place(music, glock(midi(n + 12)), at, 0.45, pan=0.25)

# build: a rising piano run into the reveal
run = [60, 64, 67, 72, 76, 79, 84, 88]
for i, n in enumerate(run):
    place(music, piano(midi(n), vel=0.6 + i * 0.05), finale - 0.8 + i * 0.1, 0.7)

# finale: big C major bloom that rings out to the end
tail = DUR - finale
place(music, pad([midi(n) for n in [48, 55, 60, 64, 67, 72, 76]], tail), finale, 1.25)
place(music, bass(midi(36), tail), finale, 1.1)
for i, n in enumerate([72, 76, 79, 84]):
    place(music, piano(midi(n), sec=4, vel=0.9), finale + i * 0.12, 0.9)
for i, n in enumerate([84, 88, 91, 96, 91, 88]):
    place(music, glock(midi(n)), finale + 0.6 + i * 0.25, 0.4, pan=-0.4 + i * 0.16)

music = reverb(music, 2.6, 0.32)
fade_in = np.minimum(1, np.arange(N) / (SR * 0.8))
fade_out = np.clip((DUR - np.arange(N) / SR) / 1.6, 0, 1) ** 1.5
music *= (fade_in * fade_out)[:, None]

# ---------------------------------------------------------------- sfx

sfx = np.zeros((N, 2))


def whoosh(sec=0.9, lo=300, hi=5000):
    """Noise swept through a moving band-pass, swelling then fading."""
    n = int(sec * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blocks = 48
    edges = np.linspace(0, n, blocks + 1).astype(int)
    for b in range(blocks):
        p = b / blocks
        c = lo * (hi / lo) ** (np.sin(p * np.pi) * 0.9)
        seg = bp(noise, c * 0.6, min(c * 1.6, SR / 2 - 100))[edges[b] : edges[b + 1]]
        out[edges[b] : edges[b + 1]] = seg
    t = np.linspace(0, 1, n)
    return out * np.sin(t * np.pi) ** 1.6 * 0.9


def handbell(strikes=6, rate=7.0):
    """A shaken brass school hand-bell: inharmonic partials, struck repeatedly."""
    sec = strikes / rate + 2.5
    t = t_axis(sec)
    out = np.zeros_like(t)
    base = 1318.5  # E6
    partials = [(0.5, 0.35, 1.2), (1.0, 1.0, 2.2), (1.19, 0.5, 3.0), (1.5, 0.45, 3.4), (2.0, 0.35, 4.0), (2.52, 0.22, 5.5), (3.0, 0.15, 6.5)]
    for s in range(strikes):
        st = s / rate
        tt = t - st
        m = tt >= 0
        vel = 1.0 - 0.08 * s if s % 2 == 0 else 0.8 - 0.08 * s
        for ratio, amp, dec in partials:
            out[m] += vel * amp * np.sin(2 * np.pi * base * ratio * tt[m] * (1 + 0.002 * (s % 2))) * np.exp(-tt[m] * dec)
        click = np.exp(-np.maximum(tt, 0) * 400) * m
        out += click * rng.standard_normal(len(t)) * 0.15 * vel
    return lp(out, 9000) * 0.12


def pop(f0=900, f1=260):
    t = t_axis(0.16)
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 40)) / SR
    return np.sin(ph) * np.exp(-t * 26) * 0.55


def sparkle(sec=0.8, grains=26, seed=0):
    r = np.random.default_rng(seed)
    out = np.zeros(int(sec * SR))
    for _ in range(grains):
        at = r.uniform(0, sec * 0.7)
        f = r.uniform(2500, 7500)
        g = np.sin(2 * np.pi * f * t_axis(0.18)) * np.exp(-t_axis(0.18) * 30)
        i = int(at * SR)
        seg = g[: len(out) - i]
        out[i : i + len(seg)] += seg * r.uniform(0.2, 1)
    return out * 0.09


def boom():
    t = t_axis(2.2)
    ph = 2 * np.pi * np.cumsum(34 + 50 * np.exp(-t * 6)) / SR
    body = np.sin(ph) * np.exp(-t * 2.2)
    thump = lp(rng.standard_normal(len(t)), 220) * np.exp(-t * 14) * 2
    return (body + thump) * 0.7


def riser(sec=2.0, lo=200, hi=3000):
    t = t_axis(sec)
    p = t / sec
    noise = whoosh(sec, lo, hi) * p
    ph = 2 * np.pi * np.cumsum(lo * (hi / lo) ** p * 0.5) / SR
    tone = np.sin(ph) * p**2 * 0.15
    return (noise * 0.5 + tone) * np.minimum(1, (sec - t) / 0.05)


def crackle(sec=1.4, count=60, seed=3):
    r = np.random.default_rng(seed)
    out = np.zeros(int(sec * SR))
    for _ in range(count):
        at = (r.uniform(0, 1) ** 2) * sec * 0.9
        g = hp(r.standard_normal(600), 2500) * np.exp(-np.arange(600) / 80)
        i = int(at * SR)
        out[i : i + 600] += g * r.uniform(0.1, 0.5)
    return out * 0.18


# Scene 1: dawn shimmer, then the bell as the title rises
place(sfx, riser(2.2, 150, 2500), 0.0, 0.35)
place(sfx, handbell(6, 7.0), f2s(56), 0.9, pan=0.15)
place(sfx, sparkle(1.0, 30, 1), f2s(62), 0.8)

# Transitions
for start, pan in ((S2, -0.5), (S3, 0.5), (S4, 0.0)):
    place(sfx, whoosh(0.85, 250, 6000), start - 0.45, 0.75, pan=pan)

# Scene 2: teachers step in, speech bubbles pop, caption shimmer
for k, frame in enumerate((6, 14, 22)):
    place(sfx, pop(520, 180), S2 + f2s(frame + 10), 0.35, pan=-0.4 + 0.4 * k)
for k, (frame, pan) in enumerate(((62, -0.5), (78, 0.5), (94, 0.0))):
    place(sfx, pop(1100 + 150 * k, 320), S2 + f2s(frame + 2), 0.75, pan=pan)
place(sfx, sparkle(0.9, 24, 4), S2 + f2s(104), 0.7)

# Scene 3: each word lands on a rising chime
for k, n in enumerate((84, 88, 91, 96)):
    at = S3 + f2s(24 + k * 22 + 4)
    place(sfx, glock(midi(n), 1.6, 1.0), at, 0.9, pan=-0.45 + 0.3 * k)
    place(sfx, pop(1400, 500), at, 0.25, pan=-0.45 + 0.3 * k)
place(sfx, sparkle(0.9, 20, 9), S3 + f2s(112), 0.5)

# Scene 4: title rise, then the big bell + boom + confetti
reveal = S4 + f2s(40)
place(sfx, riser(1.3, 300, 4000), reveal - 1.3, 0.5)
place(sfx, boom(), reveal, 0.9)
place(sfx, handbell(8, 8.0), reveal, 1.0, pan=-0.1)
place(sfx, crackle(1.6, 80, 5), reveal + 0.05, 0.9, pan=-0.3)
place(sfx, crackle(1.6, 80, 6), reveal + 0.1, 0.9, pan=0.3)
place(sfx, sparkle(1.4, 40, 11), reveal + 0.1, 0.9)
place(sfx, sparkle(1.0, 24, 12), S4 + f2s(88), 0.6)

sfx = reverb(sfx, 1.6, 0.2, seed=2)
sfx *= np.clip((DUR - np.arange(N) / SR) / 1.0, 0, 1)[:, None]


def write(path, x, peak):
    x = np.tanh(x / peak * 0.9) * 0.95  # gentle soft-clip at target level
    wavfile.write(path, SR, (x * 32767).astype(np.int16))


out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(out_dir, exist_ok=True)
write(os.path.join(out_dir, "music.wav"), music / np.max(np.abs(music)) * 0.62, 1.0)
write(os.path.join(out_dir, "sfx.wav"), sfx / np.max(np.abs(sfx)) * 0.8, 1.0)
print("wrote", out_dir)
