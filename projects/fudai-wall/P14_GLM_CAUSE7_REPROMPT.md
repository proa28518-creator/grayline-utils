# GLM SEAT — CORRECTIVE RE-PROMPT · phase 14 · cause 7: the F1197 rider block ONLY

Your film lines for cause 7 are ACCEPTED as authored, verbatim —
do not resend or alter them. ONE part of your reply was unusable:

**Defect (measured against the actual file):** your rider block
reads the prop from `chunks[ci]` — no variable named `chunks` or
`ci` exists anywhere in `tools/audit_staging.mjs`; the block would
throw on its first line. The audit's resolved props live in the
module-level array named `props` (every existing check uses it,
e.g. the state branch: `const p=props.find(x=>x.id===id)`), and
its keys are already time-resolved numbers. The audit's existing
state rule for a field is: take the last key with `k.t <= t`
(the array is in authored order), read that key's field, falling
back to the prop's base field, then 0. Your loop's intent matched
this; only the data access was invented.

## Your task (narrow)
Re-author ONLY the frame-1197 rider block + the header comment
line, verbatim and pasteable, against the real file:
- Header comment line (exact text, as briefed):
  `// Phase-14 P14_GLM_CAUSE7_BRIEF.md (GLM seat): F1197 sea_sheet state rider restored per Qwen's declared moment.`
- Block: fires on `frameNo===1197` inside the chunk-3 moment loop;
  finds the prop in `props` by id `sea_sheet_sh17`; computes pull
  by the state rule above (field `pull`); pushes exactly one check
  line of the form `sea_sheet_sh17 state rider PASS pull 14 >= 12`
  (FAIL form likewise, with the measured value interpolated).
- Placement: immediately BEFORE the line ` chunk3Results.push({frameNo,t,shotId,checks});`
- Use ONLY names that exist in the file (`props`, `checks`,
  `frameNo`, `t`). No new imports, no new helpers, no other lines.

## Reply format (exact)
1. DEFECT RESTATED: one line naming what was wrong.
2. AUDIT BLOCK: the header comment line + the rider block, verbatim, pasteable.
Nothing else. Do not claim you ran anything. **NO LOCAL RENDERS.**
