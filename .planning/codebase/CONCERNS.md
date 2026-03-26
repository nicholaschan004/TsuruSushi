# Codebase Concerns

**Analysis Date:** 2026-03-26

## Tech Debt

**Missing Core Files Referenced in App.jsx:**
- Issue: `src/App.jsx` imports three modules that do not exist on disk: `@/api/base44Client`, `@/components/UserNotRegisteredError`, and `./pages/Home`. The app cannot compile or run until these are created.
- Files: `src/App.jsx` (lines 7–8), `src/lib/AuthContext.jsx` (line 2), `src/lib/PageNotFound.jsx` (line 2)
- Impact: Application is non-functional in its current state. Any `npm run dev` or `npm run build` will fail with module resolution errors.
- Fix approach: Create `src/api/base44Client.js` exporting a configured `base44` SDK instance, create `src/components/UserNotRegisteredError.jsx` with an error UI component, and create `src/pages/Home.jsx` assembling the restaurant section components.

**Filename Mismatch: app-param vs app-params:**
- Issue: The file on disk is `src/lib/app-param.js` but `src/lib/AuthContext.jsx` imports from `@/lib/app-params` (with an "s"). This is a broken import that will cause a build error.
- Files: `src/lib/app-param.js`, `src/lib/AuthContext.jsx` (line 3)
- Impact: `AuthContext` fails to import, breaking all authentication logic.
- Fix approach: Either rename `src/lib/app-param.js` to `src/lib/app-params.js` (preferred, matches import), or update the import in `AuthContext.jsx` to match the existing filename.

**Empty query-client and utils Stubs:**
- Issue: `src/lib/query-client.js` and `src/lib/utils.js` are 0-byte empty files. `App.jsx` imports `queryClientInstance` from query-client, which will be `undefined` at runtime, crashing the `QueryClientProvider`.
- Files: `src/lib/query-client.js`, `src/lib/utils.js`
- Impact: `QueryClientProvider` will throw a runtime error since `client` prop is `undefined`.
- Fix approach: Implement `src/lib/query-client.js` to create and export a `QueryClient` instance. Implement `src/lib/utils.js` with the standard `cn()` Tailwind merge utility (required by all shadcn/ui components).

**48 Empty shadcn/ui Component Files:**
- Issue: All shadcn/ui component files in `src/components/ui/` except `button.jsx` are empty (0 bytes). Any component imported from this directory (e.g., `Toaster`, dialogs, forms) will export nothing and cause runtime failures.
- Files: All of `src/components/ui/` except `src/components/ui/button.jsx`
- Impact: `Toaster` in `App.jsx` will fail. Any future use of cards, inputs, selects, modals, etc. will fail silently or throw.
- Fix approach: Run `npx shadcn-ui@latest add [component]` for each needed component, or restore from a shadcn/ui scaffold. At minimum, populate `toaster.jsx` and `use-toast.jsx` since they are used in `App.jsx`.

**Empty util Directory:**
- Issue: `src/util/` directory exists but contains no files. Unclear if this was intended as a future utility location or is an accidental artifact.
- Files: `src/util/`
- Impact: No functional impact currently, but creates confusion about where shared utilities should live given `src/lib/utils.js` also exists.
- Fix approach: Either remove the empty directory or document its intended purpose relative to `src/lib/`.

**Booking Component Has No Real Functionality:**
- Issue: `src/components/restaurant/Booking.jsx` shows hardcoded sitting slots with a "Reserve" button that does nothing — there is no `onClick` handler on the button, no form, and no integration with Resy or any booking API.
- Files: `src/components/restaurant/Booking.jsx` (lines 77–85)
- Impact: Users who click "Reserve" get no response. This section appears functional but is a UI-only stub.
- Fix approach: Wire the button to either open the Resy booking URL (consistent with `OrderReserve.jsx`) or implement a real booking flow.

**TodaysCatch Data Is Completely Static:**
- Issue: `src/components/restaurant/TodaysCatch.jsx` hard-codes fish items with no dynamic data source. The section is labeled "Today's Selection / The Morning Catch" implying daily updates, but the data never changes.
- Files: `src/components/restaurant/TodaysCatch.jsx` (lines 4–8)
- Impact: Content is perpetually stale. Misleads users into thinking this reflects actual daily availability.
- Fix approach: Replace the static `catches` array with a data fetch from a CMS, backend API, or at minimum a configurable data source that staff can update.

