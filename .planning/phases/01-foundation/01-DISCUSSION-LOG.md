# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 01-foundation
**Areas discussed:** Auth removal strategy

---

## Auth Removal Strategy

### Q1: How aggressively should we strip the auth layer?

| Option | Description | Selected |
|--------|-------------|----------|
| Complete removal (Recommended) | Delete AuthContext.jsx, app-param.js, and all auth imports. App.jsx renders Routes directly with no auth gating. Clean slate. | ✓ |
| No-op wrappers | Keep AuthProvider as a shell that immediately sets isAuthenticated=false, isLoading=false. Preserves provider pattern. | |
| Minimal stub | Delete AuthContext.jsx but keep a tiny base44Client.js stub that exports empty objects. Quick path but leaves dead code. | |

**User's choice:** Complete removal
**Notes:** None — recommended option selected without further discussion.

### Q2: Remove @base44/sdk and @base44/vite-plugin from package.json?

| Option | Description | Selected |
|--------|-------------|----------|
| Remove from package.json (Recommended) | Delete both packages from package.json entirely. Clean break. | ✓ |
| Keep in package.json, skip in config | Leave packages installed but don't reference them in vite.config.js. | |

**User's choice:** Remove from package.json
**Notes:** None.

### Q3: PageNotFound.jsx after stripping auth?

| Option | Description | Selected |
|--------|-------------|----------|
| Simple 404 page (Recommended) | Static component showing 'Page not found' with a link back to home. | |
| Redirect to home | Any unknown route silently redirects to '/'. | |
| You decide | Claude picks the best approach. | ✓ |

**User's choice:** You decide
**Notes:** Claude will implement a simple static 404 page based on codebase context.

### Q4: Update index.html branding (title, favicon) now or defer?

| Option | Description | Selected |
|--------|-------------|----------|
| Update now | Set page title to 'Tsuru Sushi' and remove Base44 favicon. | |
| Defer to Phase 3 | Phase 1 just gets it compiling — branding belongs in content phase. | ✓ |

**User's choice:** Defer to Phase 3
**Notes:** Keep Phase 1 scope narrow — compilation only.

---

## Claude's Discretion

- 404 page design (user said "you decide")
- Provider stack cleanup (not discussed — Claude's call)
- shadcn/ui component scope (not discussed — Claude's call)
- What renders after Phase 1 (not discussed — Claude's call)

## Deferred Ideas

None — discussion stayed within phase scope.
