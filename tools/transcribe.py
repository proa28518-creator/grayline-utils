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
import subprocess
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


def model_cached(engine: str | None, model: str, model_dir: Path) -> bool:
    if not engine:
        return False
    if engine == "faster-whisper":
        snapshots = model_dir / f"models--Systran--faster-whisper-{model}" / "snapshots"
        if not snapshots.is_dir():
            return False
        return any((snapshot / "model.bin").is_file() for snapshot in snapshots.iterdir() if snapshot.is_dir())
    if engine == "openai-whisper":
        return (model_dir / f"{model}.pt").is_file()
    return False


def atomic_copy(source: Path, target: Path) -> None:
    fd, temp_name = tempfile.mkstemp(prefix=target.name + ".tmp.", dir=target.parent)
    os.close(fd)
    try:
        shutil.copyfile(source, temp_name)
        os.replace(temp_name, target)
    except Exception:
        try:
            os.unlink(temp_name)
        except FileNotFoundError:
            pass
        raise


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


def edit_alignment(reference: list[str], hypothesis: list[str]) -> list[tuple[str, int | None, int | None]]:
    """Return ordered M/S/D/I operations with reference and hypothesis indices."""
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
    operations: list[tuple[str, int | None, int | None]] = []
    while i or j:
        op = back[i][j]
        if op in ("M", "S"):
            operations.append((op, i - 1, j - 1)); i -= 1; j -= 1
        elif op == "D":
            operations.append((op, i - 1, None)); i -= 1
        elif op == "I":
            operations.append((op, None, j - 1)); j -= 1
    operations.reverse()
    return operations


def edit_counts(reference: list[str], hypothesis: list[str]) -> dict:
    operations = edit_alignment(reference, hypothesis)
    counts = {"substitutions": 0, "deletions": 0, "insertions": 0}
    counts["substitutions"] = sum(op == "S" for op, _, _ in operations)
    counts["deletions"] = sum(op == "D" for op, _, _ in operations)
    counts["insertions"] = sum(op == "I" for op, _, _ in operations)
    distance = counts["substitutions"] + counts["deletions"] + counts["insertions"]
    counts["edit_distance"] = distance
    counts["wer"] = distance / max(1, len(reference))
    counts["word_accuracy"] = max(0.0, 1.0 - counts["wer"])
    return counts


def script_words(path: Path) -> list[dict]:
    if not path.is_file():
        raise RuntimeError("asr_script_missing: script.txt is required to align narration timings")
    rows = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        for match in re.finditer(r"[\w\u0600-\u06ff]+", line):
            normalized = normalize(match.group(0))
            for token in normalized:
                rows.append({"word": match.group(0), "normalized": token, "line": line_number})
    if not rows:
        raise RuntimeError("asr_script_empty: script.txt contains no alignable words")
    return rows


def audio_duration(audio: Path, fallback: float) -> float:
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(audio)],
            check=True, capture_output=True, text=True, timeout=10,
        )
        duration = float(result.stdout.strip())
        if duration >= fallback:
            return duration
    except (OSError, subprocess.SubprocessError, ValueError):
        pass
    return fallback


def align_script_timings(script: list[dict], asr_entries: list[dict], duration: float) -> tuple[list[dict], dict]:
    timed_hypothesis = []
    for row in asr_entries:
        tokens = normalize(str(row.get("word", "")))
        for offset, token in enumerate(tokens):
            start, end = float(row["start"]), float(row["end"])
            timed_hypothesis.append({"normalized": token, "start": start + (end - start) * offset / len(tokens), "end": start + (end - start) * (offset + 1) / len(tokens)})
    operations = edit_alignment([row["normalized"] for row in script], [row["normalized"] for row in timed_hypothesis])
    aligned: list[dict | None] = [None] * len(script)
    stats = {"script_words": len(script), "matched": 0, "substituted": 0, "inserted_interpolated": 0, "dropped_asr_words": 0}
    for op, script_index, asr_index in operations:
        if op == "M":
            stats["matched"] += 1
        elif op == "S":
            stats["substituted"] += 1
        elif op == "D":
            stats["inserted_interpolated"] += 1
            continue
        elif op == "I":
            stats["dropped_asr_words"] += 1
            continue
        script_row, asr_row = script[script_index], timed_hypothesis[asr_index]
        aligned[script_index] = {
            "start": asr_row["start"], "end": asr_row["end"], "line": script_row["line"],
            "who": None, "word": script_row["word"],
        }

    index = 0
    while index < len(aligned):
        if aligned[index] is not None:
            index += 1
            continue
        end_index = index
        while end_index < len(aligned) and aligned[end_index] is None:
            end_index += 1
        left_end = float(aligned[index - 1]["end"]) if index > 0 and aligned[index - 1] is not None else 0.0
        right_start = float(aligned[end_index]["start"]) if end_index < len(aligned) and aligned[end_index] is not None else duration
        right_start = max(left_end, right_start)
        count = end_index - index
        span = right_start - left_end
        for offset in range(count):
            script_row = script[index + offset]
            start = left_end + span * offset / count
            finish = left_end + span * (offset + 1) / count
            aligned[index + offset] = {
                "start": start, "end": finish, "line": script_row["line"],
                "who": None, "word": script_row["word"],
            }
        index = end_index
    return [row for row in aligned if row is not None], stats


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
        cached = model_cached(engine, model, model_dir)
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
        clean_path, clean_voice, transcript_path, report_path = project / "audio" / "clean.json", project / "audio" / "clean.wav", project / "transcript.txt", project / "out" / "transcribe_report.json"
        clean_path.parent.mkdir(parents=True, exist_ok=True); report_path.parent.mkdir(parents=True, exist_ok=True)
        script = script_words(project / "script.txt")
        voice_duration = audio_duration(voice, max(float(row["end"]) for row in entries))
        aligned_entries, alignment = align_script_timings(script, entries, voice_duration)
        aligned_count = alignment["matched"] + alignment["substituted"]
        alignment["aligned_fraction"] = aligned_count / max(1, alignment["script_words"])
        report = {"ok": alignment["aligned_fraction"] >= 0.8, "engine": engine, "language": os.environ.get("HEART_ASR_LANGUAGE", "ar"), "source": str(voice.relative_to(project)), "words": len(entries), "aligned_words": len(aligned_entries), "reference_words": len(reference) if reference else None, "accuracy": accuracy, "transcript": transcript, "alignment": alignment}
        if not report["ok"]:
            report["error"] = f"asr_alignment_failed: {aligned_count}/{alignment['script_words']} script words aligned; minimum is 80%"
            try: clean_path.unlink()
            except FileNotFoundError: pass
            for output, content in ((transcript_path, transcript + "\n"), (report_path, json.dumps(report, ensure_ascii=False, indent=2) + "\n")):
                fd, temp_name = tempfile.mkstemp(prefix=output.name + ".tmp.", dir=output.parent)
                with os.fdopen(fd, "w", encoding="utf-8") as stream: stream.write(content)
                os.replace(temp_name, output)
            print(json.dumps({k: v for k, v in report.items() if k != "transcript"}, ensure_ascii=False, indent=2))
            print(report["error"], file=sys.stderr)
            return 2
        atomic_copy(voice, clean_voice)  # Keep the exact owner audio bytes for the existing renderer contract.
        for output, content in ((clean_path, json.dumps(aligned_entries, ensure_ascii=False, indent=2) + "\n"), (transcript_path, transcript + "\n"), (report_path, json.dumps(report, ensure_ascii=False, indent=2) + "\n")):
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
