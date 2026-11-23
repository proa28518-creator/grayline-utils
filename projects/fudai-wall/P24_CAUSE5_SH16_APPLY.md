# PHASE 24 · CAUSE 5 — SH16 CAMERA — APPLICATION RECORD

## Previous verdict this application cites (hard-gate requirement)
Commit `21451c4` — phase-22 VERDICT: SH25 camera CLOSED (corrective
round); the tree stands at the last judged state (HEAD `b71766d` =
that verdict + the phase-23 brief prep). No judgement is pending
when this fires.

## Dispatcher ruling recorded verbatim (Layla, 2026-11-23 ~13:06 EET)
The Qwen seat stalled measurably on cause 5 (two generations + a
10-minute recheck, ~90 minutes, zero output; chat.qwen.ai
conversation 88dfb3d1-c177-403f-b5f6-3c2d859abe14). Per the standing
escalation rule (two unusable outputs → change the method), the
remaining chunk-3 camera causes (5 SH16, 4 SH13R2, 6 SH14, 8 SH17,
9 SH18, 10 SH19) and item 17 are RE-ROUTED to the Hydrogen browser
seat (Gemini Neon, Task mode; four consecutive near-exact
reproductions, 4–9 min sessions). The phase-23 briefs stand as
written (seat-agnostic format); Qwen's chunk-3a authorship credit
is unchanged — only the repair seat changes. The phase-14 (A)+(D)
ruling is amended by this ruling for these causes.

## Delivery
Seat: **Hydrogen** (Gemini Neon, Task mode; gemini.google.com,
nooaar343@gmail.com), session run by Layla 2026-11-23 13:06–13:12
EET. Verbatim seat output: `P23_HYD_SH16_OUT.txt` (same folder).
The driver applies the candidate VERBATIM — no iteration, no
hand-authored correction. **NO LOCAL RENDERS. Colab LOCKED.
SH26's line is DO-NOT-TOUCH. F1188 stays parked — its reading must
stand untouched. F590 + SH11 closed by decision — never reopen.**

## The cause (SH16's camera path passes INSIDE the town hall solid;
## the framing checks fail from that lane: body corners clipped,
## head out of frame)

Measured baseline (driver's own audit runs on HEAD `b71766d`):
- F1131 (t=37.70) FAIL: villagers body 428px, corners 2/8.
- F1137 (t=37.90) PASS: birds_sh16 130px in frustum (invariant).
- F1155 (t=38.50) FAIL: villagers face angle 33.4° (fine), head
  OUT 221px.
- F1188 (SH17) FAIL sea_sheet pull 0 >= 6 — PARKED, untouched.
- D1/D2 FAIL (2): D2-CLEAR shot 14 (SH13) + shot 17 (SH16), both
  "camera path intersects town hall".
- Chunk 3 staging 29/40 PASS (FAIL 11/40); chunk 2 untouched.

Current line (film.js):
chunk3Shot('SH16','line:14.start','line:14.end','COAST_VILLAGE',[[3.5,2.2,10.5],[0,1.4,0]],[[3.2,2.1,10.2],[0,1.3,0]],46)
World: pos [3.5,2.2,12.5] → [3.2,2.1,12.2] — inside the town hall
box (x∈[-4.5,4.5], y∈[0,6.4], z∈[9.5,18.5]) on all three axes.

## Candidate (Hydrogen seat, verbatim)
chunk3Shot('SH16','line:14.start','line:14.end','COAST_VILLAGE',[[-8.2,2.3,9.5],[-1.5,2.4,0.9]],[[-7.9,2.2,9.2],[-1.5,2.3,0.9]],48)
World: pos [-8.2,2.3,11.5] → [-7.9,2.2,11.2]; target
[-1.5,2.4,2.9] → [-1.5,2.3,2.9]; fov 48. Design: the camera leaves
the hall box entirely to the WEST (|x| ≥ 7.9, 3.4 m clear of the
hall's west wall), looking east-south-east at the villagers;
sightlines to villagers and birds cross the hall's front plane
west of its wall — unoccluded.

Seat's predicted readings (its own arithmetic):
- D2-CLEAR: PASS — |x| ≥ 7.9 ≥ 5.0 across the whole path.
- D2 target bound: PASS — FROM y=2.4, TO y=2.3, both ∈ [0,19.5];
  D1/D2 → FAIL (1) (SH13 only).
- F1131 body: PASS — 465.1px; corners 8/8.
- F1137 birds: PASS — point in frustum, NDC (+0.787, +0.411).
  (The seat's text carries two size figures — 185.4px by the
  height formula and a ≈92.4px scaled cross-note; the audit's own
  reading governs.)
- F1155 head: PASS — face angle 30.31°; head sphere fully in
  (smallest margin +148.9px left); 237.5px ≥ 80px.

## Judgement plan (hard gate, in order)
1. Staging audit on the applied tree — F1131/F1155 must PASS,
   F1137 must stay PASS, F1188's line must stand byte-identical;
   no other moment may change.
2. D1/D2 audit on the applied tree — must read exactly FAIL (1)
   (SH13 only): SH16's D2-CLEAR line gone, no new line of any kind.
3. Fleet re-probes of F1131/F1137/F1155 → pixel measurements +
   driver eye.
4. Verdict committed. A failed candidate parks per precedent —
   application reverted uncommitted, no self-iteration.
