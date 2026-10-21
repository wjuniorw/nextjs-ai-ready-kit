---
name: extreme-software-optimization
description: Profile-driven performance optimization for React/Next.js. Use for fixing slow renders, hydration bottlenecks, bundle size issues, and layout thrashing.
---

# extreme-software-optimization

> **The One Rule:** Profile first. Prove behavior unchanged. One change at a time.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `../../rules/presentation.md` | Context vs Store guidelines, Debouncing |
| `references/frontend-techniques.md` | React/Next.js specific optimization patterns |

## The Loop

```
1. BASELINE    → Lighthouse / React Profiler / Next.js Bundle Analyzer
2. PROFILE     → Identify the exact component or hook causing the drop
3. PROVE       → Visual and functional isomorphism proof per change
4. IMPLEMENT   → Apply one lever (e.g., useMemo, dynamic import, Zustand slice)
5. VERIFY      → Confirm metrics improved without breaking UX
6. REPEAT      → Re-profile (bottlenecks shift)
```

## Frontend Opportunity Matrix

| Hotspot | Impact (1-5) | Confidence (1-5) | Effort (1-5) | Score |
|---------|--------------|------------------|--------------|-------|
| *Component/Hook* | × | × | ÷ | Impact×Conf/Effort |

**Rule:** Only implement Score ≥ 2.0

## Isomorphism Proof Template

For EVERY change, document:
```
## Change: [description]
- Visual layout preserved:   [yes/no + why]
- Interactive state intact:  [yes/no + why]
- Hydration mismatch risk:   [none/mitigated]
- Accessibility unchanged:   [yes/no]
- Metric improvement:        [e.g., TTI down by 200ms]
```

## Anti-Patterns (Never Do)

- Optimize without profiling (guessing what is slow).
- Multiple changes per commit.
- Wrap everything in `useMemo`/`useCallback` blindly (memory overhead).
- Move high-frequency state into Context (causes full tree re-renders).

## Output

1. Profiling baseline (before)
2. Isomorphism proof
3. Code changes applied
4. New metrics (after)