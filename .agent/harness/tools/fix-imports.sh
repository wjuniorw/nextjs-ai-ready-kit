#!/bin/bash
# Script wrapper to fix relative imports in a feature

FEATURE=$1

if [ -z "$FEATURE" ]; then
  echo "Uso: bash .agent/harness/tools/fix-imports.sh <feature-name>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v bun &> /dev/null; then
  bun "$SCRIPT_DIR/fix-imports.js" "$FEATURE"
else
  node "$SCRIPT_DIR/fix-imports.js" "$FEATURE"
fi
