# Phase 1: Foundation - Research

**Researched:** 2026-03-26
**Domain:** Vite + React SPA build infrastructure, Base44 SDK removal, shadcn/ui component system
**Confidence:** HIGH

## Summary

Phase 1 requires transforming a non-functional Base44-platform app into a standalone Vite + React SPA. The project currently cannot compile due to four categories of issues: (1) missing `vite.config.js` (Base44 injected config at build time), (2) broken import chains referencing non-existent modules (`@/api/base44Client`, `./pages/Home`, `@/components/UserNotRegisteredError`), (3) empty stub files for critical utilities (`utils.js`, `query-client.js`), and (4) the entire auth layer depending on Base44 SDK.

The restaurant section components (10 files in `src/components/restaurant/`) are fully built with Framer Motion animations and have no Base44 SDK imports -- only CDN image URLs reference `media.base44.com`, which is out of scope for Phase 1. The shadcn/ui component layer has a critical bug: `toast.jsx` contains `Textarea` component code instead of Toast components, which will cause the `Toaster` import in `App.jsx` to fail at runtime.

**Primary recommendation:** Delete the entire auth layer (AuthContext.jsx, app-param.js), rewrite App.jsx to render routes directly, create vite.config.js with React plugin and `@/*` alias, populate utils.js with `cn()`, populate query-client.js with a QueryClient instance, fix toast.jsx, and create a minimal Home.jsx page.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Complete removal of the auth layer -- delete `AuthContext.jsx`, `app-param.js`, all auth imports, and the `AuthenticatedApp` wrapper. `App.jsx` renders `<Routes>` directly with no auth gating. This is a public restaurant site; no auth is needed.
- **D-02:** Remove `@base44/sdk` and `@base44/vite-plugin` from `package.json` entirely. Clean break -- no Base44 artifacts remain anywhere in the project.
- **D-03:** Rewrite `PageNotFound.jsx` as a simple static 404 page (remove the base44Client auth check). No redirect -- keep it as a proper 404.
- **D-04:** Defer `index.html` branding updates (title, favicon) to Phase 3 (Content). Phase 1 focuses strictly on compilation.

### Claude's Discretion
- 404 page design: Claude picks the best static 404 approach (simple "Page not found" with link home).
- Provider stack: Whether to keep `QueryClientProvider` or strip it is at Claude's discretion -- optimize for what makes Phase 2 easier.
- shadcn/ui component scope: Populate only the components actually imported by `App.jsx` and restaurant sections (at minimum: `toaster.jsx`, `use-toast.jsx`, plus any others referenced in restaurant components). Don't populate all 48 stubs.
- What renders after Phase 1: At minimum the app shows a blank page or basic shell without errors. If restaurant sections happen to render because `Home.jsx` is created, that's fine but not required by Phase 1 success criteria.

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BUILD-01 | App compiles and runs in dev mode (`npm run dev` succeeds) | Requires vite.config.js creation, fixing all broken imports, populating empty stubs |
| BUILD-02 | `vite.config.js` exists with React plugin and `@/*` path alias | Standard Vite + React config pattern documented in Architecture Patterns section |
| BUILD-04 | `src/lib/utils.js` exports `cn()` utility | Standard shadcn/ui `cn()` pattern using clsx + tailwind-merge documented in Code Examples |
| BUILD-05 | `src/lib/query-client.js` exports a configured QueryClient instance | Standard TanStack Query pattern documented in Code Examples |
| AUTH-01 | Base44 SDK auth gating removed from App.jsx -- app renders without login | Requires deleting AuthenticatedApp wrapper, AuthProvider, rewriting App.jsx |
| AUTH-02 | AuthProvider/AuthContext stripped or replaced with a no-op wrapper | Decision D-01: complete deletion, not replacement. Delete AuthContext.jsx entirely |
| AUTH-03 | All `base44Client` import references removed or stubbed | Three files reference it: App.jsx, AuthContext.jsx, PageNotFound.jsx. Auth files deleted; PageNotFound rewritten |
| AUTH-04 | `app-param.js` / `app-params.js` import mismatch fixed | Decision D-01: delete app-param.js entirely (only consumer was AuthContext.jsx, also being deleted) |
</phase_requirements>

## Standard Stack

