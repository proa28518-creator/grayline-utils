#!/usr/bin/env bash
# Heart Studio — installer for Debian / Kali Linux (user-level; sudo is
# only ever used, with the user's explicit confirmation, for the optional
# Node 22 install below). Ensures Node >= 22 (offers a NodeSource install
# when Node is missing or older), locates a Chromium, and writes a `heart`
# launcher into ~/.local/bin that always points back at THIS clone.
set -euo pipefail
cd "$(dirname "$0")"
ROOT="$PWD"

echo "== Heart Studio installer =="

# 1) Node — «heart still» needs >= 22 (built-in WebSocket). If Node is
# missing or older, offer to install Node 22 LTS via NodeSource. The user
# is always asked BEFORE any sudo step; declining (or no sudo) is handled
# gracefully below.
node_ok=0
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
  if [ "$NODE_MAJOR" -ge 22 ]; then
    echo "Node: $(node -v) ✓"
    node_ok=1
  else
    echo "تنبيه: إصدار Node الحالي ($(node -v)) أقدم من 22. / Note: current Node ($(node -v)) is older than 22."
  fi
else
  echo "تنبيه: Node.js غير مثبّت. / Note: Node.js is not installed."
fi

if [ "$node_ok" -eq 0 ]; then
  if command -v sudo >/dev/null 2>&1; then
    ans=""
    printf "هل تريد تثبيت/تحديث Node.js إلى الإصدار 22 الآن عبر NodeSource؟ [y/N] / Install/update Node.js to 22 now via NodeSource? [y/N] "
    if [ -r /dev/tty ]; then read -r ans 2>/dev/null </dev/tty || ans=""; else read -r ans || ans=""; fi
    case "$ans" in
      y|Y|yes|YES)
        echo "جارٍ تثبيت Node.js 22 عبر NodeSource... / Installing Node.js 22 via NodeSource..."
        if curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs; then
          hash -r
          if command -v node >/dev/null 2>&1 && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 22 ]; then
            echo "Node: $(node -v) ✓"
            node_ok=1
          else
            echo "تحذير: اكتملت خطوات التثبيت لكن إصدار Node ما زال أقدم من 22. / Warning: the install steps finished but Node is still older than 22."
          fi
        else
          echo "تحذير: فشل تثبيت Node.js 22 عبر NodeSource. / Warning: the NodeSource install of Node.js 22 failed."
        fi
        ;;
      *)
        echo "تم تخطّي تحديث Node. / Skipped the Node update."
        ;;
    esac
  else
    echo "sudo غير متاح على هذا الجهاز، فلا يمكن التثبيت التلقائي. / sudo is unavailable on this machine, so automatic install is not possible."
  fi
fi

if [ "$node_ok" -eq 0 ]; then
  echo "للإصلاح اليدوي / To fix manually:"
  echo "  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -"
  echo "  sudo apt-get install -y nodejs"
  if command -v node >/dev/null 2>&1; then
    echo "سيستمر التثبيت على أي حال: صفحة التحكم وأمر «heart serve» قد يعملان مع إصدار Node الأقدم، لكن أمر «heart still» يحتاج Node >= 22."
    echo "Continuing anyway: the control panel and «heart serve» may work on the older Node, but «heart still» needs Node >= 22."
  else
    echo "خطأ: لا يمكن المتابعة بدون Node.js — ثبّته بالأوامر أعلاه ثم أعد تشغيل المثبّت. / Error: cannot continue without Node.js — install it with the commands above, then re-run the installer."
    exit 1
  fi
fi

# 2) Chromium (Playwright cache first, then system packages)
CHROME_PATH=""
for d in "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux/chrome; do
  [ -x "$d" ] && CHROME_PATH="$d"
done
if [ -z "$CHROME_PATH" ]; then
  for c in /usr/bin/chromium /usr/bin/chromium-browser /usr/bin/google-chrome /usr/bin/google-chrome-stable; do
    [ -x "$c" ] && CHROME_PATH="$c" && break
  done
fi
if [ -n "$CHROME_PATH" ]; then
  echo "Chromium: $CHROME_PATH ✓"
else
  echo "تحذير: لم يتم العثور على Chromium — صفحة التحكم ستعمل، لكن «heart still» يحتاج Chromium."
  echo "Warning: no Chromium found. Install one:  sudo apt install chromium  — or:  npx playwright install chromium"
fi

# 3) Launcher (wrapper script, overwritten on every re-run so moves/updates propagate)
mkdir -p "$HOME/.local/bin" || { echo "خطأ: لا يمكن إنشاء ~/.local/bin — تحقق من الصلاحيات: mkdir -p ~/.local/bin"; exit 1; }
cat > "$HOME/.local/bin/heart" <<EOF
#!/bin/bash
export HEART_HOME="$ROOT"
export CHROME_PATH="$CHROME_PATH"
exec node "$ROOT/bin/heart" "\$@"
EOF
chmod +x "$HOME/.local/bin/heart"
echo "المنصّة: ~/.local/bin/heart ✓"

case ":$PATH:" in
  *":$HOME/.local/bin:"*) ;;
  *) echo "تحذير: ~/.local/bin ليس في PATH. أضف إلى ~/.bashrc:"
     echo "  export PATH=\"\$HOME/.local/bin:\$PATH\"" ;;
esac

echo
echo "تم التثبيت. الخطوات التالية:"
echo "  heart serve demo-ring     # افتح صفحة التحكم على http://127.0.0.1:8903/"
echo "  heart new my-film         # مشروع جديد"
echo "  heart still demo-ring 33 frame.png   # لقطة واحدة عند الثانية 33"
