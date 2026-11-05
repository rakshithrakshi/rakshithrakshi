"""Synthesize the score and sound effects for the Deepavali shadow-puppet film.

Writes public/audio/music.wav and public/audio/sfx.wav (48 kHz stereo, 78 s).
Cue frames mirror src/timeline.ts and the beat constants in the scenes
(S5Battle BATTLE, S7Light LIGHT); change them together.

Instruments are all synthesized: tanpura drone, bansuri flute, veena
(Karplus-Strong), mridangam, conch (shankha), temple bells, ghungroo.
Ragas: Mohanam (hope) and Shivaranjani (sorrow), Sa = D.
"""

import os

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, lfilter, sosfilt

SR = 48000
FPS = 30
DUR = 78.0
N = int(SR * DUR)
rng = np.random.default_rng(11)

# scene starts (frames), from src/timeline.ts
S = dict(title=0, demon=180, darkness=480, call=780, battle=1080, wish=1440, light=1740, message=2040)
BATTLE = dict(chakraOut=20, chakraHit=58, arrowOut=70, arrowHit=92, raise_=115, draw=150, release=228, impact=250)


def sec(frame):
    return frame / FPS


def t_axis(s):
    return np.arange(int(SR * s)) / SR


def place(buf, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0:
        return
    sig = sig[: len(buf) - i]
    buf[i : i + len(sig), 0] += sig * gain * np.cos((pan + 1) * np.pi / 4)
    buf[i : i + len(sig), 1] += sig * gain * np.sin((pan + 1) * np.pi / 4)


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, max(lo + 10, min(hi, SR / 2 - 200))], "band", fs=SR, output="sos"), x)


def reverb(stereo, seconds=2.6, wet=0.3, seed=1):
    r = np.random.default_rng(seed)
    t = t_axis(seconds)
    out = stereo.copy()
    for ch in range(2):
        ir = r.standard_normal(len(t)) * np.exp(-t * 6.0 / seconds)
        ir = lp(ir, 6500)
        ir /= np.sqrt(np.sum(ir**2))
        out[:, ch] = stereo[:, ch] * (1 - wet) + fftconvolve(stereo[:, ch], ir)[: len(stereo)] * wet * 2.0
    return out


SA = 146.83  # D3


def swara(semi, octave=0):
    return SA * 2 ** ((semi + 12 * octave) / 12)


# ---------------------------------------------------------------- instruments


def tanpura(seconds, level=1.0):
    """Four strings (Pa, Sa', Sa', Sa) plucked in a cycle, rich jawari overtones."""
    out = np.zeros(int(seconds * SR))
    strings = [swara(7, -1), swara(0, 0), swara(0, 0), swara(0, -1)]
    period = 0.7
    k = 0
    t0 = 0.0
    while t0 < seconds:
        f = strings[k % 4]
        n = int(min(3.2, seconds - t0) * SR)
        if n <= 0:
            break
        t = np.arange(n) / SR
        sig = np.zeros(n)
        for h in range(1, 16):
            # jawari: upper partials swell slightly after the pluck
            env = np.exp(-t * (0.6 + h * 0.08)) * (1 - np.exp(-t * (4 + h)))
            sig += np.sin(2 * np.pi * f * h * (1 + 0.0007 * h) * t + rng.uniform(0, 6)) * env / h**0.9
        i = int(t0 * SR)
        out[i : i + n] += sig[: len(out) - i]
        t0 += period
        k += 1
    return lp(out, 4200) * 0.05 * level


def flute(phrase, start_pad=0.0):
    """Bansuri: phrase = [(t, semitone, dur)], glides between notes, breath and vibrato."""
    end = max(t + d for t, _, d in phrase) + 1.2
    n = int(end * SR)
    t = np.arange(n) / SR
    freq = np.full(n, swara(phrase[0][1], 2))
    amp = np.zeros(n)
    for j, (st, semi, d) in enumerate(phrase):
        f = swara(semi, 2)
        i0, i1 = int(st * SR), int((st + d) * SR)
        glide = int(0.07 * SR)
        prev = freq[i0 - 1] if i0 > 0 else f
        freq[i0 : i0 + glide] = np.linspace(prev, f, glide)[: len(freq[i0 : i0 + glide])]
        freq[i0 + glide :] = f
        a = np.zeros(n)
        seg = np.arange(i1 - i0) / SR
        a[i0:i1] = np.minimum(1, seg / 0.08) * np.minimum(1, (d - seg) / 0.12 + 0.15)
        amp = np.maximum(amp, np.clip(a, 0, 1))
    amp = lp(amp, 30)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.clip(amp, 0, 1)
    ph = 2 * np.pi * np.cumsum(freq * vib) / SR
    tone = np.sin(ph) + 0.22 * np.sin(2 * ph) + 0.07 * np.sin(3 * ph)
    breath = bp(rng.standard_normal(n), 900, 5000) * 0.12
    return lp((tone + breath) * amp, 7000) * 0.22


