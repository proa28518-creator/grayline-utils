#!/usr/bin/env python3
"""Qwen Chat browser driver — drives chat.qwen.ai with a persistent profile.

The login state lives ONLY in the profile directory (default ~/qwen-profile),
which is OUTSIDE this repository and must never be committed or copied into
any secret store. Sign-in is done once, by the owner, by hand (login mode).

Modes:
  python3 driver.py probe            -> open the chat, dump page structure
                                        (titles, buttons, inputs) to stdout
                                        so selectors can be calibrated.
  python3 driver.py ask "prompt..."  -> one question, prints the answer.
  python3 driver.py login            -> headed browser for manual sign-in
                                        (needs a display / xvfb-run).
"""
import json
import os
import sys
import time

PROFILE = os.environ.get("QWEN_PROFILE", os.path.expanduser("~/qwen-profile"))
CHAT_URL = "https://chat.qwen.ai/"
MODEL_HINT = os.environ.get("QWEN_MODEL_HINT", "Qwen4-Max")  # picker label fragment

# Selector candidates, tried in order. Qwen Chat's DOM changes over time;
# `probe` mode exists to recalibrate these without guessing.
INPUT_SELECTORS = [
    "textarea",
    "div[contenteditable='true']",
    "[placeholder*='Qwen' i]",
]
ANSWER_SELECTORS = [
    ".markdown-body",
    "[class*='markdown']",
    "[class*='message']",
]
SEND_HINTS = ("send", "submit", "arrow", "إرسال")


def _launch(pw, headed=False):
    return pw.chromium.launch_persistent_context(
        PROFILE,
        headless=not headed,
        args=["--no-sandbox", "--disable-dev-shm-usage"],
        viewport={"width": 1366, "height": 900},
    )


def _find_input(page):
    for sel in INPUT_SELECTORS:
        loc = page.locator(sel)
        try:
            if loc.count() > 0 and loc.first.is_visible():
                return loc.first
        except Exception:
            continue
    return None


def _logged_in(page):
    """Heuristic: a usable chat input means we are in; a login wall means not."""
    return _find_input(page) is not None


def _try_select_model(page):
    """Open the model picker (div[role=button].wms-trigger, or a legacy
    <button> whose text mentions qwen/model), click the entry containing
    MODEL_HINT, and return True only after verifying the trigger's label
    now contains MODEL_HINT. (Patch by Qwen4-Max, 2026-11-19.)"""
    try:
        trigger = None
        modern = page.locator("div[role='button'].wms-trigger, [aria-label='Select Model']")
        for i in range(modern.count()):
            if modern.nth(i).is_visible():
                trigger = modern.nth(i)
                break
        if trigger is None:  # legacy fallback: plain <button> trigger
            buttons = page.locator("button")
            for i in range(buttons.count()):
                label = (buttons.nth(i).inner_text() or "").lower()
                if "qwen" in label or "model" in label:
                    trigger = buttons.nth(i)
                    break
        if trigger is None:
            return False
        if MODEL_HINT in (trigger.inner_text(timeout=2000) or ""):
            return True  # already selected in this session
        trigger.click(timeout=3000)
        options = page.locator("[role='option'], [role='menuitem']").filter(has_text=MODEL_HINT)
        option = None
        for _ in range(15):  # poll up to ~3s for the menu to render
            if options.count() and options.first.is_visible():
                option = options.first
                break
            page.wait_for_timeout(200)
        if option is None:  # last resort: leaf-most exact text match
            option = page.get_by_text(MODEL_HINT, exact=True).last
        option.click(timeout=3000)
        for _ in range(10):  # verify the trigger label updated (~2s max)
            label = ((trigger.inner_text(timeout=1000) or "") + " " +
                     (trigger.get_attribute("aria-label") or ""))
            if MODEL_HINT in label:
                return True
            page.wait_for_timeout(200)
        try:
            page.keyboard.press("Escape")  # close picker on failed verification
        except Exception:
            pass
        return False
    except Exception:
        return False


def _last_answer(page):
    best = ""
    for sel in ANSWER_SELECTORS:
        try:
            loc = page.locator(sel)
            for i in range(loc.count()):
                text = (loc.nth(i).inner_text() or "").strip()
                if len(text) > len(best):
                    best = text
        except Exception:
            continue
    return best


def _wait_stable(page, timeout_s=240):
    """Wait until the extracted answer stops growing (streaming finished)."""
    last, stable = "", 0
    start = time.time()
    while time.time() - start < timeout_s:
        cur = _last_answer(page)
        if cur and cur == last:
            stable += 1
            if stable >= 3:
                return cur
        else:
            stable = 0
            last = cur
        page.wait_for_timeout(1500)
    return last


def cmd_probe():
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        ctx = _launch(pw)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto(CHAT_URL, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)
        info = {
            "url": page.url,
            "title": page.title(),
            "logged_in_heuristic": _logged_in(page),
            "buttons": [],
            "inputs": [],
        }
        btns = page.locator("button")
        for i in range(min(btns.count(), 40)):
            try:
                info["buttons"].append((btns.nth(i).inner_text() or "")[:60])
            except Exception:
                pass
        for sel in INPUT_SELECTORS:
            try:
                info["inputs"].append([sel, page.locator(sel).count()])
            except Exception:
                pass
        print(json.dumps(info, ensure_ascii=False, indent=2))
        ctx.close()


def cmd_ask(prompt):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        ctx = _launch(pw)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto(CHAT_URL, wait_until="domcontentloaded")
        page.wait_for_timeout(3000)
        box = _find_input(page)
        if box is None:
            print(json.dumps({"ok": False, "error": "LOGIN_NEEDED_OR_UI_CHANGED",
                              "detail": "no chat input found; run probe/login"}))
            ctx.close()
            return
        _try_select_model(page)
        box.click()
        box.fill(prompt) if box.evaluate("e => e.tagName") == "TEXTAREA" \
            else page.keyboard.type(prompt)
        page.keyboard.press("Enter")
        answer = _wait_stable(page)
        print(json.dumps({"ok": bool(answer), "answer": answer},
                         ensure_ascii=False))
        ctx.close()


def cmd_login():
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        ctx = _launch(pw, headed=True)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto(CHAT_URL)
        print("Sign in by hand in the opened browser, then press Enter here.")
        input()
        ctx.close()


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "probe"
    if mode == "probe":
        cmd_probe()
    elif mode == "ask":
        cmd_ask(" ".join(sys.argv[2:]))
    elif mode == "login":
        cmd_login()
    else:
        print(__doc__)
        sys.exit(2)
