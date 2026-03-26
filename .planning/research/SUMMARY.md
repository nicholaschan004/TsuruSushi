# Project Research Summary

**Project:** Tsuru Sushi — Base44 SDK Removal and Standalone Vercel Deployment
**Domain:** Restaurant website (static SPA), BaaS decoupling
**Researched:** 2026-03-26
**Confidence:** HIGH

## Executive Summary

Tsuru Sushi is a nearly-complete React/Vite single-page restaurant website that was scaffolded on the Base44 BaaS platform. The entire visual product — 10 scroll-animated sections, a Leaflet map, a menu carousel, and a Framer Motion-driven narrative layout — already exists and works. The only task is severing the Base44 dependency, creating the handful of missing configuration files the platform was injecting at build time, and deploying the resulting static bundle to Vercel. This is a cleanup and deployment project, not a build-from-scratch project.

The recommended approach is surgical and sequential: first make the project compile (vite.config.js, empty stubs, App.jsx strip), then assemble the page (Home.jsx, Leaflet CSS, Resy CTA wiring), then replace placeholder content with real restaurant data, then deploy. The codebase is structurally sound — the Base44 scaffold left behind a kitchen-sink dependency list and a set of auth wrappers layered over components that never needed them. Stripping those layers exposes a clean, self-contained SPA.

The key risk is that several failures are silent or non-obvious: a missing vite.config.js prevents the build from starting at all, two 0-byte stub files cause runtime crashes in shadcn components, the Leaflet map renders as a grey box without its CSS import, the Reserve button does nothing when clicked, and all food photography may vanish if the Base44 CDN account is deactivated before images are migrated. All five risks are known, documented, and straightforwardly preventable — they are not architecture problems, they are a missing checklist.

---

## Key Findings

### Recommended Stack

The stack is already chosen and correct for this project. The work is configuration and cleanup, not technology selection. Vite 6 + React 18 + Tailwind 3.4 + Framer Motion + React Router 6 is the keeper set. Approximately 17 packages installed by the Base44 scaffold have zero imports in the source and can be removed immediately (Three.js at ~580kB gzipped, Stripe, recharts, html2canvas, jspdf, and others) — their presence is build overhead, not a feature gap.

Two new files must be created that the Base44 platform previously injected: `vite.config.js` (registers the `@` path alias and React plugin) and `vercel.json` (SPA routing fallback). Without these two files, the project cannot build locally and cannot route correctly in production. These are the only net-new configuration artifacts the project needs.

**Core technologies:**
- Vite 6 + `@vitejs/plugin-react`: build tooling — already installed, needs `vite.config.js` created
- React 18.2 + React Router 6: UI framework and routing — keep as-is, no upgrade needed
- Tailwind CSS 3.4: styling — all 10 components use it; defer Tailwind 4 upgrade
- Framer Motion 11: scroll animations throughout — keep, brand-appropriate for omakase positioning
- react-leaflet + leaflet: interactive map — working but requires missing CSS import
- embla-carousel-react: menu carousel — working as-is
- shadcn/ui (button + toaster only): UI primitives — 48 of 49 component stubs are 0-byte and unused

### Expected Features

The feature set is already built and correct for the restaurant type. The primary gap is content wiring (real Resy URL, real phone/address, real images) and one missing meta layer (Open Graph tags, JSON-LD structured data). No new features should be added in this milestone — the anti-feature list is as important as the feature list.

**Must have (table stakes — all built, some need wiring):**
- Booking / reservation CTA linking to live Resy URL — buttons exist but have no `href`
- Operating hours with today's day highlighted — built in MapHours, works at runtime
- Interactive map at correct address (37.7249, -122.1561 San Leandro) — built, needs Leaflet CSS
- Phone number as clickable `tel:` link — likely in Footer, needs real number
- Food photography — all images on Base44 CDN, must be migrated before account close
- Mobile-responsive layout — assumed built, must be verified on iPhone Safari before launch
- Open Graph meta tags — missing from `index.html`; single most-missed pre-launch SEO item

**Should have (differentiators — built):**
- Sitting-time display communicating scarcity and exclusivity
- Today's Catch freshness signal (content needs real fish names; heading may need softening)
- Provenance / sourcing story section
- Scroll-based single-page narrative mimicking meal progression
- Framer Motion scroll animations for premium brand feel

**Defer (v2+):**
- CMS / admin panel for self-serve content updates
- Resy real-time availability widget (iframe complexity, not worth it)
- Newsletter, social feed embeds, chat widget — explicitly anti-features for this brand
- Tailwind 4 / React 19 upgrades — breaking changes, out of scope

### Architecture Approach

The architecture is a flat static SPA: one route (`/`), no server, no API calls at runtime. `Home.jsx` assembles 10 self-contained section components in scroll order. Each section owns its own data as top-level constants — no props between sections, no shared state, no context. The only runtime external call is OpenStreetMap tile loading by Leaflet (no API key required). `App.jsx` needs its Base44 auth wrappers removed entirely; the cleaned version needs only `<BrowserRouter>`, `<Routes>`, and `<Toaster />`.

