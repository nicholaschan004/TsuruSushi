# Feature Landscape

**Domain:** Restaurant website — upscale omakase sushi, single-page SPA
**Researched:** 2026-03-26
**Confidence:** HIGH (restaurant website patterns are stable and well-established)

---

## Context Note

This research targets the *current milestone* specifically: fixing a mostly-built site and deploying it. The frontend components are already constructed. This document serves to (a) confirm the existing feature set is correct, (b) flag gaps that matter for launch, and (c) explicitly rule out scope creep.

The restaurant is Tsuru Sushi: 12-seat omakase counter, two sittings per night, San Leandro CA. This is a small, premium, intimate operation — that positioning shapes every feature priority.

---

## Table Stakes

Features users expect from any restaurant website. Missing or broken = users bounce or call instead.

| Feature | Why Expected | Complexity | Status | Notes |
|---------|--------------|------------|--------|-------|
| Restaurant name + tagline above fold | Instant identity confirmation | Low | Built (Hero) | "Tsuru Sushi" must appear without scrolling |
| Operating hours | Top user need — "are they open?" | Low | Built (MapHours) | Today's day should be visually highlighted — already done |
| Physical address + directions | Users need to find the place | Low | Built (MapHours) | Leaflet map at 1427 E 14th St, San Leandro |
| Phone number | Fallback for all questions | Low | Likely in Footer | Must be real, clickable `tel:` link on mobile |
| Booking / reservation CTA | Primary conversion action | Low | Built (Booking, OrderReserve) | Must link to live Resy URL — currently placeholder |
| Menu overview | "What do they serve / what's the price range?" | Medium | Built (MenuCarousel) | For omakase: price point + format matters more than item list |
| Food photography | Drives appetite and trust | Low | Built (images in sections) | Base44 CDN images need to stay accessible post-decoupling |
| Mobile-responsive layout | 60-70% of restaurant searches are mobile | High | Assumed built | Verify breakpoints on real device before launch |
| Page load under 3 seconds | Users abandon slow restaurant sites fast | Medium | Needs validation | Framer Motion + Leaflet adds weight — test with Lighthouse |
| Contact information in footer | Standard convention — users look here | Low | Built (Footer) | Email, phone, address, social links |
| Open Graph / social preview | Shared links on social must look good | Low | Missing — needs `<meta>` tags | Single most-missed SEO item on restaurant sites |

---

## Differentiators

Features that distinguish Tsuru Sushi's site from a generic restaurant template. These match the brand positioning: precision, scarcity, ritual.

| Feature | Value Proposition | Complexity | Status | Notes |
|---------|-------------------|------------|--------|-------|
| Sitting-time display with seat counts | Communicates scarcity and exclusivity; no other local sushi bar shows this | Medium | Built (Booking section) | Shows "6:00 PM — 4 seats" etc. — powerful for premium positioning |
| "Today's Catch" section | Freshness signal unique to high-end sushi; builds trust | Medium | Built (TodaysCatch) | Content must be real and updated regularly to retain value |
| Provenance / sourcing story | Differentiates on values; supports premium price | Medium | Built (Provenance) | "Where does our fish come from?" — strong brand narrative |
| Framer Motion scroll animations | Premium feel; matches brand positioning | Medium | Built | Avoid removing — this is brand-appropriate |
| Experience / atmosphere section | Sells the room, not just the food | Medium | Built (Experience) | Especially important for omakase where ambience is part of the product |
| Scroll-based narrative structure | Single-page storytelling mimics the meal's progression | High | Built | The one-page SPA format is itself a differentiator for this type of restaurant |
| Award / recognition badge | Social proof for premium positioning | Low | Built (Footer — "San Leandro Chamber of Commerce") | Visible but understated — correct placement |
| Highlighted "today is X day" in hours | Reduces friction; tiny touch that signals care | Low | Built (MapHours, `TODAY` const) | Confirm it works at runtime |

---

## Anti-Features

Things to deliberately NOT build. Some are explicitly out of scope; others are tempting but wrong for this project.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| User accounts / login | No value for a 12-seat counter; adds auth complexity | Remove Base44 AuthProvider entirely — it's already the task |
| Online ordering / payments | Wrong for omakase format; commoditizes the experience | Link to Resy only; no payment flows |
| Real-time Resy availability widget | Requires Resy API key, OAuth, iframe complexity | Link directly to Resy profile — they handle availability display |
| CMS / admin panel | Content changes rarely; adds backend dependency | Edit in code; owner emails developer for updates |
| Newsletter signup / mailing list | Adds third-party service (Mailchimp etc.), GDPR surface area, distraction | Not needed at launch; evaluate only if owner requests |
| Blog / editorial content | Mismatched with brand (silent, minimal Japanese aesthetic) | Let food photography and section copy do narrative work |
| Social media feed embeds | Third-party JS bloat, frequently breaks, clutters premium layout | Link to Instagram/social in footer; don't embed |
| Chat widget / chatbot | Feels off-brand for intimate omakase; adds script weight | Phone number serves this need |
| Multiple pages / routing | The single-page format IS the product | Keep SPA; 404 page is sufficient second route |
| Loading spinners / auth gates | Currently in App.jsx from Base44 template | Strip entirely — public static site has no auth |
| Accessibility overlay (accessiBe etc.) | Third-party a11y overlays are controversial and often counterproductive | Build accessible HTML natively: `alt` tags, semantic elements, focus states |

---

## Feature Dependencies

