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

DIST_DIR="$ROOT_DIR/dist/pwa"
if [[ ! -s "$DIST_DIR/index.html" ]]; then
  echo "Build output is missing: $DIST_DIR/index.html" >&2
  exit 1
fi

DEPLOY_DIR="$(mktemp -d "$ROOT_DIR/.deploy.XXXXXX")"
trap 'rm -rf "$DEPLOY_DIR"' EXIT

git clone --branch deploy_dev git@github.com:hugoofilipe/huna-site.git "$DEPLOY_DIR/repo"
REPO_DIR="$DEPLOY_DIR/repo"

# Replace the published files, but preserve the clone's .git directory.
find "$REPO_DIR" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf -- {} +
cp -R "$DIST_DIR/." "$REPO_DIR/"

cd "$REPO_DIR"
git add --all
if git diff --cached --quiet; then
  echo "Deployment branch already matches the PWA build; nothing to publish."
  exit 0
fi

git commit -m 'Deploy PWA build'
git push origin deploy_dev
