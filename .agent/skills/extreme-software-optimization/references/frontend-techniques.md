# Frontend Optimization Techniques

## Tier 1: Low-Hanging Fruit (React)

| Pattern | When to use | Isomorphism |
|---------|-------------|-------------|
| **Zustand Slices** | Context is causing full re-renders | Selectors ensure only dependents re-render |
| **Debounce View-Model** | Rapid inputs triggering API/State | Preserves final state, delays interim renders |
| **Component Split** | Heavy component doing too much | Isolates re-renders to smaller leaves |
| **Dynamic Import** | Large non-critical modal/chart | `next/dynamic` defers bundle loading |

## Tier 2: Next.js & Server

| Pattern | When to use | Check |
|---------|-------------|-------|
| **Image Optimization** | Large LCP images | Switch to `next/image` with proper sizing |
| **`use cache` / Server Actions** | Heavy data processing | Cache responses on the server edge |
| **Parallel Data Fetching** | Sequential `await` in RSC | Use `Promise.all` |
| **Suspense Boundaries** | Slow component blocking page | Wraps slow component, streams UI |

## Tier 3: Advanced UI & CSS

| Structure | Use Case |
|-----------|----------|
| **Virtualization** | Rendering > 100 list items | `useVirtualizer` (TanStack) |
| **CSS transform/opacity** | Animations | Avoids layout thrashing (Reflow) |
| **requestAnimationFrame** | Visual syncing | Defers non-urgent DOM updates |
| **Web Workers** | Heavy client-side processing | Offloads main thread |

## Profiling Tools

- **React Profiler DevTools:** For identifying render times and "why did this render" commits.
- **Next.js Bundle Analyzer:** `@next/bundle-analyzer` to visualize chunks.
- **Chrome Performance Tab:** For Long Tasks and Main Thread blocking.
- **Lighthouse:** For Core Web Vitals (LCP, CLS, TBT, INP).