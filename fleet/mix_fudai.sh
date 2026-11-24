#!/usr/bin/env bash
# Seat 5 (audio engineer) — Fudai Wall mix render. FLEET ONLY: this script is
# executed by .github/workflows/fleet-mix.yml on a GitHub runner; it must never
# run on the desk VM (owner's standing condition: heavy work on the fleet).
# Design: projects/fudai-wall-v2 MIX_CUE_SHEET (lane home) + MIX_EXEC_PREP.md.
# Law: RULES.md §8 — mix −16.0 LUFS ±0.5 (two-pass loudnorm), TP ≤ −1.0 dBTP,
# voice-to-bed ≥ 16 dB while speaking, beds −29…−32 dBFS. Voice is law:
# audio/clean.wav is never edited; only levelled (limiter before gain, +1.9 dB).
set -euo pipefail
PROJ=${1:?project dir required}; OUT=${2:?out dir required}
BED_TRIM_DB=${BED_TRIM_DB:-0}; SFX_TRIM_DB=${SFX_TRIM_DB:-0}
DUR=68.08
V="$PROJ/audio/clean.wav"; SFXD="$PROJ/audio/sfx"; CJ="$PROJ/audio/clean.json"
mkdir -p "$OUT/work"; W="$OUT/work"
ff(){ ffmpeg -hide_banner -loglevel error -y "$@"; }
rms_db(){
  local raw v
  raw=$(ffmpeg -hide_banner -i "$1" -af "pan=mono|c0=0.5*c0+0.5*c1,astats" -f null - 2>&1) || { echo "rms_db: ffmpeg failed on $1" >&2; echo "$raw" | tail -5 >&2; exit 1; }
  v=$(printf '%s\n' "$raw" | awk '/RMS level/{x=$NF} END{print x}')
  if [ -z "$v" ]; then echo "rms_db: no RMS line for $1; astats said:" >&2; printf '%s\n' "$raw" | tail -30 >&2; exit 1; fi
  printf '%s' "$v"
}

echo "== 1. voice stem: 24k -> 48k, limiter (ceiling -1.0 dBTP) BEFORE +1.9 dB gain =="
ff -i "$V" -af "aresample=48000,alimiter=limit=0.88:attack=5:release=50:level=false,volume=1.9dB,pan=stereo|c0=c0|c1=c0" -c:a pcm_f32le "$W/voice.wav"

echo "== 2. sea bed: brown noise, HP 40 Hz, per-segment LP + RMS targets, 2.5 s crossfades =="
ffmpeg -hide_banner -loglevel error -y -f lavfi -i "anoisesrc=color=brown:sample_rate=48000:amplitude=0.9" -t 70 -c:a pcm_f32le "$W/noise.wav"
# segment: start len lpHz targetRMSdBFS tremolo?
SEG=( "0 39.89 420 -32 1" "37.39 17.11 600 -30 0" "52 14.19 800 -29.5 0" "61.19 6.89 350 -35 0" )
# NOTE seg D source window is arbitrary (stationary noise); its PLACE comes from the crossfade chain.
i=0
for s in "${SEG[@]}"; do
  read -r st len lp tgt trem <<< "$s"
  tf=""; [ "$trem" = 1 ] && tf="tremolo=f=0.11:d=0.25,"
  ff -ss "$st" -t "$len" -i "$W/noise.wav" -af "${tf}highpass=f=40,lowpass=f=$lp,pan=stereo|c0=c0|c1=c0" -c:a pcm_f32le "$W/seg_raw$i.wav"
  cur=$(rms_db "$W/seg_raw$i.wav")
  adj=$(awk -v t="$tgt" -v c="$cur" -v b="$BED_TRIM_DB" 'BEGIN{printf "%.2f", t-c+b}')
  echo "bed seg$i: measured RMS $cur dBFS -> adjust $adj dB (target $tgt, trim $BED_TRIM_DB)"
  ff -i "$W/seg_raw$i.wav" -af "volume=${adj}dB" -c:a pcm_f32le "$W/seg$i.wav"
  i=$((i+1))
