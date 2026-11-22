# Chat round — hunts and adjudication (2026-11-22, desk)

Scope: one batched Opus hunt + one batched GLM hunt over the round delta
`fce8c55..39bd1d9` (stage 4 + TDZ fix + director decision-extraction fix +
transcribe→align step). Raw outputs: `hunt_opus_out.md`, `hunt_glm_out.md`
in this folder. Every finding below was checked against the code at the desk;
the desk does not relay hunt verdicts unverified.

## Verdict: no critical or major defect survives adjudication. No fix turn was spent.

### Convergent themes (both hunts) — adjudicated

1. **Conversation save/merge concurrency** (Opus "critical", GLM "major").
   `saveConversations` is a synchronous read-merge-write inside a single
   Node process; two requests cannot interleave inside it (event loop), and
   no other process writes conversations. The merge exists to protect the
   sequential stale-save case and was desk-verified in stage 4. Concurrent
   same-thread edits from two browser tabs remain theoretically lossy —
   accepted for a single-operator local console; recorded, not fixed.
2. **Director extractor takes the LAST valid `{tool}` object** (both hunts).
   Deliberate: codex stdout carries banner/log noise before the decision;
   the director's answer is its final object. Desk-verified live across the
   whole round (setup, write_brief, passes). A user message echoed verbatim
   as a trailing tool-shaped object is a theoretical steer; the chat
   operator is the owner and the tools are bounded to the project.
   Recorded as a design note.
3. **Message-cap throw** (both hunts claimed crash/inconsistency).
   Not sustained: the request listener wraps all routes in try/catch, so
   `conversation_message_limit_reached` surfaces as a named 500;
   `addMessage` pops the unaccepted message, and in the POST route
   `touchThread` runs only after a successful `addMessage`. This is the
   stage-4 A1 specified behavior (named failure when nothing may be dropped).
4. **Preflight-failed pass run returns HTTP 202 with status `failed`**
   (GLM major). The UI polls the job record and shows the named failure —
   desk-verified live in stage 4 (state + history show `validation_failed`).
   Protocol-purity nit; recorded.
5. **`clean.json` now holds script words, not raw ASR** (GLM major).
   Intended — it is the align step's purpose (the owner's rule: his written
   text governs wording, ASR is for timing only; MAKE_FILM requires script
   words). The raw ASR transcript is preserved in `transcript.txt` and the
   transcribe report carries full alignment stats. Documented in
   ALIGN_FIX_VERIFY.md.

### Single-hunt items — adjudicated

- **Opus: alignment failure leaves transcript.txt.** Minor, partially real:
  on `asr_alignment_failed` the aligned `clean.json` is removed; a
  `transcript.txt` from the same run holds the RAW ASR transcript (which is
  what that file always contains) and the report marks the failure. Recorded.
- **Opus: zero-duration interpolated words** when neighbouring ASR words are
  adjacent (span 0). Real edge, unobserved live (fixture: 0 interpolated
  words). Words still carry a start time, which is what the renderer keys
  on. Recorded as a named minor.
- **Opus: `audio_duration` fallback "backward".** Not sustained — the code
  returns max(probe duration, last ASR end), the intended guard against
  clipping word timings.
- **Opus: report unclear about dropped ASR words.** Not sustained — the
  report's `alignment` block carries matched / substituted /
  inserted_interpolated / dropped_asr_words (fixture run: 52 / 31 / 0 / 4).
- **Opus/GLM: style registry rescanned per call; pass history unbounded;
  message-id collision odds; ffprobe 10 s timeout on slow storage.**
  Real but trivial at this program's scale (3 style packs, local files,
  single operator). Recorded as minors.
- **GLM: empty-ASR alignment confusion.** Not sustained — transcribe raises
  `asr_empty_transcript` before alignment when ASR returns no words.
- **GLM: transcribe now requires script.txt** (`asr_script_missing`).
  By design of the align step: no script of record → nothing to align →
  named failure. Every program-created project carries script.txt.
- **GLM: mid-conversation style change mutates project.json.** Intended
  B10 behavior: style is a live conversation input, saved to the project
  and recorded with runs.
- **Opus self-discarded** (after its own re-reading): prop-gate fraction
  validation, pass style state race, `atomic_copy` temp handling, escaped
  braces. Non-findings.

## Desk-found cosmetic defect (from this session's screenshot)
- The Berserk screen renders its heading + tab bar twice (shell heading and
  the page's own heading). Cosmetic only; evidence:
  `shots/berserk-chat-fixture-conversation.png`. Recorded, not fixed
  (production over looks; quota discipline).