### Core (already in package.json -- keep these)
| Library | Version in package.json | Purpose | Why Standard |
|---------|------------------------|---------|--------------|
| react | ^18.2.0 | UI framework | Project foundation |
| react-dom | ^18.2.0 | DOM rendering | Required by React |
| react-router-dom | ^6.26.0 | Client-side routing | Already configured in App.jsx |
| vite | ^6.1.0 (devDep) | Dev server and bundler | Already in devDeps |
| @vitejs/plugin-react | ^4.3.4 (devDep) | React fast refresh | Already in devDeps |
| @tanstack/react-query | ^5.84.1 | Server-state caching | Already used; keep for Phase 2 |
| clsx | ^2.1.1 | Conditional class construction | Required by cn() utility |
| tailwind-merge | ^3.0.2 | Tailwind class merging | Required by cn() utility |
| class-variance-authority | ^0.7.1 | Variant management | Used by button.jsx and other shadcn components |
| framer-motion | ^11.16.4 | Animations | Used by all restaurant components |
| lucide-react | ^0.475.0 | Icons | Used in carousel, navigation, dialog |
| embla-carousel-react | ^8.5.2 | Carousel engine | Used by carousel.jsx |
| tailwindcss | ^3.4.17 (devDep) | Utility CSS | Project styling foundation |

### Remove from package.json (D-02)
| Package | Reason |
|---------|--------|
| `@base44/sdk` | Base44 platform SDK -- the primary thing being removed |
| `@base44/vite-plugin` | Base44 build integration -- no longer needed |

### Keep but unused (defer cleanup to Phase 3 DEPLOY-02)
All other unused packages (Stripe, three.js, jspdf, react-quill, moment, lodash, etc.) are out of Phase 1 scope. Phase 1 focuses on compilation, not dependency cleanup.

## Architecture Patterns

### Post-Phase-1 Project Structure
```
src/
├── App.jsx                    # Root: Router + Routes (no auth wrapping)
├── main.jsx                   # Entry: renders <App /> into DOM
├── index.css                  # Global styles (already populated)
├── components/
│   ├── restaurant/            # 10 section components (unchanged)
│   └── ui/                    # shadcn/ui primitives (fix toast.jsx, keep populated ones)
├── hooks/
│   └── use-mobile.jsx         # Viewport breakpoint hook (unchanged)
├── lib/
│   ├── utils.js               # cn() utility (populate)
│   ├── query-client.js        # QueryClient instance (populate)
│   └── PageNotFound.jsx       # Simple static 404 (rewrite)
├── pages/
│   └── Home.jsx               # Composes restaurant sections (create)
```

### Files to DELETE
```
src/lib/AuthContext.jsx         # Entire file (Base44 auth context)
src/lib/app-param.js            # Entire file (Base44 token/param handling)
```

### Files to CREATE
```
vite.config.js                  # Vite config with React plugin + @/* alias
src/pages/Home.jsx              # Page assembling restaurant sections
```

### Files to MODIFY
```
src/App.jsx                     # Remove auth gating, simplify to Router + Routes + Toaster
package.json                    # Remove @base44/sdk, @base44/vite-plugin
postcss.config.js               # Populate with tailwindcss + autoprefixer plugins
```

### Files to FIX
```
src/components/ui/toast.jsx     # CRITICAL: Contains Textarea code, needs actual Toast component
src/lib/utils.js                # Empty, needs cn() function
src/lib/query-client.js         # Empty, needs QueryClient instance
src/lib/PageNotFound.jsx        # Rewrite to static 404 (remove base44 imports)
```

### Pattern: Simplified App.jsx (post-Phase-1)
```jsx
// No auth provider, no auth gating
// QueryClientProvider kept for Phase 2 convenience
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PageNotFound from '@/lib/PageNotFound'
import Home from './pages/Home'

function App() {
    return (
        <QueryClientProvider client={queryClientInstance}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Router>
            <Toaster />
        </QueryClientProvider>
    )
}

export default App
```