def veena(semi, octave=1, seconds=2.4, vel=1.0):
    """Karplus-Strong plucked string with a resonant body."""
    f = swara(semi, octave)
    p = int(SR / f)
    n = int(seconds * SR)
    x = np.zeros(n)
    x[:p] = rng.uniform(-1, 1, p) * vel
    a = np.zeros(p + 2)
    a[0] = 1
    a[p] = -0.497
    a[p + 1] = -0.497
    y = lfilter([1.0], a, x)
    return lp(y, 3800) * 0.35


def mridangam(stroke):
    if stroke == "T":  # tha / dhi: bass with pitch drop
        t = t_axis(0.5)
        ph = 2 * np.pi * np.cumsum(90 + 70 * np.exp(-t * 22)) / SR
        return np.sin(ph) * np.exp(-t * 7) * 0.8
    if stroke == "N":  # nam: ringing treble head
        t = t_axis(0.6)
        return (np.sin(2 * np.pi * 620 * t) + 0.4 * np.sin(2 * np.pi * 1240 * t)) * np.exp(-t * 6) * 0.35 + bp(rng.standard_normal(len(t)), 800, 3000) * np.exp(-t * 60) * 0.3
    if stroke == "k":  # ki / ta: short slap
        t = t_axis(0.12)
        return bp(rng.standard_normal(len(t)), 1200, 5000) * np.exp(-t * 55) * 0.5 + np.sin(2 * np.pi * 700 * t) * np.exp(-t * 40) * 0.2
    return np.zeros(1)


def drum_pattern(buf, start, end, bpm, pattern, gain=1.0, pan=0.0):
    step = 60 / bpm / 2  # pattern is in 8ths
    t = start
    i = 0
    while t < end:
        s = pattern[i % len(pattern)]
        if s != ".":
            place(buf, mridangam(s), t, gain * (1.0 if i % 4 == 0 else 0.8), pan)
        t += step
        i += 1


def thavil(big=False):
    t = t_axis(0.8)
    ph = 2 * np.pi * np.cumsum(60 + 90 * np.exp(-t * 18)) / SR
    body = np.sin(ph) * np.exp(-t * (4 if big else 7))
    crack = bp(rng.standard_normal(len(t)), 300, 2500) * np.exp(-t * 30)
    return (body + crack * 0.5) * (1.0 if big else 0.7)


def temple_bell(f0=420, seconds=5.0):
    t = t_axis(seconds)
    sig = np.zeros_like(t)
    for ratio, amp, dec in [(0.5, 0.5, 0.5), (1.0, 1.0, 0.9), (1.183, 0.6, 1.2), (1.506, 0.5, 1.5), (2.0, 0.4, 2.0), (2.74, 0.3, 2.8), (3.76, 0.2, 3.5)]:
        sig += amp * np.sin(2 * np.pi * f0 * ratio * t * (1 + 0.0015 * np.sin(2 * np.pi * 1.3 * t))) * np.exp(-t * dec)
    strike = bp(rng.standard_normal(len(t)), 2000, 8000) * np.exp(-t * 120) * 0.5
    return (sig + strike) * 0.16


def conch(seconds=2.6, f=233.0):
    t = t_axis(seconds)
    env = np.minimum(1, t / 0.5) * np.minimum(1, (seconds - t) / 0.6)
    bend = 1 + 0.03 * np.minimum(1, t / 0.4) - 0.03
    ph = 2 * np.pi * np.cumsum(f * bend * (1 + 0.004 * np.sin(2 * np.pi * 5 * t))) / SR
    tone = sum(np.sin(h * ph) / h ** 0.7 for h in range(1, 12))
    tone = bp(tone, 180, 3200)
    breath = bp(rng.standard_normal(len(t)), 600, 4000) * 0.08
    return (tone * 0.25 + breath) * env * 0.5


