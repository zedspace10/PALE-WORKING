"""Look back: home as seen from each place in Explore. Square pictures that fade into PALE's
background at the edges, with small labels."""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from skylib import *

S = 1080
BG = np.array([5, 7, 12]) / 255
FONT = ImageFont.truetype("Inter_500Medium.ttf", 30)
yy, xx = np.mgrid[0:S, 0:S].astype(float)

def finish(img01, name, labels=(), circles=(), fade=True):
    """Fade the edges into the app's background, then add labels and dotted circles."""
    img = np.clip(img01, 0, 1)
    if fade:
        r = np.hypot(xx - S / 2, yy - S / 2) / (S / 2)
        w = np.clip((1.0 - r) / 0.36, 0, 1) ** 1.4
        img = img * w[:, :, None] + BG * (1 - w[:, :, None])
    im = Image.fromarray((img * 255 + 0.5).astype(np.uint8)).convert("RGBA")
    over = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(over)
    for (cx, cy, rad) in circles:
        n = max(18, int(rad / 3))
        for k in range(n):
            a0 = 360 * k / n; d.arc([cx - rad, cy - rad, cx + rad, cy + rad], a0, a0 + 360 / n * 0.45, fill=(245, 250, 255, 200), width=3)
    shadow = Image.new("RGBA", im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(shadow)
    for (x, y, text) in labels:
        ds.text((x, y), text, font=FONT, fill=(0, 0, 0, 200))
    from PIL import ImageFilter
    im = Image.alpha_composite(im, shadow.filter(ImageFilter.GaussianBlur(5)))
    for (x, y, text) in labels:
        d.text((x, y), text, font=FONT, fill=(245, 250, 255, 190))
    im = Image.alpha_composite(im, over).convert("RGB")
    im.save(f"lookback-{name}.jpg", quality=88, subsampling=0, optimize=True, progressive=True)

def starfield(img, n, seed, bright=1.0, sigma=0.8):
    rng = np.random.default_rng(seed)
    xs, ys = rng.uniform(0, S, n), rng.uniform(0, S, n)
    splat(img, xs, ys, (rng.pareto(1.9, n) * 0.12 + 0.03) * bright, star_colour(rng, n), sigma=sigma)
    return rng

def mars():
    rng = np.random.default_rng(3)
    img = np.zeros((S, S, 3)); t = yy / S
    hz = 0.74 * S  # the horizon
    # Twilight on Mars: blue near where the Sun went down, butterscotch higher up, then dark.
    sunx = S * 0.30
    up = np.clip(hz - yy, 0, None) / S
    side = np.abs(xx - sunx) / S
    img += (np.exp(-up / 0.05 - side / 0.12) * 0.5)[:, :, None] * np.array([0.45, 0.62, 0.95])
    img += (np.exp(-up / 0.12 - side / 0.5) * 0.16)[:, :, None] * np.array([0.78, 0.55, 0.34])
    starfield(img, 260, 5, 0.6)
    ex, ey = S * 0.62, S * 0.34
    bright_star(img, ex, ey, 70, [0.75, 0.88, 1.0], core=2.2, halo=14, halo_amp=0.12)
    bright_star(img, ex + 30, ey + 6, 6, [0.95, 0.95, 0.92], core=1.4, halo=5, halo_amp=0.05)
    out = tonemap(img, exposure=1.0, sat=1.1)
    # The ground: dark rolling hills and a few rocks against the glow.
    ridge = fbm(1, S, 260, 6, rng)[0]
    gy = hz + ridge * 26 - 18 * np.exp(-((np.arange(S) - S * 0.8) / 120) ** 2)
    mask = (yy >= gy[None, :]).astype(float)
    mask = ndi.gaussian_filter(mask, 0.8)
    ground = np.array([0.045, 0.03, 0.025]) * (1 + 0.3 * (1 - (yy - hz) / S))[:, :, None]
    out = out * (1 - mask[:, :, None]) + ground * mask[:, :, None]
    finish(out, "mars", labels=[(ex + 26, ey - 46, "Earth"), (ex + 44, ey + 18, "the Moon")])

def voyager():
    rng = np.random.default_rng(9)
    img = np.zeros((S, S, 3))
    # Scattered sunlight inside the camera: broad soft rays crossing the frame, as in the 1990 picture.
    ang = np.deg2rad(-58); u = (xx - S / 2) * np.cos(ang) + (yy - S / 2) * np.sin(ang)
    for (off, w, col, amp) in [(-260, 70, [0.55, 0.38, 0.28], 0.16), (-120, 46, [0.62, 0.45, 0.34], 0.2), (10, 60, [0.45, 0.5, 0.62], 0.16), (150, 90, [0.5, 0.36, 0.28], 0.12), (300, 50, [0.4, 0.42, 0.55], 0.1)]:
        band = np.exp(-((u - off) / w) ** 2) * (0.75 + 0.25 * fbm(S, S, 140, 3, rng))
        img += (band * amp)[:, :, None] * np.array(col)
    img += 0.004 * fbm(S, S, 2, 1, rng)[:, :, None]  # grain
    ex, ey = S * 0.5 + 12, S * 0.52
    bright_star(img, ex, ey, 3.0, [0.7, 0.82, 1.0], core=1.2, halo=2, halo_amp=0.02)
    out = tonemap(img, exposure=1.0, sat=1.0)
    finish(out, "voyager", labels=[(ex + 36, ey - 50, "Earth")], circles=[(ex, ey, 26)])

def radec_to_xy(ra_h, dec_d, ra0, dec0, scale):
    ra, dec, a0, d0 = np.deg2rad(ra_h * 15), np.deg2rad(dec_d), np.deg2rad(ra0 * 15), np.deg2rad(dec0)
    c = np.sin(d0) * np.sin(dec) + np.cos(d0) * np.cos(dec) * np.cos(ra - a0)
    x = np.cos(dec) * np.sin(ra - a0) / c
    y = (np.cos(d0) * np.sin(dec) - np.sin(d0) * np.cos(dec) * np.cos(ra - a0)) / c
    return S / 2 - x * scale, S / 2 - y * scale

def proxima():
    rng = np.random.default_rng(21)
    img = np.zeros((S, S, 3))
    # The Milky Way runs through Cassiopeia: a faint band behind the stars.
    ang = np.deg2rad(20); v = -(xx - S / 2) * np.sin(ang) + (yy - S / 2) * np.cos(ang)
    band = np.exp(-(v / 230) ** 2) * (0.7 + 0.5 * fbm(S, S, 120, 5, rng))
    img += (band * 0.05)[:, :, None] * np.array([0.9, 0.88, 0.85])
    n = 2600; xs, ys = rng.uniform(0, S, n), rng.uniform(0, S, n)
    keep = rng.random(n) < 0.35 + 0.65 * np.exp(-((-(xs - S / 2) * np.sin(ang) + (ys - S / 2) * np.cos(ang)) / 230) ** 2)
    splat(img, xs[keep], ys[keep], rng.pareto(2.0, keep.sum()) * 0.1 + 0.025, star_colour(rng, keep.sum()), sigma=0.8)
    # Cassiopeia's W, with the Sun seen from Alpha Centauri sitting just beyond it.
    W = [("Caph", 0.153, 59.15, 2.3), ("Schedar", 0.675, 56.54, 2.2), ("Navi", 0.945, 60.72, 2.2), ("Ruchbah", 1.430, 60.24, 2.7), ("Segin", 1.907, 63.67, 3.4)]
    ra0, dec0, scale = 1.35, 61.0, 2300
    pts = [radec_to_xy(r, d, ra0, dec0, scale) for _, r, d, _ in W]
    sun = radec_to_xy(2.66, 60.8, ra0, dec0, scale)
    over = np.zeros_like(img)
    for (x, y), (_, _, _, mag) in zip(pts, W):
        bright_star(img, x, y, 10 * 10 ** (-0.4 * (mag - 2.2)), [0.92, 0.95, 1.0], core=1.6, halo=7, halo_amp=0.08)
    bright_star(img, sun[0], sun[1], 22, [1.0, 0.9, 0.72], core=1.9, halo=10, halo_amp=0.1)
    out = tonemap(img, exposure=1.1, sat=1.15)
    im = Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    for a, b in zip(pts, pts[1:]):
        d.line([a, b], fill=(160, 180, 210), width=2)
    out = np.asarray(im).astype(float) / 255 * 0.6 + out * 0.4
    xs_, ys_ = zip(*pts)
    finish(out, "proxima", labels=[(min(xs_) + 40, min(ys_) - 70, "Cassiopeia"), (sun[0] - 50, sun[1] + 24, "the Sun")])

def orion():
    rng = np.random.default_rng(31)
    img = np.zeros((S, S, 3))
    wx = fbm(S, S, 200, 5, rng) * 60; wy = fbm(S, S, 200, 5, rng) * 60
    n1 = warp(fbm(S, S, 150, 7, rng), wx, wy); fil = warp(ridged(fbm(S, S, 90, 6, rng)), wx, wy) ** 5
    r = np.hypot(xx - S / 2, yy - S / 2) / (S / 2)
    # Inside the nebula, looking out: glowing gas all around, thinner towards the middle.
    gas = np.clip(0.3 + n1 + 0.5 * fil, 0, None) ** 1.6 * (0.25 + 0.9 * r ** 1.5)
    teal = np.clip(warp(fbm(S, S, 110, 6, rng), wx, wy) + 0.2, 0, None)
    img += (gas * 0.22)[:, :, None] * np.array([1.0, 0.3, 0.33]) + (gas * teal * 0.12)[:, :, None] * np.array([0.3, 0.8, 0.85])
    dust = np.clip(warp(fbm(S, S, 120, 6, rng), wx, wy) * 1.5, 0, None)
    img *= np.exp(-dust * 0.9)[:, :, None]
    starfield(img, 1800, 33, 0.8)
    out = tonemap(img, exposure=1.0, sat=1.15)
    cx, cy = S * 0.5, S * 0.48
    finish(out, "orion", labels=[(cx - 190, cy + 64, "the Sun is in here, too faint to see")], circles=[(cx, cy, 44)])

def galactic():
    rng = np.random.default_rng(55)
    img = np.zeros((S, S, 3))
    ang = np.deg2rad(-24)
    u = ((xx - S / 2) * np.cos(ang) + (yy - S / 2) * np.sin(ang)) / S; s = (-(xx - S / 2) * np.sin(ang) + (yy - S / 2) * np.cos(ang)) / S
    wx = fbm(S, S, 220, 5, rng) * 40; wy = fbm(S, S, 220, 5, rng) * 40
    def along(field, st):
        return ndi.map_coordinates(field, [S / 2 + s * S + wy * 0.5, S / 2 + u * S / st + wx * 0.3], order=1, mode='mirror')
    band = np.exp(-(s / 0.3) ** 2)
    tau = (np.clip(along(fbm(S, S, 80, 6, rng), 3) + 0.1, 0, None) * 2.4 + np.clip(along(fbm(S, S, 40, 5, rng), 2.5), 0, None) * 1.4) * band
    T = np.exp(-tau)
    img += (band * 0.3 * T * np.clip(0.7 + 0.6 * along(fbm(S, S, 50, 5, rng), 2), 0, None))[:, :, None] * np.array([1.0, 0.82, 0.6])
    m = 500000; xs, ys = rng.uniform(0, S, m), rng.uniform(0, S, m)
    tt = T[ys.astype(int), xs.astype(int)]; keep = rng.random(m) < 0.25 + 0.75 * band[ys.astype(int), xs.astype(int)]
    xs, ys, tt = xs[keep], ys[keep], tt[keep]
    cols = star_colour(rng, len(xs), warm=0.15); cols[:, 2] *= tt ** 0.6
    splat(img, xs, ys, (rng.pareto(2.2, len(xs)) * 0.2 + 0.05) * tt ** 0.8, cols, sigma=0.7)
    out = tonemap(img, exposure=1.2, sat=1.2)
    cx, cy = S * 0.62, S * 0.34
    finish(out, "galactic", labels=[(cx - 40, cy - 92, "the Sun, somewhere")], circles=[(cx, cy, 40)])

def milkyway():
    rng = np.random.default_rng(77)
    img = np.zeros((S, S, 3))
    cx, cy = S * 0.5, S * 0.47
    pa, qi, scale = np.deg2rad(-28), 0.42, 0.36 * S
    X = ((xx - cx) * np.cos(pa) + (yy - cy) * np.sin(pa)) / scale
    Y = (-(xx - cx) * np.sin(pa) + (yy - cy) * np.cos(pa)) / scale / qi
    r = np.hypot(X, Y) + 1e-6; th = np.arctan2(Y, X)
    # A barred spiral: a bar through the middle and two main arms winding out from its ends.
    bar = np.exp(-((X / 0.32) ** 2 + (Y / 0.09) ** 2))
    arms = 0.5 + 0.5 * np.cos(2 * th - np.log(r + 0.05) / 0.22)
    arms = ndi.gaussian_filter(arms, 2)
    n = fbm(S, S, 18, 4, rng)
    disc = np.exp(-r / 0.32) * (0.35 + arms ** 3 * 1.6 * np.clip(0.7 + n, 0, None)) * (r < 1.25)
    bulge = np.exp(-(r / 0.08) ** 1.2)
    img += (disc * 0.32)[:, :, None] * np.array([0.78, 0.84, 1.0])
    img += (bar * 0.45 + bulge * 0.9)[:, :, None] * np.array([1.0, 0.86, 0.65])
    dust = np.exp(-(((arms - 0.75) / 0.1) ** 2)) * np.exp(-r / 0.6) * (r > 0.15) * 0.35
    img *= (1 - dust)[:, :, None]
    starfield(img, 1400, 79, 0.7)
    out = tonemap(img, exposure=0.85, sat=1.15)
    finish(out, "andromeda", labels=[(cx - 95, cy + scale * 0.62, "the Milky Way")])

def first_glow():
    rng = np.random.default_rng(13)
    # The first light: a nearly even warm glow, with faint patches a little warmer or cooler.
    f = fbm(S, S, 60, 5, rng) * 0.6 + fbm(S, S, 18, 3, rng) * 0.4
    f = (f - f.mean()) / f.std()
    base = np.array([1.0, 0.55, 0.32])
    img = np.ones((S, S, 3)) * base * 0.42
    img *= (1 + 0.1 * f)[:, :, None]
    img[:, :, 2] *= (1 - 0.12 * f); img[:, :, 0] *= (1 + 0.04 * f)
    out = np.clip(img, 0, 1)
    r = np.hypot(xx - S / 2, yy - S / 2) / (S / 2)
    w = np.clip((1.12 - r) / 0.5, 0, 1) ** 1.2
    out = out * w[:, :, None] + BG * (1 - w[:, :, None])
    finish(out, "edge", fade=False)

def post3d(src, name, labels=(), dot=None):
    im = Image.open(src).convert("RGB").resize((S, S), Image.LANCZOS)
    img = np.asarray(im).astype(float) / 255
    if dot:
        x, y = dot; work = np.zeros_like(img)
        bright_star(work, x, y, 4.0, [0.6, 0.78, 1.0], core=1.3, halo=3, halo_amp=0.03)
        img = img + tonemap(work, exposure=1.0)
    finish(img, name, labels=labels)

jobs = {"mars": mars, "voyager": voyager, "proxima": proxima, "orion": orion, "galactic": galactic, "andromeda": milkyway, "edge": first_glow,
        "moon": lambda: post3d("lb-moon.png", "moon"),
        "saturn": lambda: post3d("lb-saturn.png", "saturn", labels=[(S * 0.73 + 22, S * 0.72 - 44, "Earth"), (S * 0.66, S * 0.23, "the Sun, behind Saturn")], dot=(S * 0.73, S * 0.72))}
for name in (sys.argv[1:] or jobs):
    jobs[name]()
    print("made", name)
