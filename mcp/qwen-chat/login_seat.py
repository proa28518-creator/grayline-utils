#!/usr/bin/env python3
"""Seat login for Qwen Chat (the owner runs this by hand, in the seat).

Usage (from the repo root, inside the Codespace):
    xvfb-run -a python3 mcp/qwen-chat/login_seat.py

What it does:
  * Opens https://chat.qwen.ai/ in a headed Chromium under xvfb, using the
    same persistent profile as the MCP driver (~/qwen-profile, or
    $QWEN_PROFILE), so the login survives for driver.py afterwards.
  * Clicks "Log in", chooses "Log in with a password" if offered, and
    fills the email address automatically.
  * Asks the OWNER for the account password in the terminal with
    getpass (hidden input). The password is never printed, never
    logged and never stored anywhere; it lives only in memory.
  * Submits the login. If an "Access Verification" slider or any CAPTCHA
    appears, it prints a clear Arabic/English blocked line and exits
    WITHOUT retrying.
  * On success it selects the model labelled "Qwen4-Max", sends the test
    message "Reply with exactly: QWEN MCP OK", prints the reply, and
    prints SEAT LOGIN OK -- only on real success.

Standing rule from mcp/qwen-chat/README.md: sacrificial account only --
never use the owner's main account for chat-UI automation.
"""

import getpass
import os
import re
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

CHAT_URL = "https://chat.qwen.ai/"
EMAIL = "arabymahmuod10@gmail.com"
MODEL_LABEL = "Qwen4-Max"
TEST_MESSAGE = "Reply with exactly: QWEN MCP OK"
PROFILE = Path(os.environ.get("QWEN_PROFILE", "~/qwen-profile")).expanduser()

BLOCKED_LINE = (
    "BLOCKED AT VERIFICATION / تم الحظر عند التحقق: "
    "Access Verification / CAPTCHA appeared -- stopping without retrying. "
    "يرجى إكمال التحقق يدويا ثم إعادة تشغيل السكربت."
)

VERIFICATION_TEXT = (
    "access verification", "verify you are human", "verify you're human",
    "drag the slider", "slide to verify", "complete the verification",
    "captcha", "human verification",
)

VERIFICATION_SELECTORS = (
    "iframe[src*='captcha']", "iframe[title*='captcha' i]",
    "[class*='captcha' i]", "[id*='captcha' i]",
    "[class*='nc_wrapper' i]", "[class*='slider' i][class*='verify' i]",
    "[class*='verify' i][class*='slider' i]",
)

def fail(message, code=1):
    print(message)
    sys.exit(code)


def page_is_blocked(page):
    """True if an Access Verification slider or any CAPTCHA is showing."""
    try:
        for selector in VERIFICATION_SELECTORS:
            if page.locator(selector).first.is_visible(timeout=500):
                return True
    except Exception:
        pass
    try:
        text = (page.inner_text("body") or "").lower()
    except Exception:
        return False
    return any(phrase in text for phrase in VERIFICATION_TEXT)


def check_blocked(page):
    if page_is_blocked(page):
        print(BLOCKED_LINE)
        sys.exit(2)


def click_text(page, patterns, timeout=8000):
    """Click the first visible button/link whose text matches a pattern."""
    for pattern in patterns:
        try:
            target = page.get_by_role("button", name=re.compile(pattern, re.I))
            if target.first.is_visible(timeout=1000):
                target.first.click(timeout=timeout)
                return True
        except Exception:
            pass
        try:
            target = page.locator(f"text={pattern}").first
            if target.is_visible(timeout=1000):
                target.click(timeout=timeout)
                return True
        except Exception:
            pass
    return False


CHAT_INPUT_SELECTORS = (
    "textarea",
    "textarea[placeholder*='Qwen' i]",
    "textarea[placeholder*='Ask' i]",
    "[contenteditable='true']",
    "input[placeholder*='Qwen' i]",
)


def find_chat_input(page):
    for selector in CHAT_INPUT_SELECTORS:
        try:
            box = page.locator(selector).first
            if box.is_visible(timeout=1000):
                return box
        except Exception:
            continue
    return None


def is_logged_in(page):
    """Logged in only if the chat input is there AND no Log in button is.
    (Qwen shows the chat box to guests too, so the input alone proves nothing.)"""
    if not find_chat_input(page):
        return False
    try:
        login_btn = page.locator("button:has-text('Log in'), a:has-text('Log in')").first
        if login_btn.is_visible(timeout=1000):
            return False
    except Exception:
        pass
    return True


def wait_for_reply(page, timeout=120):
    """Wait until the last assistant message stops changing; return its text."""
    last = ""
    stable_since = None
    deadline = time.time() + timeout
    while time.time() < deadline:
        check_blocked(page)
        try:
            candidates = page.locator(".markdown-body, [class*='markdown' i], [class*='message' i]")
            count = candidates.count()
            text = ""
            if count:
                text = (candidates.last.inner_text() or "").strip()
                # The prompt itself contains the expected phrase; never
                # mistake our own sent message for the model's reply.
                if text == TEST_MESSAGE:
                    text = ""
        except Exception:
            text = ""
        if text and text != last:
            last = text
            stable_since = time.time()
        elif text and stable_since and time.time() - stable_since > 3:
            return last
        time.sleep(1)
    return last