```
Booking CTA (all buttons) → Resy URL (must be live before launch)
Today's Catch section → Real content from owner (fish names, descriptions)
MapHours → Leaflet CSS import (currently missing — map won't render without it)
MapHours → Correct lat/long for San Leandro address (already set: 37.7249, -122.1561)
Footer contact info → Real phone, email, social URLs from owner
Food photography → Base44 CDN accessibility (risk: images break after decoupling)
Open Graph meta tags → Site URL (needed at deploy time to set og:url correctly)
Home page → src/pages/Home.jsx (missing file — must be created to assemble sections)
```

---

## SEO Essentials

For a restaurant, local SEO matters more than general SEO. The goal is ranking for "sushi San Leandro" and "omakase East Bay."

### Must-have at launch

| Element | Location | Complexity | Notes |
|---------|----------|------------|-------|
| `<title>` tag | `index.html` or `<Helmet>` | Low | "Tsuru Sushi — Omakase Counter, San Leandro CA" |
| `<meta name="description">` | `index.html` | Low | 150-160 chars, include "omakase", "San Leandro", "sushi" |
| Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`) | `index.html` | Low | Use a high-quality hero image as `og:image`; this drives social shares |
| Canonical URL | `index.html` | Low | `<link rel="canonical" href="https://tsurusushi.com/">` |
| Structured data: `Restaurant` schema | `index.html` inline `<script type="application/ld+json">` | Low-Medium | Enables Google rich results: hours, address, phone, cuisine, priceRange |
| `robots.txt` | Vercel `public/` folder | Low | Allow all; Vercel serves this automatically if present |
| Sitemap | `public/sitemap.xml` | Low | Single-page site — one URL entry; still good practice |
| NAP consistency | Footer, schema, Google Business Profile | Low | Name / Address / Phone must match exactly across all three |

### Schema.org Restaurant snippet (recommended)

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Tsuru Sushi",
  "servesCuisine": "Japanese",
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1427 E 14th St",
    "addressLocality": "San Leandro",
    "addressRegion": "CA",
    "postalCode": "94577"
  },
  "telephone": "[PHONE]",
  "url": "https://[domain]",
  "openingHoursSpecification": [...]
}
```

This schema is what powers the "hours" panel in Google Search results and Google Maps. It is the single highest-ROI SEO addition for a local restaurant.

---

## Booking Integration Patterns

For context on what was decided and why alternatives were ruled out.

| Pattern | Complexity | Pros | Cons | Verdict |
|---------|------------|------|------|---------|
| Direct Resy link (`href` to Resy profile) | Minimal | Zero infrastructure, always current, Resy handles availability | Leaves site; no inline feel | **Use this. Correct for the project.** |
| Resy Widget (iframe embed) | Low-Medium | Inline booking feel | Requires Resy partnership/widget access, introduces iframe cross-origin issues, heavy JS | Not worth the complexity |
| Resy API integration | High | Full control, inline availability | OAuth, API key management, webhooks for confirmations, significant scope | Out of scope; Resy does this better |
| OpenTable / Tock | Medium-High | Alternatives to Resy | Restaurant is on Resy; don't change platforms | Not applicable |
| Custom booking backend | Very High | Full control | Database, email confirmations, payments, spam, ops burden | Explicitly out of scope |

The implemented approach — showing sitting times with seat counts as a UI signal, then routing to Resy for actual booking — is the right pattern. It communicates scarcity on-site while offloading reservation management entirely.

---

## Content Management Patterns

| Pattern | Complexity | Fit for Tsuru Sushi | Notes |
|---------|------------|---------------------|-------|
| Hardcoded in components | Minimal | Good for launch | Appropriate when content changes < once/month; matches "no CMS" decision |
| Flat JSON data files in repo | Low | Better long-term | Move menu items, hours, fish catches to `/src/data/*.js` — owner can edit with less risk |
| Headless CMS (Sanity, Contentful) | Medium | Overkill now | Valid future milestone if owner wants self-serve updates |
| Markdown files | Low | Not suited | Works for blogs; awkward for structured restaurant data |

**Recommendation for this milestone:** Keep content hardcoded but consolidate into `/src/data/` files. This makes the "owner provides real content" task cleaner without adding CMS complexity.

---

## MVP Recommendation

For the current milestone (deploy to Vercel), the priority order is:

1. **Booking CTAs link to live Resy URL** — every "Reserve" button must work; this is the primary conversion action and the reason the site exists
2. **Map renders correctly** — requires Leaflet CSS import; broken map is highly visible and damages trust
3. **Real content in place** — phone, hours, address, Today's Catch must be real before going live
4. **Mobile layout verified** — at minimum test on iPhone Safari; this is where most restaurant lookups happen
5. **Open Graph meta tags** — before sharing the URL anywhere; takes 30 minutes and avoids embarrassing blank link previews
6. **Restaurant structured data (JSON-LD)** — 1 hour of work, significant long-term SEO value for local search

**Defer to post-launch:**
- `src/data/` file consolidation — nice to have, not blocking
- Sitemap / robots.txt — minor SEO value, not urgent
- Newsletter, social embeds, CMS — explicitly anti-features for now

---

## Sources

**Confidence assessment:** HIGH based on training data through August 2025. Restaurant website patterns are a mature domain — table stakes have been stable for 5+ years. SEO schema recommendations come from Schema.org and Google's structured data documentation (well-established). Resy integration pattern is based on how the platform actually works. No web search was available during this research session; findings are grounded in well-established industry practice, not speculative trends.

**Key references (from training knowledge):**
- Google Search Central: Restaurant structured data — `developers.google.com/search/docs/appearance/structured-data/local-business`
- Schema.org Restaurant type — `schema.org/Restaurant`
- Resy for Restaurants — `resy.com/restaurant-platform`
- Core Web Vitals for restaurants — Google PageSpeed guidance
- Open Graph protocol — `ogp.me`
