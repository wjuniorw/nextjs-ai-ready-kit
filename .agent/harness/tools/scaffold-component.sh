#!/bin/bash
# Tool: scaffold-component
# Cria a anatomia padrão de um componente (index.ts + .tsx + .styles.ts)
#
# Uso:
#   bash .agent/harness/tools/scaffold-component.sh <comp-name> <dest-dir> [tamagui|vanilla]
#
# Exemplos:
#   bash .agent/harness/tools/scaffold-component.sh task-card src/features/task-board/presentation/board/components
#   bash .agent/harness/tools/scaffold-component.sh badge src/core/ui/primitives vanilla

set -e

COMP_NAME=${1:?"Uso: scaffold-component.sh <comp-name> <dest-dir> [tamagui|vanilla]"}
DEST_DIR=${2:?"Informe o diretório destino"}
STYLE_LIB=${3:-"vanilla"}

COMP_DIR="$DEST_DIR/$COMP_NAME"

if [ -d "$COMP_DIR" ]; then
  echo "⚠️  Componente '$COMP_NAME' já existe em $COMP_DIR"
  exit 1
fi

# Converter kebab-case para PascalCase
PASCAL=$(echo "$COMP_NAME" | sed -E 's/(^|-)([a-z])/\U\2/g')

mkdir -p "$COMP_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SCAFFOLD COMPONENT: $PASCAL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# index.ts
cat > "$COMP_DIR/index.ts" << EOF
export { ${PASCAL} } from './${COMP_NAME}'
export type { ${PASCAL}Props } from './${COMP_NAME}'
EOF

# .tsx
cat > "$COMP_DIR/${COMP_NAME}.tsx" << EOF
export type ${PASCAL}Props = {
  // TODO: definir props
}

export const ${PASCAL} = (props: ${PASCAL}Props) => {
  return null // TODO: implementar
}
EOF

# styles
cat > "$COMP_DIR/${COMP_NAME}.css.ts" << EOF
import { style } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'

export const root = style({
  // TODO: estilos
})
EOF
echo "  Estilo: Vanilla Extract (.css.ts)"

echo ""
echo "  Arquivos criados:"
find "$COMP_DIR" -type f | sort | sed 's/^/    /'
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Componente '$PASCAL' scaffolded"
echo "  Próximo: preencha props e implemente o render"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
