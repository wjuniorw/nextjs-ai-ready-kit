# Token Economy Rules — Consolidated

## Mandatory Reading Hierarchy
```
1. Snapshots (.agent/context/)        ← always prefer
2. Contratos — only of the current feature
3. Knowledge — only when explicitly relevant
4. Real files (src/)              ← last resort
```

## Forbidden Without Explicit Instruction
- ListDir in neighboring features/modules
- Reading contracts of features not mentioned in the spec
- Spawning a sub-agent to "research style consistency"

## If Snapshot Does Not Exist
→ Signal/warn the user — never replace by reading real files

**Rules origin:** ARCH-003 in `LESSONS.md`
