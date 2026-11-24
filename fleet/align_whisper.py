# Fleet word alignment — runs faster-whisper (large-v3) on a project's
# audio/clean.wav ON THE FLEET (owner's standing condition: no heavy
# processing on the desk VM) and dumps the raw word timings as JSON.
# The voice file itself is only READ here — never written, never edited.
# Usage: python3 fleet/align_whisper.py <clean.wav> <out.json>
import json
import sys

from faster_whisper import WhisperModel


def main() -> int:
    wav_path, out_path = sys.argv[1], sys.argv[2]
    model = WhisperModel("large-v3", device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        wav_path,
        language="ar",
        word_timestamps=True,
        beam_size=5,
    )
    words = []
    segs = []
    for seg in segments:
        segs.append({"start": seg.start, "end": seg.end, "text": seg.text})
        for w in seg.words or []:
            words.append(
                {
                    "word": w.word,
                    "start": round(w.start, 3),
                    "end": round(w.end, 3),
                    "probability": round(w.probability, 4),
                }
            )
    payload = {
        "model": "large-v3",
        "language": info.language,
        "language_probability": info.language_probability,
        "duration": info.duration,
        "words": words,
        "segments": segs,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=1)
    print(f"language={info.language} p={info.language_probability:.3f} duration={info.duration:.2f}")
    print(f"whisper words: {len(words)}")
    for w in words[:5]:
        print("  first:", w)
    for w in words[-3:]:
        print("  last:", w)
    return 0


if __name__ == "__main__":
    sys.exit(main())