done
ff -i "$W/seg0.wav" -i "$W/seg1.wav" -i "$W/seg2.wav" -i "$W/seg3.wav" \
  -filter_complex "[0][1]acrossfade=d=2.5:c1=tri:c2=tri[ab];[ab][2]acrossfade=d=2.5:c1=tri:c2=tri[abc];[abc][3]acrossfade=d=2.5:c1=tri:c2=tri,atrim=0:$DUR,afade=t=out:st=65.58:d=2.5[bed]" \
  -map "[bed]" -c:a pcm_f32le "$W/bed.wav"

echo "== 3. SFX cues (earshot library) =="
# cue: file | at_s | gain_dB | extra_filter | fit_len_s (tempo-fit target, empty = none)
CUES=(
 "whoosh_big__swell.ogg|0.05|-16|lowpass=f=3000|"
 "mallet__pluck.ogg|9.30|-26||"
 "swipe__cloth.ogg|17.70|-24||"
 "cut_hit__rumble.ogg|37.39|-7||"
 "sub_drop__long.ogg|37.39|-9||"
 "pro_whoosh_big__reverse.ogg|39.28|-11|lowpass=f=1000|"
 "riser__build.ogg|41.06|-13||3.75"
 "whoosh_big__gust.ogg|51.00|-11||"
 "riser__tension.ogg|56.50|-13||4.00"
 "impact__deep.ogg|61.56|-5||"
 "sub_drop__808.ogg|61.56|-7||"
 "impact__swell.ogg|61.56|-9||"
 "shimmer__m2.ogg|65.80|-19||"
 "mallet__celesta.ogg|66.90|-21||"
)
inputs=(); n=0
for c in "${CUES[@]}"; do
  IFS='|' read -r f at g extra fit <<< "$c"
  chain=""
  if [ -n "$fit" ]; then
    sd=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$SFXD/$f")
    fac=$(awk -v s="$sd" -v t="$fit" 'BEGIN{f=s/t; if(f<0.5)f=0.5; if(f>2)f=2; printf "%.4f", f}')
    chain="atempo=$fac,"
    echo "cue $f: source ${sd}s tempo-fit x$fac -> ${fit}s"
  fi
  [ -n "$extra" ] && chain="${chain}${extra},"
  ms=$(awk -v a="$at" 'BEGIN{printf "%d", a*1000}')
  ff -i "$SFXD/$f" -af "${chain}aresample=48000,volume=${g}dB,adelay=${ms}|${ms},apad,atrim=0:$DUR" -ac 2 -c:a pcm_f32le "$W/cue$n.wav"
  inputs+=( -i "$W/cue$n.wav" ); n=$((n+1))
done
ff "${inputs[@]}" -filter_complex "amix=inputs=$n:normalize=0,volume=${SFX_TRIM_DB}dB" -c:a pcm_f32le "$W/sfx.wav"

echo "== 4. duck bed under voice (sidechain ratio ~3, RULES §8) =="
ff -i "$W/bed.wav" -i "$W/voice.wav" \
  -filter_complex "[0:a][1:a]sidechaincompress=threshold=0.03:ratio=2.5:attack=25:release=400[bd]" \
  -map "[bd]" -c:a pcm_f32le "$W/bed_ducked.wav"

echo "== 5. premaster + two-pass loudnorm to -16 LUFS / TP -1.0 =="
ff -i "$W/voice.wav" -i "$W/bed_ducked.wav" -i "$W/sfx.wav" \
  -filter_complex "[0:a][1:a][2:a]amix=inputs=3:normalize=0[pm]" -map "[pm]" -c:a pcm_f32le "$W/premaster.wav"
