# MCP INTEGRATION — APInex model API inside Heart Studio (2026-11-18)

## Why
The owner saw in Russell's Creatorize videos that the heart is wired to a
model API: the API models do the work and the reviewing from inside the
program, and the operator only watches and evaluates at the end. This
integration wires OUR APInex model API into Heart Studio the same way.

## What was added
- `mcp/apinex_mcp.py` — our APInex MCP server, bundled self-contained
  (dependency-free stdio JSON-RPC; tools `apinex_chat` {model?, prompt},
  default free/glm-5.3, and `apinex_models`). Adapted from the proven desk
  server; the one change is that it calls the bundled helper beside it
  instead of a desk path.
- `mcp/apinex_helper.py` — stdlib-only helper the server (and the CLI)
  call: `models [substr]` / `chat <model> <prompt-file>`, printing exactly
  one JSON line in the same shape as the desk connector helper.
- `bin/heart` — three new commands, all through the bundled helper:
  - `heart models [substr]` — catalog summary or matching model ids.
  - `heart consult <model> <prompt-file>` — print the model's reply.
  - `heart critic <evidence-file>` — wraps the evidence in our production
    critic form (judge only the evidence against its stated bars; answer
    VERDICT: YES/NO first, then biggest gap, then minor notes) and sends
    it to free/glm-5.3.
- `README.md` — new Arabic-first section «نموذج التشغيل»: the operating
  model, the commands, key setup (desk vs fresh machine), and the MCP
  registration commands for agy / Claude Code pointing at the bundled
  server.
- `.gitignore` — `.env` and `mcp/server.log` excluded.

## Key flow (no key material is ever committed, printed or logged)
Resolution order inside `mcp/apinex_helper.py`:
- (a) If the desk connector helper exists at
  `~/workspace/custom-connectors/custom.apinex/bin/apinex_chat.py`,
  delegate to it unchanged — on Layla's desk the real credential flows
  through the Secure Vault surrogate exchange and never touches disk.
- (b) Else read `APINEX_API_KEY` from the environment, or from a `.env`
  in the Heart Studio root, or from `~/.heart-studio.env`, and call
  `https://api.apinex.bond/v1` directly with it.
- (c) Else exit 3 with a bilingual message explaining how to set the key,
  plus a JSON error line; no API call is made.

## Proofs (all from a scratch install: fresh copy + scratch HOME,
## `bash install.sh` OK — Node v24.22.1, Chromium found, launcher written)
Desk proofs used key path (a), exactly as the desk runs it.

1. `heart consult free/glm-5.3 proof_prompt.txt`
   Prompt: "What is seventeen plus twenty-five? Answer with the number only."
   Output (complete): `42` — exit 0.

2. `heart critic evidence.txt` — invented wiring-test measurements
   (bars: close-up head >= 300 px; gold ring visible in every shot; no
   fully black shot; shot 2 close-up head 184 px; shot 3 ring NOT visible):
   Run 1 output:
   ```
   VERDICT: NO
   Biggest gap: The hero prop (gold ring) is not visible in Shot 3, violating the requirement that it must be visible in every shot.
   Minor notes: Head height in Shot 2 (184 px) fails the minimum requirement of >= 300 px for close-up shots.
   ```
   Run 2 output: VERDICT: NO with the same biggest gap; minor notes varied
   ("None") — the verdict and biggest gap are stable, minor notes are not
   guaranteed identical between runs.

3. `heart models glm` — output: free/glm-5.3, free/glm-5.3-flashx,
   free/glm-5.3-flash, glm-5.3, glm-5.3-flash — exit 0.

4. Bundled MCP server driven over stdio (installed copy):
   initialize -> {"name": "apinex-mcp", "version": "1.0.0"}, protocol
   2024-11-05 · tools/list -> ['apinex_chat', 'apinex_models'] ·
   tools/call apinex_chat {free/glm-5.3, "Reply with exactly one word:
   MCPREADY"} -> isError: False, text: MCPREADY.

5. Key paths (b) and (c), against the repo copy:
   (b) dummy env key -> {"status": 403, "model_count": 0, ...} from the
   real API — direct wiring works, failures surface as structured JSON.
   (c) no key anywhere -> exit 3, bilingual setup message, JSON error
   line, no API call.

## GLM verification (APInex, free/glm-5.3, cost 0)
Round 1: items 1, 3, 4, 5 PASS; item 2 FAIL -> VERDICT: NO. The
verifier's stated reason (asked explicitly): the item-2 evidence did not
prove `heart critic` executed end-to-end from the installed copy.
Fix round: complete command/stdout transcripts for consult and critic
plus the live MCP stdio proof were supplied.
**Fix-round result: all five items PASS — VERDICT: YES.**

## Integrity
- Engine untouched: engine.js md5 `316f277544566d8de208c8b1c38e248a`,
  models.js md5 `2957eba4afb66b263762e78f3fec3b90` — identical before
  and after.
- Secret scan: grep over the repo (excluding .git) for key-like patterns
  (sk- tokens, Bearer literals, api-key assignments) found no matches;
  no `.env` exists in the repo.
- Nothing under `.github/workflows/` was added or modified.

## Honest limits
- The APInex bench models are TEXT models. `heart critic` judges
  structured evidence — measurements, logs, frame descriptions — that
  the driving agent supplies; the models do not see frames directly.
  Frame judgement stays with the operator's eyes at the end, as in the
  videos that inspired this.
- APInex free tier allows 15 requests/minute account-wide; consults and
  critic calls should stay few and spaced.
- Gated models (e.g. Claude on APInex) return their 402 error as-is;
  the free shelf (free/glm-5.3, free/gpt-6-luna, ...) is the working set.
- On a fresh machine, path (b) needs the user's own APInex key; there is
  no way around that, and the program says so bilingually instead of
  failing silently.
