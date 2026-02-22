#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$ROOT_DIR/.newsletter_factory.pid"

if [[ ! -f "$PID_FILE" ]]; then
  echo "No PID file found. Nothing to stop."
  exit 0
fi

PID="$(cat "$PID_FILE" 2>/dev/null || true)"
if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then
  kill "$PID" 2>/dev/null || true
  sleep 0.2
  if kill -0 "$PID" 2>/dev/null; then
    kill -9 "$PID" 2>/dev/null || true
  fi
  echo "Stopped server PID $PID"
else
  echo "Process $PID not running."
fi

rm -f "$PID_FILE"
echo "Cleanup complete."
