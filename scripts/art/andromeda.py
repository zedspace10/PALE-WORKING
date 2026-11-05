import numpy as np
from skylib import *
W, H = 1080, 1350
rng = np.random.default_rng(31415)
yy, xx = np.mgrid[0:H, 0:W].astype(float)
cx, cy = W * 0.5, H * 0.5
pa = np.deg2rad(-52); qi = 0.31  # tilt on the sky and how edge on the disc looks
X = ((xx - cx) * np.cos(pa) + (yy - cy) * np.sin(pa)) / W
Y = (-(xx - cx) * np.sin(pa) + (yy - cy) * np.cos(pa)) / W
X /= 1.3; Y /= 1.3
Yd = Y / qi; rd = np.sqrt(X * X + Yd * Yd); th = np.arctan2(Yd, X)
wx = fbm(H, W, 200, 6, rng) * 25; wy = fbm(H, W, 200, 6, rng) * 25
n1 = warp(fbm(H, W, 60, 6, rng), wx, wy); n2 = warp(fbm(H, W, 25, 5, rng), wx, wy)
# Disc with ring like arms (Andromeda's arms look almost like rings at this angle).
arms = np.zeros_like(rd)
for r0, a in [(0.17, 0.5), (0.27, 0.8), (0.36, 0.7), (0.45, 0.45)]:
    rr = r0 * (1 + 0.06 * np.cos(th * 1 + r0 * 20)) + 0.012 * n1
    arms += a * np.exp(-((rd - rr) / 0.03) ** 2)
disc = np.exp(-rd / 0.13) * (1 + 1.6 * arms * np.clip(0.7 + n2, 0, None)) * (rd < 0.62) * np.clip((0.62 - rd) / 0.08, 0, 1)
bulge = np.exp(-7.67 * ((np.sqrt(X * X + (Y / 0.62) ** 2) / 0.05) ** 0.25 - 1))
bulge = np.minimum(bulge, 60)
# Dust lanes: strongest on the near side of the disc (one side of the minor axis).
dl = np.zeros_like(rd)
for r0, a in [(0.13, 0.6), (0.215, 1.0), (0.31, 0.9), (0.40, 0.6)]:
    rr = r0 * (1 + 0.05 * np.cos(th + r0 * 30)) + 0.015 * n1
    dl += a * np.exp(-((rd - rr) / 0.012) ** 2)
near = np.clip(0.35 + 0.65 * (Yd > 0), 0, 1)
tau = dl * near * np.clip(0.3 + 1.6 * n2, 0, None) ** 1.3 * 1.7 * (rd < 0.6)
T = np.exp(-tau)
img = np.zeros((H, W, 3))
img += (disc * 0.2 * T)[:, :, None] * np.array([0.82, 0.86, 1.0])
halo = np.exp(-np.sqrt(X * X + (Y / 0.55) ** 2) / 0.06)
img += (bulge * 0.012 * T ** 0.7 + halo * 0.35 * T ** 0.8)[:, :, None] * np.array([1.0, 0.85, 0.64])
# Clusters of young blue stars along the arms, pink glowing gas here and there.
m = 5000; rr_ = rng.uniform(0.12, 0.55, m); tt_ = rng.uniform(0, 2 * np.pi, m)
xs = cx + 1.3 * W * (rr_ * np.cos(tt_) * np.cos(pa) - rr_ * np.sin(tt_) * qi * np.sin(pa))
ys = cy + 1.3 * W * (rr_ * np.cos(tt_) * np.sin(pa) + rr_ * np.sin(tt_) * qi * np.cos(pa))
ok = (xs > 0) & (xs < W) & (ys > 0) & (ys < H); xs, ys = xs[ok], ys[ok]
a_ = arms[ys.astype(int), xs.astype(int)]; keep = rng.random(len(xs)) < a_ / 1.2; xs, ys = xs[keep], ys[keep]
cols = np.tile([0.7, 0.82, 1.0], (len(xs), 1)); pink = rng.random(len(xs)) < 0.12; cols[pink] = [1.0, 0.45, 0.6]
splat(img, xs, ys, rng.pareto(2.5, len(xs)) * 0.12 + 0.05, cols, sigma=1.0)
# M32: a small bright round companion. M110: a larger faint elongated one.
def blob(x0, y0, rx, ry, ang, amp, col):
    dx, dy = xx - x0, yy - y0; a = np.deg2rad(ang)
    u_ = (dx * np.cos(a) + dy * np.sin(a)) / rx; v_ = (-dx * np.sin(a) + dy * np.cos(a)) / ry
    r = np.sqrt(u_ * u_ + v_ * v_) + 1e-6
    return (amp * np.exp(-7.67 * (r ** 0.25 - 1)) * np.exp(-r / 6))[:, :, None] * np.array(col)
img += blob(cx + 0.075 * W, cy + 0.2 * W, 9, 8, 0, 0.03, [1.0, 0.88, 0.7])
img += blob(cx - 0.24 * W, cy - 0.36 * W, 40, 20, -30, 0.0016, [1.0, 0.9, 0.76])
# Foreground stars of our own galaxy.
m = 7000; xs = rng.uniform(0, W, m); ys = rng.uniform(0, H, m)
splat(img, xs, ys, rng.pareto(1.9, m) * 0.12 + 0.03, star_colour(rng, m), sigma=0.85)
for i in range(18):
    x, y = rng.uniform(0, W), rng.uniform(0, H); fl = rng.pareto(1.5) * 2 + 1
    bright_star(img, x, y, fl * 3, star_colour(rng, 1)[0], core=1.2, halo=7, halo_amp=0.06)
img += 0.002
out = tonemap(img, exposure=1.3, sat=1.25)
out = grain(out, rng, 0.008)
save(out, 'andromeda.jpg')
