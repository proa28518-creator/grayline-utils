# CODEX SEAT — BRIEF · phase 12 · cause 7: SH17 sea_sheet — restore Qwen's dropped numeric keys + the F1197 state rider

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md` (you author
ALL code; seat-attribution headers), RULES.md §3 (one cause, one
change), §4 (pure in t; the owner's word times are the timing law).
**NO LOCAL RENDERS. No fleet dispatch. Audits only.**

## Previous verdict this brief cites (hard-gate requirement)
The phase-12 cause-6 verdict commit (SH14 camera; recorded in
RUN_RECORD phase 12). No judgement is pending when this brief
fires; cite "phase-12 cause 6" in your reply.

## The cause (ONE mechanism: the merge dropped Qwen's numeric keys for SH17's props, and one audit rider)
Source of truth: `.suite/chunks/CHUNK3A_QWEN_REPLY.md` (sea_sheet
keys at its SH17 prop entry; boat settle keys; the declared
moments list). The merged `scenes/film.js` collapsed them:
1. **sea_sheet_sh17 pull keys.** Qwen's design:
   `{line:15.start, 0} → {line:15.w2, 4} → {t:39.90, 14, ease inout}
   → {t:40.50, 36, ease inout} → {line:15.end, 36}`.
   The merge kept only start 0 → word:2 4 → end 36. Restore her
   full key set in the film's key format (`{t, pull, ease}` — match
   how the film's other eased keys are written; her `line:15.w2`
   is the film's `line:15.word:2`).
2. **Boat settle times.** Qwen settles boat_sh17_a at t=39.90 and
   boat_sh17_b at t=39.70 (their `at` drops y .15 → .02 as the
   water edge passes them); the merge settles both at line:15.end.
   Restore the numeric settle keys (positions unchanged).
3. **The F1197 state rider (audit).** Qwen's declared moment for
   F1197 reads "PROP boat_sh17_a >= 40 [state: pull >= 12]"; the
   merge translated only the prop check. In
   `tools/audit_staging.mjs`, append the state rider to frame
   1197's checks in the same rider pattern the SH21→SH22 match-cut
   uses (an extra check line on the existing moment, NOT a new
   moment): sea_sheet pull at t=39.90 >= 12, read by the audit's
   existing state rule. With the restored keys this reads 14.

## Explicitly NOT in this cause
**F1188's state moment stays exactly as it stands (FAIL).** It is
formally parked with a priced option table for Layla (RUN_RECORD
phase 12): Qwen's "pull >= 6 by 39.60" contradicts the owner's word
times (اتسحب is spoken at 39.84) and her own keys. Do not retime
keys ahead of the word, do not move the moment, do not touch its
threshold.

## Verify + reply
Run `node --check` on both files, `node tools/audit_d1_d2.mjs`
(unchanged: PASS), `node tools/audit_staging.mjs` full. Paste: the
restored key sets, F1197's lines (boat PASS + the new state rider
PASS), F1188's line (unchanged FAIL, as parked), F1215's line
(boat_b — its verdict is the next cause's business; report it as
measured), and a statement that chunk 2's lines are unchanged and
no other chunk-3 moment changed. Do NOT commit. Touch no other
file.
