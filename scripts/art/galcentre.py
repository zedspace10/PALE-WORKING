import numpy as np
from skylib import *
W, H = 1080, 1350
rng = np.random.default_rng(77)
yy, xx = np.mgrid[0:H, 0:W].astype(float)
ang = np.deg2rad(-58)
u = ((xx - W * 0.5) * np.cos(ang) + (yy - H * 0.52) * np.sin(ang)) / W   # along the band
s = (-(xx - W * 0.5) * np.sin(ang) + (yy - H * 0.52) * np.cos(ang)) / W  # across it
wx = fbm(H, W, 300, 6, rng) * 60; wy = fbm(H, W, 300, 6, rng) * 60
bandw = 0.20 + 0.04 * fbm(H, W, 400, 3, rng)
band = np.exp(-(s / bandw) ** 2)
bulge = np.exp(-((u + 0.02) ** 2 / 0.09 + (s + 0.01) ** 2 / 0.03))
light = band * 0.55 + bulge * 1.2
# Dust: thin dark filaments along the plane, the Great Rift style lanes.
def along(field, stretch):
    # Sample a noise field in band coordinates, stretched along the plane like real dust lanes.
    py = H / 2 + s * W + wy * 0.5; px = W / 2 + u * W / stretch + wx * 0.3
    return ndi.map_coordinates(field, [py, px], order=1, mode='mirror')
f1 = along(fbm(H, W, 110, 7, rng), 3.0)
f2 = along(fbm(H, W, 70, 7, rng), 2.2)
f3 = along(fbm(H, W, 40, 6, rng), 2.5)
lane = np.exp(-((s - 0.015 + 0.03 * f2) / 0.06) ** 2)
tau = (np.clip(f1 + 0.05, 0, None) * 2.6 + np.clip(f3, 0, None) * 1.6) * (band * 0.9 + 0.05) + lane * (0.6 + 2.6 * np.clip(f2 + 0.25, 0, None) ** 1.3)
T = np.exp(-tau)
img = np.zeros((H, W, 3))
glow = light * np.clip(0.7 + 0.6 * warp(fbm(H, W, 70, 6, rng), wx, wy), 0, None)
warmth = np.clip(bulge * 1.6, 0, 1)[:, :, None]
img += (glow * 0.32 * T)[:, :, None] * (warmth * np.array([1.0, 0.78, 0.52]) + (1 - warmth) * np.array([0.92, 0.88, 0.82]))
# Faint red glowing gas clouds sitting in the band.
for (pu, ps, rad) in [(0.22, -0.06, 0.035), (0.30, -0.02, 0.025), (-0.26, 0.05, 0.03)]:
    blob = np.exp(-((u - pu) ** 2 + (s - ps) ** 2) / rad ** 2) * np.clip(0.6 + f2, 0, None)
    img += (blob * 0.18 * T ** 0.6)[:, :, None] * np.array([1.0, 0.3, 0.38])
# Stars: hundreds of thousands, densest in the bulge, thinned and reddened by dust.
m = 700000; xs = rng.uniform(0, W, m); ys = rng.uniform(0, H, m)
iy, ix = ys.astype(int), xs.astype(int)
dens = 0.12 + light[iy, ix] * 1.6
keep = rng.random(m) < dens / dens.max(); xs, ys, iy, ix = xs[keep], ys[keep], iy[keep], ix[keep]
tt = T[iy, ix]; n = len(xs)
f = (rng.pareto(2.2, n) * 0.22 + 0.05) * tt ** 0.85
cols = star_colour(rng, n, warm=0.15); cols[:, 2] *= tt ** 0.6; cols[:, 1] *= tt ** 0.25
splat(img, xs, ys, f, cols, sigma=0.7)
for i in range(40):
    x, y = rng.uniform(0, W), rng.uniform(0, H); fl = rng.pareto(1.6) * 1.5 + 1
    bright_star(img, x, y, fl * 3, star_colour(rng, 1, warm=0.1)[0], core=1.1, halo=6, halo_amp=0.05)
out = tonemap(img, exposure=1.25, sat=1.2)
out = grain(out, rng, 0.008)
save(out, 'galactic-center.jpg')