def ghungroo(seconds=0.6, density=40):
    out = np.zeros(int(seconds * SR))
    for _ in range(int(density * seconds)):
        at = rng.uniform(0, seconds * 0.85)
        g = np.zeros(int(0.08 * SR))
        tt = np.arange(len(g)) / SR
        for f in (rng.uniform(4200, 5200), rng.uniform(6200, 7400)):
            g += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 45)
        i = int(at * SR)
        out[i : i + len(g)] += g[: len(out) - i] * rng.uniform(0.2, 0.6)
    return out * 0.1


def glock(semi, octave=3, seconds=1.6):
    f = swara(semi, octave)
    t = t_axis(seconds)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 2.5) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 7)) * np.minimum(1, t / 0.002) * 0.2


# ---------------------------------------------------------------- score

music = np.zeros((N, 2))

# tanpura drone runs throughout, quieter in the battle
drone = tanpura(DUR)
dl = np.ones(N)
for a, b, v in [(S["battle"], S["wish"], 0.45), (S["wish"], S["light"], 1.2)]:
    dl[int(sec(a) * SR) : int(sec(b) * SR)] = v
dl = lp(dl, 2)
place(music, drone * dl, 0, 1.0)

MOHANAM = [0, 2, 4, 7, 9, 12, 14, 16]  # S R G P D S' R' G'
# Title: a slow, rising bansuri alaap
place(music, flute([(0.6, 7, 0.9), (1.5, 9, 0.6), (2.1, 12, 1.4), (3.6, 14, 0.5), (4.1, 12, 0.6), (4.7, 9, 1.0)]), 0, 1.0, pan=-0.15)
place(music, veena(0, 1, 3.0), sec(72) - 0.1, 0.8, pan=0.2)
for k, semi in enumerate([0, 4, 7, 12]):
    place(music, veena(semi, 1, 2.0, 0.7), sec(72) + k * 0.09, 0.5, pan=0.2)

# Narakasura: low menace, slow heavy drums
for k in range(10):
    place(music, thavil(big=k % 4 == 0), sec(S["demon"]) + k * 1.0, 0.55, pan=-0.2)
place(music, veena(1, -1, 4.0), sec(S["demon"]) + 0.2, 0.9)  # flat ri: a dark colour
place(music, veena(1, -1, 4.0), sec(S["demon"]) + 4.2, 0.9)

# Darkness: Shivaranjani on flute, sinking
place(music, flute([(0.5, 12, 1.0), (1.6, 9, 0.8), (2.5, 7, 1.0), (3.6, 3, 1.4), (5.2, 2, 0.8), (6.1, 0, 2.2)]), sec(S["darkness"]), 0.9, pan=-0.1)

# Call to Krishna: hope returns, flute in Mohanam over a light mridangam
place(music, flute([(0.2, 0, 0.4), (0.6, 4, 0.4), (1.0, 7, 0.6), (1.7, 9, 0.4), (2.1, 12, 1.0), (3.3, 9, 0.4), (3.7, 12, 0.4), (4.1, 14, 0.8), (5.0, 16, 1.2)]), sec(S["call"]), 1.0, pan=-0.15)
drum_pattern(music, sec(S["call"]) + 1.0, sec(S["call"] + 205), 96, "T.kNT.kN", 0.55, pan=0.25)
drum_pattern(music, sec(S["call"] + 205), sec(S["battle"]), 120, "TkTkNkTk", 0.6, pan=0.2)

# Battle: thavil war rhythm, then silence before the arrow, then the hit
bs = sec(S["battle"])
drum_pattern(music, bs + 0.3, bs + sec(BATTLE["raise_"]), 150, "TkkTkNTk", 0.75, pan=0.15)
for k in range(int(sec(BATTLE["raise_"]) / 0.4)):
    place(music, thavil(big=k % 4 == 0), bs + 0.3 + k * 0.4, 0.45, pan=-0.2)
