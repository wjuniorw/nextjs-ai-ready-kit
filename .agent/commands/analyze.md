# Command: /analyze

Invoca o `analyze-worker` para executar análise pós-implementação sobre uma lista explícita de arquivos.

## Uso

```
/analyze [feature] [arquivo1] [arquivo2] ...
```

## Exemplos

```
/analyze auth src/features/auth/domain/entities/user.entity.ts src/features/auth/application/use-cases/signin.use-case.ts

/analyze billing src/features/billing/infra/repositories/invoice.repository.ts src/features/billing/infra/factories/repo.factory.ts
```

## Comportamento

O agente principal DEVE:
1. Coletar a lista de arquivos gerados/modificados na sessão atual
2. Invocar `invoke_subagent(analyze-worker)` passando: `feature` + lista de arquivos
3. Aguardar o relatório do `analyze-worker`
4. Se resultado for `❌ VIOLATION` → não prosseguir com nenhuma outra tarefa até correção confirmada
5. Se resultado for `✅ PASS` → continuar normalmente
