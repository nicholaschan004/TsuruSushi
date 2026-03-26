# Technology Stack

**Project:** Tsuru Sushi — React/Vite SPA, standalone Vercel deployment
**Researched:** 2026-03-26
**Sources:** Vercel official docs (vercel.com/docs/frameworks/vite, vercel.com/docs/environment-variables, vercel.com/docs/builds/configure-a-build), project package.json and codebase analysis

---

## Current State

The project already has a defined stack from its Base44 template origin. This research focuses on what to **keep**, what to **remove**, and what **new configuration** is required for a standalone Vercel deployment. There is no vite.config file in the repo — Base44's plugin injected it at deploy time. That config must be created from scratch.

---

## Recommended Stack

### Build & Dev Tooling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vite | `^6.1.0` (already installed) | Bundler and dev server | Already in project; Vite 6 is stable, Vercel auto-detects it with build command `npm run build` and output dir `dist` |
| `@vitejs/plugin-react` | `^4.3.4` (already installed) | React fast refresh, JSX transform | Required for React + Vite; already present |
| `vite.config.js` | n/a — must be created | Vite entry config | Base44 vite plugin injected this at platform deploy time; removing `@base44/vite-plugin` means the project has zero build config until this file is created |

**The single highest-priority configuration artifact:** `vite.config.js` at project root. Without it, `vite build` uses bare defaults with no `@/*` alias resolution, which will break every import in the project.

### Core Runtime (keep as-is)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | `^18.2.0` | UI framework | Stable, all components written to this API |
| React DOM | `^18.2.0` | DOM renderer | Paired with React |
| React Router DOM | `^6.26.0` | Client-side routing | Single route (`/`) + 404 fallback; already wired in `App.jsx` |

React 18.2 is the correct target here. React 19 exists but upgrading it is out of scope for this milestone and introduces potential breaking changes in StrictMode behavior and hydration semantics that are irrelevant for a static SPA.

### UI / Animation (keep)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | `^3.4.17` | Utility CSS | All 10 restaurant components use Tailwind classes; Tailwind 4 exists but is a breaking change, defer |
| shadcn/ui (via Radix UI) | components installed individually | Headless UI primitives | Components referenced in restaurant sections; only populate what's actually imported |
| Framer Motion | `^11.16.4` | Scroll animations, parallax | Used throughout all restaurant section components |
| lucide-react | `^0.475.0` | Icons | Used by shadcn/ui and restaurant components |
| embla-carousel-react | `^8.5.2` | Menu carousel | Used in `Menucarousel.jsx` |
| react-leaflet | `^4.2.1` | Interactive map | Used in `MapHours.jsx`; requires `leaflet/dist/leaflet.css` import (currently missing) |
| tailwind-merge | `^3.0.2` | Safe Tailwind class merging | Required by `cn()` utility in `utils.js` |
| class-variance-authority | `^0.7.1` | Variant management | Required by shadcn/ui components |
| tailwindcss-animate | `^1.0.7` | Tailwind animation keyframes | Used by shadcn/ui accordion |

### Vercel Deployment Configuration

| Artifact | What it does | Why required |
|----------|-------------|--------------|
| `vite.config.js` | Configures `@/*` alias, React plugin, build chunking | Vercel detects Vite and runs `npm run build`; without the alias, every `@/components/...` import fails |
| `vercel.json` | SPA routing rewrite: all paths → `index.html` | Without this, any URL other than `/` returns a 404 from Vercel's static file server; confirmed required per official Vercel docs |
| `.env.local` (local only, gitignored) | Dev environment variables | Vite reads `VITE_`-prefixed vars from `.env.local` during `npm run dev`; no env vars are needed for this static site right now |

Vercel auto-detects Vite projects: build command defaults to `npm run build`, output directory defaults to `dist`. No Vercel dashboard overrides needed.

### Image Hosting

