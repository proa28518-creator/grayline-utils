#!/usr/bin/env python3
# AUTHORSHIP: Codex seat; brief: P9_PIXEL_GATE_REDERIVE_BRIEF.md; date: 2026-11-23.
"""Pixel measurements for one probed still (fudai-wall pixel gate).

Usage: pixel_measure.py <still.png>
Prints one JSON object:
  flat_pct / detail_pct  - RULES S5 block measure: 32x32 blocks on grayscale;
                           flat block = std < 5, detail block = std >= 12.
  discs                  - rendered head discs found by skin segmentation:
                           a skin component ringed by the characters' dark
                           outline. Each disc: skin bbox, expanded bbox
                           (outline + hair/hat allowance, +12% per side),
                           area, dark-adjacency ratio.
Calibration (2026-11-23, chunk2d stills): F537 mocker silhouette 648x624 px
vs the staging audit's 480 px model disc (1.32x, hat-inclusive); F687 mayor
disc centre (553,30) r~473 vs projected (540,653) r448 - the gate therefore
MEASURES discs in the image instead of trusting projected centres.
"""
import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage

def components(mask):
    lab, n = ndimage.label(mask)
    return lab, n

def main():
    path = sys.argv[1]
    img = Image.open(path).convert('RGB')
    a = np.asarray(img).astype(np.int32)
    H, W = a.shape[:2]
    R, G, B = a[:, :, 0], a[:, :, 1], a[:, :, 2]

    # ---- S5 block measure (grayscale, 32x32 blocks) ----
    gray = (0.299 * R + 0.587 * G + 0.114 * B)
    bs = 32
    nb = 0; flat = 0; detail = 0
    for y in range(0, H - bs + 1, bs):
        for x in range(0, W - bs + 1, bs):
            s = gray[y:y + bs, x:x + bs].std()
            nb += 1
            if s < 5: flat += 1
            if s >= 12: detail += 1
    flat_pct = round(100.0 * flat / nb, 1)
    detail_pct = round(100.0 * detail / nb, 1)

    # ---- head discs: skin mask + dark-outline adjacency ----
    skin = (R > 130) & (R - B > 25) & (R - G > 8) & (R - G < 95) & (G - B > 5) & (G - B < 80)
    dark = (R < 85) & (G < 75) & (B < 75)
    lab, n = components(skin)
    discs = []
    if n:
        for root in range(1, n + 1):
            m = lab == root
            area = int(m.sum())
            if area < 6000:
                continue
            ys, xs = np.nonzero(m)
            x0, x1, y0, y1 = int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())
            # dark adjacency: dilate by 3 px, ring = dilated & ~m
            d = ndimage.binary_dilation(m, iterations=3)
            ring = d & ~m
            ring_n = int(ring.sum())
            adj = float((ring & dark).sum()) / ring_n if ring_n else 0.0
            bw, bh = x1 - x0 + 1, y1 - y0 + 1
            aspect = bw / max(bh, 1)
            if adj < 0.30 or not (0.55 <= aspect <= 2.3):
                continue
            ex = round(bw * 0.12); ey = round(bh * 0.12)
            discs.append({
                'skin': [x0, y0, x1, y1],
                # Keep these bounds in image coordinates even when they cross
                # the raster. The caller needs the overshoot to detect crops.
                'disc': [x0 - ex, y0 - ey, x1 + ex, y1 + ey],
                'centre': [round((x0 + x1) / 2), round((y0 + y1) / 2)],
                'area': area, 'adj': round(adj, 2),
            })
    discs.sort(key=lambda d: -d['area'])
    print(json.dumps({'file': path, 'size': [W, H], 'flat_pct': flat_pct,
                      'detail_pct': detail_pct, 'discs': discs}))

if __name__ == '__main__':
    main()