### Anti-Patterns to Avoid
- **Do not create a no-op AuthProvider wrapper:** Decision D-01 says complete removal, not replacement. Resist the temptation to create a stub.
- **Do not populate all 48 shadcn/ui stubs:** Only fix the ones that are actually imported. Empty files that are never imported are harmless to compilation.
- **Do not modify restaurant components:** They have no Base44 SDK imports. The `media.base44.com` image URLs are content, not SDK references -- they are deferred to Phase 3.
- **Do not touch index.html branding:** D-04 explicitly defers this to Phase 3.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class name merging | Custom string concatenation | `cn()` with clsx + tailwind-merge | Tailwind class conflicts are subtle; hand-rolled merging creates visual bugs |
| Toast notifications | Custom toast system | shadcn/ui toast (Radix-based) | Already wired in App.jsx; toaster.jsx and use-toast.jsx are populated and working |
| Vite path aliases | Webpack-style resolve | `vite.config.js` `resolve.alias` | Must match jsconfig.json `@/*` alias exactly |
| 404 page | Complex routing logic | Simple component with link home | Decision D-03: static page, no auth check |

## Common Pitfalls

### Pitfall 1: toast.jsx Contains Wrong Component Code
**What goes wrong:** `toaster.jsx` imports `Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport` from `toast.jsx`, but `toast.jsx` actually exports `Textarea`. The app will crash at runtime.
**Why it happens:** The Base44 platform scaffold appears to have written the wrong content to this file.
**How to avoid:** Replace `toast.jsx` content with the correct Radix-based Toast component code (using `@radix-ui/react-toast` which is already in package.json).
**Warning signs:** `Toaster` renders but shows no toasts; or import errors about undefined exports.

### Pitfall 2: postcss.config.js is Empty
**What goes wrong:** Tailwind CSS directives in `index.css` (`@tailwind base; @tailwind components; @tailwind utilities;`) will not be processed. The entire site will have no styling.
**Why it happens:** The file exists but has zero content. PostCSS needs `tailwindcss` and `autoprefixer` plugins configured.
**How to avoid:** Populate `postcss.config.js` with standard Tailwind PostCSS config.
**Warning signs:** Dev server starts but page has no styling at all.

### Pitfall 3: Vite Path Alias Must Match jsconfig.json
**What goes wrong:** If `vite.config.js` alias for `@` doesn't resolve to the same path as jsconfig.json, imports work in IDE but fail at build time (or vice versa).
**Why it happens:** Vite and the editor use different resolution mechanisms.
**How to avoid:** Use `path.resolve(__dirname, './src')` in vite.config.js, matching jsconfig.json's `"@/*": ["./src/*"]`.
**Warning signs:** Import resolution errors that only appear during `vite build` but not in the IDE.

### Pitfall 4: Forgetting to Remove All Auth Imports
**What goes wrong:** Deleting AuthContext.jsx but leaving its import in App.jsx causes a module-not-found build error.
**Why it happens:** Multiple files reference the auth layer: App.jsx imports AuthProvider + useAuth, App.jsx imports UserNotRegisteredError.
**How to avoid:** After deleting auth files, grep for all remaining references: `AuthContext`, `AuthProvider`, `useAuth`, `base44Client`, `base44`, `UserNotRegisteredError`, `app-param`.
**Warning signs:** `vite build` fails with "module not found" errors.

### Pitfall 5: QueryClient Export Name Mismatch
**What goes wrong:** App.jsx imports `{ queryClientInstance }` from `@/lib/query-client`. If the populated file exports a different name (e.g., `queryClient`), the import will be `undefined` and `QueryClientProvider` will throw.
**Why it happens:** TanStack Query tutorials often name the export `queryClient`, not `queryClientInstance`.
**How to avoid:** Match the exact export name already used in App.jsx: `export const queryClientInstance = new QueryClient()`.
**Warning signs:** Runtime error "No QueryClient set, use QueryClientProvider" or similar.

### Pitfall 6: Toaster Must Be Inside Router Scope or Outside It Consistently
**What goes wrong:** The current App.jsx places `<Toaster />` outside `<Router>` but inside `QueryClientProvider`. This is fine. If someone moves it inside `<Routes>`, it will unmount on route changes.
**How to avoid:** Keep `<Toaster />` at the same level as `<Router>`, not inside `<Routes>`.
**Warning signs:** Toast notifications disappear on navigation.

## Code Examples

### vite.config.js (BUILD-02)
```javascript
// Source: Vite official docs + shadcn/ui manual install guide
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
```

### src/lib/utils.js (BUILD-04)
```javascript
// Source: shadcn/ui manual installation guide
// https://ui.shadcn.com/docs/installation/manual
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
```

