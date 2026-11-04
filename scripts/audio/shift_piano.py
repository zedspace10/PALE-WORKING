"""PALE's Shift music (draft 3, chosen): soft piano over a quiet ambient pad. Synthesised from scratch
(no samples, no licences), so the result belongs to Stellara.

Timed to the Shift: stage zooms start at 5.7, 13.9, 22.6 and 31.8 s, the last line at 41.5 s,
the flight home at 52.9 s and "Back on Earth" at about 57 s. Key of D, notes from the D major
pentatonic scale (D E F# A B), so nothing ever clashes. Each stage's phrase reaches a little
higher as the view widens; the last line gets single, spaced notes; the flight home steps down
to a rolled D major chord that rings out.
"""
import sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
LENGTH = 72.0
N = int(SR * LENGTH)
t = np.arange(N) / SR
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)

def smooth_env(on, off, attack, release):
    e = np.zeros(N)
    a0, a1, r0, r1 = on, on + attack, off - release, off
    m = (t >= a0) & (t < a1); e[m] = 0.5 - 0.5 * np.cos(np.pi * (t[m] - a0) / attack)
    e[(t >= a1) & (t < r0)] = 1.0
    m = (t >= r0) & (t < r1); e[m] = 0.5 + 0.5 * np.cos(np.pi * (t[m] - r0) / release)
    return e

def pad(freq, on, off, amp, attack=5.0, release=9.0, bright=0.25, pan=0.0, wobble=0.07):
    env = smooth_env(on, off, attack, release)
    breathe = 1.0 + 0.09 * np.sin(2 * np.pi * wobble * t + rng.uniform(0, 6.28))
    l = np.zeros(N); r = np.zeros(N)
    for cents, side in ((-4, -1), (0, 0), (4, 1)):
        f = freq * 2 ** (cents / 1200); ph = rng.uniform(0, 6.28)
        tone = np.sin(2*np.pi*f*t + ph) + bright*np.sin(4*np.pi*f*t + 2*ph) + bright*0.35*np.sin(6*np.pi*f*t + 3*ph)
        p = np.clip(pan + 0.35 * side, -1, 1)
        l += tone * np.cos((p + 1) * np.pi / 4); r += tone * np.sin((p + 1) * np.pi / 4)
    g = amp * env * breathe / 3
    return l * g, r * g

def piano_note(freq, vel, ring=9.0):
    """A soft felt piano tone, built from scratch.

    Strings are a little stiff, so each overtone sits slightly sharp of a whole multiple. The hammer
    strikes about a seventh of the way along, which quietens every seventh overtone. Each overtone
    is played by two strings tuned a hair apart and dies away in two stages, quickly at first and
    then slowly, as a real piano note does. Felt softens the high overtones, more so when played
    gently. Every note ends with a smooth release, because a cut off note clicks.
    """
    n_samp = int(SR * ring); tt = np.arange(n_samp) / SR
    out = np.zeros(n_samp)
    B = 0.00012 * (freq / 261.6) ** 0.9
    brightness = 1600 + 2400 * vel
    lr = np.random.default_rng(int(freq * 100))
    for n in range(1, 30):
        fn = n * freq * np.sqrt(1 + B * n * n)
        if fn > 9000: break
        amp = abs(np.sin(np.pi * n / 7.3)) / n ** 1.15 * np.exp(-fn / brightness)
        fast = 0.35 * (fn / 300) ** -0.35 + 0.05
        slow = 5.5 * (180 / fn) ** 0.55 + 0.4
        env = 0.55 * np.exp(-tt / fast) + 0.45 * np.exp(-tt / slow)
        for cents in (-0.35, 0.35):
            out += 0.5 * amp * env * np.sin(2*np.pi*fn*2**(cents/1200)*tt + lr.uniform(0, 6.28))
    attack = np.clip(tt / 0.006, 0, 1)
    rel = int(SR * 2.0); release = np.ones(n_samp)
    release[-rel:] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, rel))
    return out * attack * release * vel

NOTE = {}
for name, f in [("D2",73.42),("A2",110.0),("D3",146.83),("E3",164.81),("F#3",185.0),("A3",220.0),("B3",246.94),
                ("D4",293.66),("E4",329.63),("F#4",369.99),("A4",440.0),("B4",493.88),
                ("D5",587.33),("E5",659.26),("F#5",739.99),("A5",880.0)]:
    NOTE[name] = f

