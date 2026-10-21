#!/bin/bash
# Tool: feature-flag
# Toggle de feature flags via CLI — útil em trunk based development
# Permite ligar/desligar flags sem abrir o painel admin
#
# Uso:
#   bash .agent/harness/tools/feature-flag.sh list
#   bash .agent/harness/tools/feature-flag.sh enable  new-diagram-engine
#   bash .agent/harness/tools/feature-flag.sh disable new-diagram-engine
#   bash .agent/harness/tools/feature-flag.sh status  new-diagram-engine
#
# Pré-requisito: API_BASE_URL e API_TOKEN configurados no ambiente
# (ou adapte para chamar diretamente o MongoDB se preferir)

set -e

CMD=${1:-"list"}
FLAG_KEY=${2:-""}
API_BASE=${API_BASE_URL:-"http://localhost:3000/api"}
TOKEN=${API_TOKEN:-""}

print_header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  FEATURE FLAGS — $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

auth_header() {
  [ -n "$TOKEN" ] && echo "-H Authorization: Bearer $TOKEN" || echo ""
}

case $CMD in
  list)
    print_header "LIST"
    echo ""
    curl -s $(auth_header) "$API_BASE/admin/flags" | \
      python3 -c "
import sys, json
data = json.load(sys.stdin)
flags = data.get('flags', data) if isinstance(data, dict) else data
print(f'  {'KEY':<40} {'CATEGORY':<12} {'STATUS':<12} {'ENABLED'}')
print(f'  {'-'*40} {'-'*12} {'-'*12} {'-'*8}')
for f in flags:
    key = f.get('key', '')[:40]
    cat = f.get('category', '')[:12]
    status = f.get('status', '')[:12]
    enabled = '✅' if f.get('enabled') else '❌'
    print(f'  {key:<40} {cat:<12} {status:<12} {enabled}')
print()
"
    ;;

  status)
    [ -z "$FLAG_KEY" ] && { echo "Uso: feature-flag.sh status [key]"; exit 1; }
    print_header "STATUS: $FLAG_KEY"
    echo ""
    curl -s $(auth_header) "$API_BASE/admin/flags/$FLAG_KEY" | \
      python3 -c "
import sys, json
f = json.load(sys.stdin)
enabled = '✅ habilitada' if f.get('enabled') else '❌ desabilitada'
print(f'  Key:         {f.get(\"key\")}')
print(f'  Status:      {f.get(\"status\")}')
print(f'  Categoria:   {f.get(\"category\")}')
print(f'  Ambiente:    {f.get(\"environment\")}')
print(f'  Enabled:     {enabled}')
print(f'  Atualizado:  {f.get(\"updatedAt\")}')
print(f'  Atualizado por: {f.get(\"updatedBy\")}')
"
    echo ""
    ;;

  enable)
    [ -z "$FLAG_KEY" ] && { echo "Uso: feature-flag.sh enable [key]"; exit 1; }
    print_header "ENABLE: $FLAG_KEY"
    echo ""

    # Buscar o ID da flag pelo key
    FLAG_ID=$(curl -s $(auth_header) "$API_BASE/admin/flags/$FLAG_KEY" | \
      python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))")

    [ -z "$FLAG_ID" ] && { echo "  ❌ Flag não encontrada: $FLAG_KEY"; exit 1; }

    read -p "  Habilitar '$FLAG_KEY'? [s/N] " CONFIRM
    [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ] && exit 0

    curl -s -X PATCH $(auth_header) \
      -H "Content-Type: application/json" \
      -d "{\"enabled\": true}" \
      "$API_BASE/admin/flags/$FLAG_ID/toggle" > /dev/null

    echo "  ✅ Flag habilitada: $FLAG_KEY"
    echo "     Cache invalidado via updateTag — próximo request já usa novo estado"
    echo ""
    ;;

  disable)
    [ -z "$FLAG_KEY" ] && { echo "Uso: feature-flag.sh disable [key]"; exit 1; }
    print_header "DISABLE: $FLAG_KEY"
    echo ""

    FLAG_ID=$(curl -s $(auth_header) "$API_BASE/admin/flags/$FLAG_KEY" | \
      python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))")

    [ -z "$FLAG_ID" ] && { echo "  ❌ Flag não encontrada: $FLAG_KEY"; exit 1; }

    read -p "  Desabilitar '$FLAG_KEY'? [s/N] " CONFIRM
    [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ] && exit 0

    curl -s -X PATCH $(auth_header) \
      -H "Content-Type: application/json" \
      -d "{\"enabled\": false}" \
      "$API_BASE/admin/flags/$FLAG_ID/toggle" > /dev/null

    echo "  ✅ Flag desabilitada: $FLAG_KEY"
    echo "     Cache invalidado — feature indisponível no próximo request"
    echo ""
    ;;

  *)
    echo ""
    echo "  Comandos disponíveis:"
    echo "    list               → lista todas as flags"
    echo "    status [key]       → detalhes de uma flag"
    echo "    enable [key]       → habilita uma flag"
    echo "    disable [key]      → desabilita uma flag"
    echo ""
    ;;
esac
