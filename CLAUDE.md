<!-- GSD:project-start source:PROJECT.md -->
## Project

**Tsuru Sushi**

A production restaurant website for Tsuru Sushi — a Japanese sushi restaurant. The site is a single-page React application featuring a hero section, navigation, menu carousel, experience showcase, provenance story, today's catch, booking section, order/reserve CTAs, map with hours, and footer. The frontend components are mostly built but the app is non-functional due to missing files, broken imports, and Base44 platform dependencies that need to be stripped out for standalone Vercel deployment.

**Core Value:** Customers can find Tsuru Sushi online, browse the menu, and book a reservation through Resy — a polished, working restaurant website that represents the brand.

### Constraints

- **Hosting**: Vercel — free tier, static SPA deployment
- **Booking**: Resy link only — no custom booking backend
- **Content**: Hardcoded in components — no CMS, owner provides updates via code changes
- **Images**: Currently on Base44 CDN — may need to migrate if access is lost after decoupling
- **Budget**: Minimal — free Vercel tier, no paid services
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- JavaScript (JSX) — All application source code in `src/`
- CSS — Global styles in `src/index.css`
- JavaScript with TypeScript type-checking enabled via `jsconfig.json` (`checkJs: true`, targeting `esnext`)
## Runtime
- Browser (SPA — no server-side rendering)
- Node.js v22 (development tooling only)
- npm (no lockfile committed — `package-lock.json` absent from repo)
## Frameworks
- React 18.2 — UI framework, entry point `src/main.jsx`
- React Router DOM 6.26 — Client-side routing, configured in `src/App.jsx`
- shadcn/ui (New York style) — Component system configured via `components.json`; all generated components live in `src/components/ui/`
- Radix UI — Headless primitives backing shadcn/ui (full suite: accordion, dialog, dropdown-menu, select, tabs, tooltip, etc.)
- Framer Motion 11.16 — Scroll-triggered animations, parallax effects, motion primitives used throughout `src/components/restaurant/`
- Tailwind CSS 3.4 — Utility-first CSS, config at `tailwind.config.js`
- CSS custom properties for theming (light/dark via `.dark` class), defined in `src/index.css`
- `tailwindcss-animate` — Accordion open/close keyframe animations
- `tailwind-merge` — Merges Tailwind class strings safely
- `class-variance-authority` — Variant management for UI components
- Cormorant Garamond (display) — Loaded from Google Fonts in `src/index.css`
- Inter (body) — Loaded from Google Fonts in `src/index.css`
- Exposed as CSS vars `--font-display` and `--font-body`; consumed via Tailwind `font-display` / `font-body` utilities
- React Hook Form 7.54 — Form state management
- `@hookform/resolvers` 4.1 — Schema-based validation adapter
- Zod 3.24 — Schema validation
- TanStack Query (React Query) 5.84 — Server-state caching, client configured at `src/lib/query-client.js`
- Vite 6.1 — Dev server and bundler, entry `index.html` → `src/main.jsx`
- `@vitejs/plugin-react` 4.3 — React fast refresh
- `@base44/vite-plugin` 1.0 — Base44 platform build integration
- `@base44/sdk` 0.8 — Base44 BaaS platform SDK; used for auth (`base44.auth.me()`, `base44.auth.logout()`, `base44.auth.redirectToLogin()`), accessed via `src/api/base44Client` (generated/injected at deploy time — not committed)
## Key Dependencies
- `@base44/sdk` ^0.8.0 — Auth provider, API client; the app won't function without a valid Base44 app configuration
- `react-leaflet` ^4.2.1 — Interactive map in `src/components/restaurant/MapHours.jsx` using OpenStreetMap tiles
- `lucide-react` ^0.475.0 — Icon library (referenced in `components.json` as `iconLibrary: "lucide"`)
- `embla-carousel-react` ^8.5.2 — Carousel backing in `src/components/restaurant/Menucarousel.jsx`
- `next-themes` ^0.4.4 — Dark/light theme toggle (theme vars defined in `src/index.css`)
- `sonner` ^2.0.1 + `react-hot-toast` ^2.6.0 — Toast notification libraries (both present)
- `framer-motion` ^11.16.4 — Animation engine
- `@stripe/react-stripe-js` ^3.0.0 + `@stripe/stripe-js` ^5.2.0 — Stripe payment UI (present in `package.json`, no active usage found in `src/`)
- `three` ^0.171.0 — 3D rendering library (present in `package.json`, no active usage found in `src/`)
- `jspdf` ^4.0.0 + `html2canvas` ^1.4.1 — PDF generation (present, no active usage found)
- `react-quill` ^2.0.0 — Rich text editor (present, no active usage found)
- `react-markdown` ^9.0.1 — Markdown renderer (present, no active usage found)
- `recharts` ^2.15.4 — Charting library (present, no active usage found)
- `@hello-pangea/dnd` ^17.0.0 — Drag-and-drop (present, no active usage found)
- `moment` ^2.30.1 + `date-fns` ^3.6.0 — Dual date libraries (both present)
- `lodash` ^4.17.21 — Utility library (present, no active usage found)
- `canvas-confetti` ^1.9.4 — Confetti animation (present, no active usage found)
- `cmdk` ^1.0.0 — Command palette (present in UI primitives)
## Configuration
- Environment variables read via `import.meta.env` (Vite):
- Params also readable from URL query string and cached in `localStorage` with `base44_` prefix; logic in `src/lib/app-param.js`
- `.env` file absent from repo (would hold secrets)
- `vite.config.*` — Not present in repo (Base44 platform likely injects config via `@base44/vite-plugin`)
- `postcss.config.js` — PostCSS config present (contents empty)
- `tailwind.config.js` — Tailwind config, dark mode via `["class"]`
- `jsconfig.json` — Path aliases (`@/*` → `./src/*`), type checking enabled
- ESLint 9.19 flat config at `eslint.config.js`
- Plugins: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-unused-imports`
- `src/lib/**` and `src/components/ui/**` excluded from linting
## Platform Requirements
- Node.js (v22 in current environment)
- npm
- `VITE_BASE44_APP_ID` set to a valid Base44 app ID
- Deployed via Base44 platform (inferred from SDK, vite plugin, and `index.html` favicon pointing to `base44.com`)
- SPA — static file hosting, all routing client-side
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- React components use PascalCase: `Hero.jsx`, `Navigation.jsx`, `MenuCarousel.jsx`
- Hooks use camelCase with `use` prefix: `use-mobile.jsx` (kebab-case filename, camelCase export `useIsMobile`)
- Utility/lib files use camelCase: `utils.js`, `query-client.js`, `app-param.js`
- UI primitives follow shadcn/ui naming: `button.jsx`, `dialog.jsx`, `alert-dialog.jsx`
- React components exported as named `default` PascalCase functions: `export default function Hero()`
- Event handlers use camelCase with verb prefix: `handleScroll`, `scrollTo`, `checkAppState`, `checkUserAuth`
- Custom hooks use camelCase `use` prefix: `useIsMobile`, `useAuth`
- Boolean state variables use `is` prefix: `isLoadingAuth`, `isAuthenticated`, `isMobile`
- camelCase for all local variables and state: `lastScrollY`, `mobileOpen`, `scrolled`
- SCREAMING_SNAKE_CASE for module-level constants/config: `HERO_IMG`, `NAV_LINKS`, `MENU_ITEMS`, `SITTINGS`, `HOURS`, `SOURCES`, `MOBILE_BREAKPOINT`
- Underscore prefix for intentionally unused function args (per ESLint rule): `_unused`
- JavaScript (no TypeScript) — no type definitions in application code
- `jsconfig.json` enables `checkJs: true` for JS type checking in `src/components/**` and `src/pages/**`
- shadcn/ui components in `src/components/ui/` are excluded from type checking
## Code Style
- No Prettier config present — formatting is not enforced by a formatter
- 4-space indentation used consistently across all files
- Single quotes for imports in most lib files; double quotes in component files (inconsistent)
- Trailing commas present in multi-line objects/arrays
- Semicolons omitted at module level in some files (`export default App`) but present in others
- ESLint 9 with flat config: `eslint.config.js`
- Plugins: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-unused-imports`
- Key rules enforced:
- ESLint scope: only `src/components/**`, `src/pages/**`, `src/Layout.jsx`
- Explicitly excluded from linting: `src/lib/**`, `src/components/ui/**`
## Import Organization
- `@/*` maps to `./src/*` (configured in `jsconfig.json`)
- Used consistently for cross-directory imports: `@/components/ui/button`, `@/lib/AuthContext`, `@/api/base44Client`
- Relative paths used only for same-directory imports: `import App from '@/App.jsx'` in `main.jsx`
- Named React imports are always explicit: `import React, { useState } from "react"` — React is imported even when not strictly needed (pre-v17 style, though `react-in-jsx-scope` is off)
- Some files split `useRef` into a separate import line: `import { useRef } from "react"` after `import React from "react"` (inconsistency in `Experience.jsx`, `MapHours.jsx`, `Provenance.jsx`, `Footer.jsx`)
## Error Handling
- Async functions in lib layer use `try/catch` with `console.error` for logging: `AuthContext.jsx`
- Nested try/catch used to distinguish app-level vs user-level auth errors: `AuthContext.jsx` lines 36–78
- Error state held in React state as typed objects: `{ type: 'auth_required', message: '...' }`
- Components check `authError.type` string to branch rendering: `App.jsx`
- No error boundaries present in component tree
- Query errors in `PageNotFound.jsx` are silently swallowed: catch returns `{ user: null, isAuthenticated: false }`
- No global error handler or toast-based error display for auth failures
## Logging
- Used exclusively in `src/lib/AuthContext.jsx` for catch blocks
- No `console.log` or `console.warn` in production code
- No structured logging or log levels
## Comments
- Inline comments describe intent for non-obvious UI sections: `{/* Background image with parallax */}`, `{/* Blade edge line */}`
- Code comments clarify async flow steps: `// First, check app public settings`, `// If user auth fails, it might be an expired token`
- Minimal comments in straightforward component code
- Not used anywhere in the codebase
## Function Design
- Components return JSX directly from the function body
- Early returns used for loading/error states in `App.jsx`: `if (isLoadingPublicSettings || isLoadingAuth) return (...)`
- Utility functions return primitive values or null: `app-param.js`
## Module Design
- Restaurant components: `export default function ComponentName()`
- Hooks: named export `export function useIsMobile()`
- Context: named exports `export const AuthProvider`, `export const useAuth`
- Utility constants: named export `export const appParams`
- Not used — each component/module is imported directly by path
## Component Patterns
- All animated sections use `framer-motion`
- Scroll-triggered animations use `useInView` hook with `{ once: true, margin: "-100px" }`
- Pattern: `animate={isInView ? { opacity: 1, y: 0 } : {}}` — animates on entry, stays visible
- `Hero.jsx` uses `useScroll` + `useTransform` for parallax scroll effects
- Component-local data arrays defined as module-level constants in SCREAMING_SNAKE_CASE above the component function
- Examples: `MENU_ITEMS`, `SITTINGS`, `NAV_LINKS`, `HOURS`, `SOURCES`
- No external data fetching in restaurant components — all data is hardcoded
- All sections use a consistent 12-column CSS grid: `grid-cols-12`
- Max width constraint: `max-w-screen-2xl mx-auto`
- Standard section padding: `py-24 md:py-36 px-6 md:px-12`
- Responsive column offsets via `md:col-start-N` for visual asymmetry
- Two font families applied via Tailwind utility classes:
- Headings always `font-light` weight with `font-display`
- Labels use tiny sizes with wide letter-spacing: `text-[10px] tracking-[0.4em] uppercase`
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- React SPA built with Vite, using client-side routing via React Router
- Auth-gated rendering: app checks authentication state before displaying any routes
- Base44 platform SDK integration for authentication and backend API access
- Feature sections organized as discrete section components composed into page(s)
## Layers
- Purpose: Bootstraps providers, routing, and auth gating
- Location: `src/App.jsx`, `src/main.jsx`
- Contains: Provider wrappers (AuthProvider, QueryClientProvider, Router), top-level route definitions
- Depends on: `src/lib/AuthContext.jsx`, `src/lib/query-client.js`
- Used by: `index.html` via `src/main.jsx`
- Purpose: Manages authentication state, app parameters, and shared query infrastructure
- Location: `src/lib/`
- Contains: `AuthContext.jsx` (React context + provider for auth state), `app-param.js` (reads app ID and token from URL/localStorage/env), `query-client.js` (TanStack Query client instance), `utils.js` (shared utilities), `PageNotFound.jsx` (fallback route component)
- Depends on: `@/api/base44Client` (expected but not yet committed to repo), Base44 SDK (`@base44/sdk`)
- Used by: `src/App.jsx`, any component needing auth or data fetching
- Purpose: Top-level route containers that compose restaurant section components
- Location: `src/pages/` (referenced in `src/App.jsx` as `./pages/Home` — directory not yet created)
- Contains: Route-level page components (e.g., `Home`)
- Depends on: `src/components/restaurant/`, `src/components/ui/`
- Used by: `src/App.jsx` route definitions
- Purpose: Restaurant-specific UI sections that compose the landing page experience
- Location: `src/components/restaurant/`
- Contains: `Hero.jsx`, `Navigation.jsx`, `Booking.jsx`, `Experience.jsx`, `Footer.jsx`, `MapHours.jsx`, `Menucarousel.jsx`, `OrderReserve.jsx`, `Provenance.jsx`, `TodaysCatch.jsx`
- Depends on: `src/components/ui/`, framer-motion, lucide-react, react-leaflet
- Used by: Page-level components in `src/pages/`
- Purpose: Reusable headless/styled UI primitives (shadcn/ui components)
- Location: `src/components/ui/`
- Contains: 40+ primitive components (button, dialog, form, carousel, calendar, etc.)
- Depends on: Radix UI primitives, Tailwind CSS, lucide-react
- Used by: Domain components and pages
- Purpose: Shared custom React hooks
- Location: `src/hooks/`
- Contains: `use-mobile.jsx` (viewport breakpoint detection at 768px)
- Depends on: React
- Used by: Any component needing responsive logic
## Data Flow
- Auth state: React Context (`src/lib/AuthContext.jsx`) — user, isAuthenticated, isLoadingAuth, authError, appPublicSettings
- Server state: TanStack Query via `src/lib/query-client.js`
- URL/local state: `src/lib/app-param.js` reads from URL params and localStorage, persisting tokens
## Key Abstractions
- Purpose: Centralizes auth lifecycle and exposes it to the entire component tree
- Examples: `src/lib/AuthContext.jsx`
- Pattern: React Context with a custom `useAuth()` hook that throws if used outside the provider
- Purpose: Reads runtime configuration (appId, access token, base URLs) from URL params, localStorage, or environment variables — in that priority order
- Examples: `src/lib/app-param.js`
- Pattern: Module-level singleton; params are read once at import time and exported as `appParams`
- Purpose: SDK client for Base44 platform auth and data APIs
- Examples: `src/api/base44Client` (referenced in `AuthContext.jsx` and `PageNotFound.jsx` but file not present in repository)
- Pattern: Named export `base44` with `.auth.me()`, `.auth.logout()`, `.auth.redirectToLogin()`
- Purpose: Each section of the restaurant landing page is a self-contained component with its own animation logic
- Examples: `src/components/restaurant/Hero.jsx`, `src/components/restaurant/Booking.jsx`
- Pattern: framer-motion `useInView` + `useRef` for scroll-triggered animations; `motion.div` wrappers for transitions
## Entry Points
- Location: `index.html`
- Triggers: Browser loads the page
- Responsibilities: Mounts `#root` div, loads `src/main.jsx` as ES module
- Location: `src/main.jsx`
- Triggers: Script load from `index.html`
- Responsibilities: Renders `<App />` into the DOM
- Location: `src/App.jsx`
- Triggers: Rendered by `main.jsx`
- Responsibilities: Wraps providers, defines routes (`/` → Home, `*` → PageNotFound), handles auth gating via `AuthenticatedApp`
## Error Handling
- Auth errors stored as `{ type, message }` objects in `AuthContext` state
- `AuthenticatedApp` conditionally renders error UI based on `authError.type`
- API calls in `AuthContext` use try/catch with explicit error type classification
- `PageNotFound` uses TanStack Query to check auth before showing admin hint
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
