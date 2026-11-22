# Camera angles — RUN 13 (Stage 2)

Instruction set: none named by the member; the pass was scoped by the
task to the carried framing MINORs from RUN 10–12, under the hard
constraint that shots 6–12 ring framing is gate-locked and any change must
re-verify the ring readable at BOARD SCALE (360×640) before proceeding.

## Before (verified from the RUN 12 gate stills, own eyes)
- S6 @19.355: ring-only tile (gold annulus + pigeon); groom absent.
  Carried MINOR: groom's face cut at top (RUN 10 framing).
- S7a @22.24: ring-only tile; groom absent except a dark torso fragment
  at the bottom-left corner. Carried MINOR: groom absent at midpoint.
- S7b @24.855: ring-only tile; groom absent. Carried MINOR: face ~75%.
- S9 @28.444 / gate tile @26.6: groom's torso fills the top, face out of
  frame top; ring big and clear at 26.6. Carried MINOR: face out top.
- S10/S11: ring-only tiles by design (groom approaching / at the west rim).
- S12 @37.579: VERIFIED — full face in frame (eyes, brows, mouth, hair),
  ring clear at his feet, no bisection. The RUN 11 "hairline cut" MINOR is
  RESOLVED by RUN 12 pass 2; no touch.

## Ground truth probed first (harness/probe13.mjs)
- propTrack `w` body-prop entries report the groom's CURRENT WALK
  SEGMENT END, not his live position — never design from them.
- Live groom positions (walk easing + segment timing): S6 ~[1.5, 2.2] at
  19.355 (camera axis x 0.65, ~13° off-axis vs ~11.5° half-FOV — just out
  right); S7a he passes the camera's left edge, very close to the lens
  plane (the "blob" in the RUN 11 tile is his torso at the frame edge);
  S9 he STANDS at [8.3, 2.35] from ~24.6 on, head top ~2.7 D, while the
  camera target sat at y 0.15 — the face was above the frame by geometry,
  not by a nudge.

## Attempt (one round, 4 shots, near-static pushes, fov widened)
- S6: fov 42→48, pos z 6.2→6.9, target x 0.65→1.15/y 0.35.
- S7a: fov 42→48, pos z 6.2→7.2, target [3.9, 0.4, 1.95].
- S7b: fov 40→48, pos z 5.4→6.2, target [7.0, 0.4, 1.95].
- S9: fov 40→44, pos [9.4, 2.4, 7.2], target [8.4, 1.0, 2.3].
- Captures: harness/recap13.mjs → frames_s2/s2_r13_shot06/07/08/09/09b.png.

## Result — ALL FOUR REVERTED (film.js restored byte-identical to RUN 12,
## md5 09bf951c6014b48f878b9b7f3dc242c7, boot-probe clean)
- S6: groom entered at the right edge but his face is STILL cut at the
  top (chin + one eye in the corner) and his body is half out of frame;
  the ring stayed clear (~85 px, hole reads). The MINOR was not fixed —
  it changed shape. Worse than the accepted clean ring tile.
- S7a: groom still unreadable (torso fragment, now bottom-left, even
  closer to the lens); the broom now crosses the whole frame horizontally
  in the foreground. Ring stayed clear. No gain, new foreground clutter.
- S7b: groom still only a torso sliver + foot at the right edge, no face.
  Ring stayed clear. No gain.
- S9: the face-cut MINOR was FIXED (full face, big, readable, happy/
  look_up at 28.444) — BUT the ring VANISHED from the midpoint frame
  (gold-pixel scan: NO GOLD at 28.444; at the gate time 26.6 the ring is
  ~56 px at the left edge, half behind the burned caption, vs the
  gate-locked ~110 px annulus). The ring is the film's hero prop and its
  S9 tile is gate-locked; a face fix that costs the ring fails the hard
  constraint. Also at 26.6 the new camera catches the groom from behind
  (back of head), so the gate tile loses on both counts.

## Why (the structural reason, for the next film)
In 9:16 at fov 40–48 the horizontal half-FOV is ~11–14°. The ring (0.11 D
across) needs a tight, centred framing to read at board scale, while the
running groom is 1–2 D off the ring's camera axis and 2.6 D tall. One
9:16 frame cannot hold both at once: widening far enough to include the
groom shrinks the ring below board readability or pushes it under the
burned caption, and the groom still arrives cut (he passes within ~1 D of
the lens plane on S7a). The S6–S11 ring-tracking tiles are therefore
ring-only BY NECESSITY, not by neglect; the groom's chase reads in S1–S5
and S12–S15 and in motion. This is a staging lesson for the next film:
if the groom must share a tile with the ring, the shot must be staged
with them on the SAME axis (groom behind the ring from the camera), not
1–2 D apart laterally.

## HANDOVER
- Cameras: UNCHANGED from RUN 12 (gate-locked). Shots 1–9, 13–15
  accepted; 10–12 ring re-tilt [-33,37,0] + float [12.7,1.05,3.1] hold.
- Carried MINORs (framing, accepted, none blocking): S6–S8/S10/S11
  ring-only tiles (groom out of frame at the still instant); S9 groom's
  face out of frame top at the midpoint (face reads in motion as he
  stands at the fountain; the 26.6 gate tile holds the big ring annulus);
  S12 ring small at board scale (~17×20 px, hole reads).
- Next pass: Environment-overhaul (scenes/set.js), then Post, Shading —
  none of them moves a camera.
