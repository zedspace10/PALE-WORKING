"""PALE's Shift music: warm, slow chords with no melody, one chord per stage, swelling gently
as the view widens and a faint high shimmer on the last line. Synthesised from scratch (no
samples, no licences), so the result belongs to Stellara.

Timed to the Shift (TRACK_CUES in constants/shiftTiming.ts): stages at 0.62, 5.72, 13.92, 22.62
and 31.82 s, the last line at 41.52 s, the flight home at 52.02 s, back on Earth at about 57 s,
silent by 70 s. Nothing below 90 Hz, so phone speakers do not rattle.

The other two styles ("organ" and "stars") were drafts and are kept for reference.

    python3 shift_pad.py pad shift.wav
    ffmpeg -i shift.wav -af loudnorm=I=-23:TP=-3:LRA=11 -c:a aac -b:a 160k shift-ambient.m4a
"""
import sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100; LENGTH = 72.0; N = int(SR * LENGTH)
rng = np.random.default_rng(7)
CUES = [0.62, 5.72, 13.92, 22.62, 31.82, 41.52, 52.02, 57.0]

def hz(note):
    names = {'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
    n, o = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[n] + 12 * (o + 1) - 69) / 12)

# One chord per stage, all in D major. Each stage opens a little wider and higher.
CHORDS = [
    ['D3','A3','D4','F#4','E5'],          # Earth
    ['B2','F#3','D4','A4','C#5'],         # the Solar System: Bm add9 feel
    ['G2','D3','B3','F#4','A4'],          # stars nearby: Gmaj9
    ['E3','B3','D4','G4','B4','F#5'],     # the Milky Way: Em9
    ['G2','D3','A3','B3','E4','A4','D5'], # galaxies: G6/9, wide
    ['F#3','D4','A4','E5','F#5','A5'],    # the last line: D/F#, high and open
    ['G2','D3','B3','D4','G4','B4'],      # flight home: G
    ['D3','A3','D4','F#4','A4','D5'],     # back on Earth: D
]
SECTIONS = [(CUES[i], CUES[i + 1] if i + 1 < len(CUES) else 69.0) for i in range(len(CUES))]
# How full each stage is, building to the galaxies, quieter for the last line, warm at home.
LEVEL = [0.55, 0.65, 0.75, 0.85, 1.0, 0.7, 0.8, 0.75]

def place(buf, sig, at, pan=0.0):
    i = int(at * SR); j = min(N, i + sig.shape[0])
    if j <= i: return
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    buf[i:j, 0] += sig[: j - i] * l; buf[i:j, 1] += sig[: j - i] * r

def env(n, attack, release):
    e = np.ones(n); a = int(attack * SR); r = int(release * SR)
    if a: e[:a] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a))
    if r: e[-r:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, r))
    return e

