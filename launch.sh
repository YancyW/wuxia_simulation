#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================"
echo "      江湖人生 - Wuxia Life Simulator"
echo "============================================"
echo

# Install
if [ ! -d "node_modules" ]; then
    echo "[1/5] Installing dependencies..."
    pnpm install
else
    echo "[1/5] Dependencies OK."
fi

# Build
echo "[2/5] Building shared package..."
pnpm --filter @life-restart/shared build

echo "[3/5] Building electron package..."
pnpm --filter @life-restart/electron build

# Rebuild native modules for Electron
echo "[4/5] Rebuilding native modules for Electron..."
npx @electron/rebuild -v 30.5.1 -m packages/electron 2>&1 || echo "[WARN] Some native modules may not work."

echo "[5/5] Starting application..."
echo
echo "  Vite dev server: http://localhost:5173"
echo "  Electron window will open automatically."
echo

# Kill existing Vite
PORT_PID=$(lsof -ti :5173 2>/dev/null || true)
[ -n "$PORT_PID" ] && kill "$PORT_PID" 2>/dev/null || true

# Start Vite
pnpm --filter @life-restart/frontend dev &
VITE_PID=$!
sleep 3

# Find and launch Electron
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

cleanup() {
    echo "Stopping..."
    kill "$VITE_PID" 2>/dev/null || true
    kill "$ELECTRON_PID" 2>/dev/null || true
    exit 0
}
trap cleanup INT TERM

wait
