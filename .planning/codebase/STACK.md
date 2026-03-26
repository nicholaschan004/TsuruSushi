# Technology Stack

**Analysis Date:** 2026-03-26

## Languages

**Primary:**
- JavaScript (JSX) — All application source code in `src/`

**Secondary:**
- CSS — Global styles in `src/index.css`

**Type Checking:**
- JavaScript with TypeScript type-checking enabled via `jsconfig.json` (`checkJs: true`, targeting `esnext`)

## Runtime

**Environment:**
- Browser (SPA — no server-side rendering)
- Node.js v22 (development tooling only)

**Package Manager:**
- npm (no lockfile committed — `package-lock.json` absent from repo)

## Frameworks

**Core:**
- React 18.2 — UI framework, entry point `src/main.jsx`
- React Router DOM 6.26 — Client-side routing, configured in `src/App.jsx`

**UI Components:**
- shadcn/ui (New York style) — Component system configured via `components.json`; all generated components live in `src/components/ui/`
- Radix UI — Headless primitives backing shadcn/ui (full suite: accordion, dialog, dropdown-menu, select, tabs, tooltip, etc.)

**Animation:**
- Framer Motion 11.16 — Scroll-triggered animations, parallax effects, motion primitives used throughout `src/components/restaurant/`

**Styling:**
- Tailwind CSS 3.4 — Utility-first CSS, config at `tailwind.config.js`
- CSS custom properties for theming (light/dark via `.dark` class), defined in `src/index.css`
- `tailwindcss-animate` — Accordion open/close keyframe animations
- `tailwind-merge` — Merges Tailwind class strings safely
- `class-variance-authority` — Variant management for UI components

**Fonts:**
- Cormorant Garamond (display) — Loaded from Google Fonts in `src/index.css`
- Inter (body) — Loaded from Google Fonts in `src/index.css`
- Exposed as CSS vars `--font-display` and `--font-body`; consumed via Tailwind `font-display` / `font-body` utilities

**Forms:**
- React Hook Form 7.54 — Form state management
- `@hookform/resolvers` 4.1 — Schema-based validation adapter
- Zod 3.24 — Schema validation

**Data Fetching:**
- TanStack Query (React Query) 5.84 — Server-state caching, client configured at `src/lib/query-client.js`

**Build/Dev:**
- Vite 6.1 — Dev server and bundler, entry `index.html` → `src/main.jsx`
- `@vitejs/plugin-react` 4.3 — React fast refresh
- `@base44/vite-plugin` 1.0 — Base44 platform build integration

**Platform SDK:**
- `@base44/sdk` 0.8 — Base44 BaaS platform SDK; used for auth (`base44.auth.me()`, `base44.auth.logout()`, `base44.auth.redirectToLogin()`), accessed via `src/api/base44Client` (generated/injected at deploy time — not committed)

## Key Dependencies

**Critical:**
- `@base44/sdk` ^0.8.0 — Auth provider, API client; the app won't function without a valid Base44 app configuration
- `react-leaflet` ^4.2.1 — Interactive map in `src/components/restaurant/MapHours.jsx` using OpenStreetMap tiles

**UI Utilities:**
- `lucide-react` ^0.475.0 — Icon library (referenced in `components.json` as `iconLibrary: "lucide"`)
- `embla-carousel-react` ^8.5.2 — Carousel backing in `src/components/restaurant/Menucarousel.jsx`
- `next-themes` ^0.4.4 — Dark/light theme toggle (theme vars defined in `src/index.css`)
- `sonner` ^2.0.1 + `react-hot-toast` ^2.6.0 — Toast notification libraries (both present)
- `framer-motion` ^11.16.4 — Animation engine

**Installed but Usage Not Found in Application Source:**
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

**Environment:**
- Environment variables read via `import.meta.env` (Vite):
  - `VITE_BASE44_APP_ID` — Base44 application ID (required)
  - `VITE_BASE44_FUNCTIONS_VERSION` — Base44 functions version
  - `VITE_BASE44_APP_BASE_URL` — Base44 app base URL
- Params also readable from URL query string and cached in `localStorage` with `base44_` prefix; logic in `src/lib/app-param.js`
- `.env` file absent from repo (would hold secrets)

**Build:**
- `vite.config.*` — Not present in repo (Base44 platform likely injects config via `@base44/vite-plugin`)
- `postcss.config.js` — PostCSS config present (contents empty)
- `tailwind.config.js` — Tailwind config, dark mode via `["class"]`
- `jsconfig.json` — Path aliases (`@/*` → `./src/*`), type checking enabled

**Linting:**
- ESLint 9.19 flat config at `eslint.config.js`
- Plugins: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-unused-imports`
- `src/lib/**` and `src/components/ui/**` excluded from linting

## Platform Requirements

**Development:**
- Node.js (v22 in current environment)
- npm
- `VITE_BASE44_APP_ID` set to a valid Base44 app ID

**Production:**
- Deployed via Base44 platform (inferred from SDK, vite plugin, and `index.html` favicon pointing to `base44.com`)
- SPA — static file hosting, all routing client-side

---

*Stack analysis: 2026-03-26*