def pad_voice(f, dur, attack=3.5, release=6.0):
    n = int((dur + release) * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for det in (-5, 0, 5):
        ff = f * 2 ** (det / 1200); ph = rng.uniform(0, 6.28)
        for k in range(1, 10):
            if ff * k > 6000: break
            out += np.sin(2 * np.pi * ff * k * t + ph * k) / k ** 1.7
    out *= 1 + 0.12 * np.sin(2 * np.pi * rng.uniform(0.05, 0.11) * t + rng.uniform(0, 6))
    return out * env(n, attack, release) / 3

def organ_voice(f, dur, attack=0.9, release=3.5):
    n = int((dur + release) * SR); t = np.arange(n) / SR; out = np.zeros(n)
    # Flue pipes: the fundamental, the octave, a quiet twelfth and fifteenth.
    for k, w in [(1, 1.0), (2, 0.55), (3, 0.22), (4, 0.25), (6, 0.08), (8, 0.06)]:
        for det in (-1.5, 1.5):
            out += 0.5 * w * np.sin(2 * np.pi * f * k * 2 ** (det / 1200) * t + rng.uniform(0, 6.28))
    out *= 1 + 0.025 * np.sin(2 * np.pi * 4.6 * t)
    breath = sosfilt(butter(2, [f * 0.9, f * 1.1], 'band', fs=SR, output='sos'), rng.standard_normal(n)) * 0.02
    return (out + breath) * env(n, attack, release)

def bell(f, vel=0.6, ring=6.0):
    n = int(ring * SR); t = np.arange(n) / SR; out = np.zeros(n)
    # Glass and celesta like: a few slightly stretched partials, the higher ones fading first.
    for ratio, w, dec in [(1.0, 1.0, 2.6), (2.0, 0.35, 1.4), (3.01, 0.12, 0.8), (4.18, 0.06, 0.5), (5.43, 0.03, 0.3)]:
        out += w * np.exp(-t / dec) * np.sin(2 * np.pi * f * ratio * t + rng.uniform(0, 6.28))
    return out * env(n, 0.004, 1.0) * vel

def reverb(x, seconds=4.5, wet=0.45, tone=5000):
    n = int(seconds * SR); t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for c in range(2):
        noise = sosfilt(butter(2, tone, 'low', fs=SR, output='sos'), rng.standard_normal(n))
        ir[:, c] = noise * np.exp(-t / (seconds / 6.9))
    ir /= np.sqrt((ir ** 2).sum(0))
    y = np.stack([fftconvolve(x[:, c], ir[:, c])[:N] for c in range(2)], 1)
    return x * (1 - wet) + y * wet * 3.0

def build(style):
    buf = np.zeros((N, 2))
    for i, ((a, b), chord) in enumerate(zip(SECTIONS, CHORDS)):
        lvl = LEVEL[i]; dur = b - a + 0.8
        for j, note in enumerate(chord):
            f = hz(note); pan = -0.5 + j / max(1, len(chord) - 1)
            if style == 'pad':
                place(buf, pad_voice(f, dur) * 0.18 * lvl / (1 + 0.5 * (f < 120)), a - 0.6, pan * 0.7)
            elif style == 'organ':
                place(buf, organ_voice(f, dur, attack=1.6 if i else 2.5) * 0.11 * lvl, a - 0.3, pan * 0.5)
            elif style == 'stars':
                # A quiet bed underneath the bells.
                place(buf, pad_voice(f, dur, attack=4.0, release=7.0) * 0.07 * lvl, a - 0.6, pan * 0.6)
        if style == 'stars':
            # Bells: chord tones an octave or two up, scattered like stars, more of them as the view widens.
            tones = [hz(n) * (2 if hz(n) < 500 else 1) for n in chord if hz(n) >= 290]
            count = int((b - a) * (0.9 + 0.25 * i)) if i != 5 else 5
            times = np.sort(rng.uniform(a + 0.1, b - 0.4, count))
            if i == 6: times = np.linspace(a + 0.2, b - 0.5, 6)
            for k, at in enumerate(times):
                f = tones[k % len(tones)] if i == 6 else rng.choice(tones)
                if i == 6: f = sorted(tones, reverse=True)[k % len(tones)]
                place(buf, bell(f, rng.uniform(0.35, 0.7) * lvl) * 0.16, at, rng.uniform(-0.7, 0.7))
        if style == 'pad' and i in (5,):
            # A slow high shimmer for the last line.
            for k, at in enumerate(np.linspace(a + 0.5, b - 2, 5)):
                place(buf, bell(hz(['A5','F#5','E5','D5','A5'][k]) * 2, 0.35) * 0.08, at, -0.4 + 0.2 * k)
    if style == 'stars':
        for k, n in enumerate(['A5', 'F#5', 'D5']):
            place(buf, bell(hz(n), 0.6) * 0.18, 57.0 + k * 0.45, -0.3 + 0.3 * k)
    if style == 'organ':
        # Softly back on Earth, one high D held over the last chord.
        place(buf, organ_voice(hz('D5'), 8, attack=2, release=5) * 0.05, 57.0, 0.2)
    buf = reverb(buf, 5.5 if style != 'organ' else 6.5, wet=0.5 if style != 'stars' else 0.55)
    # Phone speakers: nothing below 90 Hz, so no rattle.
    sos = butter(4, 90, 'high', fs=SR, output='sos'); buf = np.stack([sosfilt(sos, buf[:, c]) for c in range(2)], 1)
    t = np.arange(N) / SR
    fade = np.clip((69.0 - t) / 8.0, 0, 1) ** 1.5; fade *= np.clip(t / 0.5, 0, 1)
    buf *= fade[:, None]
    buf *= 0.89 / np.abs(buf).max()
    return buf

def write(buf, path):
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(buf, -1, 1) * 32767).astype('<i2').tobytes())

if __name__ == '__main__':
    style, out = sys.argv[1], sys.argv[2]
    write(build(style), out)
