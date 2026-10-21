#!/bin/bash
# Pipeline: promote-rc
# Promove uma Release Candidate validada para produção
# Fluxo: validar RC → tag de release → deploy prod (manual) → notifica
#
# Uso: bash .agent/harness/pipeline/promote-rc.sh [rc-tag]
# Exemplo: bash .agent/harness/pipeline/promote-rc.sh v1.2.0-rc.1

set -e

RC_TAG=${1:-""}
HARNESS_DIR=".agent/harness"
LOG_DIR="$HARNESS_DIR/logs"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p "$LOG_DIR"

print_header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

if [ -z "$RC_TAG" ]; then
  echo ""
  echo "  RCs disponíveis:"
  git tag --list 'v*-rc.*' --sort=-version:refname | head -5 | sed 's/^/    /'
  echo ""
  echo "  Uso: bash .agent/harness/pipeline/promote-rc.sh [rc-tag]"
  exit 1
fi

# Verificar se a tag RC existe
if ! git tag --list | grep -q "^${RC_TAG}$"; then
  echo "❌ Tag não encontrada: $RC_TAG"
  exit 1
fi

# Extrair versão de release a partir da RC
# v1.2.0-rc.1 → v1.2.0
RELEASE_TAG=$(echo "$RC_TAG" | sed 's/-rc\.[0-9]*//')

COMMIT=$(git rev-list -n 1 "$RC_TAG")
COMMIT_SHORT=$(git rev-parse --short "$COMMIT")
AUTHOR=$(git log -1 --pretty=%an "$COMMIT")

print_header "PIPELINE: promote-rc"
echo "  RC:      $RC_TAG"
echo "  Release: $RELEASE_TAG"
echo "  Commit:  $COMMIT_SHORT"
echo "  Autor:   $AUTHOR"

# ─────────────────────────────────────────
# CHECKPOINT HUMANO — deploy em produção
# ─────────────────────────────────────────
echo ""
echo "  Commits nesta release:"
PREV_RELEASE=$(git tag --list 'v*' --sort=-version:refname | grep -v '\-rc\.' | head -2 | tail -1)
git log "${PREV_RELEASE}..${RC_TAG}" --oneline 2>/dev/null | sed 's/^/    /' || \
  git log "$RC_TAG" --oneline -10 | sed 's/^/    /'
echo ""

print_header "⛔ CHECKPOINT HUMANO — PRODUÇÃO"
echo ""
echo "  RC validada em staging? Esta ação faz deploy em PRODUÇÃO."
echo ""
echo "  RC:      $RC_TAG"
echo "  Release: $RELEASE_TAG"
echo ""
read -p "  Digite '$RELEASE_TAG' para confirmar: " CONFIRM

if [ "$CONFIRM" != "$RELEASE_TAG" ]; then
  echo ""
  echo "  Confirmação incorreta. Deploy cancelado."
  exit 0
fi

# ─────────────────────────────────────────
# ETAPA 1 — Tag de release
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 1 — Tag de release"

RELEASE_MSG="Release $RELEASE_TAG

Promovido de: $RC_TAG
Commits incluídos:
$(git log "${PREV_RELEASE}..${RC_TAG}" --oneline 2>/dev/null || git log "$RC_TAG" --oneline -10)"

git tag -a "$RELEASE_TAG" "$COMMIT" -m "$RELEASE_MSG"
git push origin "$RELEASE_TAG"
echo "  ✅ Tag publicada: $RELEASE_TAG"

# ─────────────────────────────────────────
# ETAPA 2 — Deploy produção
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 2 — Deploy produção"

if [ -n "$DEPLOY_WEBHOOK_URL_PROD" ]; then
  curl -s -X POST "$DEPLOY_WEBHOOK_URL_PROD" \
    -H "Authorization: Bearer $DEPLOY_TOKEN_PROD" \
    -H "Content-Type: application/json" \
    -d "{\"environment\": \"production\", \"tag\": \"$RELEASE_TAG\", \"commit\": \"$COMMIT_SHORT\"}" \
    > /dev/null
  echo "  ✅ Deploy disparado em produção"
else
  echo "  ⚠️  DEPLOY_WEBHOOK_URL_PROD não configurado"
  echo "     Configure ou faça o deploy manualmente pelo painel do provider"
fi

# ─────────────────────────────────────────
# ETAPA 3 — Notificação Telegram
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 3 — Notificação Telegram"

if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  COMMITS_LIST=$(git log "${PREV_RELEASE}..${RC_TAG}" --pretty="• %s" 2>/dev/null | head -10 || echo "• (sem commits anteriores)")

  MESSAGE="🎉 *Release em produção*

*Versão:* \`$RELEASE_TAG\`
*Promovida de:* \`$RC_TAG\`
*Commit:* \`$COMMIT_SHORT\`
*Autor:* $AUTHOR

*O que há de novo:*
$COMMITS_LIST"

  TOPIC_PARAM=""
  [ -n "$TELEGRAM_TOPIC_ID" ] && TOPIC_PARAM="-d message_thread_id=$TELEGRAM_TOPIC_ID"

  curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
    -d "chat_id=$TELEGRAM_CHAT_ID" \
    $TOPIC_PARAM \
    -d "parse_mode=Markdown" \
    -d "text=$MESSAGE" > /dev/null

  echo "  ✅ Notificação enviada no Telegram"
fi

# ─────────────────────────────────────────
print_header "🎉 RELEASE $RELEASE_TAG EM PRODUÇÃO"
echo ""
