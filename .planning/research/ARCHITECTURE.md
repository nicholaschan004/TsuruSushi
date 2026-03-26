# Architecture Patterns

**Project:** Tsuru Sushi — Standalone React SPA
**Researched:** 2026-03-26
**Confidence:** HIGH (based on direct code inspection of existing components)

---

## Recommended Architecture

A flat single-page application. One route (`/`), no server, no backend calls at runtime. All data is hardcoded in component files. The browser loads a static asset bundle from Vercel's CDN; from there everything runs client-side.

```
index.html
  └── main.jsx          (React root mount)
        └── App.jsx     (Router + providers)
              └── Home.jsx  (page — assembles all sections in order)
                    ├── Navigation.jsx    (fixed overlay, scroll-driven)
                    ├── Hero.jsx          (section 1, parallax)
                    ├── MenuCarousel.jsx  (section 2, horizontal scroll)
                    ├── Experience.jsx    (section 3, atmosphere)
                    ├── Provenance.jsx    (section 4, sourcing story)
                    ├── TodaysCatch.jsx   (section 5, daily fish)
                    ├── Booking.jsx       (section 6, sitting times + Resy CTA)
                    ├── OrderReserve.jsx  (section 7, Resy + Toast links)
                    ├── MapHours.jsx      (section 8, Leaflet map + hours)
                    └── Footer.jsx        (section 9, brand close + social)
```

### Component Boundaries

| Component | Responsibility | External Dependencies | Communicates With |
|-----------|---------------|----------------------|-------------------|
| `main.jsx` | Mount React tree into `#root` | — | `App.jsx` |
| `App.jsx` | Router, global providers (stripped of auth) | `react-router-dom`, `@radix-ui/react-toast` | `Home.jsx`, `PageNotFound` |
| `Home.jsx` | Assemble all sections in DOM order | — | All 10 section components |
| `Navigation.jsx` | Sticky nav, scroll-hide/show, mobile drawer, anchor scrolling | `framer-motion`, `lucide-react` | None (reads `window.scrollY`, calls `document.querySelector`) |
| `Hero.jsx` | Full-height parallax hero image, split-text animation | `framer-motion` | None |
| `MenuCarousel.jsx` | Horizontal scroll carousel of menu items | `framer-motion`, `lucide-react` | None |
| `Experience.jsx` | Atmosphere / photo showcase section | `framer-motion` | None |
| `Provenance.jsx` | Sourcing story section | `framer-motion` | None |
| `TodaysCatch.jsx` | Daily fish selection list | `framer-motion` | None |
| `Booking.jsx` | Sitting time selector, Resy CTA button | `framer-motion`, `@/components/ui/button` | `button.jsx` (shadcn) |
| `OrderReserve.jsx` | Resy + Toast external links | `framer-motion`, `lucide-react` | None |
| `MapHours.jsx` | Leaflet map + operating hours table | `framer-motion`, `react-leaflet`, `leaflet` CSS | OpenStreetMap tile server (CDN, no API key) |
| `Footer.jsx` | Brand close, social links, address, copyright | `framer-motion` | None (anchor scroll to `#reserve`) |
| `button.jsx` | shadcn/ui Button primitive | `@radix-ui/react-slot`, `class-variance-authority` | — |
| `toaster.jsx` | Toast notification container (stub — needs population) | `@radix-ui/react-toast` | `App.jsx` renders it |

### Providers in App.jsx (post-strip)

The cleaned `App.jsx` needs only two providers:

```
<BrowserRouter>
  <App>          (routes only)
    <Toaster />  (global toast, already in place)
  </App>
</BrowserRouter>
```

`AuthProvider` and `QueryClientProvider` are Base44 scaffolding — neither is used by any restaurant section component. Both are removed. `@tanstack/react-query` can be removed from `package.json` entirely.

---

## Data Flow

All data flows in one direction: from hardcoded constants inside each component file down into JSX. There are no props passed between section components, no shared state, and no API calls.

```
Component file (const MENU_ITEMS = [...])
  → JSX render
    → DOM / CSS / Framer Motion animation
      → User's browser
```

### Booking interaction (local state only)

```
User clicks sitting row
  → Booking.jsx local useState(selected)
    → Button label updates
      → User clicks "Reserve" button
        → External navigation to Resy URL (window.open or <a href>)
```

The sitting times shown in `Booking.jsx` are fake/placeholder. They do not come from Resy's API — clicking reserve simply opens the Resy booking page. This is intentional per project scope.

