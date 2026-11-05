import numpy as np
from skylib import *
W, H = 1080, 1350
rng = np.random.default_rng(4242)
yy, xx = np.mgrid[0:H, 0:W].astype(float)
cx, cy, R = W * 0.5, H * 0.5, W * 0.27
dx, dy = (xx - cx) / R, (yy - cy) / R; r = np.sqrt(dx * dx + dy * dy)
inside = r < 1
mu = np.sqrt(np.clip(1 - r * r, 0, 1))
# Surface: boiling convection cells, a few dark starspots, strong limb darkening.
g1 = fbm(H, W, 4, 2, rng); g2 = fbm(H, W, 16, 3, rng); g3 = fbm(H, W, 38, 3, rng)
# Foreshorten the texture towards the limb by sampling in sphere coordinates.
sx = cx + R * np.arcsin(np.clip(dx, -1, 1)) / (np.pi / 2) * 1.0; sy = cy + R * np.arcsin(np.clip(dy, -1, 1)) / (np.pi / 2)
gran = ndi.map_coordinates(g1 * 0.6 + g2 * 0.4, [sy, sx], order=1, mode='mirror')
spots = ndi.map_coordinates(g3, [sy, sx], order=1, mode='mirror')
spot = np.clip((spots - 0.8) * 2.5, 0, 1) ** 1.5 * (1 + 0 * spots)
limb = 1 - 0.75 * (1 - mu) - 0.12 * (1 - mu) ** 2
surf = limb * (1 + 0.2 * gran) * (1 - 0.55 * spot)
img = np.zeros((H, W, 3))
col_hot = np.array([1.0, 0.52, 0.2]); col_cool = np.array([0.75, 0.13, 0.03])
mix = np.clip(mu ** 0.8 * (1 - 0.6 * spot), 0, 1)[:, :, None]
img += (surf * inside * 1.0)[:, :, None] * (mix * col_hot + (1 - mix) * col_cool)
# Glow and a faint red chromosphere just beyond the edge, plus a small flare loop.
out_r = np.clip(r - 1, 0, None)
img += (np.exp(-out_r / 0.02) * (r >= 1) * 0.35)[:, :, None] * np.array([1.0, 0.32, 0.16])
img += (np.exp(-out_r / 0.12) * 0.16)[:, :, None] * np.array([1.0, 0.4, 0.2])
ang = np.arctan2(dy, dx); fa = np.deg2rad(-38)
loop = np.exp(-((r - 1.05 - 0.05 * np.sin((ang - fa) * 18).clip(0, 1)) / 0.012) ** 2) * np.exp(-((ang - fa) / 0.07) ** 2)
img += (np.exp(-((r - 0.96) ** 2 + 0) / 0.0003) * np.exp(-((ang - fa) / 0.05) ** 2) * 0.0)[:, :, None] * np.array([1.0, 0.9, 0.75])
# Background: the bright pair Alpha Centauri A and B, far behind, and the Milky Way's stars.
m = 9000; xs = rng.uniform(0, W, m); ys = rng.uniform(0, H, m)
ok = np.hypot((xs - cx) / R, (ys - cy) / R) > 1.02
splat(img, xs[ok], ys[ok], rng.pareto(1.9, ok.sum()) * 0.12 + 0.03, star_colour(rng, ok.sum()), sigma=0.85)
ax, ay = W * 0.82, H * 0.13
bright_star(img, ax, ay, 70, [1.0, 0.95, 0.82], core=2.0, halo=22, halo_amp=0.08, spikes=HUBBLE, spike_len=16, spike_w=0.9)
bright_star(img, ax + 22, ay + 8, 35, [1.0, 0.8, 0.58], core=1.7, halo=16, halo_amp=0.08, spikes=HUBBLE, spike_len=11, spike_w=0.9)
out = tonemap(img, exposure=0.8, sat=1.6)
out = grain(out, rng, 0.006)
save(out, 'proxima-centauri.jpg')
