#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4173}"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$ROOT_DIR/.newsletter_factory.pid"
LOG_FILE="$ROOT_DIR/.newsletter_factory.log"
URL="http://127.0.0.1:${PORT}"

is_healthy() {
  curl -sSf -I --max-time 2 "$URL" >/dev/null 2>&1
}

cleanup_stale_pid() {
  if [[ -f "$PID_FILE" ]]; then
    local pid
    pid="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      if is_healthy; then
        echo "Newsletter Factory already running on PID $pid"
        echo "Open: http://localhost:$PORT"
        exit 0
      fi
      kill "$pid" 2>/dev/null || true
      sleep 0.2
    fi
    rm -f "$PID_FILE"
  fi
}

cd "$ROOT_DIR"
cleanup_stale_pid

nohup python3 -m http.server "$PORT" >"$LOG_FILE" 2>&1 &
PID="$!"
echo "$PID" > "$PID_FILE"

for _ in {1..10}; do
  if is_healthy; then
    echo "Deployed locally."
    echo "URL: http://localhost:$PORT"
    echo "PID: $PID"
    echo "Log: $LOG_FILE"
    exit 0
  fi
  sleep 0.2
done

echo "Failed to start local server on port $PORT"
echo "Check logs: $LOG_FILE"
exit 1
