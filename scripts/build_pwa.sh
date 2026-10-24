#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# This legacy Quasar/Webpack toolchain requires OpenSSL's legacy provider on
# newer Node.js versions. Preserve any options already set by the caller.
if [[ "${NODE_OPTIONS:-}" != *"--openssl-legacy-provider"* ]]; then
  export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--openssl-legacy-provider"
fi

"$ROOT_DIR/node_modules/.bin/quasar" build -m pwa
