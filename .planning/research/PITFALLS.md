# Domain Pitfalls

**Domain:** Restaurant website — BaaS SDK removal, static SPA standalone deployment on Vercel
**Researched:** 2026-03-26
**Confidence:** HIGH — all findings derived from direct codebase inspection, not theory

---

## Critical Pitfalls

Mistakes that cause the app to not compile, deploy, or render at all.

---

### Pitfall 1: Stripping AuthProvider Without Deleting Its Consumers

**What goes wrong:** `AuthProvider` and `useAuth` are removed from `src/lib/AuthContext.jsx`, but
`src/App.jsx` still wraps the entire app in `<AuthProvider>` and `AuthenticatedApp` still calls
`useAuth()`. The build fails with module-not-found or the hook throws "must be used within AuthProvider."

**Why it happens:** Auth wrappers are invisible middleware — they are easy to forget when the surface
change is "just delete the SDK." The real deletion target is `App.jsx`, not only `AuthContext.jsx`.

**Consequences:** App cannot render at all. The loading spinner loop (`isLoadingAuth` / `isLoadingPublicSettings`)
gates the entire `<Routes>` block — if these states are never set to false, the site shows only a spinner forever.

**Prevention:**
- Delete both `AuthContext.jsx` and remove `AuthProvider`/`AuthenticatedApp` from `App.jsx` in the same commit.
- Replace `App.jsx` with a direct, flat render: `<Router><Routes><Route path="/" element={<Home />} /></Routes></Router>`.
- Do not leave `isLoadingAuth: true` as a default state anywhere — it will permanently gate the app.

**Detection:** `npm run build` exits with "cannot find module `@/api/base44Client`" — the first signal that
`AuthContext.jsx` still imports the SDK.

**Phase:** SDK stripping phase (first phase).

---

### Pitfall 2: Missing `vite.config.js` Means the `@` Alias Never Works

**What goes wrong:** The entire codebase uses `@/` path aliases (e.g., `import { cn } from "@/lib/utils"`).
These aliases are defined in `jsconfig.json` for editor tooling, but Vite resolves imports at build time
using its own config — not `jsconfig.json`. Without a `vite.config.js` that sets `resolve.alias`,
every `@/` import fails at build time with "Module not found."

**Why it happens:** The project was built on the Base44 platform which injected a `vite.config.js`
at build time. That file was never committed to the repo. There is currently no `vite.config.js` on disk.

**Consequences:** `npm run build` fails on the first `@/` import. `npm run dev` also fails. The app
cannot be worked on locally or deployed without this file.

