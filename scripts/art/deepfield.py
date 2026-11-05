import sys, numpy as np
from skylib import *

def galaxy(img, x, y, size, kind, ang, q, col, flux, rng):
    h, w, _ = img.shape
    R = int(size * 9) + 4
    xa, xb = max(0, int(x) - R), min(w, int(x) + R + 1); ya, yb = max(0, int(y) - R), min(h, int(y) + R + 1)
    if xa >= xb or ya >= yb: return
    yy, xx = np.mgrid[ya:yb, xa:xb].astype(float); dx = xx - x; dy = yy - y
    ca, sa = np.cos(ang), np.sin(ang); u = dx * ca + dy * sa; v = (-dx * sa + dy * ca) / q
    r = np.sqrt(u * u + v * v) + 1e-6; th = np.arctan2(v, u)
    win = np.clip(1 - (dx * dx + dy * dy) / (R * R), 0, 1) ** 2
    if kind == 'ell':
        I = np.exp(-7.67 * ((r / size) ** 0.25 - 1)) * win
        C = np.broadcast_to(np.array(col), I.shape + (3,))
        img[ya:yb, xa:xb] += flux * I[:, :, None] * C / max(I.sum(), 1e-6) * 40
    else:
        disc = np.exp(-r / (size * 0.5)) * win
        pitch = rng.uniform(0.25, 0.45); ph = rng.uniform(0, 6.3); m = 2
        arms = 1 + 0.55 * np.cos(m * (th - np.log(r / size + 0.05) / pitch) + ph)
        clump = ndi.gaussian_filter(rng.standard_normal(r.shape), max(size * 0.07, 0.6))
        clump = np.exp(clump / (clump.std() + 1e-6) * 0.45 * (r > size * 0.2))
        arms = ndi.gaussian_filter(arms, max(size * 0.05, 0.5))
        bulge = np.exp(-(r / (size * 0.16)) ** 1.1) * 1.2 * win
        dI = disc * np.maximum(arms * clump, 0) * 0.6
        bc = np.array([1.0, 0.86, 0.66]); dc = np.array(col)
        tot = (dI.sum() + bulge.sum()) + 1e-6
        img[ya:yb, xa:xb] += flux * 40 * (dI[:, :, None] * dc + bulge[:, :, None] * bc) / tot

def render(W, H, seed, mode, right_bias=False):
    rng = np.random.default_rng(seed)
    img = np.zeros((H, W, 3))
    # Faint background haze of countless unresolved galaxies.
    haze = fbm(H, W, 220, 5, rng); img += (0.0035 + 0.002 * haze)[:, :, None] * np.array([0.55, 0.6, 0.85])
    scale = W / 1080
    n = int((1000 if mode == 'edge' else 750) * (W * H) / (1080 * 1350))
    for i in range(n):
        x = rng.uniform(-20, W + 20); y = rng.uniform(-20, H + 20)
        if right_bias and rng.random() < 0.55 * (1 - x / W): continue
        z = rng.random()
        far = z < (0.75 if mode == 'edge' else 0.55)
        size = (rng.pareto(2.6) + 1) * (1.0 if far else 1.8) * scale
        if not far and rng.random() < 0.02: size *= 4.0
        size = min(size, 46 * scale)
        kind = 'ell' if rng.random() < 0.38 else 'sp'
        q = rng.uniform(0.25, 1.0); ang = rng.uniform(0, np.pi)
        if far:
            t = rng.random(); col = [1.0, 0.45 + 0.25 * t, 0.30 + 0.2 * t]  # light stretched red
            flux = size ** 1.6 * rng.uniform(0.03, 0.09)
        elif kind == 'ell':
            col = [1.0, 0.84, 0.62]; flux = size ** 1.8 * rng.uniform(0.05, 0.12)
        else:
            col = rng.choice([[0.72, 0.82, 1.0], [0.85, 0.88, 1.0], [1.0, 0.86, 0.75]]); flux = size ** 1.8 * rng.uniform(0.05, 0.12)
        galaxy(img, x, y, size, kind, ang, q, col, flux, rng)
    # A few foreground stars of our own galaxy, with Webb's eight point spikes.
    for i in range(int(7 * (W * H) / (1080 * 1350))):
        x = rng.uniform(0, W); y = rng.uniform(0, H)
        if right_bias and x < W * 0.4: x = W - x * 0.6
        f = rng.pareto(1.6) * 1.2 + 0.6
        col = star_colour(rng, 1)[0]
        bright_star(img, x, y, f * 4 * scale, col, core=1.0 * scale, halo=5 * scale, halo_amp=0.05, spikes=WEBB, spike_len=min(5 + 6 * f, 32) * scale, spike_w=0.7 * scale)
    # Faint field stars.
    m = int(260 * (W * H) / (1080 * 1350)); xs = rng.uniform(0, W, m); ys = rng.uniform(0, H, m)
    splat(img, xs, ys, rng.pareto(2.0, m) * 0.25 + 0.05, star_colour(rng, m), sigma=0.8 * scale)
    out = tonemap(img, exposure=1.3, sat=1.15)
    out = grain(out, rng, 0.006)
    return out

if __name__ == '__main__':
    W, H, seed, mode, path = int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]), sys.argv[4], sys.argv[5]
    save(render(W, H, seed, mode, right_bias=(mode == 'card')), path)
