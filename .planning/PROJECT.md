# Tsuru Sushi

## What This Is

A production restaurant website for Tsuru Sushi — a Japanese sushi restaurant. The site is a single-page React application featuring a hero section, navigation, menu carousel, experience showcase, provenance story, today's catch, booking section, order/reserve CTAs, map with hours, and footer. The frontend components are mostly built but the app is non-functional due to missing files, broken imports, and Base44 platform dependencies that need to be stripped out for standalone Vercel deployment.

## Core Value

Customers can find Tsuru Sushi online, browse the menu, and book a reservation through Resy — a polished, working restaurant website that represents the brand.

## Requirements

### Validated

- ✓ Hero section with parallax imagery — existing
- ✓ Sticky navigation with scroll behavior — existing
- ✓ Menu carousel with dish categories — existing
- ✓ Experience/atmosphere showcase section — existing
- ✓ Provenance/sourcing story section — existing
- ✓ Today's catch/daily selection section — existing
- ✓ Booking section with sitting times — existing
- ✓ Order/reserve CTA section — existing
- ✓ Interactive map with operating hours — existing
- ✓ Footer with contact info and links — existing

### Active

- [ ] Strip Base44 SDK dependency — remove auth, make standalone static SPA
- [ ] Fix broken imports and missing files (Home page, query-client, utils, base44Client references)
- [ ] Populate empty shadcn/ui component stubs that are actually used
- [ ] Import Leaflet CSS so map renders correctly
- [ ] Wire all booking/reserve buttons to Resy URL (placeholder for now)
- [ ] Update hardcoded content with real restaurant data (menu, hours, catches)
- [ ] Remove unused dependencies to reduce bundle size
- [ ] Configure Vite build for Vercel deployment
- [ ] Deploy to Vercel with proper environment setup

### Out of Scope

- Base44 platform integration — stripping it out, deploying standalone
- User authentication / login — not needed for a public restaurant site
- Real-time booking availability from Resy API — just link to Resy
- CMS or admin panel for content updates — content lives in code for now
- Online ordering / payments — Stripe dependencies unused, removing them
- Server-side rendering — static SPA is sufficient
- Test suite — focus on getting to production first

## Context

- Built on a Base44 app template which scaffolded many unused dependencies and empty component stubs
- 10 restaurant section components in `src/components/restaurant/` are fully built with Framer Motion animations
- 48+ shadcn/ui component files exist but most are empty (0 bytes) — only need to populate the ones actually imported
- `src/pages/Home.jsx` doesn't exist yet — needs to assemble the section components
- `src/api/base44Client` is referenced but doesn't exist — needs to be removed or stubbed out
- `src/lib/app-param.js` filename doesn't match its import (`app-params` with an "s")
- Content (menu items, hours, fish catches) is hardcoded and needs real data from the owner
- All images hosted on `media.base44.com` CDN — will need to verify these remain accessible after decoupling from Base44

## Constraints

- **Hosting**: Vercel — free tier, static SPA deployment
- **Booking**: Resy link only — no custom booking backend
- **Content**: Hardcoded in components — no CMS, owner provides updates via code changes
- **Images**: Currently on Base44 CDN — may need to migrate if access is lost after decoupling
- **Budget**: Minimal — free Vercel tier, no paid services

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Strip Base44 SDK | Not needed for static restaurant site, simplifies deployment | — Pending |
| Deploy on Vercel | Free, excellent DX for React SPAs, automatic deploys | — Pending |
| Resy link (not API) | Simpler than building booking integration, Resy handles availability | — Pending |
| No CMS | Content changes are infrequent enough to edit in code | — Pending |
| Remove unused deps | Base44 template included ~15 unused large packages | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-26 after initialization*