# tension: rising veena tremolo during the draw
for k in range(18):
    place(music, veena(7 + (k // 6), 0, 0.5, 0.6), bs + sec(BATTLE["draw"]) + k * 0.14, 0.5 + k * 0.03)

# Last wish: sorrowful flute, resolving to the major third on "ತಥಾಸ್ತು"
ws = sec(S["wish"])
place(music, flute([(0.6, 12, 1.2), (2.0, 10, 0.6), (2.7, 9, 1.0), (3.9, 7, 0.8), (4.8, 3, 1.6), (6.6, 2, 0.6), (7.3, 0, 2.0)]), ws, 0.85, pan=-0.1)
place(music, flute([(0.0, 4, 0.8), (0.9, 7, 0.6), (1.6, 12, 2.0)]), ws + sec(225), 1.0, pan=-0.1)
for k, semi in enumerate([0, 4, 7, 12, 16]):
    place(music, veena(semi, 1, 3.0, 0.7), ws + sec(225) + k * 0.11, 0.55, pan=0.25)

# Light returns: dawn theme with veena and a happy mridangam groove
ls = sec(S["light"])
place(music, flute([(0.3, 0, 0.3), (0.6, 2, 0.3), (0.9, 4, 0.6), (1.6, 7, 0.4), (2.0, 9, 0.4), (2.4, 12, 1.0), (3.6, 9, 0.3), (3.9, 7, 0.3), (4.2, 9, 0.3), (4.5, 12, 0.8), (5.5, 14, 0.4), (5.9, 16, 0.4), (6.3, 14, 0.4), (6.7, 12, 1.4)]), ls, 1.0, pan=-0.15)
drum_pattern(music, ls + 0.6, sec(S["message"]), 108, "TkNkTTkN", 0.6, pan=0.2)
for k in range(16):
    place(music, veena(MOHANAM[k % 5] + (12 if k % 8 >= 5 else 0), 1, 1.8, 0.6), ls + 4.6 + k * (60 / 108 / 2), 0.4, pan=0.3)

# Message: the full theme, a final bloom on Sa and ring-out
ms = sec(S["message"])
place(music, flute([(0.4, 7, 0.6), (1.1, 9, 0.5), (1.7, 12, 1.2), (3.0, 14, 0.5), (3.6, 16, 0.5), (4.2, 14, 0.5), (4.8, 12, 1.4), (6.4, 9, 0.5), (7.0, 12, 2.6)]), ms, 1.0, pan=-0.15)
drum_pattern(music, ms + 0.4, ms + 5.6, 108, "TkNkTkNN", 0.55, pan=0.2)
for k, semi in enumerate([0, 7, 12, 16, 19, 24]):
    place(music, veena(semi, 1, 4.0, 0.8), ms + 6.2 + k * 0.1, 0.6, pan=-0.3 + k * 0.12)
place(music, tanpura(4.0, 2.0), ms + 6.0, 1.0)

music = reverb(music, 3.0, 0.3)
fi = np.minimum(1, np.arange(N) / (SR * 1.0))
fo = np.clip((DUR - np.arange(N) / SR) / 3.0, 0, 1) ** 1.4
music *= (fi * fo)[:, None]

# ---------------------------------------------------------------- sfx

sfx = np.zeros((N, 2))


def whoosh(seconds=0.9, lo=250, hi=5500):
    n = int(seconds * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blocks = 40
    edges = np.linspace(0, n, blocks + 1).astype(int)
    for b in range(blocks):
        c = lo * (hi / lo) ** (np.sin(b / blocks * np.pi) * 0.9)
        out[edges[b] : edges[b + 1]] = bp(noise, c * 0.6, c * 1.6)[edges[b] : edges[b + 1]]
    return out * np.sin(np.linspace(0, np.pi, n)) ** 1.6 * 0.8


def match_strike():
    t = t_axis(0.9)
    scratch = bp(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-((t - 0.08) ** 2) / 0.002) * 0.8
    flare = lp(rng.standard_normal(len(t)), 1200) * np.exp(-t * 3) * np.minimum(1, np.maximum(0, (t - 0.12) * 20)) * 0.6
    return scratch + flare


def thunder(seconds=3.5):
    t = t_axis(seconds)
    crack = hp(rng.standard_normal(len(t)), 800) * np.exp(-t * 18) * 0.7
    roll = lp(rng.standard_normal(len(t)), 160) * np.exp(-t * 1.1) * (1 + 0.5 * np.sin(2 * np.pi * 3 * t)) * 2.4
    return crack + roll


def shing():
    t = t_axis(1.0)
    ring = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in [(2300, 4), (3410, 6), (5100, 9)]) * 0.12
    swipe = np.zeros(len(t))
    w = whoosh(0.3, 2000, 8000)
    swipe[: len(w)] = w * 0.6
    return ring + swipe


def thud(f0=70, seconds=0.7):
    t = t_axis(seconds)
    ph = 2 * np.pi * np.cumsum(f0 * (1 + 1.2 * np.exp(-t * 25))) / SR
    return np.sin(ph) * np.exp(-t * 8) + lp(rng.standard_normal(len(t)), 400) * np.exp(-t * 30) * 0.6


def boom(seconds=3.0):
    t = t_axis(seconds)
    ph = 2 * np.pi * np.cumsum(32 + 60 * np.exp(-t * 5)) / SR
    return np.sin(ph) * np.exp(-t * 1.6) * 1.1 + lp(rng.standard_normal(len(t)), 300) * np.exp(-t * 6) * 1.2 + hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 25) * 0.5


def clink(f=1800):
    t = t_axis(0.5)
    return (np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * f * 2.3 * t)) * np.exp(-t * 14) * 0.25


def footsteps(seconds, rate=5.5, gain=1.0):
    out = np.zeros(int(seconds * SR))
    for k in range(int(seconds * rate)):
        g = lp(rng.standard_normal(int(0.08 * SR)), 900) * np.exp(-np.arange(int(0.08 * SR)) / SR * 50)
        i = int(k / rate * SR)
        out[i : i + len(g)] += g[: len(out) - i] * gain * 0.4
    return out


def wing_flap():
    t = t_axis(0.5)
    return lp(rng.standard_normal(len(t)), 500) * np.sin(np.pi * np.minimum(1, t / 0.35)) ** 2 * 0.9


def wind(seconds):
    t = t_axis(seconds)
    return bp(rng.standard_normal(len(t)), 300, 1600) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.3 * t)) * np.sin(np.linspace(0, np.pi, len(t))) * 0.35


