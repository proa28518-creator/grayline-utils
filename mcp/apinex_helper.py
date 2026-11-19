#!/usr/bin/env python3
"""Bundled APInex helper for Heart Studio (self-contained; stdlib only).

Usage:
  apinex_helper.py models [substr]            -> GET /v1/models summary
  apinex_helper.py chat <model> <prompt-file> -> POST /v1/chat/completions

Prints exactly one JSON line, the same shape as the desk connector helper:
  models -> {"status", "model_count", "has_glm_free", "has_luna_free"[, "matching"]}
  chat   -> {"status", "model", "content", "usage"} or {"status", "model", "raw"}

Key resolution order (this process never prints or logs the key):
  (a) If the desk connector helper exists at
      ~/workspace/custom-connectors/custom.apinex/bin/apinex_chat.py,
      delegate to it unchanged — on Layla's desk the real credential flows
      through the Secure Vault surrogate exchange and never touches disk.
  (b) Else read the API key from the APINEX_API_KEY environment variable,
      or from a `.env` file in the Heart Studio root (the parent folder of
      this file's folder), or from ~/.heart-studio.env.
  (c) Else fail with a bilingual message explaining how to set the key.
"""
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request

BASE = "https://api.apinex.bond/v1"
DESK_HELPER = os.path.expanduser(
    "~/workspace/custom-connectors/custom.apinex/bin/apinex_chat.py"
)
HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(HERE)

NO_KEY_MESSAGE = (
    "خطأ: لم يتم العثور على مفتاح APInex.\n"
    "على مكتب ليلى يعمل البرنامج تلقائيًا عبر مساعد الموصل (الخزنة الآمنة).\n"
    "على جهاز جديد عيّن المفتاح بإحدى الطرق التالية ثم أعد المحاولة:\n"
    "  export APINEX_API_KEY=<your-key>\n"
    "  أو ضع سطرًا APINEX_API_KEY=<your-key> في ملف .env داخل مجلد البرنامج\n"
    "  أو في الملف ~/.heart-studio.env\n"
    "Error: no APInex API key found.\n"
    "On Layla's desk this works automatically via the connector helper "
    "(Secure Vault). On a fresh machine set the key in one of these ways "
    "and retry:\n"
    "  export APINEX_API_KEY=<your-key>\n"
    "  or put a line APINEX_API_KEY=<your-key> in a .env file in the "
    "program folder, or in ~/.heart-studio.env"
)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused, verify the endpoint")


def read_env_file(path):
    """Return APINEX_API_KEY from a simple KEY=VALUE file, or None."""
    try:
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                name, _, value = line.partition("=")
                if name.strip() == "APINEX_API_KEY":
                    value = value.strip().strip('"').strip("'")
                    if value:
                        return value
    except OSError:
        pass
    return None


def resolve_key():
    key = os.environ.get("APINEX_API_KEY", "").strip()
    if key:
        return key
    for candidate in (
        os.path.join(REPO_ROOT, ".env"),
        os.path.expanduser("~/.heart-studio.env"),
    ):
        key = read_env_file(candidate)
        if key:
            return key
    return None


def call_direct(req, key, timeout):
    req.add_header("Authorization", "Bearer " + key)
    opener = urllib.request.build_opener(NoRedirect())
    try:
        with opener.open(req, timeout=timeout) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:600]
        return e.code, {"error_body": body}


def models_direct(key, substr):
    req = urllib.request.Request(BASE + "/models", method="GET")
    status, data = call_direct(req, key, timeout=60)
    ids = [m.get("id") for m in data.get("data", [])] if isinstance(data, dict) else []
    out = {"status": status, "model_count": len(ids),
           "has_glm_free": "free/glm-5.3" in ids,
           "has_luna_free": "free/gpt-6-luna" in ids}
    if substr is not None:
        out["matching"] = [i for i in ids if substr.lower() in (i or "").lower()]
    print(json.dumps(out, ensure_ascii=False))
    return 0


def chat_direct(key, model, prompt_file):
    with open(prompt_file, encoding="utf-8") as f:
        prompt = f.read()
    payload = {"model": model,
               "messages": [{"role": "user", "content": prompt}],
               "max_tokens": 1200}
    req = urllib.request.Request(
        BASE + "/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST")
    status, data = call_direct(req, key, timeout=180)
    out = {"status": status, "model": model}
    if isinstance(data, dict) and data.get("choices"):
        msg = data["choices"][0].get("message", {})
        out["content"] = msg.get("content", "")
        out["usage"] = data.get("usage")
    else:
        out["raw"] = data
    print(json.dumps(out, ensure_ascii=False))
    return 0


def delegate_to_desk_helper():
    proc = subprocess.run([sys.executable, DESK_HELPER] + sys.argv[1:])
    return proc.returncode


def main():
    args = sys.argv[1:]
    is_models = len(args) in (1, 2) and args[0] == "models"
    is_chat = len(args) == 3 and args[0] == "chat"
    if not (is_models or is_chat):
        print("usage: apinex_helper.py models [substr] | chat <model> <prompt-file>",
              file=sys.stderr)
        return 2
    # (a) Desk connector helper (Secure Vault surrogate flow) wins when present.
    if os.path.isfile(DESK_HELPER):
        return delegate_to_desk_helper()
    # (b) Env var / .env key for fresh machines.
    key = resolve_key()
    if not key:
        # (c) No key anywhere: clear bilingual failure.
        print(NO_KEY_MESSAGE, file=sys.stderr)
        print(json.dumps({"status": 0, "error": "no_api_key",
                          "hint": "set APINEX_API_KEY (env, ./.env, or ~/.heart-studio.env)"},
                         ensure_ascii=False))
        return 3
    if is_models:
        return models_direct(key, args[1] if len(args) == 2 else None)
    return chat_direct(key, args[1], args[2])


if __name__ == "__main__":
    sys.exit(main())
