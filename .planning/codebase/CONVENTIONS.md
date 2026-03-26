# Coding Conventions

**Analysis Date:** 2026-03-26

## Naming Patterns

**Files:**
- React components use PascalCase: `Hero.jsx`, `Navigation.jsx`, `MenuCarousel.jsx`
- Hooks use camelCase with `use` prefix: `use-mobile.jsx` (kebab-case filename, camelCase export `useIsMobile`)
- Utility/lib files use camelCase: `utils.js`, `query-client.js`, `app-param.js`
- UI primitives follow shadcn/ui naming: `button.jsx`, `dialog.jsx`, `alert-dialog.jsx`

**Functions/Components:**
- React components exported as named `default` PascalCase functions: `export default function Hero()`
- Event handlers use camelCase with verb prefix: `handleScroll`, `scrollTo`, `checkAppState`, `checkUserAuth`
- Custom hooks use camelCase `use` prefix: `useIsMobile`, `useAuth`
- Boolean state variables use `is` prefix: `isLoadingAuth`, `isAuthenticated`, `isMobile`

**Variables:**
- camelCase for all local variables and state: `lastScrollY`, `mobileOpen`, `scrolled`
- SCREAMING_SNAKE_CASE for module-level constants/config: `HERO_IMG`, `NAV_LINKS`, `MENU_ITEMS`, `SITTINGS`, `HOURS`, `SOURCES`, `MOBILE_BREAKPOINT`
- Underscore prefix for intentionally unused function args (per ESLint rule): `_unused`

**Types/Interfaces:**
- JavaScript (no TypeScript) — no type definitions in application code
- `jsconfig.json` enables `checkJs: true` for JS type checking in `src/components/**` and `src/pages/**`
- shadcn/ui components in `src/components/ui/` are excluded from type checking

## Code Style

**Formatting:**
- No Prettier config present — formatting is not enforced by a formatter
- 4-space indentation used consistently across all files
- Single quotes for imports in most lib files; double quotes in component files (inconsistent)
- Trailing commas present in multi-line objects/arrays
- Semicolons omitted at module level in some files (`export default App`) but present in others

**Linting:**
- ESLint 9 with flat config: `eslint.config.js`
- Plugins: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-unused-imports`
- Key rules enforced:
  - `unused-imports/no-unused-imports`: error (must remove unused imports)
  - `unused-imports/no-unused-vars`: warn (vars prefixed `_` are exempt)
  - `react-hooks/rules-of-hooks`: error
  - `react/prop-types`: off (no PropTypes required)
  - `react/react-in-jsx-scope`: off (React 17+ JSX transform)
- ESLint scope: only `src/components/**`, `src/pages/**`, `src/Layout.jsx`
- Explicitly excluded from linting: `src/lib/**`, `src/components/ui/**`

## Import Organization

**Order (observed in restaurant components):**
1. React and named React imports: `import React, { useState, useEffect } from "react"`
2. Third-party libraries: `framer-motion`, `lucide-react`, `react-leaflet`
3. Internal UI components via alias: `import { Button } from "@/components/ui/button"`
4. Internal lib/hooks: `import { useAuth } from "@/lib/AuthContext"`

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `jsconfig.json`)
- Used consistently for cross-directory imports: `@/components/ui/button`, `@/lib/AuthContext`, `@/api/base44Client`
- Relative paths used only for same-directory imports: `import App from '@/App.jsx'` in `main.jsx`

**Import style:**
- Named React imports are always explicit: `import React, { useState } from "react"` — React is imported even when not strictly needed (pre-v17 style, though `react-in-jsx-scope` is off)
- Some files split `useRef` into a separate import line: `import { useRef } from "react"` after `import React from "react"` (inconsistency in `Experience.jsx`, `MapHours.jsx`, `Provenance.jsx`, `Footer.jsx`)

## Error Handling

**Patterns:**
- Async functions in lib layer use `try/catch` with `console.error` for logging: `AuthContext.jsx`
- Nested try/catch used to distinguish app-level vs user-level auth errors: `AuthContext.jsx` lines 36–78
- Error state held in React state as typed objects: `{ type: 'auth_required', message: '...' }`
- Components check `authError.type` string to branch rendering: `App.jsx`
- No error boundaries present in component tree
- Query errors in `PageNotFound.jsx` are silently swallowed: catch returns `{ user: null, isAuthenticated: false }`
- No global error handler or toast-based error display for auth failures

## Logging

**Framework:** `console.error` only (no logging library)

**Patterns:**
- Used exclusively in `src/lib/AuthContext.jsx` for catch blocks
- No `console.log` or `console.warn` in production code
- No structured logging or log levels

## Comments

**When to Comment:**
- Inline comments describe intent for non-obvious UI sections: `{/* Background image with parallax */}`, `{/* Blade edge line */}`
- Code comments clarify async flow steps: `// First, check app public settings`, `// If user auth fails, it might be an expired token`
- Minimal comments in straightforward component code

**JSDoc:**
- Not used anywhere in the codebase

## Function Design

**Size:** Components are single-responsibility and concise (50–120 lines typical). `AuthContext.jsx` is the largest file at 155 lines.

**Parameters:** Components accept props destructured inline. No prop validation (prop-types off).

**Return Values:**
- Components return JSX directly from the function body
- Early returns used for loading/error states in `App.jsx`: `if (isLoadingPublicSettings || isLoadingAuth) return (...)`
- Utility functions return primitive values or null: `app-param.js`

## Module Design

**Exports:**
- Restaurant components: `export default function ComponentName()`
- Hooks: named export `export function useIsMobile()`
- Context: named exports `export const AuthProvider`, `export const useAuth`
- Utility constants: named export `export const appParams`

**Barrel Files:**
- Not used — each component/module is imported directly by path

## Component Patterns

**Animation:**
- All animated sections use `framer-motion`
- Scroll-triggered animations use `useInView` hook with `{ once: true, margin: "-100px" }`
- Pattern: `animate={isInView ? { opacity: 1, y: 0 } : {}}` — animates on entry, stays visible
- `Hero.jsx` uses `useScroll` + `useTransform` for parallax scroll effects

**Static Data:**
- Component-local data arrays defined as module-level constants in SCREAMING_SNAKE_CASE above the component function
- Examples: `MENU_ITEMS`, `SITTINGS`, `NAV_LINKS`, `HOURS`, `SOURCES`
- No external data fetching in restaurant components — all data is hardcoded

**Layout:**
- All sections use a consistent 12-column CSS grid: `grid-cols-12`
- Max width constraint: `max-w-screen-2xl mx-auto`
- Standard section padding: `py-24 md:py-36 px-6 md:px-12`
- Responsive column offsets via `md:col-start-N` for visual asymmetry

**Typography:**
- Two font families applied via Tailwind utility classes:
  - `font-display` — Cormorant Garamond serif, for headings
  - `font-body` — Inter sans-serif, for labels, body text, UI elements
- Headings always `font-light` weight with `font-display`
- Labels use tiny sizes with wide letter-spacing: `text-[10px] tracking-[0.4em] uppercase`

---

*Convention analysis: 2026-03-26*
