import sys, numpy as np
from PIL import Image, ImageDraw
from skylib import *
mode = sys.argv[1]
W, H = (1440, 620) if mode == 'tonight' else (1440, 810)
rng = np.random.default_rng(808 if mode == 'tonight' else 909)
yy, xx = np.mgrid[0:H, 0:W].astype(float)
img = np.zeros((H, W, 3))
# Sky: deep blue overhead, paler towards the horizon, a last trace of warm glow low on the right.
t = yy / H
img += (0.004 + 0.03 * t ** 2.2)[:, :, None] * np.array([0.35, 0.5, 1.0])
glow = np.exp(-((xx - W * 0.86) / (W * 0.35)) ** 2) * np.exp(-((H * (0.7 if mode == 'tonight' else 0.74) - yy) / (H * 0.16)).clip(0) ** 1.4) * (yy < H * 0.82)
img += (glow * 0.05)[:, :, None] * np.array([1.0, 0.6, 0.35])
# The Milky Way rising from the horizon.
if mode == 'tonight':
    p0, ang, width = (W * 0.78, H * 0.85), np.deg2rad(-64), 0.13
else:
    p0, ang, width = (W * 0.72, H * 0.9), np.deg2rad(-78), 0.10
u = ((xx - p0[0]) * np.cos(ang) + (yy - p0[1]) * np.sin(ang)) / W
s = (-(xx - p0[0]) * np.sin(ang) + (yy - p0[1]) * np.cos(ang)) / W
wx = fbm(H, W, 200, 5, rng) * 30; wy = fbm(H, W, 200, 5, rng) * 30
def along(field, stretch):
    py = H / 2 + s * W + wy * 0.5; px = W / 2 + u * W / stretch + wx * 0.3
    return ndi.map_coordinates(field, [py, px], order=1, mode='mirror')
band = np.exp(-(s / (width * (1 + 0.25 * along(fbm(H, W, 300, 3, rng), 2)))) ** 2) * np.clip(1.15 - u * 0.9, 0.2, 1.2)
core = np.exp(-((u - 0.12) ** 2 / 0.02 + s ** 2 / 0.006))
f1 = along(fbm(H, W, 60, 6, rng), 3.0); f2 = along(fbm(H, W, 30, 5, rng), 2.4)
tau = (np.clip(f1 + 0.1, 0, None) * 2.2 + np.clip(f2, 0, None) * 1.2) * band + np.exp(-((s + 0.01 + 0.015 * f1) / 0.018) ** 2) * band * 1.6
T = np.exp(-tau)
mw = (band * 0.10 + core * 0.12) * np.clip(0.7 + 0.6 * along(fbm(H, W, 25, 5, rng), 2), 0, None) * T
img += mw[:, :, None] * (np.array([0.95, 0.9, 0.85]) + core[:, :, None] * np.array([0.05, -0.06, -0.2]))
m = 160000; xs = rng.uniform(0, W, m); ys = rng.uniform(0, H, m)
iy, ix = ys.astype(int), xs.astype(int)
d = 0.25 + band[iy, ix] * 2.2; keep = rng.random(m) < d / d.max(); xs, ys, iy, ix = xs[keep], ys[keep], iy[keep], ix[keep]
tt = T[iy, ix]; n = len(xs)
splat(img, xs, ys, (rng.pareto(2.0, n) * 0.07 + 0.012) * tt ** 0.8 * (1 - 0.6 * (ys / H) ** 3), star_colour(rng, n), sigma=0.6)
for i in range(26):
    x, y = rng.uniform(0, W), rng.uniform(0, H * 0.7); fl = rng.pareto(1.4) * 1.2 + 0.8
    bright_star(img, x, y, fl * 2.2, star_colour(rng, 1)[0], core=1.0, halo=5, halo_amp=0.05)
if mode == 'tonight':
    # Jupiter, steady and bright, low in the east.
    bright_star(img, W * 0.62, H * 0.40, 26, [1.0, 0.93, 0.82], core=1.5, halo=12, halo_amp=0.10)
# Foreground, drawn at twice the size for clean edges.
S = 2; mask = Image.new('L', (W * S, H * S), 0); far = Image.new('L', (W * S, H * S), 0)
dm, df = ImageDraw.Draw(mask), ImageDraw.Draw(far)
ridge = fbm(1, W * S, 300, 6, rng)[0]; ridge2 = fbm(1, W * S, 500, 6, rng)[0]
xs_ = np.arange(W * S)
far_y = H * S * ((0.72 if mode == 'tonight' else 0.80) - 0.05 * np.exp(-((xs_ - W * S * 0.3) / (W * S * 0.25)) ** 2)) + ridge2 * 40 * S
df.polygon([(0, H * S)] + list(zip(xs_.tolist(), far_y.tolist())) + [(W * S, H * S)], fill=255)
if mode == 'tonight':
    near_y = H * S * (0.78 + 0.06 * (xs_ / (W * S) - 0.5) ** 2 * -4 + 0.04 * (xs_ / (W * S))) + ridge * 26 * S