### src/lib/query-client.js (BUILD-05)
```javascript
// Source: TanStack Query docs
// Export name MUST match App.jsx import: queryClientInstance
import { QueryClient } from '@tanstack/react-query'

export const queryClientInstance = new QueryClient()
```

### postcss.config.js (required for Tailwind to work)
```javascript
// Source: Tailwind CSS installation guide for Vite
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
}
```

### src/lib/PageNotFound.jsx (AUTH-03, D-03)
```jsx
// Simple static 404 -- no auth, no query, just JSX
export default function PageNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <div className="max-w-md w-full text-center space-y-6">
                <h1 className="text-7xl font-light text-muted-foreground font-display">404</h1>
                <div className="h-0.5 w-16 bg-border mx-auto"></div>
                <h2 className="text-2xl font-medium text-foreground font-display">
                    Page Not Found
                </h2>
                <p className="text-muted-foreground font-body">
                    The page you are looking for does not exist.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-background border border-border hover:bg-secondary transition-colors duration-200"
                >
                    Go Home
                </a>
            </div>
        </div>
    )
}
```

### src/components/ui/toast.jsx (fix -- current content is Textarea, not Toast)
The file must export: `Toast`, `ToastClose`, `ToastDescription`, `ToastProvider`, `ToastTitle`, `ToastViewport`, `ToastAction`. It is built on `@radix-ui/react-toast` (already in package.json as `^1.2.2`) and uses `class-variance-authority` for variant support. The `toaster.jsx` file (which is correctly populated) imports these exact named exports.

Standard shadcn/ui new-york style toast pattern:
- Wraps Radix `@radix-ui/react-toast` primitives
- Uses `cva` for `default` and `destructive` variants
- Exports: `ToastProvider` (Radix Provider), `ToastViewport` (positioned container), `Toast` (main component with variants), `ToastAction` (action button), `ToastClose` (dismiss X button), `ToastTitle`, `ToastDescription`
- Depends on: `@radix-ui/react-toast`, `class-variance-authority`, `lucide-react` (X icon), `@/lib/utils` (cn)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Base44 SDK auth gating | No auth (public site) | This phase | Entire auth layer removed |
| Base44 injected vite config | Manual vite.config.js | This phase | Must create from scratch |
| shadcn/ui Toast (Radix-based) | Sonner recommended by shadcn/ui | 2024 | We keep Radix Toast since toaster.jsx + use-toast.jsx are already wired. Migration to Sonner would be unnecessary churn. |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None -- no test framework installed or configured |
| Config file | none |
| Quick run command | N/A |
| Full suite command | N/A |

Note: REQUIREMENTS.md explicitly lists "Test suite" as Out of Scope: "Focus on shipping to production first."

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BUILD-01 | `npm run dev` starts without errors | smoke | `npm run build` (build is more deterministic than dev) | N/A -- manual |
| BUILD-02 | vite.config.js exists with React plugin and alias | smoke | `node -e "require('./vite.config.js')"` won't work (ESM), use `npm run build` | N/A |
| BUILD-04 | utils.js exports cn() | unit | `node -e "import('@/lib/utils').then(m => console.log(typeof m.cn))"` -- not viable without bundler | N/A |
| BUILD-05 | query-client.js exports QueryClient | unit | Same limitation as above | N/A |
| AUTH-01 | No login screen on load | manual | Visual check: app renders without auth spinner | N/A |
| AUTH-02 | No AuthProvider in code | grep | `grep -r "AuthProvider\|AuthContext" src/` returns 0 | N/A |
| AUTH-03 | No base44Client imports | grep | `grep -r "base44Client" src/` returns 0 | N/A |
| AUTH-04 | No app-param imports | grep | `grep -r "app-param" src/` returns 0 | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (verifies zero compilation errors)
- **Per wave merge:** `npm run build` + `grep -r "base44" src/` (verifies zero Base44 references)
- **Phase gate:** All 5 success criteria from ROADMAP.md checked

### Wave 0 Gaps
None -- test infrastructure is explicitly out of scope per REQUIREMENTS.md. Validation for this phase relies on build success and grep-based verification.

## Detailed Import Chain Analysis

This is the critical dependency graph that must be resolved for compilation:

