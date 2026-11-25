#!/usr/bin/env python3
"""Build audio/clean.json (word times) from the timings file.
Sentences follow the locked script's punctuation; every timing line maps to
exactly one sentence so no word is lost or reordered."""
import json, re, sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
src = (root / "audio" / "word_timings_source.txt").read_text(encoding="utf-8")

entries = []  # (start, end, [words])
for line in src.splitlines():
    line = line.strip()
    if not line:
        continue
    m = re.match(r"(\d+):(\d+\.\d+)\s*-\s*(\d+):(\d+\.\d+)\s*\|\s*(.+)$", line)
    assert m, line
    s = int(m.group(1)) * 60 + float(m.group(2))
    e = int(m.group(3)) * 60 + float(m.group(4))
    entries.append((s, e, m.group(5).split()))

total_words = sum(len(w) for _, _, w in entries)

# sentence membership: timing line indices (1-based, inclusive)
SENTENCES = [
    (1, 18),    # سنة 1916 ... ماشي جنبه.
    (19, 40),   # بعد 16 يوم ... نعل جزمهم.
    (41, 52),   # من كتر التعب ... نص ساعة كاملة.
    (53, 61),   # في الوقت ده ... بنفس الإحساس،
    (62, 64),   # وكرين كمان أكد نفس الكلام.
    (65, 69),   # التلاتة ... معاهم.
    (70, 77),   # مش بس هم ... شافه..
    (78, 81),   # ظاهرة معروفة ... الرجل الثالث
]

words = []
lines = []
prev_end = entries[-1][1]
for li, (a, b) in enumerate(SENTENCES, 1):
    seg = entries[a - 1 : b]
    text = " ".join(w for _, _, ws in seg for w in ws)
    lines.append({"who": None, "text": text, "start": seg[0][0], "end": seg[-1][1]})
    for s, e, ws in seg:
        for w in ws:
            words.append({"word": w, "start": round(s, 2), "end": round(e, 2), "line": li})

out = {"fps": 30, "duration": 62.99, "words": words, "lines": lines,
       "source": "member-provided word timings 2026-11-25, used as-is"}
(root / "audio" / "clean.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"timing lines: {len(entries)}  words: {total_words}  sentences: {len(lines)}")
for li, l in enumerate(lines, 1):
    print(f"line {li}: {l['start']:.2f}-{l['end']:.2f}  {l['text'][:60]}")