def whirr(seconds):
    t = t_axis(seconds)
    ph = 2 * np.pi * np.cumsum(180 + 40 * np.sin(2 * np.pi * 7 * t)) / SR
    return (np.sin(ph) * 0.3 + bp(rng.standard_normal(len(t)), 800, 3000) * 0.15) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 9 * t))) * np.sin(np.linspace(0, np.pi, len(t))) ** 0.5


def bow_creak(seconds):
    t = t_axis(seconds)
    f = 120 + 160 * (t / seconds) ** 1.5
    ph = 2 * np.pi * np.cumsum(f) / SR
    grain = (np.sin(ph) > 0.92).astype(float)
    return bp(grain, 400, 3000) * 0.25 * (t / seconds)


def twang():
    t = t_axis(1.2)
    return np.sin(2 * np.pi * 110 * t * (1 + 0.15 * np.exp(-t * 20))) * np.exp(-t * 5) * 0.6 + np.sin(2 * np.pi * 220 * t) * np.exp(-t * 8) * 0.3


def heartbeat(seconds, bpm=72):
    out = np.zeros(int(seconds * SR))
    beat = 60 / bpm
    for k in range(int(seconds / beat) + 1):
        for off, g in ((0, 1.0), (0.22, 0.7)):
            s = thud(48, 0.4) * g * 0.5
            i = int((k * beat + off) * SR)
            if i < len(out):
                out[i : i + len(s)] += s[: len(out) - i]
    return out


def shimmer(seconds=1.2, grains=34, seed=0):
    r = np.random.default_rng(seed)
    out = np.zeros(int(seconds * SR))
    for _ in range(grains):
        at = r.uniform(0, seconds * 0.7)
        f = r.uniform(2500, 7500)
        tt = t_axis(0.2)
        g = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 26)
        i = int(at * SR)
        out[i : i + len(g)] += g[: len(out) - i] * r.uniform(0.2, 1)
    return out * 0.08


def crackle(seconds=1.4, count=60, seed=3):
    r = np.random.default_rng(seed)
    out = np.zeros(int(seconds * SR))
    for _ in range(count):
        at = (r.uniform(0, 1) ** 1.5) * seconds * 0.9
        g = hp(r.standard_normal(500), 2500) * np.exp(-np.arange(500) / 70)
        i = int(at * SR)
        out[i : i + 500] += g[: len(out) - i] * r.uniform(0.1, 0.5)
    return out * 0.2


