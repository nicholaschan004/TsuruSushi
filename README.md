<div align="center">

# Tsuru Sushi

*Restaurant site for a Japanese sushi kitchen*

[![Live site](https://img.shields.io/badge/Live-tsurusushi.com-1a1a1a?style=flat-square)](https://tsurusushi.com)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Overview](#overview) • [Content workflow](#content-workflow) • [Structure](#structure) • [Architecture](#architecture)

</div>

A single page site for Tsuru Sushi: menu, today's catch, the story behind the fish, hours and
directions, and every ordering and reservation route in one place. Content is owned by the
restaurant through a Google Sheet, so the menu changes without a deploy.

## Overview

Restaurant sites go stale because updating them requires a developer. This one is built so
the people running the kitchen can change what the site says.

- **Menu and daily catch driven by Google Sheets**, no CMS, no admin login
- **Images pulled and localized at build time** rather than hotlinked from Drive
- **Ordering routes in one place**: DoorDash, Grubhub and Uber Eats side by side
- **No runtime configuration**, the build is fully static and deploys anywhere

## Content workflow

The restaurant edits Google Sheets. A prebuild step localizes every referenced image so the
site never depends on Drive at runtime.

```
Google Sheets  ──►  npm run sync-images  ──►  public/sheets-images/
(staff edit)        download Drive images     src/data/sheet-images.json
                                                       │
                                                       ▼
                                              bundled and CDN served
```

`sync-sheet-images.mjs` runs automatically as `prebuild`, so a deploy always ships whatever
the staff have most recently entered.

> [!NOTE]
> Hotlinking Google Drive images directly was the original approach and it was slow and
> fragile, since Drive rate limits and rewrites URLs. Downloading at build time removed a runtime
> dependency and a whole class of broken images.

## Structure

```
src/
  pages/
    Home.jsx            composes the single page experience
    Menu.jsx            full menu view
  components/
    restaurant/         Hero, Navigation, MenuCarousel, Experience,
                        Provenance, TodaysCatch, Booking, OrderReserve,
                        MapHours, Footer
    ui/                 shared primitives
  lib/
    google-sheets.js    fetch and cache published Sheet CSV
    image-resolver.js   map Sheet image URLs to localized assets
    InlineMarkdown.jsx  light markdown for Sheet authored copy
scripts/
  sync-sheet-images.mjs Drive images to local assets + manifest
```

`InlineMarkdown` exists because staff write copy in spreadsheet cells and reasonably expect
bold and line breaks to work. It supports a deliberately small subset rather than pulling in a
full markdown parser for a handful of fields.

## Architecture

The build only localizes images, from the Hero and Menu carousel tabs. All text (menu, specials, story, contact email) is read from the published Sheet in the visitor's browser, through `lib/google-sheets.js` with a 5 minute memory and localStorage cache. The `/menu` page fetches its own tab directly. Hosting config exists for both Cloudflare Pages (`public/_headers`, `public/_redirects`) and Vercel (`vercel.json`), with matching SPA fallback, `/menu.html` redirect and CSP.

```mermaid
flowchart LR
  subgraph sheet["Google Sheet (published CSV tabs)"]
    heroTab["Hero"]
    carTab["Menu carousel"]
    expTab["Experience"]
    provTab["Provenance"]
    footTab["Footer email"]
    menuTab["Full menu"]
  end
  heroTab --> sync["scripts/sync-sheet-images.mjs (prebuild)"]
  carTab --> sync
  sync --> imgs["public/sheets-images/* + public/hero-default.jpg"]
  sync --> manifest["src/data/sheet-images.json"]
  imgs --> build["vite build"]
  manifest --> build
  build --> host["Cloudflare Pages or Vercel (static dist)"]
  host --> browser["Browser"]
  sheet -.->|"runtime CSV fetch, 5 min cache"| browser
  osm["tile.openstreetmap.org"] -.->|"map tiles"| browser
  browser --> toast["Toast online ordering"]
```

The home page is one scroll-snapped page; `/menu` is the full menu:

```mermaid
flowchart TB
  main["main.jsx"] --> app["App.jsx (QueryClientProvider, MotionConfig, Router)"]
  app --> home["/ : pages/Home.jsx"]
  app --> menu["/menu : pages/Menu.jsx"]
  app --> nf["* : lib/PageNotFound.jsx"]
  home --> nav["Navigation"]
  home --> hero["Hero"]
  home --> exp["Experience"]
  home --> car["MenuCarousel"]
  home --> order["OrderReserve (Toast + phone)"]
  home --> prov["Provenance"]
  home --> map["MapHours (react-leaflet)"]
  home --> foot["Footer"]
  hero --> gs["lib/google-sheets.js fetchSheet"]
  exp --> gs
  car --> gs
  prov --> gs
  foot --> gs
  hero --> ir["lib/image-resolver.js"]
  car --> ir
  menu --> md["lib/InlineMarkdown.jsx"]
  hero --> md
  car --> md
  exp --> md
  prov --> md
```
