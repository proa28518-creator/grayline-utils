#!/usr/bin/env python3
"""Local Arabic word transcription for Heart Studio projects.

Engines are optional runtime installs. This command never fabricates timings:
without faster-whisper or openai-whisper it exits with asr_engine_unavailable.
"""
from __future__ import annotations

import argparse
import shutil
import json
import os
import re
import sys
import tempfile
import unicodedata
from pathlib import Path


def engine_name() -> str | None:
    try:
        import faster_whisper  # noqa: F401
        return "faster-whisper"
    except Exception:
        pass
    try:
        import whisper  # noqa: F401
        return "openai-whisper"
    except Exception:
        return None


def normalize(text: str) -> list[str]:
    text = unicodedata.normalize("NFKC", text or "")
    text = re.sub(r"[\u064b-\u065f\u0670\u0640]", "", text)
    text = text.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ى", "ي")
    return re.findall(r"[\w\u0600-\u06ff]+", text.lower())


def reference_words(path: Path) -> list[str]:
    if not path.is_file():
        return []
    words = []
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^\[(\d{2}):(\d{2}\.\d+)\s+-\s+\d{2}:\d{2}\.\d+\]\s+(.+)$", line)
        if match:
            words.extend(normalize(match.group(3)))
    return words


def edit_counts(reference: list[str], hypothesis: list[str]) -> dict:
    # Compute explicit counts using a standard backtrace table.
    n, m = len(reference), len(hypothesis)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    back = [[""] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1): dp[i][0], back[i][0] = i, "D"
    for j in range(1, m + 1): dp[0][j], back[0][j] = j, "I"
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            sub = dp[i - 1][j - 1] + (reference[i - 1] != hypothesis[j - 1])
            options = [(dp[i - 1][j] + 1, "D"), (dp[i][j - 1] + 1, "I"), (sub, "S" if reference[i - 1] != hypothesis[j - 1] else "M")]
            dp[i][j], back[i][j] = min(options, key=lambda item: item[0])
    i, j = n, m
    counts = {"substitutions": 0, "deletions": 0, "insertions": 0}
    while i or j:
        op = back[i][j]
        if op == "S": counts["substitutions"] += 1; i -= 1; j -= 1
        elif op == "D": counts["deletions"] += 1; i -= 1
        elif op == "I": counts["insertions"] += 1; j -= 1
        else: i -= 1; j -= 1
    counts["edit_distance"] = dp[n][m]
    counts["wer"] = dp[n][m] / max(1, n)
    counts["word_accuracy"] = max(0.0, 1.0 - counts["wer"])
    return counts