**Major components:**
1. `vite.config.js` — missing configuration artifact; blocks all development until created
2. `App.jsx` (stripped) — Router + Routes only; AuthProvider and QueryClientProvider removed
3. `pages/Home.jsx` — does not exist yet; assembles all 10 sections in correct scroll order
4. `src/lib/utils.js` — currently 0 bytes; must export `cn()` or all shadcn components crash
5. `components/ui/toaster.jsx` — currently 0 bytes; imported by App.jsx; must be populated
6. All 10 restaurant section components — already built; no changes needed except content

### Critical Pitfalls

1. **Missing `vite.config.js`** — every `@/` import fails at build time; create this file first, before touching any other file. The `@base44/vite-plugin` must also be removed from package.json simultaneously.

2. **AuthProvider strip is incomplete without clearing all consumers** — `App.jsx` loading gate (`isLoadingAuth`) will show a spinner forever if left in place; `PageNotFound.jsx` still imports `base44Client` and will crash the build; `grep -r "base44Client" src/` must return zero results before moving on.

3. **`utils.js` and `toaster.jsx` are 0-byte stubs** — the build completes but every shadcn component crashes at runtime with "cn is not a function"; implement `cn()` using `clsx` + `tailwind-merge` (both already installed) before running the dev server.

4. **Leaflet CSS import is missing** — `MapHours.jsx` renders as a grey box with no tiles; add `import 'leaflet/dist/leaflet.css'` in `main.jsx` before other CSS.

5. **Base44 CDN images will 404 when the account is deactivated** — download all 6+ images and commit them to `public/images/` before closing the Base44 account; this is time-sensitive and irreversible once the account closes.

---

## Implications for Roadmap

Based on research, the natural phase sequence is driven by hard dependencies — nothing can run until the Vite config exists, nothing can render until App.jsx is clean, nothing can be tested until the page is assembled. Four phases cover the full scope.

### Phase 1: Foundation — Make the Project Compile

**Rationale:** The project cannot be built or developed locally until `vite.config.js` exists and the `@` alias is registered. This is the hard prerequisite for every other task. The Base44 auth wrappers must also be removed in this same phase because they will throw immediately on first render, masking all other work.

**Delivers:** A working `npm run dev` and `npm run build` with zero SDK references remaining.

**Key tasks:**
- Create `vite.config.js` with React plugin and `@` alias
- Remove `@base44/vite-plugin` from package.json
- Strip `App.jsx` of `AuthProvider`, `AuthenticatedApp`, `QueryClientProvider`
- Implement `cn()` in `src/lib/utils.js`
- Populate `src/lib/query-client.js` (or delete if QueryClientProvider is removed)
- Populate `src/components/ui/toaster.jsx`
- Replace `PageNotFound.jsx` with a static component (remove `base44Client` import)
- Remove `UserNotRegisteredError` import from App.jsx

**Avoids pitfalls:** #1 (missing vite.config), #2 (auth strip incomplete), #3 (0-byte stubs), #5 (PageNotFound SDK survivor)

**Research flag:** Standard patterns — no additional research needed. All tasks are mechanical file edits.

---

### Phase 2: Page Assembly — Make Everything Render

**Rationale:** Once the build succeeds, the page cannot display because `Home.jsx` does not exist. This phase creates the missing page file, fixes the Leaflet map, wires the booking CTA, and verifies all sections render correctly in the browser.

**Delivers:** A fully functional dev environment where every section renders and the Reserve button navigates to Resy.

**Key tasks:**
- Create `src/pages/Home.jsx` assembling all 10 sections in scroll order
- Add `import 'leaflet/dist/leaflet.css'` in `main.jsx`
- Fix Leaflet marker icon path (Vite + Leaflet known icon path issue)
- Wire Booking.jsx Reserve button to `window.open(RESY_URL, '_blank')`
- Wire `OrderReserve.jsx` Resy and Toast links to real URLs (or confirmed placeholders)
- Verify all 10 sections render correctly in browser

**Avoids pitfalls:** #4 (Leaflet CSS), #6 (dead Reserve button)

**Research flag:** Standard patterns — Leaflet icon fix is documented and well-known.

---

### Phase 3: Content and Image Migration

**Rationale:** The site must have real content before launch. This phase is time-sensitive because the Base44 CDN images are at risk once the SDK is removed — they should be migrated before the Base44 account is closed or deactivated.

**Delivers:** A site with real restaurant content, self-hosted images, and no remaining Base44 dependencies at runtime.