def do_login(page):
    """Click Log in, fill the email, ask for the password, submit."""
    check_blocked(page)
    if is_logged_in(page):
        print("Already logged in (chat open, no Log in button); skipping login.")
        return
    if not click_text(page, [r"^Log in$", r"Log in", r"Sign in", r"Login"]):
        print("Could not find a 'Log in' button; the page may already be logged in or changed.")
    page.wait_for_timeout(2500)
    check_blocked(page)
    # The auth page defaults to verification-code login; the password form
    # is behind "Log in with a password". Prefer that: in the dry-check the
    # code flow showed an Access Verification slider after Continue, and
    # no password field at all.
    click_text(page, [r"Log in with a password"])
    page.wait_for_timeout(1500)
    check_blocked(page)
    try:
        email_box = page.locator("input[type='email'], input[name*='email' i], input[placeholder*='email' i]").first
        email_box.wait_for(state="visible", timeout=15000)
    except Exception:
        fail("LOGIN FAILED: no email field appeared after clicking Log in.")
    email_box.fill(EMAIL)
    print(f"Email filled: {EMAIL}")
    check_blocked(page)
    # The password may be on the same form, or after a Continue/Next step.
    password_box = page.locator("input[type='password']").first
    try:
        password_box.wait_for(state="visible", timeout=3000)
    except Exception:
        if click_text(page, [r"^Continue$", r"Continue", r"^Next$", r"Next"]):
            page.wait_for_timeout(2000)
        check_blocked(page)
        try:
            password_box.wait_for(state="visible", timeout=15000)
        except Exception:
            fail("LOGIN FAILED: no password field appeared after the email step.")
    # Hidden terminal prompt: the owner types the password himself.
    password = getpass.getpass(f"Password for {EMAIL} (hidden, not stored): ")
    if not password:
        fail("LOGIN ABORTED: empty password.")
    password_box.fill(password)
    password = None  # drop the only in-memory copy as soon as it is used
    check_blocked(page)
    if not click_text(page, [r"^Log in$", r"Log in", r"^Sign in$", r"Sign in", r"^Continue$", r"Continue"]):
        password_box.press("Enter")
    print("Login submitted; waiting for the chat to open...")
    deadline = time.time() + 60
    while time.time() < deadline:
        check_blocked(page)
        if is_logged_in(page):
            print("Logged in: chat is open and the Log in button is gone.")
            return
        page.wait_for_timeout(1000)
    fail("LOGIN FAILED: the chat did not open after submitting the login.")


def select_model(page):
    """Open the model picker and select the model labelled Qwen4-Max."""
    picker = page.locator("button", has_text=re.compile(r"Qwen", re.I)).first
    try:
        if picker.is_visible(timeout=3000):
            label = (picker.inner_text() or "").strip()
            if MODEL_LABEL in label:
                print(f"Model already selected: {label}")
                return
            picker.click(timeout=5000)
    except Exception:
        pass
    page.wait_for_timeout(1500)
    check_blocked(page)
    entry = page.get_by_text(MODEL_LABEL, exact=True).first
    try:
        entry.wait_for(state="visible", timeout=10000)
        entry.click(timeout=5000)
    except Exception:
        fail(f"MODEL FAILED: could not select the model labelled '{MODEL_LABEL}'.")
    page.wait_for_timeout(1500)
    print(f"Model selected: {MODEL_LABEL}")

def send_test_message(page):
    """Send the test message and return the model's reply text."""
    box = find_chat_input(page)
    if not box:
        fail("CHAT FAILED: no chat input found after login/model selection.")
    box.click(timeout=5000)
    try:
        box.fill(TEST_MESSAGE)
    except Exception:
        box.type(TEST_MESSAGE, delay=10)
    page.keyboard.press("Enter")
    page.wait_for_timeout(2000)
    try:
        if (box.input_value() or "").strip() == TEST_MESSAGE:
            clicked = click_text(page, [r"Send", r"Submit", r"send"])
            if not clicked:
                page.keyboard.press("Enter")
    except Exception:
        pass
    reply = wait_for_reply(page, timeout=120)
    print("REPLY:")
    print(reply if reply else "(no reply text captured)")
    return reply


def main():
    print(f"Qwen seat login -- profile: {PROFILE}")
    print(f"Email: {EMAIL} | Model: {MODEL_LABEL}")
    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            str(PROFILE),
            headless=False,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
            viewport={"width": 1366, "height": 900},
        )
        try:
            page = ctx.pages[0] if ctx.pages else ctx.new_page()
            page.goto(CHAT_URL, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            check_blocked(page)
            do_login(page)
            select_model(page)
            reply = send_test_message(page)
            if "QWEN MCP OK" not in reply or reply.strip() == TEST_MESSAGE:
                fail("TEST FAILED: the reply did not contain 'QWEN MCP OK'.")
            print("SEAT LOGIN OK")
        finally:
            ctx.close()


if __name__ == "__main__":
    main()