def firework():
    t = t_axis(2.2)
    pop = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 18) * 0.8
    return pop + np.concatenate([np.zeros(int(0.12 * SR)), crackle(2.08, 70, int(rng.integers(100)))])[: len(t)]


def chirp():
    t = t_axis(0.18)
    f = 3200 + 1800 * np.sin(np.pi * t / 0.18)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.18) * 0.12


def growl(seconds=2.0):
    t = t_axis(seconds)
    ph = 2 * np.pi * np.cumsum(70 + 8 * np.sin(2 * np.pi * 6 * t)) / SR
    tone = sum(np.sin(h * ph) / h for h in range(1, 10))
    return lp(tone * (1 + 0.6 * np.sin(2 * np.pi * 11 * t)), 900) * np.sin(np.linspace(0, np.pi, len(t))) * 0.35


# Title: match strike, flame, diya tinkles, bell
place(sfx, match_strike(), sec(8), 0.9, pan=0.05)
place(sfx, whoosh(0.8, 200, 1800), sec(12), 0.35)
for k in range(10):
    place(sfx, glock(MOHANAM[k % 6], 3, 1.2), sec(40 + k * 3), 0.35, pan=-0.6 + k * 0.13)
for k in range(16):
    place(sfx, glock(MOHANAM[(k + 2) % 7], 3, 1.0), sec(64 + k * 2), 0.22, pan=0.6 - k * 0.08)
place(sfx, shimmer(1.4, 40, 1), sec(72), 0.9)
place(sfx, temple_bell(420), sec(100), 1.0, pan=-0.1)

# Narakasura: thunder, sword, growl, embers
d0 = S["demon"]
for k, fr in enumerate((52, 190)):
    place(sfx, thunder(), sec(d0 + fr), 0.9, pan=-0.3 + 0.6 * k)
place(sfx, shing(), sec(d0 + 105), 0.8, pan=0.2)
place(sfx, growl(2.4), sec(d0 + 120), 0.8)
place(sfx, crackle(9.5, 160, 4), sec(d0), 0.35)

# Darkness: a whoosh into each beat, fleeing feet, the grab, chains
z0 = S["darkness"]
for k in range(3):
    place(sfx, whoosh(0.8), sec(z0 + k * 100) - 0.3, 0.6, pan=-0.4 + 0.4 * k)
place(sfx, footsteps(3.0, 6.5), sec(z0 + 4), 0.8, pan=0.2)
place(sfx, whoosh(1.2, 120, 1500), sec(z0 + 100), 0.8)
place(sfx, thud(55, 0.9), sec(z0 + 140), 0.9)
place(sfx, shimmer(1.6, 30, 3), sec(z0 + 110), 0.6)
for k in range(9):
    place(sfx, clink(1500 + (k % 3) * 400), sec(z0 + 206 + k * 9), 0.5, pan=-0.5 + (k % 5) * 0.25)
place(sfx, whoosh(2.8, 1200, 120), sec(z0 + 220), 0.5)

# Call to Krishna: bell, footsteps, anklets, bow lift, Garuda takeoff
c0 = S["call"]
place(sfx, temple_bell(520, 4.0), sec(c0 + 4), 0.6, pan=0.3)
place(sfx, footsteps(1.1, 5.5), sec(c0), 0.7, pan=-0.4)
place(sfx, ghungroo(1.1, 50), sec(c0 + 118), 0.9, pan=0.5)
place(sfx, whoosh(0.5, 600, 4000), sec(c0 + 150), 0.4, pan=0.4)
place(sfx, whoosh(0.9), sec(c0 + 205) - 0.4, 0.7)
place(sfx, conch(2.2), sec(c0 + 208), 0.6, pan=-0.2)
place(sfx, wind(3.2), sec(c0 + 205), 0.9)
for k in range(5):
    place(sfx, wing_flap(), sec(c0 + 205 + k * 20), 0.7, pan=-0.6 + k * 0.3)

# Battle
b0 = S["battle"]
B = BATTLE
place(sfx, conch(2.8, 220), sec(b0) + 0.1, 0.9)
place(sfx, wind(12.0), sec(b0), 0.35)
for k in range(17):
    place(sfx, wing_flap(), sec(b0) + k * (2 * np.pi * 3.4 / FPS), 0.25, pan=0.5)