**MapHours Hours Are Static:**
- Issue: `src/components/restaurant/MapHours.jsx` hard-codes operating hours as a constant array. Restaurant hours that change seasonally or for holidays require a code deployment to update.
- Files: `src/components/restaurant/MapHours.jsx` (lines 6–14)
- Impact: Any hours change requires a developer to edit source code and redeploy.
- Fix approach: Move hours to a data source (CMS entry, environment-backed config, or admin-editable backend entity) and fetch at runtime.

**Booking Sittings Are Static:**
- Issue: `src/components/restaurant/Booking.jsx` hard-codes tonight's available sittings with seat counts as a constant. Real-time availability requires a booking system integration.
- Files: `src/components/restaurant/Booking.jsx` (lines 8–14)
- Impact: Seat counts displayed are fabricated and will not reflect actual availability.
- Fix approach: Integrate with Resy API for real availability data, or redirect entirely to the Resy booking URL as `OrderReserve.jsx` does.

## Security Considerations

**Token Stored in localStorage:**
- Risk: The `access_token` parameter from URL is immediately written to `localStorage` via `getAppParamValue` in `app-param.js`. Tokens in `localStorage` are accessible to any JavaScript on the page, making them vulnerable to XSS.
- Files: `src/lib/app-param.js` (lines 13–25)
- Current mitigation: Token is removed from URL after being read (via `removeFromUrl: true`).
- Recommendations: Evaluate whether the base44 SDK supports HttpOnly cookie-based auth instead. If localStorage is required, ensure strict CSP headers are set at the hosting layer.

**Open Redirect Risk via from_url Parameter:**
- Risk: `getAppParamValue("from_url", { defaultValue: window.location.href })` stores whatever URL is in the `from_url` query parameter. This value is passed to `base44.auth.logout()` and `base44.auth.redirectToLogin()` as a redirect target. A crafted link like `?from_url=https://evil.com` could redirect users to an attacker-controlled site after login/logout.
- Files: `src/lib/app-param.js` (line 45), `src/lib/AuthContext.jsx` (lines 119, 128)
- Current mitigation: None detected.
- Recommendations: Validate that `from_url` matches the app's own origin before using it as a redirect target.

**External Images From a Single CDN with No Fallback:**
- Risk: All hero, chef, and menu images are loaded from `media.base44.com`. If this CDN is unavailable, the entire visual presentation of the site breaks with no fallback.
- Files: `src/components/restaurant/Hero.jsx` (line 4), `src/components/restaurant/Booking.jsx` (line 6), `src/components/restaurant/Menucarousel.jsx` (lines 11–36), `src/components/restaurant/Experience.jsx` (line 5)
- Current mitigation: None.
- Recommendations: Add `onerror` fallback handlers on `<img>` tags, or serve images from the project's own hosting.

## Performance Bottlenecks

**Leaflet CSS Not Imported:**
- Problem: `src/components/restaurant/MapHours.jsx` uses `react-leaflet` but no Leaflet CSS stylesheet is imported anywhere in the codebase (`src/index.css` and `src/main.jsx` have no Leaflet import).
- Files: `src/components/restaurant/MapHours.jsx`, `src/index.css`, `src/main.jsx`
- Cause: Leaflet requires `leaflet/dist/leaflet.css` to render the map correctly. Without it, the map renders broken (missing tiles, controls, markers).
- Fix approach: Add `import 'leaflet/dist/leaflet.css'` to `src/main.jsx` or `src/index.css`.

**Unoptimized External Images:**
- Problem: All images are loaded as full-resolution PNGs from an external CDN with no `width`/`height` attributes, no `loading="lazy"`, and no `srcset`. The hero image is stretched to 120% height for parallax effect without a compressed source.
- Files: `src/components/restaurant/Hero.jsx` (line 20), `src/components/restaurant/Booking.jsx` (line 96), `src/components/restaurant/Menucarousel.jsx` (line 105), `src/components/restaurant/Experience.jsx` (line 27)
- Cause: Images lack lazy loading and responsive sizing attributes.
- Fix approach: Add `loading="lazy"` to below-fold images, add `width`/`height` to prevent layout shift, and request appropriately sized image variants from the CDN if supported.