### Map data flow

```
MapHours.jsx (POSITION constant, HOURS array)
  → react-leaflet <MapContainer>
    → OpenStreetMap tile server (external CDN, no auth)
      → Leaflet renders tiles in iframe-like canvas
```

Leaflet requires its own CSS (`leaflet/dist/leaflet.css`) to be imported somewhere before the map renders. Currently missing — this is a known bug.

### Navigation scroll behavior

```
window scroll event (passive listener)
  → Navigation.jsx useEffect → setScrolled, setVisible
    → Framer Motion AnimatePresence slide nav in/out
```

Navigation reads scroll position directly from the DOM. No React context or global state is involved.

---

## Component Build Order

Dependencies between components drive this order. Build earlier items before things that depend on them.

```
1. lib/utils.js              — cn() helper used by button.jsx; currently empty (0 bytes)
2. components/ui/button.jsx  — already populated; depends on utils.js
3. components/ui/toaster.jsx — stub (0 bytes); imported by App.jsx
4. App.jsx                   — strip AuthProvider, AuthenticatedApp, QueryClientProvider;
                               keep Router + Routes + Toaster
5. pages/Home.jsx            — does not exist yet; assembles sections in scroll order
6. Each restaurant section   — already built; no changes needed unless content updates
   (Navigation, Hero, MenuCarousel, Experience, Provenance,
    TodaysCatch, Booking, OrderReserve, MapHours, Footer)
7. index.html                — strip Base44 favicon/title, set real restaurant meta
```

**Critical path:** `utils.js` → `button.jsx` → `Booking.jsx` renders. If `utils.js` stays empty, `button.jsx` will fail to import `cn()` and crash the Booking section.

---

## Patterns to Follow

### Pattern 1: Self-Contained Section Components

Each section owns its own data as a top-level `const` array/object in the file. No props, no context. This is already how all 10 restaurant components are built and should stay that way — it makes each section independently editable.

```jsx
// Good — data lives in the file, zero coupling
const MENU_ITEMS = [{ name: "Sake", price: "8", ... }];
export default function MenuCarousel() { ... }
```

### Pattern 2: Scroll-Triggered Framer Motion with `useInView`

All sections except Hero use the `useInView` hook with `{ once: true }` to trigger entrance animations. Hero uses `useScroll` / `useTransform` for the parallax effect. Both patterns are already implemented consistently across all sections.

```jsx
const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: "-100px" });
// animate={isInView ? { opacity: 1, y: 0 } : {}}
```

### Pattern 3: Anchor-Based Internal Navigation

Navigation links use `href="#section-id"` and call `document.querySelector(href).scrollIntoView({ behavior: "smooth" })`. Section components use the matching `id` on their `<section>` element. This is the correct pattern for a single-page scroll site — no React Router `<Link>` needed for in-page navigation.

```jsx
// Navigation
{ label: "Menu", href: "#menu" }

// MenuCarousel
<section id="menu" ...>
```

### Pattern 4: External CTAs for Booking and Ordering

Neither Resy nor Toast has an embedded widget — both are plain `<a href target="_blank">` links. This is correct; it means zero third-party SDK surface area and no iframe complexity.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Keeping AuthProvider / QueryClientProvider

**What:** The existing `App.jsx` wraps everything in `<AuthProvider>` which calls Base44 APIs on mount, and `<QueryClientProvider>` which is unused by restaurant components.

**Why bad:** `AuthProvider` will throw or hang immediately at runtime because `base44Client` doesn't exist. Even if stubbed, it creates unnecessary async loading state that blocks the entire app from rendering.

**Instead:** Delete both providers from `App.jsx`. The router and `<Toaster />` are the only wrappers needed.

### Anti-Pattern 2: Importing Leaflet Without Its CSS

**What:** `MapHours.jsx` uses `react-leaflet` but Leaflet's CSS (`leaflet/dist/leaflet.css`) is not imported anywhere in the project.

**Why bad:** Map tiles and markers render broken/invisible — a visually obvious defect.

**Instead:** Add `import 'leaflet/dist/leaflet.css'` in `main.jsx` or directly in `MapHours.jsx` before the component definition.

### Anti-Pattern 3: Leaving `app-param.js` / `app-params` Import Mismatch

**What:** `AuthContext.jsx` imports from `@/lib/app-params` (plural), but the file is named `app-param.js` (singular).

**Why bad:** Vite will throw a module-not-found error at build time even if the rest of Base44 is stripped, if any remaining file still imports from the wrong path.

