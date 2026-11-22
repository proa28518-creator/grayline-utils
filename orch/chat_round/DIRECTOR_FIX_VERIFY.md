# Director decision extraction fix

## Root cause and mechanism

`boundedCodex()` returns a tail of combined Codex stdout and stderr, which can include CLI banner and workdir/model lines around the answer. `runDirector()` previously took a greedy match from the first `{` to the last `}` and parsed that entire span, so valid tool JSON became unparseable when the tail also contained braces or other output; `write_brief` has no deterministic shortcut and therefore degraded to a plain reply. The fix scans for brace-balanced JSON objects while respecting quoted strings and escapes, parses each candidate independently, and retains the last object whose `tool` field is a string. The existing fallback and deterministic shortcut code is unchanged. Executed decisions still emit the existing `tool_result` message shape from the server tool result, without CLI output.

## Static checks

```text
$ node --check server/server.js
(exit 0)
$ git diff --check
(exit 0)
```

No server was bound and no desk conversation was changed from this seat.

## Exact desk re-check

Re-send the seed-props request on the existing thread `chat-mwrygobp-lnxgt`:

```sh
BASE=http://127.0.0.1:18911
curl -sS -X POST "$BASE/api/conversations/chat-mwrygobp-lnxgt/messages" \
  -H 'content-type: application/json' \
  -d '{"text":"Write the brief from this conversation, keeping the existing story and priorities unchanged. Seed the key props: pocket watch, magnifying lens, brass gears, mainspring."}'
curl -sS "$BASE/api/conversations/chat-mwrygobp-lnxgt"
cat projects/real-test-watchmaker/props.json
cat projects/real-test-watchmaker/brief.md
```

Expected: the thread contains an assistant message with `kind:"tool_result"` and `tool:"write_brief"`; its `result.props` is `4`. `props.json` lists `pocket watch`, `magnifying lens`, `brass gears`, and `mainspring`. `brief.md` retains the story and priorities already stored for this conversation; the command text does not replace either field. No Codex CLI banner or workdir/model lines appear in the tool-result message.
