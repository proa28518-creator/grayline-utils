I'll hunt for real defects in this diff. Let me analyze each area systematically.

## CRITICAL

**1. Race condition in `saveConversations` merge logic**
- **File**: server/server.js, `saveConversations` function (lines ~194-220)
- **Issue**: The function reads disk state, merges with in-memory state, then writes. Between read and write, another process/request could write, causing lost updates.
- **Trigger**: Two concurrent POST requests to `/api/conversations/{id}/messages` modifying different conversations.
- **Outcome**: One conversation's messages are silently lost. The "winner" is determined by filesystem rename order, not logical timestamps.
- **Fix needed**: File locking or atomic read-modify-write with retry on conflict.

**2. Conversation message cap drops wrong messages when limit hit during user submission**
- **File**: server/server.js, `addMessage` function (line ~221)
- **Issue**: `addMessage` calls `capThreadMessages` after pushing the message. If cap throws `conversation_message_limit_reached`, the catch in addMessage pops the message, but the user's request has already been accepted.
- **Trigger**: Conversation at exactly 300 messages (all protected kinds), user sends new message.
- **Outcome**: HTTP 500, user message rejected, but conversation state is inconsistent (updatedAt changed, jobCursor may have advanced).
- **Code**: `addMessage` pops on throw, but `touchThread` and other mutations in the POST handler happen before `addMessage`.

**3. Director decision extractor fails on nested objects with `tool` key**
- **File**: server/server.js, `extractDirectorDecision` function (lines ~221-233)
- **Issue**: The function returns the *last* valid JSON object with a `tool` string field. If the model returns `{"outer": {"tool": "inner"}, "tool": "intended"}`, it selects `{"outer": {...}, "tool": "intended"}` correctly, but if the order is reversed or there's a trailing `{"debug": {..., "tool": "trace"}}`, it selects the wrong object.
- **Trigger**: Model outputs multiple tool-shaped objects in its reasoning trace.
- **Outcome**: Wrong tool executed (e.g., `write_brief` when `create_project` was intended).

**4. Prop gate numeric fraction validation allows out-of-range values in cropBox path**
- **File**: server/server.js, `runPropTruthGate` function (line ~276)
- **Issue**: After adding `numericFraction` validation, the code checks `numericFraction !== null && !ratios.some(...)` and pushes `invalid_declaration`, but only if `numericFraction` is non-null. The `parseAppearance` function can still return a snapped ratio for a badly-formed time value, bypassing the validation.
- **Trigger**: `{"appearsAt": {"time": 999, "fraction": 0.7}}` — parseAppearance checks `fraction` first and returns 0.7 (not in ratios), but `numericAppearanceFraction` only extracts direct numeric `fraction` fields, so it returns 0.7, validation fails correctly. BUT: `{"appearsAt": 0.7}` (numeric, not in ratios) gets `numericFraction = 0.7`, fails validation. However, `{"appearsAt": {"time": 15}}` has `numericFraction = null` (no `fraction` key), so validation is skipped, and `parseAppearance` snaps the time to a ratio. This is inconsistent.
- **Outcome**: Mixed behavior; some invalid declarations pass, some fail. Actually, re-reading: the validation is *correct* for `{"appearsAt": 0.7}` (rejects it), but the error message is misleading because time/clock values are documented to snap. The real bug is that the code doesn't validate the *result* of parseAppearance, only the input. If parseAppearance returns a ratio, the code assumes it's valid, but parseAppearance can return ratios even for out-of-range inputs (it uses `reduce` to find the nearest).

Actually, re-checking: `parseAppearance` for a numeric in (0,1) now does `ratios.find(r => Math.abs(r - value) <= 0.005) ?? null`. If value is 0.7, this returns `null` (no ratio within 0.005), so `fraction === null` and the prop is skipped with "invalid appearsAt". So this path is correct.