**Heavy Dependencies Installed But Unused:**
- Problem: `package.json` includes many large dependencies with zero usage in the current source files: `moment`, `lodash`, `three`, `html2canvas`, `jspdf`, `react-quill`, `canvas-confetti`, `@hello-pangea/dnd`, `recharts`, `react-day-picker`, `input-otp`, `cmdk`, `next-themes`, `react-hot-toast`, `react-resizable-panels`, `react-markdown`.
- Files: `package.json`
- Cause: These appear to be scaffolding dependencies included by default from the base44 app template, not pruned for this specific restaurant site use case.
- Fix approach: Audit and remove unused dependencies. This will significantly reduce bundle size. At minimum, `three`, `html2canvas`, `jspdf`, `react-quill`, and `moment` should be removed if not used.

**React StrictMode Not Used:**
- Problem: `src/main.jsx` renders `<App />` without wrapping in `<React.StrictMode>`. This means double-invocation checks for side effects are disabled during development, making bugs from unclean effects harder to catch.
- Files: `src/main.jsx`
- Fix approach: Wrap with `<React.StrictMode>` in development.

## Fragile Areas

**AuthContext: Navigation Called During Render:**
- Files: `src/App.jsx` (lines 27–30), `src/lib/AuthContext.jsx` (lines 126–129)
- Why fragile: `navigateToLogin()` is called directly inside the render body of `AuthenticatedApp` when `authError.type === 'auth_required'`. Calling `base44.auth.redirectToLogin()` (which triggers `window.location`) during React's render phase is a side effect and can cause issues including double-invocations in StrictMode or unexpected behavior with concurrent features.
- Safe modification: Move the redirect to a `useEffect` that runs when `authError` changes.
- Test coverage: None.

**Navigation: Stale Closure on Scroll Handler:**
- Files: `src/components/restaurant/Navigation.jsx` (lines 18–31)
- Why fragile: The scroll `useEffect` has `[lastScrollY]` in its dependency array, causing it to re-subscribe to the `scroll` event on every scroll event. This creates and removes event listeners on every scroll tick, which is inefficient and could cause missed events during fast scrolls.
- Safe modification: Use a `useRef` for `lastScrollY` instead of `useState` so the effect does not need to re-run on every scroll.
- Test coverage: None.

**app-param.js: SSR/Node Compatibility Shim Is Incomplete:**
- Files: `src/lib/app-param.js` (lines 1–3)
- Why fragile: The file attempts to handle Node.js environments with `{ localStorage: new Map() }`, but `Map` does not implement the full `Storage` interface (`getItem`/`setItem` on Map work differently than on `localStorage`). Line 45 also references `window.location.href` directly without the `isNode` guard, which would throw in a Node environment.
- Safe modification: If SSR is never needed, remove the Node shim entirely. If it is needed, use a proper Storage mock.
- Test coverage: None.

## Missing Critical Features

**No Page for Home Route:**
- Problem: `src/App.jsx` imports `./pages/Home` which does not exist. There is no page component that assembles the restaurant section components (`Hero`, `Navigation`, `MenuCarousel`, `Experience`, `Provenance`, `TodaysCatch`, `Booking`, `OrderReserve`, `MapHours`, `Footer`).
- Blocks: Application cannot load at all — the root `/` route has no renderable component.

**No Error Boundary:**
- Problem: No React error boundary exists in the component tree. Any unhandled JavaScript error in a component will crash the entire application with a blank white screen and no user-facing recovery.
- Blocks: Graceful error handling for production failures.

**No Loading State for Images:**
- Problem: No skeleton loaders or placeholder states exist for the externally hosted images. On slow connections, the layout renders with empty boxes until images load, causing visible layout shift.

## Test Coverage Gaps

**No Tests Exist:**
- What's not tested: The entire codebase has zero test files.
- Files: All files in `src/`
- Risk: Any refactor, dependency update, or new feature has no regression safety net. Auth logic, scroll behavior, and booking selection state are completely untested.
- Priority: High — authentication flow in `src/lib/AuthContext.jsx` and the broken import chain are the most critical gaps.

---

*Concerns audit: 2026-03-26*