**Instead:** Fix the filename or remove `AuthContext.jsx` entirely (preferred, since auth is out of scope).

### Anti-Pattern 4: Fake Sitting Times in Booking.jsx Without Disclaimer

**What:** `Booking.jsx` shows "Tonight's Available Sittings" with hardcoded seat counts (4, 2, 6, 3, 1). This implies live availability data.

**Why bad:** Customers may be confused or misled; the CTA button currently has no real `href` — it renders a `<Button>` with no `onClick` navigation to Resy.

**Instead:** Wire the button to `window.open('https://resy.com/...', '_blank')` or an `<a>` tag, and change the UI copy to make clear these are example times, not live availability (or just remove the fake seat counts).

### Anti-Pattern 5: Leaving 48 Empty shadcn Stubs in Production Bundle

**What:** 48 of 49 shadcn/ui component files are 0 bytes. Vite still includes them in the module graph if anything imports them.

**Why bad:** Build warnings, potential tree-shaking confusion, and misleading codebase.

**Instead:** Only `button.jsx` and `toaster.jsx` are actually imported. Delete or ignore the rest, or populate them only when a feature needs them.

---

## Vercel Deployment Architecture

```
GitHub repo (main branch)
  └── Vercel build trigger
        └── vite build → dist/
              ├── index.html
              ├── assets/index-[hash].js   (all components bundled)
              └── assets/index-[hash].css  (Tailwind + Leaflet styles)

Vercel serves dist/ as static CDN
  └── All routes → index.html   (SPA fallback required)
```

### Vercel Config Required

A `vercel.json` with SPA routing fallback prevents 404s if users deep-link or reload. For a single-route app this is technically optional, but it is best practice:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

No `vite.config.js` currently exists in the project (Vite falls back to defaults). A minimal config is needed to register the `@vitejs/plugin-react` plugin and the `@` path alias:

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
});
```

The `@base44/vite-plugin` in `package.json` must be removed — it injects Base44-specific build behavior that will fail outside the Base44 platform.

---

## Scalability Considerations

This is a static brochure site. Scalability is not a meaningful concern. The relevant operational concerns are:

| Concern | Current State | Mitigation |
|---------|--------------|------------|
| Image hosting | All images on `media.base44.com` CDN | Verify URLs still resolve after SDK removal; if not, migrate to Vercel's `/public` folder or a free CDN (Cloudinary free tier) |
| Content updates | Hardcoded in component files | Owner must submit code changes; acceptable for infrequent updates |
| Booking availability | Fake/static data | Links to Resy, which handles real availability |
| Bundle size | ~15 unused large packages (Stripe, Three.js, recharts, etc.) | Remove from `package.json` to cut build time and bundle size significantly |

---

## Build Order for Roadmap Phases

Based on component dependencies, the natural phase sequence is:

**Phase 1 — Foundation (unblock the build)**
- Fix `utils.js` (populate `cn()`)
- Populate `toaster.jsx`
- Strip `App.jsx` of auth/query wrappers
- Add `vite.config.js` with `@` alias + react plugin, remove `@base44/vite-plugin`
- Fix `index.html` meta (title, favicon)
- Verify Vite build succeeds locally

**Phase 2 — Page Assembly**
- Create `src/pages/Home.jsx` composing all 10 section components in scroll order
- Import `leaflet/dist/leaflet.css` in `main.jsx`
- Wire Booking button to Resy URL
- Verify all sections render in browser

**Phase 3 — Content + Polish**
- Replace placeholder content (menu items, catches, hours) with real restaurant data
- Verify Base44 CDN image URLs still load; migrate any broken images to `/public`
- Remove unused `package.json` dependencies

**Phase 4 — Deployment**
- Add `vercel.json` SPA rewrite rule
- Connect repo to Vercel
- Confirm production build and live URL

---

## Sources

- Direct code inspection: `src/App.jsx`, `src/components/restaurant/*`, `src/lib/*`, `package.json`, `jsconfig.json`, `index.html`
- Framer Motion `useInView` / `useScroll` patterns: confirmed in component source (HIGH confidence)
- Leaflet CSS import requirement: confirmed in react-leaflet documentation (HIGH confidence — well-known requirement)
- Vercel SPA routing via `vercel.json` rewrites: standard Vercel static deployment pattern (HIGH confidence)
- `@` alias requires Vite `resolve.alias` config: confirmed by jsconfig.json showing the alias but no `vite.config.js` present in project root (HIGH confidence)
