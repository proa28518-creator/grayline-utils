#!/usr/bin/env python3
"""Fleet seat consult — one APInex chat completion from inside GitHub Actions.

Reads APINEX_API_KEY from the environment (a GitHub Actions encrypted secret;
never stored in the repo). Model and prompt come from SEAT_MODEL / SEAT_PROMPT
env vars. Writes seat-result.json and prints the reply text.
"""
import json, os, sys, urllib.request

key = os.environ.get("APINEX_API_KEY", "").strip()
if not key:
    print("APINEX_API_KEY is not set (add it under repo Settings > Secrets > Actions).")
    sys.exit(2)

model = os.environ.get("SEAT_MODEL", "free/glm-5.3")
prompt = os.environ.get("SEAT_PROMPT", "Reply with exactly: SEAT OK")

body = json.dumps({
    "model": model,
    "messages": [{"role": "user", "content": prompt}],
    "temperature": 0.2,
}).encode()
req = urllib.request.Request(
    "https://api.apinex.bond/v1/chat/completions",
    data=body,
    headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
)
with urllib.request.urlopen(req, timeout=120) as r:
    data = json.load(r)

text = data["choices"][0]["message"]["content"]
result = {"model": data.get("model", model), "reply": text, "usage": data.get("usage")}
with open("seat-result.json", "w") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print(text)