**Prevention:**
- Create `vite.config.js` as the very first step before touching any other file:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
```
- Do NOT include `@base44/vite-plugin` in the new config — it is platform-only and must be removed
  from `package.json` as well.

**Detection:** `npm run dev` immediately exits with "Failed to resolve import `@/App.jsx`".

**Phase:** SDK stripping phase / Vite config setup (must be first task).

---

### Pitfall 3: `utils.js` and `query-client.js` Are 0-Byte Stubs — Every shadcn Component Will Fail

**What goes wrong:** `src/lib/utils.js` is empty. Every single shadcn/ui component imports `cn()` from
`@/lib/utils`. The build succeeds (no syntax error in an empty file), but every shadcn component that
calls `cn()` throws a runtime error: "cn is not a function." Additionally `src/lib/query-client.js`
is empty, so `QueryClientProvider` receives `undefined` as its `client` prop and throws immediately on mount.

**Why it happens:** Base44 injects these files at deploy time. They were never scaffolded locally.

**Consequences:**
- `Toaster` (used in `App.jsx`) crashes on mount — the app renders nothing.
- All Radix-based UI components (Carousel, Button, Dialog, etc.) crash silently.
- `QueryClientProvider` throws, blocking the entire render tree.

**Prevention:**
- Implement both files before running the dev server:
  - `utils.js`: export `cn` using `clsx` + `tailwind-merge` (both already in `package.json`)
  - `query-client.js`: `export const queryClientInstance = new QueryClient()`
- Since `QueryClientProvider` is only needed if actual queries are used (the restaurant components use none),
  consider removing it entirely from `App.jsx` after the SDK strip.

**Detection:** React DevTools console shows "cn is not a function" or "client is required" on first render.

**Phase:** SDK stripping phase.

---

### Pitfall 4: The Leaflet Map Renders Completely Broken Without the CSS Import

**What goes wrong:** `react-leaflet` renders a `MapContainer` in `MapHours.jsx`, but `leaflet/dist/leaflet.css`
is never imported anywhere in the codebase. Without this CSS, the map tiles do not display (grey boxes),
the zoom controls are unstyled, the marker icon is broken (missing image URL fallback), and the map container
has zero height if no explicit height is set in CSS.

**Why it happens:** `react-leaflet` is a thin React wrapper — it does not include or auto-inject Leaflet's CSS.
This is documented in Leaflet's setup instructions but easy to miss when inheriting scaffolded code.

**Consequences:** The entire map section appears broken on the live site. A visually broken section on
a restaurant website undermines brand trust immediately.

**Prevention:**
- Add `import 'leaflet/dist/leaflet.css'` to `src/main.jsx` before `import '@/index.css'`.
- The `MapContainer` already sets `style={{ height: "100%", width: "100%" }}` and its parent has
  `style={{ height: "520px" }}` — this is correct. The only missing piece is the CSS import.
- Verify the marker icon renders (Vite + Leaflet has a known icon path issue — may need to set
  `L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl })` manually).

**Detection:** The map section renders as a grey empty box. Browser console shows 404 errors for
`marker-icon.png` and `marker-shadow.png`.

**Phase:** Fix broken imports phase.

---

### Pitfall 5: `PageNotFound.jsx` Still Imports the SDK After the Strip

**What goes wrong:** After removing `base44Client`, the `PageNotFound` component still imports
`base44` from `@/api/base44Client` and calls `base44.auth.me()` inside a `useQuery`. This causes
a build failure on the 404 route even if the main app is working.

**Why it happens:** `PageNotFound` is easy to overlook because it is only rendered on the `*` route.
It does not appear to "do anything important" for a restaurant site, making it the last place developers
look when cleaning up SDK imports.

**Consequences:** Build fails. If the build does not fail (e.g., dynamic import), navigating to any
non-existent URL crashes the app.

**Prevention:**
- Replace `PageNotFound` with a simple static component: a "Page Not Found" message and a link back
  to `/`. Remove the `useQuery` block and the `base44` import entirely.
- Also remove the `UserNotRegisteredError` import from `App.jsx` — this component does not exist on
  disk and exists only because Base44 generates it for authenticated apps.

**Detection:** `grep -r "base44Client"` after the strip should return zero results. If it returns
any, the build will fail.

**Phase:** SDK stripping phase.

---

## Moderate Pitfalls

Problems that make sections non-functional or cause significant UX issues but do not crash the full app.

---

### Pitfall 6: The Booking "Reserve" Button Does Nothing — Deadens User Intent

**What goes wrong:** `Booking.jsx` shows selectable sitting times and a large "Reserve" button.
The button has no `onClick` handler. Clicking it does nothing. Users who arrive intending to book
a table hit a dead end and must backtrack to find the Resy link in `OrderReserve.jsx`.

**Why it happens:** The Booking section was built as a UI showcase. The integration step was
deferred and never flagged as incomplete in the component itself.

**Consequences:** The most conversion-critical action on the site (booking a reservation) silently fails.

**Prevention:**
- Wire the button to open the restaurant's actual Resy URL: `window.open(RESY_URL, '_blank')`.
- Either remove the sitting-selection UI (since it shows fake hardcoded availability) or add a clear
  disclaimer that users are being redirected to Resy for live availability.
- The `href: "https://resy.com"` in `OrderReserve.jsx` is a placeholder — replace with the actual
  restaurant's Resy URL before going live.

**Detection:** Click the "Reserve" button in the dev environment. Expect a browser navigation or modal.
If nothing happens, the handler is missing.

**Phase:** Content wiring / CTA phase.

---

### Pitfall 7: The Base44 CDN Images Break If the Account Is Deactivated

**What goes wrong:** All 6+ images (hero, chef, four menu items, experience section) are hosted on
`media.base44.com` under a URL path scoped to the Base44 app ID
(`/images/public/69c4afc75d0284fc64e49e47/...`). If the Base44 account is cancelled, suspended,
or the platform changes its CDN policy, every image on the site 404s simultaneously.

**Why it happens:** The images were generated and stored by the Base44 platform during development.
They were never exported or self-hosted.

**Consequences:** The site goes visually blank — hero, menu cards, chef portrait all become broken
image icons. This is a hard dependency on an external platform that is being deliberately removed.

**Prevention:**
- Download all images before decommissioning the Base44 account.
- Host them in the Vercel project under `public/images/` or upload to a permanent CDN (Cloudflare R2,
  Vercel Blob, or Imgix).
- Update the `const` declarations in `Hero.jsx`, `Booking.jsx`, `Experience.jsx`, and `Menucarousel.jsx`
  to point to the new URLs.
- Do this before going live, not after — Base44 account access may be needed to download the originals.

**Detection:** Images still load while the Base44 account is active. The failure is silent until the
account is closed. Test by temporarily loading the URL in a browser after changing DNS/hosting.

**Phase:** Content migration phase (before go-live).

---

### Pitfall 8: Heavy Unused Dependencies Bloat the Bundle and Slow Vercel Cold Starts

**What goes wrong:** The `package.json` includes ~15 large packages that are installed but
completely unused in the current source: `three` (~600KB), `moment` (~69KB minified), `recharts`,
`react-quill`, `html2canvas`, `jspdf`, `canvas-confetti`, `@hello-pangea/dnd`, `@stripe/react-stripe-js`,
`@stripe/stripe-js`, `input-otp`, `cmdk`, `next-themes`, `react-hot-toast`, `react-day-picker`,
`react-markdown`, `react-resizable-panels`.

**Why it happens:** The Base44 scaffold pre-installs a kitchen-sink dependency set for general-purpose apps.

**Consequences:**
- `npm install` takes much longer.
- Bundle analysis (`vite-bundle-visualizer`) would show most of the JS payload is dead code.
- Tree-shaking only eliminates unused exports within a module — it cannot eliminate entire unused packages
  that are listed in `package.json` but simply never imported.

**Prevention:**
- After the SDK strip, run `npm uninstall moment three html2canvas jspdf react-quill canvas-confetti
  @hello-pangea/dnd @stripe/react-stripe-js @stripe/stripe-js input-otp cmdk next-themes react-hot-toast
  react-day-picker react-markdown react-resizable-panels` (verify none are imported first).
- Also remove `@base44/sdk` and `@base44/vite-plugin` as part of the strip.
- Keep `@tanstack/react-query` only if you keep `QueryClientProvider`; if the restaurant site has
  no data fetching, remove it too.

**Detection:** `npm ls --depth=0` shows the installed package list. Cross-reference against all
`import` statements in `src/`.

**Phase:** Dependency cleanup phase (concurrent with SDK strip or immediately after).

---

### Pitfall 9: The Vercel SPA Fallback Is Not Configured — All Routes Return 404 in Production

**What goes wrong:** React Router uses client-side routing. Vercel serves static files. When a user
navigates directly to any URL other than `/` (e.g., deep-links, refreshes, sharing a URL with a hash),
Vercel returns its own 404 page instead of serving `index.html` and letting React Router handle the route.

**Why it happens:** There is no `vercel.json` in the project. Without a rewrite rule, Vercel's default
static serving behavior does not know to fall back to `index.html` for SPA routing.

**Consequences:** Any URL shared externally, or any browser refresh on a sub-path, serves a Vercel 404.
For a single-page restaurant site this is lower risk (only `/#section` hashes are used for navigation),
but it is still a professional expectation and guards against future route expansion.