### Current Broken Chain (App.jsx)
```
App.jsx
├── @/components/ui/toaster     -> toaster.jsx (populated, BUT imports from toast.jsx which has WRONG content)
│   ├── @/components/ui/use-toast -> use-toast.jsx (populated, working)
│   └── @/components/ui/toast    -> toast.jsx (BROKEN: exports Textarea, not Toast)
├── @tanstack/react-query        -> node_modules (needs npm install)
├── @/lib/query-client           -> query-client.js (EMPTY)
├── react-router-dom             -> node_modules (needs npm install)
├── @/lib/AuthContext            -> AuthContext.jsx (TO BE DELETED)
├── @/components/UserNotRegisteredError -> DOES NOT EXIST (TO BE REMOVED from imports)
└── ./pages/Home                 -> DOES NOT EXIST (TO BE CREATED)
```

### Target Clean Chain (after Phase 1)
```
App.jsx
├── @/components/ui/toaster     -> toaster.jsx (working)
│   ├── @/components/ui/use-toast -> use-toast.jsx (working)
│   └── @/components/ui/toast    -> toast.jsx (FIXED with correct Radix Toast code)
├── @tanstack/react-query        -> node_modules
├── @/lib/query-client           -> query-client.js (POPULATED)
├── react-router-dom             -> node_modules
├── @/lib/PageNotFound           -> PageNotFound.jsx (REWRITTEN, no base44 imports)
└── ./pages/Home                 -> Home.jsx (CREATED)
    └── 10x restaurant components -> all working, no changes needed
```

### shadcn/ui Components Actually Imported
Only these shadcn/ui components are in the import chain and must be functional:
1. **button.jsx** - Imported by `Booking.jsx` and `carousel.jsx`. Already populated and working (depends on cn()).
2. **carousel.jsx** - Not directly imported by any restaurant component (MenuCarousel uses custom scroll, not the shadcn carousel). Populated but unused in Phase 1.
3. **toaster.jsx** - Imported by `App.jsx`. Populated and working (depends on toast.jsx and use-toast.jsx).
4. **use-toast.jsx** - Imported by `toaster.jsx`. Populated and working.
5. **toast.jsx** - Imported by `toaster.jsx`. BROKEN (contains Textarea code). Must be fixed.
6. **accordion.jsx** - Populated but not imported by any active component.
7. **dialog.jsx** - Populated but not imported by any active component.
8. **skeleton.jsx** - Populated but not imported by any active component.

**Minimum fix set:** toast.jsx (fix content), utils.js (populate cn()), query-client.js (populate QueryClient).

## Provider Stack Recommendation (Claude's Discretion)

**Recommendation: Keep QueryClientProvider.**

Rationale:
1. Phase 2 (UI-01 through UI-04) may benefit from cached data patterns
2. The cost of keeping it is one line in App.jsx plus the already-installed package
3. Removing it now and re-adding in Phase 2 is unnecessary churn
4. query-client.js must be populated either way (BUILD-05 requires it)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Development tooling | Yes | v22.22.1 | -- |
| npm | Package management | Yes | 10.9.4 | -- |
| node_modules | All runtime deps | No (not installed) | -- | `npm install` |

**Missing dependencies with no fallback:**
- `node_modules` not present -- `npm install` must run before any compilation

**Missing dependencies with fallback:**
- None

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection: All `src/` files read and analyzed
- `package.json` -- exact dependency versions verified
- `components.json` -- shadcn/ui configuration confirmed
- npm registry -- verified current versions of key packages

### Secondary (MEDIUM confidence)
- [shadcn/ui manual installation guide](https://ui.shadcn.com/docs/installation/manual) -- cn() utility pattern
- [Vite path alias setup guides](https://dev.to/jumbo02/how-to-setup-path-alias-vite-react-5426) -- vite.config.js alias pattern
- [shadcn/ui toast documentation](https://ui.shadcn.com/docs/components/radix/toast) -- toast component structure

### Tertiary (LOW confidence)
- None. All findings verified against actual codebase.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified in package.json, versions confirmed against npm registry
- Architecture: HIGH -- full import chain traced through actual source files, every broken link identified
- Pitfalls: HIGH -- every pitfall discovered through direct code inspection (toast.jsx wrong content, empty postcss.config.js, empty stubs)

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stable -- no fast-moving dependencies)
