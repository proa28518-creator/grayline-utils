# vendor/renderer-original — provenance note
This tree is Russell's Creatorize Suite 0.28.2 renderer, byte-true, extracted from the
original app.asar (creatorize-teardown/unpacked/win/resources/app.asar) using the asar
header's own offsets/sizes. NEVER EDIT.
History: the first backup (commit ffaef6c) copied the teardown's unpacked tree, which
turned out to be damaged — every file's content was shifted +4 bytes (each file missing
its own first 4 bytes, e.g. index.html began "ctype html>"). Proven for all 149 files:
damaged[:-4] == true[4:]. The corrected backup replaced it the same day; the damaged
copy remains in git history.
