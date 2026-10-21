# Convenção de Commits

## Padrão de Mensagens de Commit

Este projeto segue uma convenção de commits baseada no [Conventional Commits](https://www.conventionalcommits.org/), que facilita a leitura do histórico de commits e permite a geração automática de changelogs.

### Formato

```
<tipo>(<escopo>): <descrição>

[corpo]

[rodapé]
```

### Tipos

- **feat**: Uma nova funcionalidade
- **fix**: Correção de um bug
- **docs**: Alterações na documentação
- **style**: Alterações que não afetam o significado do código (espaços em branco, formatação, etc)
- **refactor**: Alteração de código que não corrige um bug nem adiciona uma funcionalidade
- **perf**: Alteração de código que melhora o desempenho
- **test**: Adição ou correção de testes
- **build**: Alterações que afetam o sistema de build ou dependências externas
- **ci**: Alterações nos arquivos de configuração de CI/CD
- **chore**: Outras alterações que não modificam arquivos de src ou test

### Escopo

O escopo é opcional e deve indicar a parte do código que está sendo alterada. Exemplos:

- **auth**: Alterações relacionadas à autenticação
- **users**: Alterações no módulo de usuários
- **projects**: Alterações no módulo de projetos
- **api**: Alterações gerais na API
- **db**: Alterações relacionadas ao banco de dados

### Exemplos

```
feat(auth): implementa autenticação com JWT
```

```
fix(users): corrige validação de email no cadastro
```

```
docs: atualiza README com instruções de instalação
```

```
refactor(projects): simplifica lógica de criação de projetos
```

```
test(api): adiciona testes para endpoints de autenticação
```

### Commits de Breaking Changes

Para commits que introduzem mudanças incompatíveis, adicione `BREAKING CHANGE:` no corpo ou rodapé do commit:

```
feat(api): altera formato de resposta dos endpoints

BREAKING CHANGE: A estrutura de resposta da API foi alterada para seguir o padrão JSON:API
```

Alternativamente, você pode adicionar um `!` após o tipo/escopo:

```
feat(api)!: altera formato de resposta dos endpoints
```

### Recomendações Gerais

1. Use o tempo presente ("adiciona", não "adicionado") ou "adding" quando em ingles
2. A primeira linha deve ter no máximo 72 caracteres
3. Descreva o que a alteração faz, não como ela foi feita
4. Seja específico e claro
5. Referencie issues e pull requests quando relevante

Esta convenção ajudará a manter o histórico de commits organizado e facilitará a compreensão das alterações realizadas no projeto ao longo do tempo.