P1=$(ffmpeg -hide_banner -i "$W/premaster.wav" -af "loudnorm=I=-16:TP=-1.0:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
echo "loudnorm pass1: $P1"
MEAS=$(python3 -c "import json,sys; d=json.loads(sys.argv[1]); print(d['input_i'], d['input_tp'], d['input_lra'], d['input_thresh'], d['offset'])" "$P1")
read -r MI MTP MLRA MTH OFF <<< "$MEAS"
if ! ff -i "$W/premaster.wav" -af "loudnorm=I=-16:TP=-1.0:LRA=11:measured_I=$MI:measured_TP=$MTP:measured_LRA=$MLRA:measured_thresh=$MTH:offset=$OFF:linear=true,aresample=48000" -c:a pcm_s16le "$OUT/fudai_wall_mix_48k.wav"; then
  echo "linear loudnorm failed; retrying dynamic"
  ff -i "$W/premaster.wav" -af "loudnorm=I=-16:TP=-1.0:LRA=11:measured_I=$MI:measured_TP=$MTP:measured_LRA=$MLRA:measured_thresh=$MTH:offset=$OFF:linear=false,aresample=48000" -c:a pcm_s16le "$OUT/fudai_wall_mix_48k.wav"
fi

echo "== 6. measure final mix + voice-to-bed ratio; write mix_report.json =="
FIN=$(ffmpeg -hide_banner -i "$OUT/fudai_wall_mix_48k.wav" -af "loudnorm=I=-16:TP=-1.0:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
ff -i "$W/voice.wav" -c:a pcm_s16le "$W/voice_s16.wav"
ff -i "$W/bed.wav" -c:a pcm_s16le "$W/bed_s16.wav"
ff -i "$W/bed_ducked.wav" -c:a pcm_s16le "$W/bedd_s16.wav"
python3 - "$FIN" "$W/voice_s16.wav" "$W/bed_s16.wav" "$W/bedd_s16.wav" "$CJ" "$OUT/mix_report.json" << 'PYEOF'
import json, sys, wave, struct, math
fin = json.loads(sys.argv[1])
def read_rms(path):
    w = wave.open(path); n = w.getnframes(); ch = w.getnchannels()
    raw = w.readframes(n); w.close()
    a = struct.unpack('<%dh' % (len(raw)//2), raw)
    return a, ch
def win_rms(a, ch, sr, wins):
    tot = 0.0; cnt = 0
    for t0, t1 in wins:
        i0 = int(t0*sr)*ch; i1 = int(t1*sr)*ch
        seg = a[i0:i1]
        tot += sum(x*x for x in seg); cnt += len(seg)
    return math.sqrt(tot/cnt)/32768.0 if cnt else 0.0
def overall_rms(a):
    return math.sqrt(sum(x*x for x in a)/len(a))/32768.0
cj = json.load(open(sys.argv[5]))
wins = [(max(0.0, x['t0']-0.05), x['t1']+0.05) for x in cj['words']]
va, vch = read_rms(sys.argv[2]); ba, bch = read_rms(sys.argv[3]); da, dch = read_rms(sys.argv[4])
sr = 48000
vr = win_rms(va, vch, sr, wins); br = win_rms(da, dch, sr, wins)
ratio = 20*math.log10(vr/br) if vr and br else 0.0
bed_pre = 20*math.log10(overall_rms(ba)); bed_post = 20*math.log10(overall_rms(da))
lufs = float(fin['input_i']); tp = float(fin['input_tp']); lra = float(fin['input_lra'])
gates = {
  'lufs_-16±0.5': abs(lufs - (-16.0)) <= 0.5,
  'true_peak<=-1.0': tp <= -1.0,
  'voice_to_bed>=16dB': ratio >= 16.0,
  'bed_rms_-29..-32dBFS': -32.0 <= bed_pre <= -29.0,
}
rep = {'integrated_lufs': lufs, 'true_peak_dbtp': tp, 'lra': lra,
       'voice_to_bed_ratio_db': round(ratio, 2),
       'bed_rms_dbfs_preduck': round(bed_pre, 2), 'bed_rms_dbfs_ducked': round(bed_post, 2),
       'targets': {'lufs': -16.0, 'tp_max': -1.0, 'ratio_min_db': 16.0, 'bed_rms_range': [-32, -29]},
       'gates': gates, 'pass': all(gates.values())}
json.dump(rep, open(sys.argv[6], 'w'), indent=1)
print(json.dumps(rep, indent=1))
sys.exit(0 if rep['pass'] else 1)
PYEOF
echo "MIX GATES PASS"
