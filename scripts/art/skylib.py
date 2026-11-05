import numpy as np
from scipy import ndimage as ndi
from PIL import Image

def value_noise(h, w, cell, rng):
    gh, gw = int(np.ceil(h / cell)) + 3, int(np.ceil(w / cell)) + 3
    g = rng.standard_normal((gh, gw))
    yy = np.arange(h)[:, None] / cell + 1; xx = np.arange(w)[None, :] / cell + 1
    return ndi.map_coordinates(g, [np.broadcast_to(yy, (h, w)), np.broadcast_to(xx, (h, w))], order=3, mode='wrap')

def fbm(h, w, base, octaves, rng, gain=0.55, lac=2.0):
    out = np.zeros((h, w)); amp = 1.0; cell = base; tot = 0
    for _ in range(octaves):
        if cell < 1.2: break
        out += amp * value_noise(h, w, cell, rng); tot += amp
        amp *= gain; cell /= lac
    return out / tot

def warp(field, dx, dy):
    h, w = field.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    return ndi.map_coordinates(field, [yy + dy, xx + dx], order=1, mode='reflect')

def ridged(n):
    return 1 - np.abs(n)

def splat(img, xs, ys, flux, cols, sigma=0.75):
    """Faint stars: bilinear splat then blur with a PSF."""
    h, w, _ = img.shape
    buf = np.zeros((h, w, 3))
    x0 = np.floor(xs).astype(int); y0 = np.floor(ys).astype(int); fx = xs - x0; fy = ys - y0
    for dx, dy, wt in [(0, 0, (1 - fx) * (1 - fy)), (1, 0, fx * (1 - fy)), (0, 1, (1 - fx) * fy), (1, 1, fx * fy)]:
        xi = x0 + dx; yi = y0 + dy; ok = (xi >= 0) & (xi < w) & (yi >= 0) & (yi < h)
        for c in range(3):
            np.add.at(buf[:, :, c], (yi[ok], xi[ok]), (flux * wt * cols[:, c])[ok])
    for c in range(3):
        buf[:, :, c] = ndi.gaussian_filter(buf[:, :, c], sigma)
    img += buf

def bright_star(img, x, y, flux, col, core=1.1, halo=6.0, halo_amp=0.04, spikes=None, spike_len=40, spike_w=0.8):
    h, w, _ = img.shape
    R = int(max(halo * 4, spike_len * 2.5 if spikes else 0, core * 6)) + 2
    xa, xb = max(0, int(x) - R), min(w, int(x) + R + 1); ya, yb = max(0, int(y) - R), min(h, int(y) + R + 1)
    if xa >= xb or ya >= yb: return
    yy, xx = np.mgrid[ya:yb, xa:xb].astype(float); dx = xx - x; dy = yy - y; r2 = dx * dx + dy * dy
    I = np.exp(-r2 / (2 * core * core)) / (2 * np.pi * core * core) + halo_amp * np.exp(-np.sqrt(r2) / halo) / (2 * np.pi * halo * halo)
    if spikes:
        for ang, rel in spikes:
            ca, sa = np.cos(ang), np.sin(ang)
            d = dx * ca + dy * sa; p = -dx * sa + dy * ca
            I += rel * 0.02 * np.exp(-p * p / (2 * spike_w ** 2)) * np.exp(-np.abs(d) / spike_len) * (d > 0)
    img[ya:yb, xa:xb] += flux * I[:, :, None] * np.asarray(col)[None, None, :]

WEBB = [(np.pi / 2 + k * np.pi / 3, 1.0) for k in range(6)] + [(0.0, 0.45), (np.pi, 0.45)]
HUBBLE = [(np.pi / 4 + k * np.pi / 2, 1.0) for k in range(4)]

def star_colour(rng, n, warm=0.0):
    # Rough black body colours from hot blue-white to cool orange.
    t = rng.random(n) + warm
    cols = np.stack([np.interp(t, [0, 0.25, 0.55, 0.85, 1.2], [0.70, 0.88, 1.00, 1.00, 1.00]),
                     np.interp(t, [0, 0.25, 0.55, 0.85, 1.2], [0.80, 0.92, 0.96, 0.84, 0.66]),
                     np.interp(t, [0, 0.25, 0.55, 0.85, 1.2], [1.00, 1.00, 0.90, 0.66, 0.42])], 1)
    return cols

def tonemap(img, exposure=1.0, black=0.0, sat=1.0):
    x = np.maximum(img * exposure - black, 0)
    lum = x.mean(2, keepdims=True)
    x = lum + (x - lum) * sat
    x = np.maximum(x, 0)
    y = np.arcsinh(x * 6) / np.arcsinh(6)  # astro style stretch
    y = y / (1 + 0.35 * y)  # soft shoulder
    y = y / (1 / 1.35)
    return np.clip(y, 0, 1)

def grain(img, rng, amt=0.012):
    return img + rng.standard_normal(img.shape[:2])[:, :, None] * amt * (0.4 + img.mean(2, keepdims=True))

def save(img01, path, size=None, quality=88):
    im = Image.fromarray((np.clip(img01, 0, 1) ** (1 / 1.0) * 255 + 0.5).astype(np.uint8))
    if size: im = im.resize(size, Image.LANCZOS)
    im.save(path, quality=quality, subsampling=0, optimize=True, progressive=True)
