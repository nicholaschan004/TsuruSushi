# Codebase Structure

**Analysis Date:** 2026-03-26

## Directory Layout

```
TsuruSushi2/
├── src/
│   ├── App.jsx                    # Root component: providers, routing, auth gate
│   ├── main.jsx                   # JS entry point (empty stub)
│   ├── index.css                  # Global styles (empty stub)
│   ├── components/
│   │   ├── restaurant/            # Domain-specific section components
│   │   │   ├── Hero.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Experience.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MapHours.jsx
│   │   │   ├── Menucarousel.jsx
│   │   │   ├── OrderReserve.jsx
│   │   │   ├── Provenance.jsx
│   │   │   └── TodaysCatch.jsx
│   │   └── ui/                    # shadcn/ui primitives (40+ components)
│   │       ├── button.jsx
│   │       ├── dialog.jsx
│   │       ├── form.jsx
│   │       ├── carousel.jsx
│   │       └── ... (all other primitives)
│   ├── hooks/
│   │   └── use-mobile.jsx         # useIsMobile() hook (768px breakpoint)
│   ├── lib/
│   │   ├── AuthContext.jsx        # Auth React context + AuthProvider + useAuth()
│   │   ├── PageNotFound.jsx       # 404 route fallback component
│   │   ├── app-param.js           # Runtime config from URL/localStorage/env
│   │   ├── query-client.js        # TanStack Query client instance (stub)
│   │   └── utils.js               # Shared utilities (stub)
│   ├── util/                      # Empty directory (reserved for utilities)
│   ├── pages/                     # NOT YET CREATED — referenced in App.jsx
│   │   └── Home.jsx               # Expected: composes restaurant section components
│   └── api/                       # NOT YET CREATED — referenced in lib/
│       └── base44Client.js        # Expected: Base44 SDK client export
├── index.html                     # HTML shell, mounts #root
├── components.json                # shadcn/ui configuration
├── jsconfig.json                  # JS compiler options + path aliases
├── tailwind.config.js             # Tailwind config (stub)
├── postcss.config.js              # PostCSS config (stub)
├── eslint.config.js               # ESLint config (stub)
├── package.json                   # Dependencies (stub)
└── .planning/
    └── codebase/                  # GSD analysis documents
```

## Directory Purposes

**`src/components/restaurant/`:**
- Purpose: All visual sections of the restaurant landing page
- Contains: One JSX file per page section, each self-contained with framer-motion animations
- Key files: `Hero.jsx` (parallax scroll hero), `Navigation.jsx` (animated nav with mobile menu), `Booking.jsx` (reservation section), `MapHours.jsx` (leaflet map + hours)

**`src/components/ui/`:**
- Purpose: Primitive UI components from shadcn/ui — do not modify directly
- Contains: Radix UI-based accessible components styled with Tailwind CSS
- Key files: `button.jsx`, `dialog.jsx`, `form.jsx`, `carousel.jsx`, `calendar.jsx`, `toast.jsx`, `toaster.jsx`
- Note: Excluded from `jsconfig.json` type checking (`src/components/ui` is in `exclude`)

**`src/lib/`:**
- Purpose: Application infrastructure — auth, config, utilities
- Contains: Context providers, config readers, shared helpers
- Key files: `AuthContext.jsx` (auth state management), `app-param.js` (runtime param resolution)

**`src/hooks/`:**
- Purpose: Shared custom React hooks
- Contains: `use-mobile.jsx` — detects viewport < 768px via `matchMedia`

**`src/util/`:**
- Purpose: Reserved for utility functions (currently empty)

**`src/pages/`:**
- Purpose: Route-level page containers that compose section components (not yet created)
- Expected: `Home.jsx` assembles `Navigation`, `Hero`, `Experience`, `TodaysCatch`, `Menucarousel`, `Provenance`, `Booking`, `MapHours`, `OrderReserve`, `Footer` sections

**`src/api/`:**
- Purpose: API client configuration (not yet created)
- Expected: `base44Client.js` exporting `base44` SDK instance used by auth and data fetching

## Key File Locations

**Entry Points:**
- `index.html`: HTML shell mounting `#root`
- `src/main.jsx`: JS entry point rendering `<App />`
- `src/App.jsx`: Root component with providers and route definitions

**Configuration:**
- `jsconfig.json`: Path alias `@/*` maps to `./src/*`
- `components.json`: shadcn/ui configuration (style: new-york, no TSX, cssVariables enabled)
- `tailwind.config.js`: Tailwind configuration (stub)

**Core Logic:**
- `src/lib/AuthContext.jsx`: All authentication logic and state
- `src/lib/app-param.js`: Runtime app configuration resolution

**UI Primitives:**
- `src/components/ui/`: All shadcn/ui primitive components

**Domain Components:**
- `src/components/restaurant/`: All restaurant landing page sections

## Naming Conventions

**Files:**
- React components: PascalCase `.jsx` (e.g., `Hero.jsx`, `AuthContext.jsx`)
- Hooks: kebab-case with `use-` prefix `.jsx` (e.g., `use-mobile.jsx`)
- UI primitives: kebab-case `.jsx` (e.g., `button.jsx`, `alert-dialog.jsx`)
- Utilities/config: kebab-case `.js` (e.g., `app-param.js`, `query-client.js`)

**Directories:**
- Feature groupings: lowercase (e.g., `restaurant/`, `ui/`, `lib/`, `hooks/`)
- Route pages: lowercase (e.g., `pages/`)

**Components:**
- Domain components: PascalCase matching visual role (e.g., `TodaysCatch`, `Menucarousel`, `OrderReserve`)
- One component per file, default exported

## Where to Add New Code

**New page route:**
- Create component: `src/pages/[PageName].jsx`
- Register route in: `src/App.jsx` inside `<Routes>`

**New restaurant section:**
- Create component: `src/components/restaurant/[SectionName].jsx`
- Follow pattern: import React + framer-motion, use `useInView` + `useRef` for scroll animations
- Import into the relevant page in `src/pages/`

**New UI primitive:**
- Add via shadcn CLI or manually: `src/components/ui/[component-name].jsx`
- Do not create custom primitives here; use for shadcn/ui additions only

**New custom hook:**
- Create: `src/hooks/use-[name].jsx`
- Use kebab-case filename with `use-` prefix

**Shared utilities:**
- Add to: `src/lib/utils.js` or `src/util/` directory
- `src/lib/utils.js` already aliased in `components.json` as `@/lib/utils`

**API client / data entities:**
- Create: `src/api/` directory and files
- The `base44Client.js` file is already expected here by `AuthContext.jsx`
- Import via `@/api/[filename]`

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD analysis documents for AI-assisted planning
- Generated: Yes (by GSD mapping commands)
- Committed: Yes

**`src/components/ui/`:**
- Purpose: shadcn/ui primitive library components
- Generated: Yes (via shadcn CLI)
- Committed: Yes
- Note: Excluded from type-checking in `jsconfig.json`; treat as third-party

---

*Structure analysis: 2026-03-26*
