#!/bin/bash
# Tool: scaffold-use-case
# Cria os stubs de um novo use case dentro de uma feature existente.
# Gera: DTO, use case, factory entry. Não sobrescreve arquivos existentes.
#
# Uso:
#   bash .agent/harness/tools/scaffold-use-case.sh <feature-name> <action-name>
#
# Exemplo:
#   bash .agent/harness/tools/scaffold-use-case.sh task-board create-task

set -e

FEATURE=${1:?"Uso: scaffold-use-case.sh <feature-name> <action-name>"}
ACTION=${2:?"Informe o nome da ação em kebab-case (ex: create-task)"}
BASE="src/features/$FEATURE"

if [ ! -d "$BASE" ]; then
  echo "❌ Feature '$FEATURE' não existe em $BASE"
  echo "   Execute scaffold-feature.sh primeiro."
  exit 1
fi

# Converter kebab-case para PascalCase
PASCAL=$(echo "$ACTION" | sed -E 's/(^|-)([a-z])/\U\2/g')
# Converter kebab-case para camelCase
CAMEL=$(echo "$PASCAL" | sed -E 's/^([A-Z])/\L\1/')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SCAFFOLD USE CASE: ${PASCAL}UseCase"
echo "  Feature: $FEATURE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CREATED=()

# DTO
DTO_FILE="$BASE/application/dtos/${ACTION}.dto.ts"
if [ ! -f "$DTO_FILE" ]; then
  cat > "$DTO_FILE" << EOF
import { z } from 'zod'

export const ${PASCAL}Schema = z.object({
  // TODO: campos do schema
})

export type ${PASCAL}Dto = z.infer<typeof ${PASCAL}Schema>
EOF
  CREATED+=("$DTO_FILE")
else
  echo "  ⏭  DTO já existe: $DTO_FILE"
fi

# Use Case
UC_FILE="$BASE/application/use-cases/${ACTION}.use-case.ts"
if [ ! -f "$UC_FILE" ]; then
  cat > "$UC_FILE" << EOF
export class ${PASCAL}UseCase {
  constructor(private readonly repository: any) {} // TODO: tipar com interface do domain

  async execute(dto: any): Promise<any> {
    // TODO: implementar orquestração
    throw new Error('Not implemented')
  }
}
EOF
  CREATED+=("$UC_FILE")
else
  echo "  ⏭  Use case já existe: $UC_FILE"
fi

echo ""
if [ ${#CREATED[@]} -gt 0 ]; then
  echo "  Arquivos criados:"
  for f in "${CREATED[@]}"; do
    echo "    $f"
  done
else
  echo "  Nenhum arquivo novo criado (todos já existiam)."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Use case '${PASCAL}UseCase' scaffolded"
echo "  Próximo:"
echo "    1. Preencha o DTO em $DTO_FILE"
echo "    2. Tipe o repositório em $UC_FILE"
echo "    3. Adicione exports nos index.ts (barrel-updater)"
echo "    4. Crie factory em infra/factories/use-cases.factory.ts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
