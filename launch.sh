#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================"
echo "      江湖人生 - Wuxia Life Simulator"
echo "============================================"
echo

# Check node_modules
if [ ! -d "node_modules" ]; then
    echo "[1/4] Installing dependencies..."
    pnpm install
else
    echo "[1/4] Dependencies already installed."
fi

echo "[2/4] Building shared package..."
pnpm --filter @life-restart/shared build

echo "[3/4] Building electron package..."
pnpm --filter @life-restart/electron build

echo "[4/4] Starting application..."
echo
echo "  Vite dev server: http://localhost:5173"
echo "  Electron window will open automatically."
echo

# Kill existing process on port 5173
PORT_PID=$(lsof -ti :5173 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
    kill "$PORT_PID" 2>/dev/null || true
fi

# Start Vite in background
pnpm --filter @life-restart/frontend dev &
VITE_PID=$!

# Wait for Vite to be ready
sleep 3

# Launch Electron
ELECTRON_BIN="node_modules/.pnpm/electron@30.5.1/node_modules/electron/dist/electron"
if [ -f "$ELECTRON_BIN" ]; then
    "$ELECTRON_BIN" packages/electron --no-sandbox &
    ELECTRON_PID=$!
elif command -v electron &> /dev/null; then
    electron packages/electron --no-sandbox &
    ELECTRON_PID=$!
else
    npx electron packages/electron --no-sandbox &
    ELECTRON_PID=$!
fi

echo "============================================"
echo "  Application started!"
echo "  Press Ctrl+C to stop all processes."
echo "============================================"

# Cleanup on exit
cleanup() {
    echo "Stopping..."
    kill "$VITE_PID" 2>/dev/null || true
    kill "$ELECTRON_PID" 2>/dev/null || true
    exit 0
}
trap cleanup INT TERM

# Wait
wait
