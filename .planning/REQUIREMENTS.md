# Requirements: Tsuru Sushi

**Defined:** 2026-03-26
**Core Value:** Customers can find Tsuru Sushi online, browse the menu, and book a reservation through Resy

## v1 Requirements

Requirements for initial launch. Each maps to roadmap phases.

### Build Infrastructure

- [ ] **BUILD-01**: App compiles and runs in dev mode (`npm run dev` succeeds)
- [ ] **BUILD-02**: `vite.config.js` exists with React plugin and `@/*` path alias
- [ ] **BUILD-03**: `src/pages/Home.jsx` assembles all restaurant section components into a single page
- [ ] **BUILD-04**: `src/lib/utils.js` exports `cn()` utility (required by all shadcn/ui components)
- [ ] **BUILD-05**: `src/lib/query-client.js` exports a configured QueryClient instance

### Base44 Removal

- [ ] **AUTH-01**: Base44 SDK auth gating removed from App.jsx — app renders without login
- [ ] **AUTH-02**: AuthProvider/AuthContext stripped or replaced with a no-op wrapper
- [ ] **AUTH-03**: All `base44Client` import references removed or stubbed
- [ ] **AUTH-04**: `app-param.js` / `app-params.js` import mismatch fixed

### UI Fixes

- [ ] **UI-01**: Leaflet CSS imported so map renders correctly with tiles and controls
- [ ] **UI-02**: Required shadcn/ui component stubs populated (at minimum: toaster, any others imported by restaurant components)
- [ ] **UI-03**: All booking/reserve buttons link to Resy URL (placeholder URL until owner provides real one)
- [ ] **UI-04**: Booking section "Reserve" button has a working click handler

### Content

- [ ] **CONT-01**: Menu carousel updated with real menu items and prices:
  - Sushi Bento Box — $30.95
  - Regular Sushi — $28.95
  - Combo Sushi — $32.95
  - Sushi & Sashimi — $35.95
  - Chirashi — $39.95
  - Moriawase Sashimi — $39.95
  - Tsuru Sashimi — $78.00
- [ ] **CONT-02**: "Omakase" references changed to "Chef's Daily Special" throughout the site
- [ ] **CONT-03**: Base44 CDN images validated or downloaded to `public/images/` as fallback
- [ ] **CONT-04**: Placeholder content clearly marked for owner to update later (phone, email, Resy URL)

### SEO

- [ ] **SEO-01**: JSON-LD structured data (Restaurant schema) added with name, address, hours, cuisine type

### Deployment

- [ ] **DEPLOY-01**: `vercel.json` created with SPA rewrite rule (all routes → `index.html`)
- [ ] **DEPLOY-02**: Unused dependencies removed from `package.json` (~15 packages)
- [ ] **DEPLOY-03**: `npm run build` produces a clean production bundle with no errors
- [ ] **DEPLOY-04**: Site deployed to Vercel and accessible via public URL

### Full Menu Page

- [ ] **MENU-01**: Dedicated `/menu` route with complete menu organized by category (Nigiri, Rolls, Handrolls, Specials, etc.)
- [ ] **MENU-02**: Menu data sourced from Google Sheets — owner can edit items, prices, descriptions, and image URLs without a redeploy
- [ ] **MENU-03**: Homepage menu carousel links to the full menu page

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### SEO & Social

- **SEO-V2-01**: Open Graph meta tags for social sharing previews
- **SEO-V2-02**: `sitemap.xml` and `robots.txt` for search crawlers
- **SEO-V2-03**: Google Analytics or Plausible for traffic tracking

### Content Management

- **CMS-01**: Admin interface or CMS for updating menu items without code changes
- **CMS-02**: Dynamic "Today's Catch" data from a backend source
- **CMS-03**: Configurable operating hours without redeployment

### Performance

- **PERF-01**: Image optimization with lazy loading and responsive `srcset`
- **PERF-02**: Lighthouse performance score above 90

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication / accounts | No value for a 12-seat restaurant — public site only |
| Online ordering / payments | Stripe deps unused; orders handled in-person |
| Real-time Resy availability API | Complexity not justified — direct link is sufficient |
| Server-side rendering | Static SPA is fast enough for a single-page restaurant site |
| Test suite | Focus on shipping to production first |
| CMS / admin panel | Content changes are infrequent; edit in code for v1 |
| Mobile app | Web-first; mobile responsive is sufficient |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUILD-01 | Phase 1 | Pending |
| BUILD-02 | Phase 1 | Pending |
| BUILD-03 | Phase 2 | Pending |
| BUILD-04 | Phase 1 | Pending |
| BUILD-05 | Phase 1 | Pending |
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| UI-01 | Phase 2 | Pending |
| UI-02 | Phase 2 | Pending |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 2 | Pending |
| CONT-01 | Phase 3 | Pending |
| CONT-02 | Phase 3 | Pending |
| CONT-03 | Phase 3 | Pending |
| CONT-04 | Phase 3 | Pending |
| SEO-01 | Phase 4 | Pending |
| DEPLOY-01 | Phase 4 | Pending |
| DEPLOY-02 | Phase 3 | Pending |
| DEPLOY-03 | Phase 4 | Pending |
| DEPLOY-04 | Phase 4 | Pending |
| MENU-01 | Phase 5 | Pending |
| MENU-02 | Phase 5 | Pending |
| MENU-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-26 after roadmap creation*
