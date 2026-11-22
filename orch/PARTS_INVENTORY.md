# PARTS INVENTORY — every piece of the program, where it is, what state it's in
### (For the assembling session: if a piece is NOT in this list, SEARCH for it —
### repo, teardown, bundle maps, audits — and report the discrepancy before building.)

State key: **PROVEN** = exercised live end-to-end · **BUILT** = code exists, not yet
exercised live · **PARTIAL** = works with a named gap · **PLACEHOLDER** = screen only ·
**MISSING** = does not exist yet.

## A. Shell & screens — `app/` (Electron, our code)
| # | Piece | State | Fits where |
|---|-------|-------|-----------|
| A1 | Desktop shell (main.js / preload.js) | PROVEN — boots, resident, clean quit | Holds every screen |
| A2 | Home screen | BUILT — status summary | Landing |
| A3 | Berserk — run-control panel (RUN, legs, live feed, steering) | PROVEN (acceptance run) | Supervision view of a run |
| A4 | **Berserk — director CHAT (new-conversation entry)** | **MISSING** | **The door: request → setup → drive → deliver, one conversation** |
| A5 | Projects screen + New project form | PROVEN (form drove acceptance) | Project creation — becomes secondary to A4 |
| A6 | Editor (board frames, click-to-annotate) | PARTIAL — annotations save; not fed into a pass fix loop | Frame-level steering |
| A7 | Channels · Styles · Library · Memory · Routines · YouTube screens | PLACEHOLDER (marked in UI) | Off the production path today |
| A8 | Model seats panel + Probe | PROVEN — GPT/Opus/GLM connected; Gemini awaiting owner's own sign-in | Seat health at a glance |

## B. Run machinery — `server/`, `bin/`
| # | Piece | State | Fits where |
|---|-------|-------|-----------|
| B1 | Server API (projects · slice · run · passes · seats) | PROVEN | Everything the UI does goes through it |
| B2 | Run executor — 7 legs: script ✓ · voice ✓ · timing · board · sound · gates · export | PROVEN end-to-end (acceptance run, fleet 45007005334 + assembly 45008177248) | The production spine |
| B3 | Pass runner — Build → Camera → Environment → Post → Shading, strict order, checkpoint each | PARTIAL — Build exercised live to checkpoint; other four BUILT, unexercised | Scene quality ladder |
| B4 | Pass critics — GLM, then FRESH Opus; fix loop between | PROVEN on Build pass | Second layer over measured checks |
| B5 | **Prop-truth gate — zoom crop per key prop + leftover scan** | **MISSING** (owner's catches, 2026-11-22: ring-as-chocolate, slab-outside-pocket) | Inside B3/B4 — no board passes without it |
| B6 | Dispatch layer — GitHub Actions (stills + assembly) | PROVEN | Heavy work leaves only through here |
| B7 | Colab render leg (full-film GPU render) | NOT DISPATCHABLE — no official API; manual wake; marked in UI | Final film render |
| B8 | `heart` CLI (new · slice · still · mix · …) | PROVEN — mix verb added in interface round | The program's hands |
| B9 | Per-project git (`.heart-git` snapshots, checkpoint, rollback) | PROVEN — rollback smoke-tested | Undo + pass baselines |
| B10 | Settings flow (UI → project.json → renderer/dispatch) | PROVEN (GitHub proof run 45000571247) | fps etc. actually reach the worker |

## C. Production heart — per project (Creatorize core lineage)
| # | Piece | State | Fits where |
|---|-------|-------|-----------|
| C1 | Scene engine (Three.js; stage dispatcher park/push/orbit/follow/path) | PROVEN (Stories 3–6 + proofs) | Every shot is code on this engine |
| C2 | Timing spine (word timings → shot plan) | PARTIAL — works from owner's timings / slice of a timed file; **in-program ASR MISSING** | Voice is law; film length = file length |
| C3 | Sound spine (music bed + SFX lanes + mix) | PARTIAL — works per film; forked per project (gap G6: fixes land in one copy; `loop_to` bug still live in Stories 3/4/5 copies) | Designed-in from the start |
| C4 | Fleet finish (pts audit · setpts re-encode · SSIM verify) | PROVEN on GitHub assembly | No master ships without it |
| C5 | Style/skill packs planted for builder sessions | PARTIAL — vendored per project (gap G12 drift risk) | House style for the builder |

## D. Knowledge pieces
| # | Piece | State | Fits where |
|---|-------|-------|-----------|
| D1 | AGENTS.md — standing direction inside the project | IN PLACE | Every session opens by reading it |
| D2 | In-program lessons memory (proposal 5) | MISSING | Program learns from each film |
| D3 | Retention analysis → Write step (proposal 4) | MISSING | Feeds the next story |
| D4 | Shared asset library (proposal 3) | MISSING (Library screen = A7 placeholder) | Props/scenes reused across films |

## Assembly = 
A4 built and wired to B1–B3 so a conversation drives the whole machine · B5 added
to the pass discipline · C2's ASR wired · A6's annotations feeding B3's fix loop ·
B3's remaining four passes exercised live · the REAL TEST (CHAT_ROUND_BRIEF §D)
passed through A4 on a brand-new story.