place(sfx, whirr(sec(B["chakraHit"] - B["chakraOut"] + 28)), sec(b0 + B["chakraOut"]), 0.8, pan=-0.2)
place(sfx, clink(2400) * 3, sec(b0 + B["chakraHit"]), 0.8, pan=-0.6)
place(sfx, thud(80, 0.6), sec(b0 + B["chakraHit"]), 0.6, pan=-0.6)
place(sfx, whoosh(0.8, 400, 6000), sec(b0 + B["arrowOut"]), 0.8, pan=-0.4)
place(sfx, thud(65, 0.8), sec(b0 + B["arrowHit"]), 0.9, pan=0.5)
place(sfx, bow_creak(sec(B["release"] - B["draw"])), sec(b0 + B["draw"]), 1.0, pan=0.4)
place(sfx, heartbeat(sec(B["release"] - B["draw"]) + 0.3, 80), sec(b0 + B["draw"]), 0.8)
place(sfx, twang(), sec(b0 + B["release"]), 0.9, pan=0.4)
place(sfx, whoosh(0.8, 300, 7000), sec(b0 + B["release"]), 1.0, pan=0.0)
place(sfx, boom(), sec(b0 + B["impact"]), 1.0)
place(sfx, crackle(2.5, 120, 9), sec(b0 + B["impact"]) + 0.05, 0.9)
place(sfx, shimmer(2.0, 50, 9), sec(b0 + B["impact"]) + 0.1, 0.8)
place(sfx, thud(50, 1.0), sec(b0 + B["impact"] + 50), 0.8, pan=-0.5)

# Last wish: gold dust shimmer, the blessing
w0 = S["wish"]
place(sfx, shimmer(6.0, 50, 12), sec(w0 + 20), 0.35, pan=-0.5)
place(sfx, temple_bell(350, 6.0), sec(w0 + 225), 0.9)
place(sfx, shimmer(2.0, 60, 13), sec(w0 + 225), 0.9, pan=0.4)

# Light returns: bars dissolve, dawn birds; then diyas and distant fireworks
l0 = S["light"]
place(sfx, shimmer(2.2, 70, 14), sec(l0 + 10), 0.8)
for k in range(12):
    place(sfx, chirp(), sec(l0 + 40) + k * 0.31 + (k % 3) * 0.07, 0.5, pan=0.6 - (k % 4) * 0.3)
place(sfx, whoosh(0.7, 300, 3000), sec(l0 + 130) - 0.3, 0.4)
# each diya lights as the child's hand passes it (S7Light LIGHT: linear walk 380→1420 over frames 140→280, hand +172)
for k in range(9):
    fr = 140 + (560 + 100 * k + 40 - 172 - 380) / 1040 * 140
    place(sfx, glock(MOHANAM[k % 6], 3, 1.0), sec(l0 + fr), 0.35, pan=-0.6 + k * 0.15)
    place(sfx, match_strike()[: int(0.3 * SR)] * 0.25, sec(l0 + fr) - 0.05, 0.5, pan=-0.6 + k * 0.15)
for k, fr in enumerate((160, 200, 240, 270)):
    place(sfx, firework(), sec(l0 + fr), 0.35, pan=[-0.6, 0.6, 0.0, 0.3][k])

# Message: bell, shimmer, end-card bell
m0 = S["message"]
place(sfx, temple_bell(420), sec(m0), 0.8)
place(sfx, shimmer(1.6, 40, 15), sec(m0 + 20), 0.8)
place(sfx, shimmer(1.6, 40, 16), sec(m0 + 186), 0.9)
place(sfx, temple_bell(560, 6.0), sec(m0 + 190), 0.8, pan=0.2)

sfx = reverb(sfx, 1.8, 0.22, seed=2)
sfx *= np.clip((DUR - np.arange(N) / SR) / 2.0, 0, 1)[:, None]


def write(path, x, peak):
    x = x / max(np.max(np.abs(x)), 1e-9) * peak
    x = np.tanh(x * 1.1) / np.tanh(1.1)
    wavfile.write(path, SR, (x * 32767 * 0.97).astype(np.int16))


out = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(out, exist_ok=True)
write(os.path.join(out, "music.wav"), music, 0.6)
write(os.path.join(out, "sfx.wav"), sfx, 0.85)
print("wrote", out)
