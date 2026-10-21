#!/bin/bash
# Helper: sync-api
# Sincroniza o OpenAPI da API com .agent/api/
# Uso: bash .agent/adapters/sync-api.sh [url] [feature?]
#
# Exemplos:
#   bash .agent/adapters/sync-api.sh https://api.seuapp.com/docs/openapi.json
#   bash .agent/adapters/sync-api.sh https://api.seuapp.com/docs/openapi.json notifications

set -e

URL=${1:-""}
FEATURE=${2:-""}
API_DIR=".agent/api/contracts"

if [ -z "$URL" ]; then
  echo "Uso: bash .agent/adapters/sync-api.sh [url] [feature?]"
  echo ""
  echo "Exemplos:"
  echo "  bash .agent/adapters/sync-api.sh https://api.sigapro.com/docs/openapi.json"
  echo "  bash .agent/adapters/sync-api.sh https://api.sigapro.com/docs/openapi.json auth"
  echo "  bash .agent/adapters/sync-api.sh https://hml-api.sigapro.com/docs/openapi.json auth"
  exit 1
fi

mkdir -p "$API_DIR"

if [ -n "$FEATURE" ]; then
  OUTPUT="$API_DIR/$FEATURE.json"
  echo "→ Baixando OpenAPI para feature: $FEATURE..."
else
  OUTPUT="$API_DIR/openapi.json"
  echo "→ Baixando OpenAPI completo..."
fi

curl -s "$URL" -o "$OUTPUT"
echo "✅ Salvo em $OUTPUT"
echo "   $(wc -c < "$OUTPUT") bytes — $(date)"
