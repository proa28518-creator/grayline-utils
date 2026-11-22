#!/usr/bin/env bash
set -euo pipefail
frames_dir=${1:?frames_dir required}; fps=${2:?fps required}; audio=${3:-}; out_dir=${4:?out_dir required}
case "$fps" in 24|30) ;; *) echo 'GATE fps: must be 24 or 30' >&2; exit 1;; esac
mkdir -p "$out_dir"; log="$out_dir/gate.log"; : > "$log"
fail(){ echo "GATE $1: $2" | tee -a "$log" >&2; exit 1; }
mapfile -t files < <(find "$frames_dir" -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \) -printf '%f\n' | sort -V)
((${#files[@]} >= 1)) || fail pts_audit 'no frame files found'
first_stem=${files[0]%%.*}; [[ "$first_stem" =~ ([0-9]+)$ ]] || fail pts_audit "non-sequential frame name: ${files[0]}"; base=$((10#${BASH_REMATCH[1]})); [[ "$base" == 0 || "$base" == 1 ]] || fail pts_audit "first frame must be numbered 0 or 1: ${files[0]}"
for i in "${!files[@]}"; do stem=${files[$i]%%.*}; [[ "$stem" =~ ([0-9]+)$ ]] || fail pts_audit "non-sequential frame name: ${files[$i]}"; actual=$((10#${BASH_REMATCH[1]})); expected=$((base+i)); [[ "$actual" == "$expected" ]] || fail pts_audit "expected sequential frame $expected, found ${files[$i]}"; done
echo "PASS pts_audit: ${#files[@]} sorted sequential frames" | tee -a "$log"
tmp="$out_dir/.normalized"; rm -rf "$tmp"; mkdir -p "$tmp"
for i in "${!files[@]}"; do ln -s "$(realpath "$frames_dir/${files[$i]}")" "$tmp/$(printf '%05d' "$i").png"; done
input="$tmp/%05d.png"; master="$out_dir/master.mp4"
ffmpeg -hide_banner -loglevel error -y -framerate "$fps" -i "$input" -vf "setpts=N/(${fps}*TB),scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1" -c:v libx264 -pix_fmt yuv420p -r "$fps" -an "$out_dir/video-only.mp4" || fail encode 'H.264 video encode failed'
if [[ -n "$audio" && -f "$audio" ]]; then ffmpeg -hide_banner -loglevel error -y -i "$out_dir/video-only.mp4" -i "$audio" -map 0:v:0 -map 1:a:0 -af apad -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "$master" || fail audio 'AAC audio mux failed'; else ffmpeg -hide_banner -loglevel error -y -i "$out_dir/video-only.mp4" -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 -map 0:v:0 -map 1:a:0 -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "$master" || fail audio 'silent AAC mux failed'; fi
echo "PASS encode_audio: H.264 re-encode at ${fps}fps with AAC" | tee -a "$log"
count=${#files[@]}; mid=$((count/2)); ssim_sum=0; ssim_n=0
for idx in 0 "$mid" "$((count-1))"; do src="$frames_dir/${files[$idx]}"; score=$(ffmpeg -hide_banner -i "$src" -i "$master" -filter_complex "[1:v]select='eq(n,${idx})',scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2[ref];[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2[src];[src][ref]ssim" -frames:v 1 -f null - 2>&1 | sed -n 's/.*All: *\([0-9.]*\).*/\1/p' | tail -1); [[ -n "$score" ]] || fail ssim "could not measure source frame $idx"; echo "SSIM frame $idx: $score" | tee -a "$log"; ssim_sum=$(awk -v a="$ssim_sum" -v b="$score" 'BEGIN{printf "%.8f",a+b}'); ssim_n=$((ssim_n+1)); done
mean=$(awk -v s="$ssim_sum" -v n="$ssim_n" 'BEGIN{printf "%.6f",s/n}'); awk -v m="$mean" 'BEGIN{exit !(m>=0.95)}' || fail ssim "mean SSIM ${mean} < 0.95"; echo "PASS ssim: mean=${mean}" | tee -a "$log"
duration=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$master")
cat > "$out_dir/run-info.json" <<EOF
{"project":"${PROJECT_NAME:-unknown}","fps":${fps},"frames":${count},"durationSec":${duration},"settings":{"fps":${fps}},"filmGradedInFrames":false,"filmGrade":null,"gates":{"pts_audit":true,"encode":true,"audio":true,"ssim":{"mean":${mean},"pass":true}}}
EOF
rm -rf "$tmp" "$out_dir/video-only.mp4"
echo 'PASS run_info: written' | tee -a "$log"
