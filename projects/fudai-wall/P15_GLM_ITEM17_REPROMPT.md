# GLM SEAT — CORRECTIVE RE-PROMPT · phase 15 · item 17 (SH04 option iii)

Your round-1 output (`P15_GLM_ITEM17_OUT.txt`) is REJECTED without
application. Its baseline restatement and its HERMES TEST section
were correct and stand — keep both exactly. The ACTS LINES and the
ARC fail the brief on measured defects, listed below. Correct
ONLY these defects; the brief `P15_GLM_ITEM17_BRIEF.md` otherwise
stands word for word.

## Defects (measured from your own output)
1. **Missing restore keys.** The brief requires, for EVERY member,
   a place entry `{t:'line:3.end',at:[baseX,baseZ]}` AND a look
   entry `{t:'line:3.end',at:[restore point]}`. Your lines omit:
   mocker_a place restore; mocker_b place restore; villager_1
   place restore AND look restore; villager_3 place restore.
   (mocker_c's and villager_2's lines have both — follow those.)
2. **mocker_a's arc position [4.4, -2.0] is illegal three ways:**
   z = -2.0 violates z ≥ 2.5; its radius from [0, 2] is 5.94,
   outside 4.2–5.8; and [4.4, -2.0] is mocker_c's SH10 staged
   position from another shot — not an arc position for SH04.
   Your own arc table contradicts the line (it prints [4.4, 2.0]).
3. **Duplicate positions.** villager_1 and mocker_b are BOTH at
   [-3.5, 4.2]; villager_2 and mocker_c are BOTH at [3.5, 4.2].
   The brief requires ≥ 2.0 units between every pair of members.
   Six members, six DISTINCT positions.
4. **villager_3 at [0, 7.0] violates the mayor-column rule:** your
   own table projects his head at screen x ≈ 665 — the mayor's
   exact column — with a head-top ABOVE the mayor's, and your note
   concedes the ≥ 942 head-top condition fails. A member in the
   mayor's column must be clearly below him or not be there.
5. **Array placement:** the two new entries go at the FRONT of each
   place/look array (your mocker_a/b look restores were appended
   after the line:24 entries). Keep every existing entry
   byte-identical and in its existing relative order.

## Binding constraints, restated (all must hold simultaneously)
- Six distinct arc positions, centre [0, 2], radius 4.2–5.8 each,
  z ≥ 2.5 each, pairwise distance ≥ 2.0.
- No member within 1.2 units of the camera→mayor sightline
  segment (from [-5, 9] to [0, 2]).
- Head screen x within [170, 910]; head-top y ≥ 40; head ≤ 460px;
  mayor-column rule: |head x − 665| < 200 only if head-top ≥ 942.
- Every member: place = [line:3.start arc, line:3.end base, ...existing];
  look = [line:3.start → [0,1.9,2], line:3.end → restore point, ...existing].
  Bases: villager_1 [-1,4], villager_2 [1,4], villager_3 [-2,6],
  mocker_a [4,0], mocker_b [4,-1], mocker_c [6,0.5].
  Restore points: villager_1 [-1,1.9,9], villager_2 [1,1.9,9],
  villager_3 [-0.29,1.9,10.70], mocker_a [4,1.9,5],
  mocker_b [4,1.9,-6], mocker_c [6,1.9,-4.5].

## Reply format (exact)
1. ACTS LINES: the six complete replacement lines, verbatim, pasteable.
2. ARC TABLE: per member — arc [x,z], radius from [0,2], distance to the sightline segment, and the pairwise distances to his two nearest neighbours.
3. HERMES TEST: repeat your round-1 section unchanged.
4. PREDICTED READINGS: F219, F241, chunk totals, D1/D2.
Nothing else. Do not claim you ran anything.