The real issue: **parseAppearance returns `null` for 0.7, but the validation message says "must match one of [0.1, 0.5, 0.9] within 0.005; time/clock values may snap to the nearest probe".** The code then checks `fraction === null` and reports "invalid appearsAt or normalized cropBox". The new validation earlier checks `numericFraction !== null && !ratios.some(...)`, which would catch 0.7, but that check only fires if `numericFraction` is non-null. For `0.7`, `numericFraction = 0.7`, so it enters the validation, fails, and pushes `invalid_declaration` with a clear error. Then the code continues to the next prop. BUT: the outer check `if (!name || fraction === null || ...)` will *also* match because `fraction = parseAppearance(...)` will return `null` for 0.7 after the validation change. So the same prop is added twice to `gate.props`? No, there's a `continue` after the validation failure. So the order is:
1. Validation: `numericFraction = 0.7`, fails, pushes `invalid_declaration`, continues to next prop.
2. Outer check never runs for this prop.

This is correct. Discard this potential issue.

**5. Style validation in pass run happens after job creation and state persistence**
- **File**: server/server.js, `/api/passes/run` handler (lines ~562-569)
- **Issue**: The code creates the job, persists the pass state with `state: 'running'`, *then* checks style validation. If validation fails, it sets `state: 'failed'` and writes again, but the `state: 'running'` was already written and the job was added to the jobs map with `status: 'running'`.
- **Trigger**: Unwired style, user clicks "Run" on a pass.
- **Outcome**: Job initially shows "running", then transitions to "failed". If a client polls between the two writes, it sees "running" and may show misleading UI. Not a correctness bug, but a race.

Actually, re-reading the code more carefully:

```javascript
const id='pass-'+Date.now(),j={id,kind:'pass',projectDir:activeDir,status:styleFailure?'failed':'running',...};
...
ps.state=styleFailure?'failed':'running';
```

The job object `j` is created with `status: styleFailure ? 'failed' : 'running'`, so if validation fails, the job is created as 'failed'. The state file is written with the same ternary. So this is correct. Discard.

**6. Alignment failure does not remove transcript.txt**
- **File**: tools/transcribe.py, `main` function (lines ~260-274)
- **Issue**: When alignment fails (<80%), the code deletes `clean.json` but writes `transcript.txt` and `report_path`. The transcript is from the raw ASR output, which is now known to be misaligned with the script.
- **Trigger**: ASR model hallucinates or audio quality is poor, alignment is 70%.
- **Outcome**: `transcript.txt` exists and contains the wrong text. Downstream tools may use it, assuming it's aligned.
- **Severity**: Major. The transcript should either be removed or clearly marked as invalid.

## MAJOR

**7. Conversation updatedAt collision on rapid messages**
- **File**: server/server.js, `touchThread` function (line ~211)
- **Issue**: `thread.updatedAt = new Date(Math.max(Date.now(), prior + 1)).toISOString()`. If two threads are touched in the same millisecond, both get the same timestamp. The merge logic in `saveConversations` uses `>=` for candidateTime, so the later write wins, but if they're equal, the candidate wins. This can cause message loss if two threads are updated concurrently.
- **Trigger**: Two conversations modified at the same millisecond (likely on fast hardware).
- **Outcome**: Merge chooses candidate over disk based on >= when times are equal, but the real risk is that two different threads get the same updatedAt and the file write order determines the winner.
- **Actually**: The real issue is that `touchThread` is called per-thread, so two threads can't get the same updatedAt unless `Date.now()` returns the same value in two calls. The `Math.max(Date.now(), prior + 1)` ensures that a thread's updatedAt always advances, but if two threads are updated in separate requests at the same millisecond, they could both get `Date.now() = T`, and both write `updatedAt = T`. Then the merge logic compares `T >= T` (true) and picks the candidate. But the candidate is the in-memory version being saved, and the disk version is the one loaded at the start of the request. If request A and B both load disk state at time T-1, both modify different threads, both save at time T, the second save will merge its candidate (with updatedAt=T) with the disk state (which now includes A's write, also with updatedAt=T), and the merge will pick the candidate (B's version) because `candidateTime >= currentTime`. So A's changes to *its* thread are preserved, but if A and B modified the *same* thread, B's version would win. But the code is designed to handle different threads, so this is not a bug for different threads. For the *same* thread, two concurrent requests would both increment jobCursor, add messages, etc., and the second write would merge, combining messages from both. But the message IDs are unique (timestamp + random), so duplicates are unlikely. The real risk: if two requests add messages to the same thread concurrently, the merge combines both sets of messages, but the order may be wrong because messages are sorted by `at` time, and if both requests use the same `Date.now()` value, messages could interleave incorrectly.