def play(name, at, vel):
    global L, R
    f = NOTE[name]
    s = piano_note(f, vel)
    i = int(at * SR); j = min(N, i + len(s)); s = s[: j - i]
    # Low notes a little to the left, high notes a little to the right, as at a piano.
    pan = np.clip((np.log2(f / 293.66)) * 0.35, -0.6, 0.6)
    L[i:j] += s * np.cos((pan + 1) * np.pi / 4); R[i:j] += s * np.sin((pan + 1) * np.pi / 4)

# ---- the pad, quieter than draft 2, underneath everything
END = 70.0
def addp(pair):
    global L, R
    L += pair[0]; R += pair[1]
addp(pad(146.83, 0.0, END, 0.15, attack=5, release=10, bright=0.3, pan=-0.1))   # D3
addp(pad(220.0, 0.6, END, 0.10, attack=5, release=10, bright=0.25, pan=0.15))   # A3
addp(pad(73.42, 1.0, END, 0.04, attack=6, release=10, bright=0.6))             # faint D2
addp(pad(293.66, 13.9, END - 2, 0.05, attack=5, release=9, pan=-0.25))          # D4 from the Milky Way
addp(pad(659.26, 31.8, 46.0, 0.014, attack=6, release=6, bright=0.08, pan=0.5, wobble=0.13))  # E5 shimmer

# ---- the piano
score = [
    # 1. You are here
    ("D4", 1.0, 0.40), ("A4", 2.5, 0.34), ("F#4", 3.8, 0.32),
    # 2. The Solar System
    ("D3", 5.9, 0.42), ("A3", 7.4, 0.34), ("E4", 8.7, 0.33), ("F#4", 10.0, 0.34), ("D4", 11.8, 0.30),
    # 3. The Milky Way
    ("D3", 14.1, 0.40), ("A3", 15.5, 0.33), ("D4", 16.8, 0.34), ("E4", 18.0, 0.33), ("A4", 19.4, 0.35), ("F#4", 21.0, 0.30),
    # 4. The Local Group
    ("A2", 22.8, 0.40), ("F#4", 24.3, 0.33), ("A4", 25.6, 0.34), ("B4", 26.9, 0.33), ("A4", 28.5, 0.30), ("E4", 30.1, 0.28),
    # 5. Everything we can see: the widest
    ("D2", 32.0, 0.36), ("D3", 32.05, 0.30), ("A4", 33.4, 0.32), ("D5", 34.7, 0.33), ("E5", 35.9, 0.31),
    ("F#5", 37.3, 0.30), ("A5", 39.0, 0.24), ("E5", 40.4, 0.24),
    # 6. Somewhere in all of this is you: single, spaced notes
    ("D4", 42.6, 0.34), ("A3", 45.2, 0.30), ("F#4", 45.25, 0.30), ("D4", 48.6, 0.28),
    # The flight home, stepping down
    ("A4", 53.2, 0.30), ("F#4", 54.4, 0.30), ("E4", 55.5, 0.30), ("D4", 56.5, 0.30),
    # Back on Earth: a rolled D major chord that rings out
    ("D3", 57.2, 0.36), ("A3", 57.32, 0.32), ("F#4", 57.44, 0.32), ("D5", 57.56, 0.30),
]
for name, at, vel in score:
    play(name, at, vel)

# Remove the very lowest frequencies (phone speakers rattle on them) and soften the very top.
hp = butter(2, 60, btype="high", fs=SR, output="sos"); lp = butter(2, 4500, btype="low", fs=SR, output="sos")
L = sosfilt(lp, sosfilt(hp, L)); R = sosfilt(lp, sosfilt(hp, R))

# A soft hall around it.
ir_len = int(SR * 4.5); ir_t = np.arange(ir_len) / SR
ir = rng.standard_normal((2, ir_len)) * np.exp(-ir_t / 1.3)
ir = sosfilt(butter(2, 3000, btype="low", fs=SR, output="sos"), ir, axis=1)
ir /= np.sqrt(np.sum(ir ** 2, axis=1, keepdims=True))
wetL = fftconvolve(L, ir[0])[:N]; wetR = fftconvolve(R, ir[1])[:N]
L = 0.7 * L + 0.48 * wetL; R = 0.7 * R + 0.48 * wetR

fade = smooth_env(-1, LENGTH, 0.5, 5.0)
L *= fade; R *= fade
peak = max(np.abs(L).max(), np.abs(R).max()); L *= 0.4 / peak; R *= 0.4 / peak
pcm = (np.stack([L, R], 1) * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("wrote", sys.argv[1])