| Option | Cost | Recommendation | When to Use |
|--------|------|---------------|-------------|
| `public/images/` in repo (committed) | Free — served by Vercel CDN | **Primary recommendation for this project** | Images are few and stable (restaurant photos don't change often); Vercel's CDN serves them with good performance |
| Cloudinary free tier | Free up to 25 credits/month (transformations + storage combined) | Fallback if images are large or need transformation (resize, WebP) | Use if image files exceed ~5MB total or owner needs on-the-fly resize |
| Continue using `media.base44.com` | Unknown — access may be revoked after SDK removal | **Do not rely on** | The CONCERNS.md flags this explicitly: CDN access may break after decoupling from Base44 |

**Decision: migrate images to `public/images/`.**

Rationale: this is a restaurant site with ~8-12 images (hero, booking, menu items, experience). Total asset size will be under 5MB. Committing them to the repo and serving from Vercel's edge is simpler, free, and eliminates the Base44 CDN dependency risk. Cloudinary is unnecessary complexity for this scale.

---

## Dependencies to Remove

These are Base44 template scaffolding artifacts with zero usage in the restaurant components. Removing them reduces bundle size and build time.

| Package | Size impact | Reason to remove |
|---------|------------|-----------------|
| `@base44/sdk` | — | Core removal target; this entire milestone exists to eliminate it |
| `@base44/vite-plugin` | — | Core removal target; Base44 build integration, replaced by standard `vite.config.js` |
| `@stripe/react-stripe-js` + `@stripe/stripe-js` | ~120kB gzipped | No usage in source; payments are out of scope |
| `three` | ~580kB gzipped | No usage in source; 3D rendering not needed |
| `html2canvas` + `jspdf` | ~300kB gzipped | No usage; PDF generation not needed |
| `react-quill` | ~200kB gzipped | No usage; rich text editor not needed |
| `recharts` | ~350kB gzipped | No usage; charting not needed |
| `@hello-pangea/dnd` | ~30kB gzipped | No usage; drag-and-drop not needed |
| `moment` | ~67kB gzipped | No usage; `date-fns` is already installed for any date needs |
| `react-day-picker` | ~50kB gzipped | No usage for this scope |
| `input-otp` | ~5kB | No usage |
| `cmdk` | ~15kB | No usage for a restaurant site |
| `canvas-confetti` | ~15kB | No usage |
| `react-hot-toast` | ~15kB | `sonner` already installed and sufficient for notifications |
| `react-resizable-panels` | ~25kB | No usage |
| `react-markdown` | ~50kB | No usage |
| `lodash` | ~72kB gzipped | No usage; replace any individual needs with native JS |

**Keep:** `date-fns` (may be used for hours display formatting), `sonner` (toast notifications), `react-hook-form` + `zod` + `@hookform/resolvers` (may be needed if a contact form is added), `@tanstack/react-query` (already wired into App.jsx QueryClientProvider; keep but simplify).

---

## Required vite.config.js

This is the complete config needed for this project. No speculation — every setting has a specific reason:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    outDir: 'dist',
    // Warn on chunks > 500kB (Vite default). Keep for visibility.
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Split vendor code from app code for better cache utilization.
        // Framer Motion and React are the two heaviest deps; split them
        // so a content update doesn't bust the vendor cache.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-tabs', '@radix-ui/react-tooltip',
                        'lucide-react'],
        },
      },
    },
  },
})
```

**Why each section:**
- `plugins: [react()]` — enables React fast refresh in dev and JSX transform in production
- `resolve.alias` — maps `@/*` to `src/*`; required because jsconfig.json defines this alias for the type checker but Vite needs its own alias config independently
- `build.outDir: 'dist'` — Vercel's default output dir for Vite; explicit is better than implicit
- `manualChunks` — Framer Motion alone is ~100kB gzipped; splitting it prevents full cache bust on content-only changes; the vendor-react chunk changes rarely

---

## Required vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Why required:** Vercel's static file server returns 404 for any path that doesn't match a physical file. React Router handles routing client-side via `index.html`. This rewrite ensures deep links (e.g., if a future `/menu` route is added) and direct URL entry resolve correctly. Confirmed in official Vercel docs as the canonical solution for Vite SPAs.

---

## Environment Variables

**For this project right now:** none. After stripping Base44, there are no secrets, API keys, or runtime config values. The site is purely static.

**If Resy booking URL is parameterized later:** prefix with `VITE_` (e.g., `VITE_RESY_URL`). Vite exposes `VITE_`-prefixed vars via `import.meta.env.VITE_RESY_URL` at build time. Set them in Vercel dashboard under Project Settings > Environment Variables. Do not commit `.env` files containing real values.

**Key rule from official Vercel docs:** Vercel System Environment Variables (like `VERCEL_ENV`) are NOT automatically exposed to Vite. You must prefix them `VITE_VERCEL_ENV` in the Vercel dashboard to make them available in `import.meta.env`.

---

## Dependencies to Keep (Final List)

Production runtime (after pruning):

```
react, react-dom, react-router-dom
framer-motion
tailwindcss, tailwindcss-animate, tailwind-merge, class-variance-authority
@radix-ui/* (only those with non-empty shadcn components after population)
lucide-react
embla-carousel-react
react-leaflet, leaflet
sonner
date-fns
@tanstack/react-query
react-hook-form, @hookform/resolvers, zod
next-themes
clsx
```

Dev only:
```
vite, @vitejs/plugin-react
autoprefixer, postcss
eslint + plugins
@types/react, @types/react-dom, @types/node
typescript
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Bundler | Vite 6 (keep) | esbuild standalone, Parcel | Already installed; Vercel native support; no migration cost |
| Image hosting | `public/` in repo | Cloudinary | Overkill for ~10 images on a free tier static site |
| Image hosting | `public/` in repo | Vercel Blob | Free tier is limited; unnecessary external dependency |
| CSS | Tailwind 3.4 (keep) | Tailwind 4 | Breaking config format change; defer to avoid scope creep |
| React | 18.2 (keep) | React 19 | Breaking changes to StrictMode and concurrent features; not worth migrating mid-cleanup |
| Notifications | sonner (keep) | react-hot-toast (remove) | Both present; sonner is more modern with composable API; one library is sufficient |
| Routing | React Router 6 (keep) | TanStack Router | Already installed and wired; no benefit to swap |

---

## Confidence Assessment

| Area | Confidence | Source |
|------|------------|--------|
| Vercel SPA rewrite config | HIGH | Official Vercel docs (vercel.com/docs/frameworks/vite) — exact JSON shown in docs |
| Vite auto-detection on Vercel | HIGH | Official Vercel docs (vercel.com/docs/builds/configure-a-build) — Vite is a named preset |
| `VITE_` prefix for env vars | HIGH | Official Vercel docs (vercel.com/docs/environment-variables) |
| vite.config.js alias setup | HIGH | jsconfig.json confirms `@/*` → `./src/*`; Vite resolve.alias is standard documented API |
| manualChunks strategy | MEDIUM | Standard Rollup/Vite pattern; specific chunk names are judgment calls not verified against a canonical source |
| Image hosting via `public/` | HIGH | Vercel static asset serving is well-documented; Cloudinary free tier limits inferred from training data, not verified current |
| Dependency removal list | HIGH | Based on direct code analysis — CONCERNS.md and codebase STACK.md document which packages have zero imports in `src/` |

---

*Research complete: 2026-03-26*
