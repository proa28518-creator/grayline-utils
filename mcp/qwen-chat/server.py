#!/usr/bin/env python3
"""ask_qwen MCP server (stdio) — wraps Qwen Chat (no API) via driver.py.

Tools:
  ask_qwen(prompt)  -> Qwen 4.0 Max's answer text, or a clear error
                       (LOGIN_NEEDED_OR_UI_CHANGED means: owner must sign in
                       again by hand, or selectors need recalibration).

Run:  python3 server.py        (speaks MCP over stdio)
Deps: mcp, playwright (+ a Chromium build: playwright install chromium)
"""
import asyncio
import json
import os
import subprocess
import sys

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool

HERE = os.path.dirname(os.path.abspath(__file__))
server = Server("qwen-chat")


@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="ask_qwen",
            description=(
                "Ask Qwen 4.0 Max (via its web chat, driven in a browser) a "
                "question and return its answer. One question at a time; "
                "expect tens of seconds. Use for consults and second opinions."
            ),
            inputSchema={
                type_: None for type_ in ()
            } if False else {
                "type": "object",
                "properties": {
                    "prompt": {"type": "string",
                               "description": "The full question for Qwen."}
                },
                "required": ["prompt"],
            },
        )
    ]


@server.call_tool()
async def call_tool(name, arguments):
    if name != "ask_qwen":
        return [TextContent(type="text", text=f"unknown tool: {name}")]
    prompt = (arguments or {}).get("prompt", "").strip()
    if not prompt:
        return [TextContent(type="text", text="error: empty prompt")]
    proc = await asyncio.create_subprocess_exec(
        sys.executable, os.path.join(HERE, "driver.py"), "ask", prompt,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    )
    try:
        out, err = await asyncio.wait_for(proc.communicate(), timeout=420)
    except asyncio.TimeoutError:
        proc.kill()
        return [TextContent(type="text",
                            text="error: qwen timed out (420s)")]
    try:
        data = json.loads(out.decode() or "{}")
    except json.JSONDecodeError:
        return [TextContent(type="text",
                            text=f"error: driver output unparsable: "
                                 f"{(err or b'').decode()[:300]}")]
    if data.get("ok"):
        return [TextContent(type="text", text=data.get("answer", ""))]
    return [TextContent(type="text",
                        text=f"error: {data.get('error', 'unknown')} — "
                             f"{data.get('detail', '')}")]


async def main():
    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())
