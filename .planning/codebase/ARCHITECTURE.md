# Architecture

**Analysis Date:** 2026-03-26

## Pattern Overview

**Overall:** Single-Page Application (SPA) with component-based architecture

**Key Characteristics:**
- React SPA built with Vite, using client-side routing via React Router
- Auth-gated rendering: app checks authentication state before displaying any routes
- Base44 platform SDK integration for authentication and backend API access
- Feature sections organized as discrete section components composed into page(s)

## Layers

**Application Shell:**
- Purpose: Bootstraps providers, routing, and auth gating
- Location: `src/App.jsx`, `src/main.jsx`
- Contains: Provider wrappers (AuthProvider, QueryClientProvider, Router), top-level route definitions
- Depends on: `src/lib/AuthContext.jsx`, `src/lib/query-client.js`
- Used by: `index.html` via `src/main.jsx`

**Auth/Infrastructure Layer:**
- Purpose: Manages authentication state, app parameters, and shared query infrastructure
- Location: `src/lib/`
- Contains: `AuthContext.jsx` (React context + provider for auth state), `app-param.js` (reads app ID and token from URL/localStorage/env), `query-client.js` (TanStack Query client instance), `utils.js` (shared utilities), `PageNotFound.jsx` (fallback route component)
- Depends on: `@/api/base44Client` (expected but not yet committed to repo), Base44 SDK (`@base44/sdk`)
- Used by: `src/App.jsx`, any component needing auth or data fetching

**Pages Layer:**
- Purpose: Top-level route containers that compose restaurant section components
- Location: `src/pages/` (referenced in `src/App.jsx` as `./pages/Home` — directory not yet created)
- Contains: Route-level page components (e.g., `Home`)
- Depends on: `src/components/restaurant/`, `src/components/ui/`
- Used by: `src/App.jsx` route definitions

**Domain Components Layer:**
- Purpose: Restaurant-specific UI sections that compose the landing page experience
- Location: `src/components/restaurant/`
- Contains: `Hero.jsx`, `Navigation.jsx`, `Booking.jsx`, `Experience.jsx`, `Footer.jsx`, `MapHours.jsx`, `Menucarousel.jsx`, `OrderReserve.jsx`, `Provenance.jsx`, `TodaysCatch.jsx`
- Depends on: `src/components/ui/`, framer-motion, lucide-react, react-leaflet
- Used by: Page-level components in `src/pages/`

**UI Primitives Layer:**
- Purpose: Reusable headless/styled UI primitives (shadcn/ui components)
- Location: `src/components/ui/`
- Contains: 40+ primitive components (button, dialog, form, carousel, calendar, etc.)
- Depends on: Radix UI primitives, Tailwind CSS, lucide-react
- Used by: Domain components and pages

**Hooks Layer:**
- Purpose: Shared custom React hooks
- Location: `src/hooks/`
- Contains: `use-mobile.jsx` (viewport breakpoint detection at 768px)
- Depends on: React
- Used by: Any component needing responsive logic

## Data Flow

**Application Boot:**

1. `index.html` loads `src/main.jsx`
2. `main.jsx` renders `<App />` into `#root`
3. `App` wraps everything in `<AuthProvider>`, `<QueryClientProvider>`, and `<Router>`
4. `AuthProvider` calls `checkAppState()` on mount
5. `checkAppState()` fetches app public settings via `/api/apps/public` using `app-param.js` values
6. If a token exists, `checkUserAuth()` calls `base44.auth.me()` to resolve the current user
7. `AuthenticatedApp` reads auth state from context: shows spinner, error state, or routes

**Authentication Error Handling:**

1. `auth_required` → `navigateToLogin()` → redirects via `base44.auth.redirectToLogin()`
2. `user_not_registered` → renders `<UserNotRegisteredError />` (component referenced but not yet in repo)
3. Other errors → sets `authError` state, surface in `AuthenticatedApp`

**State Management:**
- Auth state: React Context (`src/lib/AuthContext.jsx`) — user, isAuthenticated, isLoadingAuth, authError, appPublicSettings
- Server state: TanStack Query via `src/lib/query-client.js`
- URL/local state: `src/lib/app-param.js` reads from URL params and localStorage, persisting tokens

## Key Abstractions

**AuthProvider / useAuth:**
- Purpose: Centralizes auth lifecycle and exposes it to the entire component tree
- Examples: `src/lib/AuthContext.jsx`
- Pattern: React Context with a custom `useAuth()` hook that throws if used outside the provider

**app-param.js:**
- Purpose: Reads runtime configuration (appId, access token, base URLs) from URL params, localStorage, or environment variables — in that priority order
- Examples: `src/lib/app-param.js`
- Pattern: Module-level singleton; params are read once at import time and exported as `appParams`

**base44Client (expected):**
- Purpose: SDK client for Base44 platform auth and data APIs
- Examples: `src/api/base44Client` (referenced in `AuthContext.jsx` and `PageNotFound.jsx` but file not present in repository)
- Pattern: Named export `base44` with `.auth.me()`, `.auth.logout()`, `.auth.redirectToLogin()`

**Restaurant Section Components:**
- Purpose: Each section of the restaurant landing page is a self-contained component with its own animation logic
- Examples: `src/components/restaurant/Hero.jsx`, `src/components/restaurant/Booking.jsx`
- Pattern: framer-motion `useInView` + `useRef` for scroll-triggered animations; `motion.div` wrappers for transitions

## Entry Points

**HTML Entry:**
- Location: `index.html`
- Triggers: Browser loads the page
- Responsibilities: Mounts `#root` div, loads `src/main.jsx` as ES module

**JS Entry:**
- Location: `src/main.jsx`
- Triggers: Script load from `index.html`
- Responsibilities: Renders `<App />` into the DOM

**App Root:**
- Location: `src/App.jsx`
- Triggers: Rendered by `main.jsx`
- Responsibilities: Wraps providers, defines routes (`/` → Home, `*` → PageNotFound), handles auth gating via `AuthenticatedApp`

## Error Handling

**Strategy:** Auth errors captured in React state, rendered as UI states rather than thrown exceptions

**Patterns:**
- Auth errors stored as `{ type, message }` objects in `AuthContext` state
- `AuthenticatedApp` conditionally renders error UI based on `authError.type`
- API calls in `AuthContext` use try/catch with explicit error type classification
- `PageNotFound` uses TanStack Query to check auth before showing admin hint

## Cross-Cutting Concerns

**Logging:** `console.error` in `AuthContext.jsx` for auth failures; no structured logging framework
**Validation:** Not implemented (form components exist in `src/components/ui/form.jsx` but pattern not established)
**Authentication:** Centralized in `AuthProvider`; all components access via `useAuth()` hook

---

*Architecture analysis: 2026-03-26*
