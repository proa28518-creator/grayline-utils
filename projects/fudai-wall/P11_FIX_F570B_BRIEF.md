# CODEX SEAT — BRIEF · phase 11 · cause: F570 OPTION (b) — OWNER-ADOPTED (audit amendment + face staging)

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md`; RULES.md §3,
§4, §5; `lessons/build.md` (sampler-validation lesson is binding).

**HARD RULE (guard flag 6): NO LOCAL RENDERS.** Sampler + audits only;
the driver fleet-probes and judges.

## Previous verdict this brief cites (hard-gate requirement)
Commit `5295865` — SH04 verdict NOT CLOSED (improved, parked, escalated).
No judgement is pending: this brief may fire.

## The decision you are executing (owner's word, 2026-11-23 ~05:54)
«لو كلامه صح ومطابق لشغلنا اعتمدي» — Astra's option (b) is ADOPTED after
Layla verified it against the record (GLM's impossibility proof,
driver-verified; F590 carries the wall-top beat 0.67 s later with its
checks PASS; the candidate pose is the driver's own computation):
- the audit's F570 moment DROPS its wall-top requirement;
- F570 stages for mocker_a's FACE from the high seaward cone;
- mocker_a's LOOK DIRECTION IS PRESERVED EXACTLY (his cast keys do not
  change; the story point stands — only the moment's requirement and
  the camera change).

## Measured background (phase 10, driver-verified)
With the look locked at the wall top, any camera holding the wall-top
point in frame sits village-side where the face measures ≈130° (>60°);
the only cone where the face reads (high, slightly seaward) puts head
and wall-top in opposite directions. Candidate camera position
≈ [4,8,-3] (world): face ≈18°, head ≈323px, backdrop = wall face/sky.
The candidate is NOT certified — the render judges whole-head
clearance + foreground obstruction.

## Step 1 — amend the audit moment (tools/audit_staging.mjs, case 570)
Remove the wall-top point check from the F570 moment; keep the face
checks (mocker_a face angle + whole head in frame + occupancy). Add a
comment at the case citing: "wall-top requirement dropped per owner's
option-(b) decision 2026-11-23 (RUN_RECORD phase 11); the beat is
served at F590". Keep your seat-attribution header practice: note the
amendment in the file header block. No other case changes.

## Step 2 — stage the face (scenes/film.js, SH07 TO side only)
SH07 is a push (FROM = F537's laughing close-up; TO = the current
CAM_SH07_B / CAM_SH07_TB). Change ONLY the TO-side consts so the
SAMPLED camera at t=19.0 (F570) sits in the high seaward cone at or
near [4,8,-3] with:
- mocker_a face angle ≤60° (expect ≈18°), whole head in frame with
  ≥40px margins, head ≥230px;
- the blueprint board NOT the backdrop behind his head;
- F537 UNTOUCHED: its sampled camera at t=17.9 stays within 0.3 D of
  [4.08,2.48,-4.54] and its audit line still PASSes (the FROM side and
  fov endpoints do not change; if the lerp path shifts F537 beyond
  tolerance, say so and stop);
- mocker_a's cast entry and keys are NOT modified.
Validate your sampler first (reproduce the current F537/F570 audit
CAM lines). Search the TO pose around the candidate until the amended
audit's F570 line PASSes with the margins above.

## Apply + verify
Apply the audit amendment + the SH07 TO values. Run `node --check` on
both files, `node tools/audit_staging.mjs` (full), `node
tools/audit_d1_d2.mjs`. Paste in your reply: the validation
reproduction, the final TO values, the sampled F570 projection table
(face angle, head px, margins, backdrop), the F537 sampled camera
before/after, the complete audit outputs, and a diff summary. Do NOT
commit. Touch no other files.
