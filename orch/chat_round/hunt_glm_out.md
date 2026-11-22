Hunting real defects across the diff. Here are concrete correctness issues, off-by-one/edge-case bugs, crash paths, and validation gaps.

### server.js

**Major — `/api/passes/run`: style preflight never persists or writes state when rejected**
The `styleFailure` branch sets `j.status='failed'`, `ended:true`, logs, and returns 202 **without writing `sf` state to disk** (`fs.writeFileSync(sf, ...)` is called earlier only in the non-failure path? Actually `ps.state` and `ps.history` are mutated and `fs.writeFileSync(sf,...)` runs before the early return — wait, it does write once before `if(styleFailure){...return}`. However `ps.history.push` then `fs.writeFileSync` occurs, so state is persisted. But `j.waitingOn` is set yet `saveRunRecord` isn't relevant here. **Real defect: `/api/passes/run` returns HTTP 202 with `status:'failed'`** — a failed validation is not a successful acceptance; callers (UI `pollJob`) treat 202 as running and may misread. Minor protocol defect, but named failure is delivered.

**Critical — `boundedCodex` / director prompt injection: user `text` flows verbatim into a JSON string template**
`createDirectorDecision` builds `prompt` with `Latest user message: ${latest}` interpolated raw into a multi-line string handed to Codex. A user message containing `"tool":"create_project","arguments":{...}` or newline/brace injection can steer the model into invoking server tools. The extractor only accepts objects with `tool`, but the *prompt* instructs Codex to return one JSON object; if Codex echoes user content, the extractor may pick an attacker-supplied decision object if it appears as the last balanced `{...}` with a string `tool`. Combined with `createProjectTool` (trusted path), this is an indirect prompt-injection / tool-invocation vector via chat.

**Major — `extractDirectorDecision` returns the LAST balanced object, not the first**
It scans every `{` start, overwriting `selected` on each valid object with a string `tool`. If Codex returns reasoning text containing a JSON-like object (e.g. `{"thought":"..."}`? no, requires `tool`) followed by the real decision, the last wins. If a tool block appears earlier and a decoy `{...,"tool":"..."}` appears later in prose, the decoy wins. Real input: Codex output with a fenced JSON block earlier and trailing prose containing `{"tool":"no-op"}` → wrong tool executed.

**Major — `saveConversations` merge can resurrect stale messages / lose messages**
`merged` picks the candidate by timestamp, then merges message maps from `current` and `candidate`. If client A sends an older `thread` state with `jobCursor` behind but includes messages the server already dropped via capping, the map union re-adds capped messages. Conversely if two clients append different messages concurrently, last-write-wins by `updatedAt` discards the loser's messages entirely. Race under concurrent tabs → lost director messages / duplicate job_feed entries.

**Major — `capThreadMessages` throws when no `job_feed` exists to delete**
`while (length > 300)` finds `job_feed`; if none, throws `conversation_message_limit_reached`. `addMessage` catches, pops the just-pushed message, and rethrows. The error propagates up the chat POST handler? `addMessage` is called inside `chatMatch` POST; the catch in `addMessage` pops then throws → the route has no try/catch around `addMessage` → uncaught exception crashes the request (Node uncaught in async route handler → connection hangs or crashes depending on wrapper). Trigger: 301st non-feed message in a thread.

**Major — `createProjectTool` ffprobe audio validation can falsely reject valid audio**
`audioProbe.stdout` parsed with `JSON.parse`. ffprobe with `-v error -select_streams a` on a file with **no audio stream** exits 0 and outputs `{"streams":[]}` → `hasAudioStream=false` → throws `create_project_audio_invalid`. That's intended. But if ffprobe emits warnings to stderr and valid JSON to stdout, fine. If `audioProbe.error` exists (binary missing), status is `null`; message says `exit null: no audio stream`. More importantly **timeout 10000ms**: slow filesystem/network storage can make ffprobe time out → status !== 0 → treated as no audio → project creation blocked on a transient probe delay.

**Major — `run` handler style validation throws before `saveRunRecord`, leaving a phantom job**
`j` is added to `jobs`, then `selectedStyle` checks throw synchronously inside the async IIFE before the first `saveRunRecord()`. The `.catch` handler sets `j.status='failed'` and calls `saveRunRecord()` — so record is written on failure. OK. But `j.waitingOn='لا شيء'` default Arabic; fine.

**Minor — `extractModelJson` dead but still used nowhere?** It remains defined; `extractDirectorDecision` replaces its only use in `handleDirectorChat`. Not a defect, just dead code.

**Minor — Arabic hardcoded strings in JSON error bodies (`توجد عملية تشغيل جارية`, `الإعدادات المقبولة...`, `ملف النص غير موجود`)** — inconsistent locale; not a correctness defect but breaks English error contract. Keep as minor.

**Minor — `passModule.getState(...).style||projectStyle(activeDir)` in `/api/passes` GET** — if `getState` returns `0` or `''`, falls back to `projectStyle`. Edge case harmless.

**Minor — `run` uses `styleId` for run record but the actual builder brief hardcodes skill resolution earlier?** In pass run, `instructionFile=selectedStep` from `styleId`. In `run` (film run), style is recorded in `runSettings` but no verification that the style's step files exist for the run legs — only pass runs validate. If `cartoon-shorts` steps missing, film run proceeds and fails later. Named failure gap.

### app/renderer/app.js

**Major — `directorChatPage` `selectedStyle` may reference a style not in `styleCatalog.styles`**
`styleOptionMarkup` renders `<option ... disabled>` for non-wired styles but still includes them. If `conversation.inputs.style` is a style ID removed from the registry, `<select>` has no matching option → browser picks first option (possibly wired) → silent submission of a different style than displayed. The server validates `style_not_registered` on POST, but the UI shows a mismatch. Trigger: registry style deleted while conversation references it.

**Major — Open-ended new conversation submits `style: $('#chatStyle').value` to `/api/conversations`**
Server validates `style_not_wired` → returns 400. UI catches `errToast`. Fine. But **resuming/continuing**: when `conversationId` exists, POST messages sends `style: $('#chatStyle').value`; server calls `setProjectStyle(thread.project, style.id)` on **every message** if `b.style !== undefined`. Changing style mid-conversation mutates `project.json` and all subsequent passes inherit it — arguably intended but not obvious; a user changing the dropdown while a run is active corrupts the active project's style mid-flight.

**Minor — `chatMessagesHtml` vs inline template duplication**
The old inline `msgs.map` block was replaced by `chatMessagesHtml(msgs)`. Consistent.

### tools/transcribe.py

**Critical — `align_script_timings` index-out-of-range / misalignment on mismatched lengths**
`timed_hypothesis` length can exceed ASR entries because `normalize` can split one word into multiple tokens; the edit operations index `asr_index` into `timed_hypothesis`, while `script_index` into `script`. `aligned[script_index] = ...` is fine, but when an ASR entry normalizes to **zero tokens** (e.g. punctuation-only line), `timed_hypothesis` gets no entry; indices shift. Operations from `edit_alignment` use correct relative indices, so alignment is consistent *between the two normalized sequences*. However stats: `inserted_interpolated` counts `D` (script words missing from ASR) and `dropped_asr_words` counts `I`. The failure threshold uses `aligned_fraction = (matched+substituted)/script_words`. If ASR completely misses the script (all D), fraction = 0 → returns error. Good.

**Major — `audio_duration` requires `duration >= fallback`**
`fallback = max(end of ASR entries)`. If ffprobe reports a duration *shorter* than the last ASR word end (common: ASR slightly overestimates or ffprobe container duration excludes padding), the function **falls back to ASR max end** without reporting. That's actually a sane guard. But if ffprobe fails entirely, fallback used silently — acceptable.

**Major — interpolation can produce `start >= end` or negative spans when `right_start < left_end`**
`right_start = max(left_end, right_start)`, so span ≥ 0. If span is 0 (two aligned words at same timestamp), all interpolated words get `start=end=left_end`. Zero-duration entries — downstream may choke, but not a crash here.

**Major — `clean.json` now contains *aligned script words*, not raw ASR entries**
`shutil.copyfile(voice, clean_voice)` kept, but `clean_path` writes `aligned_entries` (script words with interpolated timings). Existing renderer contract expects ASR word timings (`tools/transcribe.py` comment says "Keep the exact owner audio bytes" but replaces JSON content). Any consumer reading `clean.json` expecting ASR hypothesis words now gets script words with different `word` values and interpolated timing — silent contract corruption. Trigger: any successful transcription; downstream passes using `clean.json` for lip-sync get script text, not spoken text.

**Minor — `normalize` returns list of tokens; `timed_hypothesis` splits one ASR word into multiple time-sliced entries**
If ASR word "don't" normalizes to ["dont"] fine. If a contraction normalizes to two tokens, start/end are subdivided proportionally. Reasonable.

**Minor — `script_words` raises `asr_script_missing` if `script.txt` absent**
Transcribe previously worked with just `words_owner.txt`. Now requires `script.txt` or it hard-fails (RuntimeError → uncaught? `main` wraps transcription in try? Need to see rest; assuming uncaught → CLI exits non-zero, server gets no JSON → 500). Trigger: project without script.txt.

### app.css

No defects found — pure style additions.

---

**Correct per area:**
- `styleRegistry`, `projectStyle`, `requireWiredStyle`, `setProjectStyle`: correct registry wiring with named failures (`style_not_registered`, `style_not_wired`).
- Pass-run style preflight (`style_id` → `style_step_missing` → `style_not_wired`) correctly blocks unwired styles before builder spawn.
- Conversation caps: 300-message cap with job_feed eviction logic is sound *except* the no-feed crash noted above.
- `edit_alignment` / DP backtrace: correct Levenshtein with operation recovery.
- Atomic writes (`atomic_copy`, mkstemp+replace) prevent torn reports.
- ffprobe audio validation in `createProjectTool`: correct concept, named error.

Top fixes to recommend: fix `capThreadMessages` no-feed crash, stop raw user text injection into director prompt / use first balanced decision object, make `clean.json` contract explicit (or write aligned output to a separate file), handle missing `script.txt` gracefully, and return non-202 status for preflight-failed pass runs.Hunt complete. Real defects found:

## server.js

**Critical — Director prompt injection via raw user text interpolation**
`boundedCodex` builds the director prompt with `Latest user message: ${latest}` interpolated verbatim into a multi-line string. A user message containing a crafted JSON object (e.g. `{"tool":"create_project","arguments":{...}}`) can steer Codex into emitting a tool decision the server executes. The server treats any balanced `{...}` with a string `tool` as authoritative.

**Major — `extractDirectorDecision` returns the LAST matching object, not the first**
It scans every `{` start and overwrites `selected` on each valid object. If Codex emits a reasoning object earlier and a decoy `{"tool":"..."}` appears later in prose, the decoy wins and the wrong tool runs.

**Major — `capThreadMessages` crashes when no `job_feed` message exists**
At 301 messages, `findIndex(m => m.kind === 'job_feed')` returns -1, so it throws `conversation_message_limit_reached`. `addMessage` pops the just-pushed message and rethrows; the chat POST route has no try/catch around `addMessage`, so the 301st non-feed message crashes the request.

**Major — Conversation state merge can resurrect capped / lose concurrent messages**
`saveConversations` unions message maps from `current` and `candidate` and picks by `updatedAt`. Concurrent tabs appending different messages cause last-write-wins by timestamp, discarding the loser's messages; stale client state can re-add messages the server already capped.

**Major — `createProjectTool` ffprobe audio validation can falsely reject valid projects**
ffprobe with `-select_streams a` on a file with no audio stream exits 0 with `{"streams":[]}` → correctly rejected. But a 10s probe timeout (slow/network storage) yields `status !== 0` and is treated as "no audio stream," blocking project creation on a transient delay. Also `audioProbe.status ?? 'error'` reports `null` when the binary is missing.

**Major — Preflight-failed pass run returns HTTP 202 with `status:'failed'`**
`/api/passes/run` returns 202 for `style_not_wired` / `style_not_registered`. Callers (UI `pollJob`) interpret 202 as accepted/running; a named validation failure is indistinguishable from a queued job at the protocol level.

**Minor — `run` handler style validation throws before first `saveRunRecord`**
The job is in `jobs` map, and the `.catch` writes the run record, so it's recovered — but the synchronous throw happens after `jobs.set(id, j)` and before any run record exists, creating a small window where a crashed process leaves an in-memory job with no disk record.

**Minor — Arabic strings leak into JSON error bodies** (`توجد عملية تشغيل جارية`, `الإعدادات المقبولة...`, `ملف النص غير موجود`). Inconsistent with the English error contract.

**Minor — `extractModelJson` is now dead code** (replaced by `extractDirectorDecision` in `handleDirectorChat`).

## app/renderer/app.js

**Major — New conversation submits a style that may not exist in the registry**
`selectedStyle` can be a conversation or project style ID absent from `styleCatalog.styles`. `styleOptionMarkup` still renders it as an `<option>`, but if the registry no longer contains it, the `<select>` has no matching value and the browser submits the first option — a silent style substitution. Server validates and 400s, but the UI shows a mismatch.

**Major — Changing the style dropdown mid-conversation mutates `project.json` on every message**
When `conversationId` exists, POST `/api/conversations/{id}/messages` sends `style`, and the server calls `setProjectStyle(thread.project, style.id)`. A user switching styles while a run is active corrupts the active project's style mid-flight.

## tools/transcribe.py

**Major — `clean.json` contract silently changed**
It previously held raw ASR word timings; now it holds aligned *script* words (with interpolated timings). Downstream consumers expecting spoken ASR words get script text instead — silent contract corruption on every successful transcription.

**Major — `align_script_timings` assumes non-empty ASR output**
If ASR returns zero entries, `timed_hypothesis` is empty; all script words fall into the interpolation branch and get `start=end=0` (or compressed into the final span). The 80% check then fails, which is safe, but an ASR engine returning empty words yields a confusing `asr_alignment_failed` rather than `asr_no_words`.

**Major — `audio_duration` silently falls back to ASR max end when ffprobe reports a shorter duration**
Legitimate: ffprobe container duration can exclude padding. But if ffprobe fails entirely, ASR end is used without surfacing the probe failure.

**Major — Transcription hard-fails without `script.txt`**
`script_words` raises `asr_script_missing`. Previously transcribe worked with only `words_owner.txt`; now any project lacking `script.txt` crashes the CLI (uncaught RuntimeError → non-zero exit, server gets no JSON).

## app.css

No defects found — style additions only.

## Correct as implemented

- Style registry (`styleRegistry`, `projectStyle`, `requireWiredStyle`, `setProjectStyle`) with named `style_not_registered` / `style_not_wired` failures.
- Pass-run preflight blocks unwired / missing-step styles before builder spawn.
- Conversation 300-message cap with `job_feed` eviction logic is sound except the no-feed crash noted above.
- `edit_alignment` DP backtrace and `transcribe` atomic writes (mkstemp + replace) are correct.

**Top recommended fixes:** guard `capThreadMessages` for missing `job_feed`; stop interpolating raw user text into the director prompt (or take the *first* balanced decision object, not the last); write aligned script timings to a separate file and keep `clean.json` as ASR entries; handle missing `script.txt` gracefully; return a 4xx status for preflight-failed pass runs.
