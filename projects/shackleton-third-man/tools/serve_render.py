#!/usr/bin/env python3
"""Static file server with permissive CORS, for the in-browser render harness.
Serves /tmp/render-root (repo + engine symlinks) on 127.0.0.1:8080."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os

os.chdir('/tmp/render-root')

class H(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    def log_message(self, *a):
        pass

ThreadingHTTPServer(('127.0.0.1', 8080), H).serve_forever()
