#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4173}"

start_server() {
  echo "[deploy] Starting static server on :${PORT}"
  python3 -m http.server "${PORT}" --bind 0.0.0.0 >/tmp/clawdbot-http.log 2>&1 &
  echo $! >/tmp/clawdbot-http.pid
  sleep 1
}

cleanup() {
  if [[ -f /tmp/clawdbot-http.pid ]]; then
    kill "$(cat /tmp/clawdbot-http.pid)" >/dev/null 2>&1 || true
    rm -f /tmp/clawdbot-http.pid
  fi
}

trap cleanup EXIT

start_server

echo "[deploy] Trying Cloudflare quick tunnel (no login required)"
if command -v cloudflared >/dev/null 2>&1; then
  cloudflared tunnel --url "http://127.0.0.1:${PORT}"
  exit 0
fi

echo "[deploy] cloudflared not found; trying localtunnel"
if command -v npx >/dev/null 2>&1; then
  npx --yes localtunnel --port "${PORT}" --host https://loca.lt
  exit 0
fi

echo "[deploy] No tunnel tool available. Install cloudflared or node/npm for localtunnel." >&2
exit 1
