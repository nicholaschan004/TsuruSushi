# Testing Patterns

**Analysis Date:** 2026-03-26

## Test Framework

**Runner:** None — no test framework is installed or configured.

**Assertion Library:** None.

**Run Commands:** No test scripts defined in `package.json`. The scripts block contains only:
```bash
npm run dev        # Vite dev server
npm run build      # Production build
npm run lint       # ESLint check
npm run lint:fix   # ESLint auto-fix
npm run typecheck  # tsc type check via jsconfig.json
npm run preview    # Preview production build
```

## Test File Organization

**Location:** No test files exist in the codebase.

**Naming:** No test files found matching `*.test.*` or `*.spec.*` patterns.

**Structure:** Not applicable.

## Test Coverage

**Requirements:** None enforced — no coverage configuration exists.

**Current State:** 0% — no tests of any kind are present.

## Test Types

**Unit Tests:** Not present.

**Integration Tests:** Not present.

**E2E Tests:** Not present — no Playwright, Cypress, or similar tooling installed.

## Quality Gates in Use

While no tests exist, the following quality checks are configured and runnable:

**Static Analysis:**
- ESLint via `eslint.config.js` — enforces unused imports, React hooks rules, and no-unknown-properties
- Scope: `src/components/**`, `src/pages/**`, `src/Layout.jsx` only
- Excluded: `src/lib/**`, `src/components/ui/**`

**Type Checking:**
- `tsc --noEmit` via `jsconfig.json` with `checkJs: true`
- Scope: `src/components/**/*.js`, `src/pages/**/*.jsx`, `src/Layout.jsx`
- Excluded: `src/lib/`, `src/api/`, `src/components/ui/`, `node_modules/`, `dist/`

## Adding Tests — Recommended Approach

If tests are added to this project, the following setup is consistent with the existing stack:

**Recommended Framework:** Vitest (matches the existing Vite build toolchain)

**Install:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Vitest config** (add to `vite.config.js` or create `vitest.config.js`):
```js
import { defineConfig } from 'vitest/config'
export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.js'],
    },
})
```

**File placement convention** (consistent with existing project structure):
- Co-locate test files alongside source: `src/components/restaurant/Hero.test.jsx`
- Shared test utilities: `src/test/`

**Test structure pattern** (matching project conventions):
```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from '@/components/restaurant/Hero'

describe('Hero', () => {
    it('renders the restaurant name', () => {
        render(<Hero />)
        expect(screen.getByText('TSU')).toBeInTheDocument()
    })
})
```

**Mocking framer-motion** (required for all restaurant components):
```js
// src/test/setup.js
vi.mock('framer-motion', () => ({
    motion: new Proxy({}, {
        get: (_, tag) => ({ children, style, ...props }) =>
            React.createElement(tag, props, children)
    }),
    useScroll: () => ({ scrollY: { get: () => 0 } }),
    useTransform: () => 0,
    useInView: () => true,
    AnimatePresence: ({ children }) => children,
}))
```

**Mocking react-leaflet** (required for `MapHours.jsx`):
```js
vi.mock('react-leaflet', () => ({
    MapContainer: ({ children }) => <div>{children}</div>,
    TileLayer: () => null,
    Marker: ({ children }) => <div>{children}</div>,
    Popup: ({ children }) => <div>{children}</div>,
}))
```

## High-Priority Test Candidates

Given zero current coverage, the highest-value areas to test first:

1. **`src/lib/AuthContext.jsx`** — auth state machine logic with multiple error paths
2. **`src/lib/app-param.js`** — URL param parsing and localStorage interaction
3. **`src/components/restaurant/Navigation.jsx`** — scroll visibility logic and mobile menu toggle
4. **`src/components/restaurant/Booking.jsx`** — sitting selection state and conditional button text

---

*Testing analysis: 2026-03-26*