**Key tasks:**
- Download all images from `media.base44.com` and commit to `public/images/`
- Update image `src` constants in `Hero.jsx`, `Booking.jsx`, `Experience.jsx`, `MenuCarousel.jsx`
- Replace placeholder content: real phone number, hours, address, Today's Catch fish names
- Consider renaming "Today's Catch" to "Featured Selection" if content won't be updated daily
- Remove unused heavy packages: `moment`, `three`, `html2canvas`, `jspdf`, `react-quill`, `recharts`, `@hello-pangea/dnd`, `@stripe/*`, `canvas-confetti`, `react-hot-toast`, `react-day-picker`, `react-markdown`, `react-resizable-panels`
- Remove `@base44/sdk` from package.json
- Update `index.html`: real `<title>`, local favicon, correct `<meta name="description">`, remove broken manifest link

**Avoids pitfalls:** #7 (Base44 CDN images), #8 (unused dependencies), #10 (wrong title/favicon)

**Research flag:** No research needed — purely mechanical content and cleanup tasks.

---

### Phase 4: SEO, Deployment, and Launch

**Rationale:** The deployment configuration and SEO additions are the last step before sharing the URL publicly. Open Graph tags and JSON-LD structured data are the highest-ROI SEO additions and take under 2 hours combined.

**Delivers:** A live URL on Vercel with correct routing, social share previews, and local SEO structured data.

**Key tasks:**
- Create `vercel.json` with SPA rewrite rule
- Add Open Graph meta tags to `index.html` (`og:title`, `og:description`, `og:image`, `og:url`)
- Add Schema.org Restaurant JSON-LD to `index.html` (hours, address, phone, cuisine, priceRange)
- Add `<link rel="canonical">` to `index.html`
- Connect repo to Vercel; confirm build command (`npm run build`) and output dir (`dist`)
- Verify production deployment: all routes, all images, map renders, Reserve button navigates
- Verify on iPhone Safari (mobile layout)

**Avoids pitfalls:** #9 (Vercel 404 on direct URL), #10 (wrong index.html meta)

**Research flag:** Standard patterns — Vercel Vite deployment and Open Graph tags are well-documented.

---

### Phase Ordering Rationale

- Phase 1 is an absolute prerequisite for everything else — a broken build blocks all development.
- Phase 2 follows immediately because a blank page blocks content verification.
- Phase 3 should happen before the Base44 account is deactivated — image migration is time-sensitive.
- Phase 4 is last because the Vercel URL and deployed assets are required for og:url and canonical URL values.
- No phase requires deeper research: this is an established SPA stack with documented deployment patterns. All pitfalls are already fully characterized from direct code inspection.

### Research Flags

Phases likely needing deeper research during planning:
- **None.** Every task in every phase has a specific, documented solution derived from direct code inspection and official Vercel/Vite documentation. The `/gsd:research-phase` step can be skipped for all four phases.

Phases with standard patterns:
- **All four phases** — static SPA deployment, Vite configuration, React component assembly, and Open Graph meta tags are all established, well-documented patterns.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Derived from direct package.json and source code analysis; Vercel Vite integration confirmed via official docs |
| Features | HIGH | Restaurant website patterns are a mature domain; table stakes stable for 5+ years; SEO schema from Schema.org and Google docs |
| Architecture | HIGH | Based on direct component-by-component code inspection; zero inference — every finding has a specific file reference |
| Pitfalls | HIGH | All pitfalls derived from direct codebase inspection with specific file and line references; no theory |

**Overall confidence:** HIGH

### Gaps to Address

- **Real Resy URL:** The actual Tsuru Sushi Resy profile URL is not known. This must be obtained from the restaurant owner before Phase 2 completes. All booking CTAs depend on it.
- **Real contact details:** Phone number, email, and social media URLs are placeholders. Owner must supply these before Phase 3 completes.
- **Image availability window:** Unknown how long Base44 CDN images remain accessible after SDK removal. Treat image migration as urgent — do it in Phase 3 before closing the Base44 account, not after.
- **Leaflet marker icon:** Vite + Leaflet has a known marker icon path resolution issue. The fix is documented (manual `L.Icon.Default.mergeOptions(...)`) but should be verified in Phase 2 since the exact behavior may vary by Vite version.
- **Font loading strategy (minor):** `index.css` uses `@import` for Google Fonts which is render-blocking. This is a post-launch optimization, not a blocker.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — `src/App.jsx`, `src/lib/*`, `src/components/restaurant/*`, `package.json`, `jsconfig.json`, `index.html`
- Vercel official docs (`vercel.com/docs/frameworks/vite`, `vercel.com/docs/builds/configure-a-build`, `vercel.com/docs/environment-variables`)
- Vite documentation — `resolve.alias`, `defineConfig`, `manualChunks`
- react-leaflet documentation — CSS import requirement

### Secondary (MEDIUM confidence)
- Schema.org Restaurant type — structured data recommendations
- Google Search Central — local business structured data patterns
- Open Graph protocol (`ogp.me`) — meta tag format

### Tertiary (LOW confidence)
- Cloudinary free tier limits — inferred from training data, not verified current pricing
- `manualChunks` vendor splitting strategy — standard Rollup pattern; specific chunk names are judgment calls

---
*Research completed: 2026-03-26*
*Ready for roadmap: yes*