def transcribe(audio: Path) -> tuple[str, list[dict], str]:
    language = os.environ.get("HEART_ASR_LANGUAGE", "ar")
    model_name = os.environ.get("HEART_ASR_MODEL", "small")
    model_dir = os.environ.get("HEART_ASR_MODEL_DIR") or str(Path.home() / "workspace" / "tools" / "whisper-models")
    selected = engine_name()
    if selected == "faster-whisper":
        from faster_whisper import WhisperModel
        model = WhisperModel(model_name, device=os.environ.get("HEART_ASR_DEVICE", "cpu"), compute_type=os.environ.get("HEART_ASR_COMPUTE_TYPE", "int8"), download_root=model_dir)
        segments, info = model.transcribe(str(audio), language=language, word_timestamps=True, vad_filter=False)
        items = []
        texts = []
        for segment in segments:
            texts.append(segment.text.strip())
            for word in segment.words or []:
                token = word.word.strip()
                if token and word.start is not None and word.end is not None:
                    items.append({"start": float(word.start), "end": float(word.end), "line": len(items) + 1, "who": None, "word": token})
        return " ".join(texts).strip(), items, f"faster-whisper/{model_name}/{info.language}"
    if selected == "openai-whisper":
        import whisper
        model = whisper.load_model(model_name, download_root=model_dir, device=os.environ.get("HEART_ASR_DEVICE", "cpu"))
        result = model.transcribe(str(audio), language=language, word_timestamps=True, fp16=False, verbose=False)
        items = []
        for segment in result.get("segments", []):
            for word in segment.get("words", []):
                token = str(word.get("word", "")).strip()
                if token and word.get("start") is not None and word.get("end") is not None:
                    items.append({"start": float(word["start"]), "end": float(word["end"]), "line": len(items) + 1, "who": None, "word": token})
        return str(result.get("text", "")).strip(), items, f"openai-whisper/{model_name}/{language}"
    raise RuntimeError("asr_engine_unavailable: install faster-whisper or openai-whisper in the configured Heart Studio Python environment")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("project", type=Path)
    parser.add_argument("--probe", action="store_true")
    args = parser.parse_args()
    if args.probe:
        engine = engine_name()
        model = os.environ.get("HEART_ASR_MODEL", "small")
        model_dir = Path(os.environ.get("HEART_ASR_MODEL_DIR") or Path.home() / "workspace" / "tools" / "whisper-models")
        cached = (model_dir / model).is_dir() or any(model_dir.rglob("*.bin")) or any(model_dir.rglob("*.pt")) if model_dir.is_dir() else False
        print(json.dumps({"available": bool(engine and cached), "engine": engine, "model": model, "error": None if engine and cached else ("asr_engine_unavailable" if not engine else "asr_model_unavailable: model weights are not cached locally")}))
        return 0
    project = args.project.resolve()
    if not project.is_dir():
        print("asr_project_missing: project directory does not exist", file=sys.stderr); return 2
    voice = next((project / rel for rel in ("voice_owner.wav", "voice_ar.wav", "audio/source.wav") if (project / rel).is_file()), None)
    if voice is None:
        print("asr_audio_missing: provide voice_owner.wav, voice_ar.wav, or audio/source.wav", file=sys.stderr); return 2
    try:
        transcript, entries, engine = transcribe(voice)
        if not transcript or not entries:
            raise RuntimeError("asr_empty_transcript: engine returned no word-level timestamps")
        for i, row in enumerate(entries):
            if row["end"] < row["start"] or (i and row["start"] < entries[i - 1]["end"]):
                raise RuntimeError(f"asr_invalid_word_timing: word {i + 1} is nonmonotonic")
        reference = reference_words(project / "words_owner.txt")
        accuracy = edit_counts(reference, normalize(transcript)) if reference else None
        report = {"ok": True, "engine": engine, "language": os.environ.get("HEART_ASR_LANGUAGE", "ar"), "source": str(voice.relative_to(project)), "words": len(entries), "reference_words": len(reference) if reference else None, "accuracy": accuracy, "transcript": transcript}
        clean_path, clean_voice, transcript_path, report_path = project / "audio" / "clean.json", project / "audio" / "clean.wav", project / "transcript.txt", project / "out" / "transcribe_report.json"
        clean_path.parent.mkdir(parents=True, exist_ok=True); report_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(voice, clean_voice)  # Keep the exact owner audio bytes for the existing renderer contract.
        for output, content in ((clean_path, json.dumps(entries, ensure_ascii=False, indent=2) + "\n"), (transcript_path, transcript + "\n"), (report_path, json.dumps(report, ensure_ascii=False, indent=2) + "\n")):
            fd, temp_name = tempfile.mkstemp(prefix=output.name + ".tmp.", dir=output.parent)
            with os.fdopen(fd, "w", encoding="utf-8") as stream: stream.write(content)
            os.replace(temp_name, output)
        print(json.dumps({k: v for k, v in report.items() if k != "transcript"}, ensure_ascii=False, indent=2))
        return 0
    except Exception as exc:
        message = str(exc)
        if "ConnectError" in message or "locate the files on the Hub" in message:
            message = "asr_model_unavailable: model weights are not cached and cannot be downloaded in this environment"
        elif not re.match(r"asr_[a-z_]+:", message): message = "asr_transcription_failed: " + message
        print(message, file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
