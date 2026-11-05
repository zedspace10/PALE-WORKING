import numpy as np
from skylib import *
W, H = 1080, 1350
rng = np.random.default_rng(31)
yy, xx = np.mgrid[0:H, 0:W].astype(float)
cx, cy = W * 0.52, H * 0.50
u = (xx - cx) / W; v = (yy - cy) / W
# Domain warp for wispy gas.
wx = fbm(H, W, 260, 6, rng) * 70; wy = fbm(H, W, 260, 6, rng) * 70
n1 = warp(fbm(H, W, 180, 7, rng), wx, wy)
n2 = warp(fbm(H, W, 90, 7, rng), wx * 0.6, wy * 0.6)
fil = warp(ridged(fbm(H, W, 120, 6, rng)), wx, wy) ** 6
r = np.sqrt(u * u + v * v); th = np.arctan2(v, u)
# The nebula opens like a fan below and to the left of the Trapezium.
R = 0.36 + 0.14 * np.cos(th - 2.2) + 0.08 * np.cos(2 * th + 0.6) + 0.07 * n1
env = np.exp(-(r / np.maximum(R, 0.05)) ** 1.7 * 2.4)
core = np.exp(-(((u - 0.01) / 0.09) ** 2 + ((v + 0.01) / 0.075) ** 2))
gas = env * np.clip(0.35 + 1.1 * n1 + 0.6 * fil, 0, None) ** 1.5
# M43, the small round nebula just north, cut off by a dark lane.
ru = np.sqrt((u + 0.02) ** 2 + (v + 0.33) ** 2)
m43 = np.exp(-(ru / 0.075) ** 2) * np.clip(0.7 + 0.8 * n2, 0, None) * 0.8
ha = gas * 1.0 + m43
oiii = (core * 0.7 + 0.6 * np.exp(-(r / 0.16) ** 2)) * np.clip(0.6 + 1.0 * n2 + 0.5 * fil, 0, None)
# Dust: a dark bay intruding from the east (left) and lanes between M42 and M43.
dust = np.clip(warp(fbm(H, W, 140, 6, rng), wx, wy) * 1.4 + 0.2, 0, None)
bay = np.exp(-(((u + 0.17) / 0.10) ** 2 + ((v + 0.05) / 0.14) ** 2)) * 1.6 * np.clip(0.3 + dust, 0, None)
lane = np.exp(-((v + 0.24 + 0.05 * np.sin(u * 12) + 0.03 * n1) / 0.035) ** 2) * np.exp(-(u / 0.35) ** 2) * 2.2
outer = np.clip(1 - env * 1.2, 0, 1) * 1.1
tau = dust * (0.35 + outer) + bay * (0.6 + 0.6 * dust) + lane
T = np.exp(-tau)
img = np.zeros((H, W, 3))
HA = np.array([1.0, 0.26, 0.30]); SII = np.array([1.0, 0.45, 0.25]); OIII = np.array([0.30, 0.82, 0.88]); WHITE = np.array([1.0, 0.95, 0.88])
img += (ha * 0.42)[:, :, None] * HA + (gas * 0.3 * np.clip(n2 + 0.5, 0, None) * np.exp(-(r / 0.3) ** 2))[:, :, None] * SII
img += (oiii * 0.42)[:, :, None] * OIII
img += (np.exp(-(r / 0.055) ** 2) * 0.55)[:, :, None] * WHITE
# Reflection: warm brown light scattered by the dust near the bright region.
img += ((1 - T) * env * 0.22)[:, :, None] * np.array([0.75, 0.42, 0.22])
img *= T[:, :, None] ** 0.9
img += 0.002
# Field stars, dimmed and reddened by dust.
m = 9000; xs = rng.uniform(0, W, m); ys = rng.uniform(0, H, m)
tt = T[ys.astype(int), xs.astype(int)]
f = (rng.pareto(1.8, m) * 0.3 + 0.05) * tt
cols = star_colour(rng, m); cols[:, 2] *= tt ** 0.5; cols[:, 1] *= tt ** 0.2
splat(img, xs, ys, f, cols, sigma=0.85)
for i in range(22):
    x, y = rng.uniform(0, W), rng.uniform(0, H); fl = rng.pareto(1.5) * 2 + 1
    bright_star(img, x, y, fl * 4, star_colour(rng, 1)[0], core=1.2, halo=7, halo_amp=0.06, spikes=HUBBLE if fl > 6 else None, spike_len=6 + fl * 0.8, spike_w=0.8)
# The Trapezium: four hot young stars at the heart.
for dx, dy, fl in [(0, 0, 30), (14, -10, 22), (-9, 8, 18), (20, 12, 15)]:
    bright_star(img, cx + 0.01 * W + dx, cy - 0.01 * W + dy, fl, [0.85, 0.92, 1.0], core=1.6, halo=10, halo_amp=0.08, spikes=HUBBLE, spike_len=14, spike_w=0.9)
out = tonemap(img, exposure=1.0, sat=1.2)
out = grain(out, rng, 0.008)
save(out, 'orion-nebula.jpg')
