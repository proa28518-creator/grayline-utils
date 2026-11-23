# BOARD ASSEMBLY — PREP (readied 2026-11-23, phase 8, parallel to chunk iteration)

Purpose: the stills board the OWNER judges with his own eye. His approval is
the gate that unlocks the Colab final render (standing condition 2). Nothing
here renders anything: the board is assembled from FLEET stills only
(standing condition 1 — no local rendering; `tools/board.cjs` is a local
renderer and is NOT the board route).

## Board contents (shot order, one row per shot)
For every shot, the board carries the frames the critic judged plus the
audit's key moments, so the owner sees exactly what the gates saw:
- Chunk 1 (SH01–SH03, critic-passed round 4): F0, F3, F45, F60, F105, F165
  (existing fleet probes, `probes/` phase-1/2 dirs).
- Chunk 2 (SH04–SH12): the 19 audit moments — 219, 241, 288, 345, 414, 474,
  537, 570, 590, 621, 639, 669, 687, 711, 723, 768, 798, 822, 870 — from the
  post-fix-#2 fleet re-probe (`probes/chunk2d/stills/`).
- Chunk 3 (SH13–SH26): Qwen's declared audit moments, from its fleet probe
  (dir named when the chunk's probe lands).
Plus, per shot, one mid-shot frame between the moments where the shot runs
longer than 3 s (owner reads motion intent from the trio: start / moment /
mid).

## Assembly
1. Collect the listed PNGs (1080×1920) from the probe dirs — verify each
   file's frame number against this list before assembly (a mislabelled
   still on the board is a false claim to the owner's eye).
2. Lay out per shot in film order, labelled with shot id + frame + time
   (labels added at assembly, never burned into the fleet stills).
3. Deliver as one board file set in `out/board/` + a one-page index naming
   every frame's shot and moment.

## Gate
- The board goes to the owner's eye as-is — no frame is swapped after a
  critic round without re-probing that frame on the fleet.
- His approval (recorded in RUN_RECORD with his word) unlocks: Colab final
  render dispatch + Seat 5 mix execution. Without it, both stay locked.