Actually, checking the merge logic:
```javascript
const winner = merged[id], messages = new Map([...(current.messages || []), ...(candidate.messages || [])].map(m => [m.id, m]));
winner.messages = [...messages.values()].sort((a, b) => Date.parse(a.at || 0) - Date.parse(b.at || 0));
```

Messages are deduplicated by ID and sorted by `at`. If two messages from concurrent requests have the same `at` time, their order is undefined (stable sort would preserve array order, but the Map dedupe may reorder). This is a minor issue, not critical.

**8. `extractDirectorDecision` does not handle escaped braces in strings correctly**
- **File**: server/server.js, `extractDirectorDecision` function (lines ~221-233)
- **Issue**: The code tracks `inString` and `escaped`, but does not handle `\{` or `\}` inside strings. If the model outputs `{"tool": "create", "text": "Use \\{ and \\}"}`, the code will incorrectly parse the braces inside the string as JSON structure.
- **Actually**: JavaScript strings use `\{` for a literal `{`, but JSON strings do not. In JSON, `{` inside a string is just `{`, not `\{`. The backslash only escapes `"`, `\`, `/`, `b`, `f`, `n`, `r`, `t`, and `u` in JSON. So `\{` in a JSON string is invalid. The code correctly handles `\"` (escaped quote), so this is not a bug for valid JSON. For invalid JSON with `\{`, `JSON.parse` will fail, and the function returns `null` or a previous valid object.

Discard this.

**9. ASR alignment interpolation can produce zero-duration words**
- **File**: tools/transcribe.py, `align_script_timings` function (lines ~143-152)
- **Issue**: When interpolating missing script words, `span = right_start - left_end`. If `left_end == right_start` (e.g., two consecutive ASR words with no gap, and multiple script words need to be interpolated between them), `span = 0`, and all interpolated words get `start = finish = left_end`.
- **Trigger**: Script has "hello beautiful world", ASR matches "hello world" at adjacent times (end of "hello" == start of "world"). "beautiful" is interpolated with zero duration.
- **Outcome**: Downstream renderers may skip zero-duration words, or captions may not display them.

**10. Style validation in conversation creation races with style registry read**
- **File**: server/server.js, `/api/conversations` handler (line ~478)
- **Issue**: `styleById` reads from `styleRegistry()`, which scans the `skills/` directory on every call. If the directory is being modified (e.g., a git pull adds a new style pack), the scan could see a partially-written directory.
- **Trigger**: User creates conversation while `git pull` is writing a new style pack.
- **Outcome**: Style validation may see incomplete style pack, incorrectly reject the style, or (unlikely) crash if readdir encounters a deleted directory.
- **Severity**: Minor in practice (git operations are atomic at the file level), but the style registry should be cached.

## MINOR

**11. Prop gate vision prompt includes "the film's own captions, subtitles, and on-screen text overlays" but captions are rendered in a later pass**
- **File**: server/server.js, `runPropTruthGate` function (line ~269)
- **Issue**: The prompt says to omit "the film's own captions, subtitles, and on-screen text overlays", but board frames are rendered before the post pass, which adds captions. So this instruction is irrelevant for board frames.
- **Outcome**: No defect, just unnecessary prompt text.

**12. `audio_duration` fallback always returns the fallback if ffprobe succeeds but duration < fallback**
- **File**: tools/transcribe.py, `audio_duration` function (lines ~117-127)
- **Issue**: `if duration >= fallback: return duration` else return fallback. If the audio file is actually shorter than the fallback (max ASR word end time), the function returns the fallback, which is longer than the audio.
- **Trigger**: Audio file is 10 seconds, last ASR word ends at 12 seconds (ASR bug or timing drift).
- **Outcome**: Interpolation uses `duration = 12` even though the file is 10 seconds. Interpolated words near the end get timings beyond the audio duration.
- **Severity**: Minor, but the logic is backward. It should return the *longer* of the two to avoid interpolating beyond the audio end.

**13. `atomic_copy` leaves temp file on failure**
- **File**: tools/transcribe.py, `atomic_copy` function (lines ~47-58)
- **Issue**: On exception during `shutil.copyfile` or `os.replace`, the function tries to unlink the temp file, but if the exception occurred in `mkstemp` or before `shutil.copyfile` started, the file may not exist. The `except FileNotFoundError` handles this, but if the exception is during `shutil.copyfile` and the file is partially written, the temp file remains.
- **Actually**: The code does `os.close(fd)` immediately, so the file is created (zero bytes) before `shutil.copyfile`. If `shutil.copyfile` raises (e.g., disk full), the file exists and is unlinked in the except block. If `os.replace` raises, the file has been fully copied and should be unlinked. The `except` block is outside the `try`, so it catches all exceptions. This is correct.

Discard.

**14. Pass state history can grow unbounded**
- **File**: server/server.js, pass run handler (line ~566)
- **Issue**: `ps.history.push(...)` appends to history on every pass run. No cap or cleanup.
- **Trigger**: Run the same pass 10,000 times.
- **Outcome**: `pass_state.json` grows to megabytes, slowing reads/writes.
- **Severity**: Minor in practice (passes are run infrequently), but should cap or rotate.

**15. `styleRegistry` scans `skills/` directory on every call**
- **File**: server/server.js, `styleRegistry` function (line ~49)
- **Issue**: Called on every `/api/styles` GET, every `/api/project` GET (via `refreshProject`), every conversation creation, every pass run, every settings save. Rescans the entire `skills/` directory each time.
- **Trigger**: Normal usage.
- **Outcome**: Unnecessary disk I/O, slow on large style pack directories.
- **Severity**: Minor performance issue, should cache and invalidate on filesystem change.

**16. Conversation merge deduplicates messages by ID but does not handle ID collisions**
- **File**: server/server.js, `saveConversations` function (line ~214)
- **Issue**: Message IDs are `'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)`. If two messages are created in the same millisecond with the same random suffix (5 base-36 digits = ~60M possibilities), they collide. The Map dedupe keeps the *last* occurrence, so one message is silently dropped.
- **Trigger**: Extremely unlikely (same ms + same 5-char random), but possible under load.
- **Outcome**: One message is lost in the merge.
- **Severity**: Very minor (collision probability ~1/60M per ms).

**17. Git operations in pass runner do not validate that `.heart-git` is a valid git repo**
- **File**: server/server.js, pass run handler (line ~588)
- **Issue**: The code checks `if (!projectGitDir(activeDir))` then inits, but if `.heart-git` exists but is corrupted (not a valid git repo), `projectGitDir` may return true (if it only checks existence), and subsequent git commands fail.
- **Actually**: Need to check the `projectGitDir` implementation. Not shown in diff, but presumably checks for `.heart-git/HEAD` or similar. If it's just checking directory existence, this is a bug.

Can't confirm without seeing `projectGitDir` implementation. Marking as potential.

**18. Alignment drops ASR words on insertions but does not report them clearly**
- **File**: tools/transcribe.py, `align_script_timings` function (line ~106)
- **Issue**: When `op == "I"`, the function increments `stats["dropped_asr_words"]` and continues. But the report includes `"words": len(entries)` (ASR word count) and `"aligned_words": len(aligned_entries)` (script word count). The difference is not clearly the number of ASR insertions.
- **Trigger**: ASR outputs "hello beautiful wonderful world", script is "hello beautiful world". One insertion ("wonderful").
- **Outcome**: Report shows `words: 4, aligned_words: 3`, but does not clarify that 1 ASR word was dropped vs. 1 script word was interpolated.
- **Severity**: Minor, but the report could be clearer.

---

## Summary by Severity

### Critical (fix immediately)
1. **Race condition in `saveConversations`** — concurrent requests can lose updates
2. **Message cap throws after state mutation** — conversation left inconsistent
3. **Director decision extractor can select wrong tool** — wrong tool executed
6. **Alignment failure leaves stale transcript.txt** — downstream tools use wrong text

### Major (fix soon)
9. **ASR alignment interpolation can produce zero-duration words** — captions may skip words
10. **Style registry scan is not cached** — performance + race on filesystem changes
12. **`audio_duration` fallback logic is backward** — interpolation can exceed audio end

### Minor (fix when convenient)
14. Pass state history unbounded
16. Message ID collision (very low probability)
18. Alignment report unclear about dropped ASR words