# CODEX SEAT — BRIEF · phase 12 · cause 1 (tooling): the stale D1 fetch matcher

You are the Codex seat for the film "fudai-wall", project
`~/workspace/fudai-rebuild/studio/projects/fudai-wall/`, branch
`ui/unified-interface`. Standing method: studio `AGENTS.md` (you author
ALL code; seat-attribution headers), RULES.md §3 (one cause, one
change), §4. **NO LOCAL RENDERS. No fleet dispatch. Audits only.**

## Previous verdict this brief cites (hard-gate requirement)
Commit `e5131de` — phase 11 CLOSE: every chunk-2 cause CLOSED or
formally parked; the chunk-3 merge (`db405c0`) + boot fix (`7bd9527`)
are in; no judgement is pending. This brief may fire.

## The cause (one cause, one file)
`tools/audit_d1_d2.mjs` arms its D1 belongings-box fetch check on
`p.id === 'box' || p.kind === 'box'` (the check + the "not present"
note near the end of the D1 section). The film's actual entry — in
`scenes/film.js` since the chunk-3 merge — is
`{id:'box_sh13', kind:'belongings_box', in:'world', at:…, fetch:true, keys:[…]}`.
The matcher never matches it, so the D1 gate's fetch:true protection
(the SH13 arms beat: the mayor's belongings box must keep `fetch:true`)
silently never arms. The audit currently prints the misleading note
"D1: no belongings-box prop yet".

## The change (exactly this, nothing else)
In `tools/audit_d1_d2.mjs`:
1. Arm the fetch check on the real entry: a prop whose
   `kind === 'belongings_box'` (match on kind; if more than one such
   prop ever exists, the check applies to each). Keep the check's
   semantics: it FAILs if any belongings_box entry's `fetch` is not
   exactly `true`.
2. The "not present" note may remain for the genuinely-absent case,
   worded so it cannot be confused with the present case.
3. If the file header comment describes the old matcher, update that
   one comment line to match.
4. Add/refresh the seat-attribution note for this change in the file
   header (author: Codex seat; brief: this file; date: 2026-11-23).

Do NOT change any threshold, any other check, or any other file.
Do NOT touch `scenes/`, `lib/`, `engine/`.

## Verify + reply
Run `node --check tools/audit_d1_d2.mjs` and
`node tools/audit_d1_d2.mjs`. In your reply paste: the diff, and the
complete audit output. Expected: the D1 fetch check is ARMED and
PASSes (the entry carries fetch:true), the stale note is gone, and
the remaining FAIL list is exactly the 4 known items (D2 bounds ×2 —
wall_distant_sh14/sh26; D2-CLEAR ×2 — SH13/SH16 town hall). If the
armed check FAILs or anything else changes, STOP and report the
measured discrepancy — do not tune anything to force the expectation.
Do NOT commit.
