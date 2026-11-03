"""An original ambient track for PALE's Shift, synthesised from scratch (no samples, no licences).

Timed to the Shift: stage zooms start at 5.7, 13.9, 22.6 and 31.8 s, the last stage at 41.5 s
(no zoom), the flight home at 52.9 s and "Back on Earth" at about 57 s.
Key: D (draft 2, an octave higher), with open fifths and an added ninth. Each zoom out adds a layer; the last stage thins to
an open fifth and a single soft bell; the flight home gathers into a warm D major and fades.
"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave, sys

SR = 44100
LENGTH = 72.0
N = int(SR * LENGTH)
t = np.arange(N) / SR
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)

def smooth_env(on, off, attack, release):
    """Raised cosine fade in from `on`, hold, raised cosine fade out ending at `off`."""
    e = np.zeros(N)
    a0, a1 = on, on + attack
    r0, r1 = off - release, off
    rise = (t >= a0) & (t < a1)
    e[rise] = 0.5 - 0.5 * np.cos(np.pi * (t[rise] - a0) / attack)
    e[(t >= a1) & (t < r0)] = 1.0
    fall = (t >= r0) & (t < r1)
    e[fall] = 0.5 + 0.5 * np.cos(np.pi * (t[fall] - r0) / release)
    return e

def pad(freq, on, off, amp, attack=4.0, release=6.0, bright=0.25, pan=0.0, wobble=0.07):
    """A soft pad note: three detuned voices, a few gentle harmonics, a slow breathing swell."""
    env = smooth_env(on, off, attack, release)
    phase_lfo = rng.uniform(0, 2 * np.pi)
    breathe = 1.0 + 0.09 * np.sin(2 * np.pi * wobble * t + phase_lfo)
    out_l = np.zeros(N); out_r = np.zeros(N)
    for cents, side in ((-4, -1), (0, 0), (4, 1)):
        f = freq * 2 ** (cents / 1200)
        ph = rng.uniform(0, 2 * np.pi)
        tone = (np.sin(2 * np.pi * f * t + ph)
                + bright * np.sin(2 * np.pi * 2 * f * t + ph * 2)
                + bright * 0.35 * np.sin(2 * np.pi * 3 * f * t + ph * 3))
        p = np.clip(pan + 0.35 * side, -1, 1)
        out_l += tone * np.cos((p + 1) * np.pi / 4)
        out_r += tone * np.sin((p + 1) * np.pi / 4)
    g = amp * env * breathe / 3
    return out_l * g, out_r * g

def breath(on, dur, amp):
    """A soft filtered air sound that rises and falls over a zoom."""
    noise = rng.standard_normal((2, N))
    sos = butter(2, [250, 1400], btype="band", fs=SR, output="sos")
    noise = sosfilt(sos, noise, axis=1)
    env = np.zeros(N)
    m = (t >= on) & (t < on + dur)
    x = (t[m] - on) / dur
    env[m] = np.sin(np.pi * x) ** 2
    return noise[0] * env * amp, noise[1] * env * amp

def bell(freq, at, amp, decay=7.0):
    """A soft glass bell: a pure tone with one quiet inharmonic partial, dying away slowly."""
    m = t >= at
    x = t[m] - at
    e = np.exp(-x / decay) * (1 - np.exp(-x / 0.02))
    s = (np.sin(2 * np.pi * freq * x) + 0.18 * np.sin(2 * np.pi * freq * 2.76 * x) * np.exp(-x / 1.5))
    out = np.zeros(N); out[m] = s * e * amp
    return out * 0.9, out * 1.0

def add(pair):
    global L, R
    L += pair[0]; R += pair[1]

D2, D3, A3, D4, Fs4, A4, E5, A5, Cs6, D5, D6 = 73.42, 146.83, 220.0, 293.66, 369.99, 440.0, 659.26, 880.0, 1108.73, 587.33, 1174.66
END = 70.0

# Draft 2: the chord sits an octave higher than draft 1, in the range a phone speaker can play
# cleanly. A faint low D stays for headphones, and the noisy rushes of air are gone; each zoom is
# marked by a smooth swell of the new layer instead.

# The ground: an open fifth, there from the start to the end.
add(pad(D3, 0.0, END, 0.30, attack=4.5, release=10, bright=0.35, pan=-0.1))
add(pad(A3, 0.6, END, 0.20, attack=5.0, release=10, bright=0.3, pan=0.15))
add(pad(D2, 1.0, END, 0.07, attack=6.0, release=10, bright=0.6, pan=0.0))
# Stage 2, the Solar System: the octave.
add(pad(D4, 5.7, END - 1, 0.13, attack=3.5, release=9, pan=-0.25))
# Stage 3, the Milky Way: the chord fills in.
add(pad(Fs4, 13.9, 47.5, 0.085, attack=4.0, release=6, pan=0.3))
add(pad(A4, 14.4, END - 2, 0.09, attack=4.0, release=9, pan=-0.3))
# Stage 4, the Local Group: an airy ninth above.
add(pad(E5, 22.6, 47.0, 0.045, attack=4.5, release=6, bright=0.12, pan=0.45, wobble=0.11))
# Stage 5, everything we can see: the widest, a high shimmer.
add(pad(A5, 31.8, 46.5, 0.028, attack=5.0, release=6, bright=0.08, pan=-0.55, wobble=0.13))
add(pad(Cs6, 32.6, 46.0, 0.018, attack=5.0, release=6, bright=0.08, pan=0.6, wobble=0.17))
# Stage 6, "Somewhere in all of this is you": the shimmer falls away, one quiet bell.
add(bell(D5, 44.4, 0.09))
# The flight home: warmth gathers, then "Back on Earth" with a lower bell, and a long fade.
add(pad(Fs4, 53.5, END - 1, 0.07, attack=4.0, release=9, pan=0.2))
add(bell(A4, 57.3, 0.06, decay=8.0))

# Keep the very lowest frequencies out: phone speakers rattle on them.
_hp = butter(2, 60, btype="high", fs=SR, output="sos")
L = sosfilt(_hp, L); R = sosfilt(_hp, R)

# Warmth: roll off the top so it never sounds harsh on a phone speaker.
sos = butter(2, 3200, btype="low", fs=SR, output="sos")
L = sosfilt(sos, L); R = sosfilt(sos, R)

# Space: a long, soft synthetic reverb.
ir_len = int(SR * 4.5)
ir_t = np.arange(ir_len) / SR
ir = rng.standard_normal((2, ir_len)) * np.exp(-ir_t / 1.2)
ir = sosfilt(butter(2, 2500, btype="low", fs=SR, output="sos"), ir, axis=1)
ir /= np.sqrt(np.sum(ir ** 2, axis=1, keepdims=True))
wetL = fftconvolve(L, ir[0])[:N]
wetR = fftconvolve(R, ir[1])[:N]
L = 0.72 * L + 0.42 * wetL
R = 0.72 * R + 0.42 * wetR

# A final fade so the file ends in true silence.
fade = smooth_env(-1, LENGTH, 0.5, 4.0)
L *= fade; R *= fade

# Level: quiet and even. Peak at -8 dBFS.
peak = max(np.abs(L).max(), np.abs(R).max())
L *= 0.4 / peak; R *= 0.4 / peak
stereo = np.stack([L, R], axis=1)
pcm = (stereo * 32767).astype(np.int16)
out = sys.argv[1]
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
rms = np.sqrt(np.mean(stereo ** 2))
print(f"wrote {out}: {LENGTH:.0f}s, peak -6 dBFS, rms {20*np.log10(rms):.1f} dBFS")
