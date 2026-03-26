# External Integrations

**Analysis Date:** 2026-03-26

## APIs & External Services

**Base44 BaaS Platform:**
- SDK: `@base44/sdk` ^0.8.0
- Auth: Bearer token stored in `localStorage` under key `base44_access_token`; passed via `X-App-Id` header
- API base: `/api/apps/public` (proxied — Base44 platform handles routing)
- Client: `src/api/base44Client` (generated/injected by Base44 platform at build/deploy time — file not committed to repo; imported by `src/lib/AuthContext.jsx` and `src/lib/PageNotFound.jsx`)
- App ID: `VITE_BASE44_APP_ID` env var (also settable via `?app_id=` URL param)

**Resy (Reservations):**
- Integration type: External deep link only
- Usage: `src/components/restaurant/OrderReserve.jsx` links to `https://resy.com`
- No SDK or API key required — pure outbound link

**Toast POS (Takeout Orders):**
- Integration type: External deep link only
- Usage: `src/components/restaurant/OrderReserve.jsx` links to `https://www.toasttab.com`
- No SDK or API key required — pure outbound link

**Google Maps:**
- Integration type: External link only
- Usage: `src/components/restaurant/MapHours.jsx` — "Get Directions" link to `https://maps.google.com/?q=1427+E+14th+St+San+Leandro+CA+94577`
- No Maps API key, no embed — pure hyperlink

**Stripe (Installed, Not Actively Used):**
- SDKs present: `@stripe/react-stripe-js` ^3.0.0, `@stripe/stripe-js` ^5.2.0
- No Stripe components, hooks, or keys found in application source
- Status: Dependencies installed but not wired up

## Data Storage

**Databases:**
- None directly. The Base44 platform manages all backend data storage; the frontend communicates exclusively through the `@base44/sdk` client.

**File Storage:**
- Base44 Media CDN — All application images are served from `https://media.base44.com/images/public/{appId}/`
  - Hero: `src/components/restaurant/Hero.jsx`
  - Chef: `src/components/restaurant/Booking.jsx`
  - Omakase: `src/components/restaurant/Experience.jsx`
  - Menu items: `src/components/restaurant/Menucarousel.jsx`

**Caching:**
- TanStack Query (`@tanstack/react-query` 5.84) — In-memory client-side cache for server state
- Client instance: `src/lib/query-client.js`
- Auth token and app params: `localStorage` (keys prefixed `base44_`)

## Authentication & Identity

**Auth Provider:**
- Base44 platform auth — managed via `@base44/sdk`
- Implementation: `src/lib/AuthContext.jsx` — React context wrapping the entire app in `src/App.jsx`
- Flow:
  1. Checks app public settings via `/api/apps/public/prod/public-settings/by-id/{appId}`
  2. If `access_token` present in URL or localStorage, calls `base44.auth.me()` to hydrate user
  3. On `auth_required` (403), calls `base44.auth.redirectToLogin(returnUrl)` — redirects to Base44 login page
  4. On `user_not_registered` (403), renders `src/components/UserNotRegisteredError`
  5. Logout: `base44.auth.logout(returnUrl)` — clears token and optionally redirects
- Token storage: `localStorage` key `base44_access_token`; also accepted via `?access_token=` URL param (removed from URL after read)

## Mapping

**OpenStreetMap / Leaflet:**
- Library: `react-leaflet` ^4.2.1
- Usage: `src/components/restaurant/MapHours.jsx` — interactive map centered on `[37.7249, -122.1561]` (1427 E 14th St, San Leandro, CA)
- Tile provider: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` — no API key required
- No custom Leaflet config file

## Fonts

**Google Fonts:**
- Loaded via `@import url(...)` in `src/index.css`
- Families: `Cormorant+Garamond` (display), `Inter` (body)
- No API key required — public CDN

## Monitoring & Observability

**Error Tracking:** None detected

**Logs:** `console.error` only — in `src/lib/AuthContext.jsx` for auth failures

## CI/CD & Deployment

**Hosting:** Base44 platform (inferred from `@base44/vite-plugin`, SDK, and `index.html` pointing to `base44.com`)

**CI Pipeline:** Not detected — no `.github/`, `.circleci/`, or similar config present

**Manifest:** `index.html` references `/manifest.json` (PWA manifest — file not found in repo, likely injected by platform)

## Environment Configuration

**Required env vars:**
- `VITE_BASE44_APP_ID` — Base44 app identifier (critical; app will not load without it)

**Optional env vars:**
- `VITE_BASE44_FUNCTIONS_VERSION` — Pinned functions version
- `VITE_BASE44_APP_BASE_URL` — Override for app base URL

**Secrets location:**
- `.env` file (not committed) — should hold `VITE_BASE44_APP_ID` and related vars
- Auth tokens are runtime-only, stored in `localStorage` client-side

## Webhooks & Callbacks

**Incoming:** None detected

**Outgoing:** None detected — all third-party integrations (Resy, Toast) are outbound hyperlinks only; no server-to-server calls

---

*Integration audit: 2026-03-26*