**Prevention:**
- Create `vercel.json` at the project root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
- Alternatively, set the `output` directory to `dist` in Vercel's project settings — Vite already
  outputs to `dist/` by default.

**Detection:** Deploy to Vercel, then paste any URL with a path component directly into the browser
address bar. A Vercel "404: NOT_FOUND" page (not the app's 404) confirms the rewrite is missing.

**Phase:** Vercel deployment configuration phase.

---

### Pitfall 10: `index.html` Has Wrong Title and Base44 Favicon — Shipped to Production Silently

**What goes wrong:** `index.html` currently has `<title>Base44 APP</title>` and `<link rel="icon" href="https://base44.com/logo_v2.svg">`. These are trivial to overlook because they do not cause errors — the site loads and works. But the browser tab shows "Base44 APP" and the favicon is Base44's logo, not Tsuru Sushi's.

**Why it happens:** Template metadata is not functional code, so it survives code-focused review.

**Consequences:** Production site has wrong identity in browser tabs, bookmarks, search engine previews
(Google shows the `<title>` in SERP listings), and social share previews.

**Prevention:**
- Update `index.html` as part of the deployment prep checklist:
  - `<title>Tsuru Sushi — San Leandro</title>`
  - Replace the Base44 favicon with a local file (e.g., `public/favicon.svg`) or a proper restaurant icon
  - Add `<meta name="description" content="...">` for SEO
  - Remove `<link rel="manifest" href="/manifest.json">` — the manifest file does not exist and causes
    a 404 network error on every page load

**Detection:** Open the deployed site in a browser tab. Check the tab title and favicon. Check DevTools
Network for a 404 on `/manifest.json`.

**Phase:** Deployment prep / go-live checklist.

---

## Minor Pitfalls

Issues that reduce quality but do not block launch.

---

### Pitfall 11: Google Fonts Load Blocks Initial Render

**What goes wrong:** `src/index.css` loads Cormorant Garamond and Inter via `@import url(...)` at the
top of the CSS file. CSS `@import` is render-blocking and adds a DNS lookup + download round-trip
before the first paint. On slow connections, the site renders in a fallback system font briefly
before the fonts load (FOUT — Flash of Unstyled Text).

**Prevention:**
- Move the Google Fonts `<link>` tags to `index.html` using `rel="preconnect"` and `rel="preload"`
  with `as="style"`. This is faster than CSS `@import`.
- Alternatively, add `&display=swap` to the Google Fonts URL (it is currently missing), which
  allows the page to use fallback fonts immediately and swap when the custom font loads.

**Phase:** Performance optimization (post-launch acceptable).

---

### Pitfall 12: Navigation Scroll Handler Creates/Destroys Event Listener on Every Scroll Event

**What goes wrong:** `Navigation.jsx` has `useEffect` depending on `[lastScrollY]`. Since
`lastScrollY` is updated inside the scroll handler via `setLastScrollY`, every scroll tick
re-triggers the effect, which removes and re-attaches the scroll listener on every pixel scrolled.
On a slow device this causes stuttering navigation hide/show behavior.

**Prevention:**
- Replace `const [lastScrollY, setLastScrollY] = useState(0)` with `const lastScrollYRef = useRef(0)`.
- Read and write `lastScrollYRef.current` inside the handler without triggering re-renders.
- Keep `useEffect` dependency array as `[]` (run once on mount).

**Phase:** Code quality cleanup (can ship with the bug; fix in a follow-up).

---

### Pitfall 13: Hardcoded Content Labeled "Today's" Will Never Change

**What goes wrong:** `TodaysCatch.jsx` displays "Today's Selection / The Morning Catch" with
fish items hard-coded in a `const catches` array. The content will be the same every day, indefinitely,
unless a developer edits the source and redeploys. The section label creates a false expectation of
freshness that reflects poorly on the restaurant if a regular visitor notices.

**Prevention:**
- Scope is explicitly "no CMS" for this milestone — accept the limitation.
- Either change the section heading to "Featured Selection" (removes the implied daily freshness)
  or add a comment in the code directing the owner to the file to edit.
- Document in a `CONTENT.md` which files contain hardcoded content so the owner knows where to
  look when they want to update.

**Phase:** Content population phase.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| SDK strip | Forgetting `PageNotFound.jsx` still imports `base44Client` | `grep -r "base44Client" src/` must return zero results before moving on |
| SDK strip | Leaving `AuthenticatedApp`'s loading-state gate in `App.jsx` | Replace `AuthenticatedApp` entirely with direct `<Routes>` render |
| Vite config | No `vite.config.js` exists — app cannot start | Create config with `@` alias as absolute first task |
| Empty stubs | `utils.js` is 0 bytes — all shadcn components silently broken | Implement `cn()` before running dev server |
| Leaflet | Map renders as grey box | `import 'leaflet/dist/leaflet.css'` in `main.jsx` |
| Image hosting | Base44 CDN images disappear when account is closed | Download and self-host before decommissioning account |
| Vercel deploy | Direct URL navigation returns Vercel 404 | Add `vercel.json` rewrite before first real user traffic |
| Go-live | Browser tab shows "Base44 APP" | Update `index.html` title, favicon, and remove broken manifest link |
| CTA wiring | "Reserve" button does nothing | Wire to actual Resy URL with `window.open` |
| Dependency cleanup | Large unused packages inflate build | Uninstall after confirming no imports remain |

---

## Sources

All findings derived from direct inspection of project source files on 2026-03-26. No external research
required — every pitfall has a specific file and line reference in the codebase.

- `/Users/nik/Desktop/TsuruSushi2/src/App.jsx` — Auth wrappers, missing page import
- `/Users/nik/Desktop/TsuruSushi2/src/lib/AuthContext.jsx` — SDK imports, loading gate
- `/Users/nik/Desktop/TsuruSushi2/src/lib/PageNotFound.jsx` — SDK import survivor
- `/Users/nik/Desktop/TsuruSushi2/src/lib/query-client.js` — 0-byte stub
- `/Users/nik/Desktop/TsuruSushi2/src/lib/utils.js` — 0-byte stub
- `/Users/nik/Desktop/TsuruSushi2/src/lib/app-param.js` — filename mismatch (app-param vs app-params)
- `/Users/nik/Desktop/TsuruSushi2/src/components/restaurant/MapHours.jsx` — Leaflet, no CSS
- `/Users/nik/Desktop/TsuruSushi2/src/components/restaurant/Booking.jsx` — dead CTA button
- `/Users/nik/Desktop/TsuruSushi2/src/components/restaurant/Navigation.jsx` — stale closure pitfall
- `/Users/nik/Desktop/TsuruSushi2/src/components/restaurant/TodaysCatch.jsx` — static "daily" content
- `/Users/nik/Desktop/TsuruSushi2/src/components/restaurant/OrderReserve.jsx` — Resy URL placeholder
- `/Users/nik/Desktop/TsuruSushi2/index.html` — wrong title, Base44 favicon, missing manifest
- `/Users/nik/Desktop/TsuruSushi2/package.json` — unused heavy dependencies, no vite.config
- `/Users/nik/Desktop/TsuruSushi2/.planning/codebase/CONCERNS.md` — prior codebase audit
- `/Users/nik/Desktop/TsuruSushi2/.planning/codebase/INTEGRATIONS.md` — integration audit
