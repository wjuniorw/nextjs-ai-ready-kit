#!/bin/bash
# Tool: scaffold-feature
# Cria a estrutura de pastas e arquivos stub de uma feature completa.
#
# Uso:
#   bash .agent/harness/tools/scaffold-feature.sh <feature-name> [slice1,slice2]
#
# Exemplo:
#   bash .agent/harness/tools/scaffold-feature.sh task-board board,detail

set -e

FEATURE=${1:?"Uso: scaffold-feature.sh <feature-name> [slice1,slice2]"}
SLICES=${2:-""}
BASE="src/features/$FEATURE"

if [ -d "$BASE" ]; then
  echo "⚠️  Feature '$FEATURE' já existe em $BASE"
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SCAFFOLD FEATURE: $FEATURE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Domain
mkdir -p "$BASE/domain/entities"
mkdir -p "$BASE/domain/repositories"
mkdir -p "$BASE/domain/value-objects"

cat > "$BASE/domain/value-objects/index.ts" << 'EOF'
EOF

# Application
mkdir -p "$BASE/application/dtos"
mkdir -p "$BASE/application/use-cases"

cat > "$BASE/application/dtos/index.ts" << 'EOF'
EOF

cat > "$BASE/application/use-cases/index.ts" << 'EOF'
EOF

# Infra
mkdir -p "$BASE/infra/factories"
mkdir -p "$BASE/infra/repositories"

cat > "$BASE/infra/factories/index.ts" << 'EOF'
EOF

# Presentation
mkdir -p "$BASE/presentation/actions"
mkdir -p "$BASE/presentation/containers"
mkdir -p "$BASE/presentation/contexts"
mkdir -p "$BASE/presentation/stores"
mkdir -p "$BASE/presentation/components"

cat > "$BASE/presentation/index.ts" << 'EOF'
EOF

# Slices
if [ -n "$SLICES" ]; then
  IFS=',' read -ra SLICE_ARR <<< "$SLICES"
  for SLICE in "${SLICE_ARR[@]}"; do
    SLICE=$(echo "$SLICE" | xargs) # trim
    mkdir -p "$BASE/presentation/$SLICE/components"
    mkdir -p "$BASE/presentation/$SLICE/view-models"
    echo "  ✅ Slice: $SLICE"
  done
fi

echo ""
echo "  Estrutura criada:"
find "$BASE" -type f | sort | sed 's/^/    /'
echo ""
echo "  Pastas criadas:"
find "$BASE" -type d | sort | sed 's/^/    /'
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Feature '$FEATURE' scaffolded"
echo "  Próximo: preencha domain/entities e domain/repositories"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
