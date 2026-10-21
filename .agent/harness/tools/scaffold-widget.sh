#!/bin/bash
# Tool: scaffold-widget
# Cria a estrutura de um Cross-Feature Widget (feature completa + componente raiz público)
#
# Uso:
#   bash .agent/harness/tools/scaffold-widget.sh <widget-name>
#
# Exemplo:
#   bash .agent/harness/tools/scaffold-widget.sh assignees

set -e

WIDGET=${1:?"Uso: scaffold-widget.sh <widget-name>"}
BASE="src/features/$WIDGET"

if [ -d "$BASE" ]; then
  echo "⚠️  Widget '$WIDGET' já existe em $BASE"
  exit 1
fi

PASCAL=$(echo "$WIDGET" | sed -E 's/(^|-)([a-z])/\U\2/g')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SCAFFOLD WIDGET: ${PASCAL}Widget"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Scaffold base feature
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/scaffold-feature.sh" "$WIDGET" "$WIDGET" 2>/dev/null

# Widget-specific: componente raiz público
WIDGET_COMP="$BASE/presentation/components/${WIDGET}-widget"
mkdir -p "$WIDGET_COMP"

cat > "$WIDGET_COMP/index.ts" << EOF
export { ${PASCAL}Widget } from './${WIDGET}-widget'
export type { ${PASCAL}WidgetProps } from './${WIDGET}-widget'
EOF

cat > "$WIDGET_COMP/${WIDGET}-widget.tsx" << EOF
export type ${PASCAL}WidgetProps = {
  entityId: string
}

export const ${PASCAL}Widget = ({ entityId }: ${PASCAL}WidgetProps) => {
  return null // TODO: implementar com ErrorBoundary + Suspense + Container
}
EOF

cat > "$WIDGET_COMP/${WIDGET}-widget.styles.ts" << EOF
// TODO: estilos do widget
EOF

echo ""
echo "  Estrutura widget criada:"
find "$BASE" -type f | sort | sed 's/^/    /'
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Widget '${PASCAL}Widget' scaffolded"
echo "  Próximo:"
echo "    1. Implemente domain e use cases (fetch, add, remove)"
echo "    2. Implemente auto-save no view-model"
echo "    3. Adicione ErrorBoundary + Suspense no componente raiz"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