else:
    hill_c = W * S * 0.72
    near_y = H * S * (0.86 - 0.13 * np.exp(-((xs_ - hill_c) / (W * S * 0.22)) ** 2)) + ridge * 16 * S
dm.polygon([(0, H * S)] + list(zip(xs_.tolist(), near_y.tolist())) + [(W * S, H * S)], fill=255)
def pine(x, base, h):
    w = h * 0.3; layers = 9
    for k in range(layers):
        y0 = base - h * k / layers * 0.92; y1 = base - h * (k + 1.7) / layers
        ww = w * (1 - k / layers) ** 0.9 * (0.6 + 0.6 * rng.random())
        dm.polygon([(x - ww, y0 + rng.uniform(-2, 4) * S), (x - ww * 0.3, y0 - h * 0.02), (x + ww * 0.25, y0 - h * 0.03), (x + ww, y0 + rng.uniform(-2, 4) * S), (x + rng.uniform(-0.03, 0.03) * h, y1)], fill=255)
    dm.rectangle([x - h * 0.02, base - h * 0.1, x + h * 0.02, base + 4], fill=255)
if mode == 'tonight':
    for i in range(70):
        x = rng.uniform(0, W * S * 0.55) if rng.random() < 0.7 else rng.uniform(W * S * 0.9, W * S)
        base = near_y[int(min(x, W * S - 1))] + 6 * S
        pine(x, base, rng.uniform(40, 120) * S)
else:
    # The observatory: a round building with a domed roof, its slit open and the telescope pointing up.
    top = near_y[int(hill_c)]; cx_ = hill_c; R = 50 * S; bh = 40 * S
    dm.rectangle([cx_ - R, top - bh, cx_ + R, top + 10], fill=255)
    dm.pieslice([cx_ - R, top - bh - R, cx_ + R, top - bh + R], 180, 360, fill=255)
    for i in range(16):
        x = cx_ + rng.choice([-1, 1]) * rng.uniform(R * 1.6, W * S * 0.35)
        if 0 < x < W * S: pine(x, near_y[int(x)] + 6 * S, rng.uniform(30, 80) * S)
far_a = np.asarray(far.resize((W, H), Image.LANCZOS), float) / 255
near_a = np.asarray(mask.resize((W, H), Image.LANCZOS), float) / 255
img = img * (1 - far_a[:, :, None]) + far_a[:, :, None] * np.array([0.010, 0.014, 0.026]) * (1 + 0.6 * (1 - yy / H))[:, :, None]
img = img * (1 - near_a[:, :, None]) + near_a[:, :, None] * np.array([0.003, 0.004, 0.007])
if mode == 'observatory':
    # Shade the dome so it reads as a curved surface catching the sky, and light the slit from inside.
    top = near_y[int(hill_c)] / S; cx2 = hill_c / S; R2 = 50; bh2 = 40
    dx = (xx - cx2) / R2; dy = (yy - (top - bh2)) / R2; rr = np.sqrt(dx * dx + dy * dy)
    dome = (rr < 1) & (yy < top - bh2); mu = np.sqrt(np.clip(1 - rr * rr, 0, 1))
    shade = (0.004 + 0.012 * np.clip(-dx * 0.5 - dy * 0.9, 0, 1) ** 2) * mu ** 0.3
    img[dome] = shade[dome][:, None] * np.array([0.6, 0.7, 1.0])
    slit = dome & (np.abs(xx - cx2 - 3) < 6)
    img[slit] = np.array([0.022, 0.004, 0.003])
    glow2 = np.exp(-((xx - cx2 - 3) ** 2 / 200 + (yy - (top - bh2 - 20)) ** 2 / 1500)) * 0.02
    img += (glow2 * (yy < top - bh2 - 10) * ~dome)[:, :, None] * np.array([1.0, 0.25, 0.2])
    # The telescope tube, a dark line leaning out of the slit.
    tube = (np.abs((xx - cx2 - 3) * np.cos(0.3) + (yy - (top - bh2 - 20)) * np.sin(0.3)) < 4) & (yy < top - bh2 - 22) & (yy > top - bh2 - 58)
    img[tube] = np.array([0.006, 0.006, 0.008])
out = tonemap(img, exposure=1.25, sat=1.1)
out = grain(out, rng, 0.006)
save(out, f'{"tonights-sky" if mode == "tonight" else "observatory"}.jpg')
