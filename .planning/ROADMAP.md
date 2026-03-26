# Roadmap: Tsuru Sushi

## Overview

A nearly-complete React/Vite restaurant website needs its Base44 BaaS dependency stripped, missing configuration files created, real content populated, and the resulting static bundle deployed to Vercel. The path is strictly sequential: the project cannot run until it compiles, cannot be verified until the page assembles, cannot launch until content is real, and cannot be shared until it deploys. Four phases cover the full scope — each one unblocks the next.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Make the project compile and run with all Base44 dependencies removed
- [ ] **Phase 2: Page Assembly** - Make every section render in the browser and all CTAs functional
- [ ] **Phase 3: Content and Cleanup** - Populate real restaurant content and remove unused dependencies
- [ ] **Phase 4: SEO and Deployment** - Add structured data and ship to Vercel

## Phase Details

### Phase 1: Foundation
**Goal**: The project compiles and runs locally with zero Base44 SDK references remaining
**Depends on**: Nothing (first phase)
**Requirements**: BUILD-01, BUILD-02, BUILD-04, BUILD-05, AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts the dev server without errors
  2. `npm run build` produces a dist bundle without errors
  3. The app renders in the browser without a login screen or auth spinner
  4. `grep -r "base44" src/` returns zero results
  5. `src/lib/utils.js` exports a working `cn()` function and all shadcn components load
**Plans:** 2 plans

Plans:
- [ ] 01-01-PLAN.md — Build config and library stubs (vite.config.js, postcss, utils, query-client, toast fix)
- [ ] 01-02-PLAN.md — Auth removal, App.jsx rewrite, Home page creation, full build verification

**UI hint**: yes

### Phase 2: Page Assembly
**Goal**: All ten restaurant sections are visible on the page and every booking/reserve CTA is wired
**Depends on**: Phase 1
**Requirements**: BUILD-03, UI-01, UI-02, UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. Visiting `http://localhost:5173` shows all ten sections in scroll order with no blank gaps
  2. The Leaflet map renders with tiles and the restaurant pin (not a grey box)
  3. Clicking any Reserve or Book button opens the Resy URL (or placeholder) in a new tab
  4. All shadcn/ui components used by restaurant sections render without console errors
**Plans**: TBD
**UI hint**: yes

### Phase 3: Content and Cleanup
**Goal**: The site displays real Tsuru Sushi content, all images load from the project, and the bundle is lean
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, DEPLOY-02
**Success Criteria** (what must be TRUE):
  1. The menu carousel shows the seven real menu items with correct prices
  2. No occurrence of the word "Omakase" appears anywhere on the page
  3. All food photography loads (images served from `public/images/`, not the Base44 CDN)
  4. Contact placeholders (phone, email, Resy URL) are clearly marked for owner update
  5. `npm run build` bundle size is visibly smaller after removing unused packages
**Plans**: TBD

### Phase 4: SEO and Deployment
**Goal**: The site is live on Vercel, routes correctly, has local SEO structured data, and works on mobile
**Depends on**: Phase 3
**Requirements**: SEO-01, DEPLOY-01, DEPLOY-03, DEPLOY-04
**Success Criteria** (what must be TRUE):
  1. The site is accessible via a public Vercel URL
  2. Refreshing any URL path does not return a 404 (SPA rewrite rule works)
  3. A browser's page source includes a JSON-LD Restaurant schema block with address and hours
  4. `npm run build` completes with no errors and produces a clean dist
  5. The site loads and all sections render correctly on iPhone Safari
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Planning complete | - |
| 2. Page Assembly | 0/? | Not started | - |
| 3. Content and Cleanup | 0/? | Not started | - |
| 4. SEO and Deployment | 0/? | Not started | - |
