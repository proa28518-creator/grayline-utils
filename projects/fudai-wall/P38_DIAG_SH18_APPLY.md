# PHASE 38 · SH18 CANDIDATE CAMERA — DIAGNOSTIC TREE STATE (NOT AN APPLICATION, NO VERDICT)

Phase 38 (camera-divergence diagnosis) needs the ENGINE's own pv + camera at
F1302 under the phase-33 candidate camera line. The track spec reads the tree
as committed, so the candidate line is committed here ONLY as a diagnostic
state, to be restored in the same phase after the track run is created (the
run pins this commit's SHA at creation).

Candidate (verbatim from `P33_CAUSE9_SH18_APPLY.md`, application `c5e0d7f`):
chunk3Shot('SH18','line:16.start','line:16.end','SEA',[[1,.65,5],[1.5,2.2,-20]],[[1.5,.9,4],[1.8,8.8,-20]],[46,50])

This state carries NO judgement: no stills are judged from it, no cause moves,
cause 9 stays PARKED-ESCALATED. The restore commit + byte-identical audit
verification are recorded in RUN_RECORD phase 38.
