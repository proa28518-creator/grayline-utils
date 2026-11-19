#!/usr/bin/env python3
"""Dependency-free MCP server (stdio, hand-rolled JSON-RPC) exposing APInex
models as tools for agent drivers (agy / Claude Code) — bundled with
Heart Studio so the program can consult and review itself through the API.

All APInex calls go through the bundled helper beside this file
(apinex_helper.py), which resolves the credential without this server ever
seeing, storing or logging key material:
  - on Layla's desk it delegates to the connector helper (Secure Vault
    surrogate exchange);
  - on a fresh machine it reads APINEX_API_KEY from the environment or a
    .env file (see apinex_helper.py and README.md).

Tools:
  apinex_chat    {model?, prompt} -> chat completion via the bundled helper
  apinex_models  {}               -> model catalog JSON via the bundled helper

Logs go to server.log beside this file (never prompts' content beyond length,
never credentials).
"""
import json
import os
import subprocess
import sys
import tempfile
import time

HERE = os.path.dirname(os.path.abspath(__file__))
LOG_PATH = os.path.join(HERE, "server.log")
HELPER = os.path.join(HERE, "apinex_helper.py")
DEFAULT_MODEL = "free/glm-5.3"
PROTOCOL_VERSION = "2024-11-05"
SERVER_INFO = {"name": "apinex-mcp", "version": "1.0.0"}
HELPER_TIMEOUT = 240  # helper itself allows 180 s for a chat call


def log(msg):
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write("%s %s\n" % (time.strftime("%Y-%m-%dT%H:%M:%S"), msg))
    except OSError:
        pass


def run_helper(args):
    """Run the bundled helper; return (exit_code, stdout_text)."""
    proc = subprocess.run(
        [sys.executable, HELPER] + args,
        capture_output=True, text=True, timeout=HELPER_TIMEOUT,
    )
    return proc.returncode, (proc.stdout or "").strip()


def parse_helper_json(stdout_text):
    """The helper prints exactly one JSON line; tolerate trailing noise."""
    for line in reversed(stdout_text.splitlines()):
        line = line.strip()
        if line.startswith("{"):
            try:
                return json.loads(line)
            except ValueError:
                continue
    return None


def tool_apinex_models():
    try:
        code, out = run_helper(["models"])
    except subprocess.TimeoutExpired:
        return ("apinex helper timed out on the models call.", True)
    data = parse_helper_json(out)
    if data is None:
        return ("apinex helper returned no parseable JSON (exit %d): %s"
                % (code, out[:500]), True)
    if data.get("status") != 200:
        return ("apinex models call failed: %s" % json.dumps(data), True)
    return (json.dumps(data, ensure_ascii=False), False)


def tool_apinex_chat(arguments):
    model = arguments.get("model") or DEFAULT_MODEL
    prompt = arguments.get("prompt")
    if not isinstance(prompt, str) or not prompt.strip():
        return ("apinex_chat requires a non-empty 'prompt' string.", True)
    log("apinex_chat model=%s prompt_len=%d" % (model, len(prompt)))
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(
            "w", suffix=".txt", prefix="apinex_prompt_", delete=False,
            encoding="utf-8",
        ) as f:
            f.write(prompt)
            tmp_path = f.name
        try:
            code, out = run_helper(["chat", model, tmp_path])
        except subprocess.TimeoutExpired:
            return ("apinex helper timed out on the chat call.", True)
    finally:
        if tmp_path:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
    data = parse_helper_json(out)
    if data is None:
        return ("apinex helper returned no parseable JSON (exit %d): %s"
                % (code, out[:500]), True)
    status = data.get("status")
    if status == 200 and data.get("content") is not None:
        return (data["content"], False)
    # Surface gated/failed calls as-is (e.g. 402 subscription/top-up gates).
    err = data.get("raw") or data
    return ("apinex chat failed (status %s): %s"
            % (status, json.dumps(err, ensure_ascii=False)[:1000]), True)


TOOLS = [
    {
        "name": "apinex_chat",
        "description": (
            "Run a chat completion on an APInex model and return its reply. "
            "Verified free models: free/glm-5.3 (default) and free/gpt-6-luna. "
            "Claude models on APInex are gated by subscription/top-up and "
            "return their 402 error as-is."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "model": {
                    "type": "string",
                    "description": "APInex model id. Defaults to free/glm-5.3.",
                },
                "prompt": {
                    "type": "string",
                    "description": "The full prompt to send to the model.",
                },
            },
            "required": ["prompt"],
        },
    },
    {
        "name": "apinex_models",
        "description": "Return the APInex model catalog summary JSON.",
        "inputSchema": {"type": "object", "properties": {}},
    },
]


def handle(request):
    """Return a JSON-RPC response dict, or None for notifications."""
    method = request.get("method")
    req_id = request.get("id")
    if method == "initialize":
        params = request.get("params") or {}
        version = params.get("protocolVersion") or PROTOCOL_VERSION
        return {
            "jsonrpc": "2.0", "id": req_id,
            "result": {
                "protocolVersion": version,
                "capabilities": {"tools": {}},
                "serverInfo": SERVER_INFO,
            },
        }
    if method in ("notifications/initialized", "notifications/cancelled"):
        return None
    if method == "ping":
        return {"jsonrpc": "2.0", "id": req_id, "result": {}}
    if method == "tools/list":
        return {"jsonrpc": "2.0", "id": req_id, "result": {"tools": TOOLS}}
    if method == "tools/call":
        params = request.get("params") or {}
        name = params.get("name")
        arguments = params.get("arguments") or {}
        if name == "apinex_chat":
            text, is_error = tool_apinex_chat(arguments)
        elif name == "apinex_models":
            text, is_error = tool_apinex_models()
        else:
            return {
                "jsonrpc": "2.0", "id": req_id,
                "error": {"code": -32602, "message": "unknown tool: %s" % name},
            }
        result = {"content": [{"type": "text", "text": text}]}
        if is_error:
            result["isError"] = True
        return {"jsonrpc": "2.0", "id": req_id, "result": result}
    if req_id is None:
        return None
    return {
        "jsonrpc": "2.0", "id": req_id,
        "error": {"code": -32601, "message": "method not found: %s" % method},
    }


def main():
    log("server start pid=%d" % os.getpid())
    out = sys.stdout
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            request = json.loads(line)
        except ValueError:
            log("unparseable input line skipped")
            continue
        try:
            response = handle(request)
        except Exception as exc:  # keep the server alive on a bad request
            log("handler error: %r" % (exc,))
            if request.get("id") is not None:
                response = {
                    "jsonrpc": "2.0", "id": request.get("id"),
                    "error": {"code": -32603, "message": "internal error"},
                }
            else:
                response = None
        if response is not None:
            out.write(json.dumps(response, ensure_ascii=False) + "\n")
            out.flush()
    log("server exit (stdin closed)")


if __name__ == "__main__":
    main()
