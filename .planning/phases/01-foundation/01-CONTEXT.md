# Phase 1: Foundation - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Strip all Base44 SDK dependencies and make the project compile and run locally as a standalone Vite + React SPA. After this phase, `npm run dev` and `npm run build` succeed, the app renders in the browser without any auth gating, and zero Base44 references remain in `src/`.

</domain>

<decisions>
## Implementation Decisions

### Auth Removal Strategy
- **D-01:** Complete removal of the auth layer — delete `AuthContext.jsx`, `app-param.js`, all auth imports, and the `AuthenticatedApp` wrapper. `App.jsx` renders `<Routes>` directly with no auth gating. This is a public restaurant site; no auth is needed.
- **D-02:** Remove `@base44/sdk` and `@base44/vite-plugin` from `package.json` entirely. Clean break — no Base44 artifacts remain anywhere in the project.
- **D-03:** Rewrite `PageNotFound.jsx` as a simple static 404 page (remove the base44Client auth check). No redirect — keep it as a proper 404.

### Branding
- **D-04:** Defer `index.html` branding updates (title, favicon) to Phase 3 (Content). Phase 1 focuses strictly on compilation.

### Claude's Discretion
- 404 page design: Claude picks the best static 404 approach (simple "Page not found" with link home).
- Provider stack: Whether to keep `QueryClientProvider` or strip it is at Claude's discretion — optimize for what makes Phase 2 easier.
- shadcn/ui component scope: Populate only the components actually imported by `App.jsx` and restaurant sections (at minimum: `toaster.jsx`, `use-toast.jsx`, plus any others referenced in restaurant components). Don't populate all 48 stubs.
- What renders after Phase 1: At minimum the app shows a blank page or basic shell without errors. If restaurant sections happen to render because `Home.jsx` is created, that's fine but not required by Phase 1 success criteria.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — BUILD-01 through BUILD-05, AUTH-01 through AUTH-04 (this phase's requirements)
- `.planning/ROADMAP.md` — Phase 1 success criteria and scope

### Codebase Analysis
- `.planning/codebase/CONCERNS.md` — All known tech debt, broken imports, and missing files
- `.planning/codebase/STACK.md` — Full dependency inventory including unused packages
- `.planning/codebase/STRUCTURE.md` — Directory layout and where to add new code

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/button.jsx` — The only non-empty shadcn/ui component; all others are 0-byte stubs
- `src/hooks/use-mobile.jsx` — Working viewport breakpoint hook (768px), no Base44 dependency
- 10 restaurant section components in `src/components/restaurant/` — fully built with Framer Motion animations, no Base44 imports

### Established Patterns
- shadcn/ui configured via `components.json` (New York style, JSX, CSS variables enabled, `@/lib/utils` alias)
- `@/*` path alias maps to `./src/*` via `jsconfig.json`
- Tailwind CSS with custom properties for theming in `src/index.css`

### Integration Points
- `src/App.jsx` — Root component that needs restructuring (remove AuthProvider wrapping, keep Router + Routes)
- `src/main.jsx` — Entry point, currently functional (renders `<App />`)
- `index.html` — HTML shell, needs no changes in Phase 1
- `vite.config.js` — Must be created (does not exist; Base44 platform injected config)
- `src/lib/query-client.js` — Empty stub, needs `QueryClient` instance
- `src/lib/utils.js` — Empty stub, needs `cn()` function for shadcn/ui

### Files to Delete
- `src/lib/AuthContext.jsx` — Entire file (Base44 auth)
- `src/lib/app-param.js` — Entire file (Base44 token/param handling)
- `src/api/` directory reference — Never existed on disk, just remove the import

### Files to Create
- `vite.config.js` — Minimal Vite config with React plugin and `@/*` alias
- `src/pages/Home.jsx` — Page component assembling restaurant sections (or minimal placeholder)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for all implementation details.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-26*
