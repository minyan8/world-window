#!/bin/zsh

set -euo pipefail

PROJECT_DIR="/Users/minyan/Documents/finance_test"
PORT="4173"
PID_FILE="$PROJECT_DIR/.world_window_server.pid"
LOG_FILE="$PROJECT_DIR/.world_window_server.log"
URL="http://127.0.0.1:$PORT/"

cd "$PROJECT_DIR"

is_running() {
  local pid="$1"
  if [[ -z "$pid" ]]; then
    return 1
  fi

  kill -0 "$pid" >/dev/null 2>&1
}

port_pid() {
  lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | head -n 1
}

if [[ -f "$PID_FILE" ]]; then
  existing_pid="$(cat "$PID_FILE" 2>/dev/null || true)"
  if is_running "$existing_pid"; then
    echo "World Window is already running at $URL"
    open "$URL"
    exit 0
  fi
fi

listening_pid="$(port_pid || true)"
if is_running "${listening_pid:-}"; then
  echo "$listening_pid" >"$PID_FILE"
  echo "World Window is already running at $URL"
  open "$URL"
  exit 0
fi

nohup python3 -m http.server "$PORT" >"$LOG_FILE" 2>&1 &
server_pid="$!"
echo "$server_pid" >"$PID_FILE"

sleep 1

if is_running "$server_pid"; then
  echo "World Window started at $URL"
  open "$URL"
else
  echo "World Window could not start. Check $LOG_FILE for details."
  exit 1
fi
