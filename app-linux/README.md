# app-linux — whole-app Linux conversion study
The REAL Creatorize Suite 0.28.2, run as-is under a Linux Electron runtime.
- `extract-asar.py` — byte-true extraction of the original app.asar (header offsets/sizes).
- `boot.sh <tag> <seconds>` — builds nothing; runs `run/` (packaged layout: Electron dist +
  resources/app.asar [original, sha256 373b1e46…] + resources/templates + resources/resources
  + app-update.yml) under Xvfb and captures X11 screenshots + the app's own log.
- `evidence/` — boot logs and screenshots (boot2 = Skool unreachable via this VM's TLS proxy;
  boot4 = TLS fixed via a writable NSS DB, Skool check times out through the proxy).
- `run/` and `app/` are working copies (git-ignored): run/ is rebuilt from the teardown's
  win/resources + the app-shell Electron dist; app/ from extract-asar.py.
Findings: orch/RENDERER_HOST_CONTRACT.md, Part II.
