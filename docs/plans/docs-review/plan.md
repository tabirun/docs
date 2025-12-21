# Documentation Review Plan

Deep review of all ported documentation to ensure accuracy against actual
implementations.

## Critical Issues Found

### Pages API is WRONG

The docs say `pages()` returns `{ registerDevServer, registerStaticServer }` but
actual API is:

```typescript
const { dev, build, serve } = pages();
await dev(app); // NOT registerDevServer(app)
await build(); // standalone, no app needed
serve(app); // NOT registerStaticServer(app)
```

### Pages Exports are WRONG

Docs reference non-existent exports:

- `@tabirun/pages/hooks` - WRONG, actual: `@tabirun/pages/preact/hooks`
- `@tabirun/pages/head` - WRONG, Head is in `@tabirun/pages/preact`
- `@tabirun/pages/markdown` - WRONG, Markdown is internal (not public API)

Actual exports from deno.json:

- `@tabirun/pages` (main) - exports: pages, PagesConfig, etc
- `@tabirun/pages/preact` - exports: Head, useFrontmatter, useBasePath, Code,
  all hooks
- `@tabirun/pages/preact/jsx-runtime`
- `@tabirun/pages/preact/jsx-dev-runtime`
- `@tabirun/pages/preact/hooks` - just preact hooks

### Import Paths for Components

Correct imports:

```typescript
import {
  Head,
  useBasePath,
  useFrontmatter,
  useState,
} from "@tabirun/pages/preact";
import type { DocumentProps, LayoutProps } from "@tabirun/pages/preact";
```

### Markdown Component is Internal

The Markdown component exists but is marked `@internal Not part of public API`.
REMOVE all documentation about embedding Markdown in TSX pages.

### CSS/Styling Documentation is WRONG

Docs claimed UnoCSS was auto-detected and built-in. **COMPLETELY FALSE.**

Actual implementation (per ADR-008):

- Uses **PostCSS** as generic CSS processing layer
- Requires `postcss.config.ts` at project root
- Users install their own PostCSS plugins (Tailwind, UnoCSS, etc.)
- CSS entry file configured via `css.entry` option (default:
  `./styles/index.css`)

Fixed styling.md to document:

1. PostCSS setup requirements
2. Tailwind CSS 4 setup (what docs site actually uses)
3. UnoCSS as alternative via @unocss/postcss
4. Static CSS fallback for simple projects

---

## Review Checklist

### Phase 1: App Overview & Intro (decide if needed)

- [x] `/docs/app/overview.md` - DELETED (thin, marketing BS)
- [x] `/docs/app/installation.md` - Verified, looks correct
- [x] `/docs/app/philosophy.md` - Trimmed to be factual

### Phase 2: App Core (verify APIs)

- [x] `/docs/app/core/tabi-app.md` - Verified against source
- [x] `/docs/app/core/tabi-context.md` - Verified against source
- [x] `/docs/app/core/routing.md` - Verified
- [x] `/docs/app/core/request-response.md` - Verified
- [x] `/docs/app/core/middleware.md` - Verified
- [x] `/docs/app/core/error-handling.md` - Verified

### Phase 3: App Middleware (verify each module)

- [x] Spot-checked cors.md and validate.md - match source code

### Phase 4: App Utilities & Guides

- [x] `/docs/app/utilities/cookies.md` - Verified
- [x] `/docs/app/guides/testing.md` - Verified
- [x] `/docs/app/guides/deploy.md` - Verified

### Phase 5: Pages Docs (FIXED CRITICAL ISSUES)

- [x] `/docs/pages/overview.md` - DELETED (thin, wrong API)
- [x] `/docs/pages/getting-started.md` - Fixed: dev() API, jsxImportSource,
      DocumentProps (was HtmlTemplateProps)
- [x] `/docs/pages/pages-and-routing.md` - Fixed: DocumentProps (was
      HtmlTemplateProps with wrong props)
- [x] `/docs/pages/layouts.md` - Fixed: all imports to @tabirun/pages/preact
- [x] `/docs/pages/markdown.md` - Fixed: imports, shikiTheme config, removed
      internal Markdown component docs
- [x] `/docs/pages/components.md` - Fixed: imports, REMOVED Markdown docs
      (internal), added Code component, fixed DocumentProps
- [x] `/docs/pages/styling.md` - **REWRITTEN**: Removed false UnoCSS claims,
      documented PostCSS setup, Tailwind CSS 4 example, UnoCSS alternative
- [x] `/docs/pages/configuration.md` - Fixed: entire API, basePath default (""
      not "/"), DocumentProps, CSS entry default, build process (PostCSS not
      UnoCSS)
- [x] `/docs/pages/build-and-deploy.md` - Fixed: serve() not
      registerStaticServer

### Key Fixes Applied

1. **API Names**: `dev()`, `build()`, `serve()` - NOT `registerDevServer`,
   `registerStaticServer`
2. **Import Paths**: All component/hook imports from `@tabirun/pages/preact`
3. **DocumentProps**: `{ head, children }` - NOT
   `{ title, description, children }`
4. **jsxImportSource**: `@tabirun/pages/preact` in deno.json - NOT `preact`
5. **Config**: `basePath` default is `""`, `shikiTheme` at top-level,
   `markdown.wrapperClassName`
6. **Removed internal API**: Markdown component is internal, only Code is public
7. **CSS/Styling**: PostCSS-based (NOT built-in UnoCSS), requires
   postcss.config.ts, documented Tailwind CSS 4 setup

---

## Source Files Reference

### @tabirun/app exports (from deno.json)

- `@tabirun/app` → ./app/mod.ts
- `@tabirun/app/body-size`
- `@tabirun/app/cache-control`
- `@tabirun/app/compression`
- `@tabirun/app/cookies`
- `@tabirun/app/cors`
- `@tabirun/app/csrf`
- `@tabirun/app/csp`
- `@tabirun/app/linear-router`
- `@tabirun/app/logs`
- `@tabirun/app/rate-limit`
- `@tabirun/app/request-id`
- `@tabirun/app/security-headers`
- `@tabirun/app/serve-files`
- `@tabirun/app/status`
- `@tabirun/app/timeout`
- `@tabirun/app/validate`

### @tabirun/pages exports (from deno.json)

- `@tabirun/pages` → ./pages/mod.ts (pages factory)
- `@tabirun/pages/preact` → ./preact/mod.ts
- `@tabirun/pages/preact/jsx-runtime`
- `@tabirun/pages/preact/jsx-dev-runtime`
- `@tabirun/pages/preact/hooks`

---

## Second Pass Verification (Complete)

All documentation pages verified against source code. All API calls, imports,
types, and configuration options match the actual implementations.

### Verified Pages Docs

- [x] `layouts.md` - Correct: LayoutProps, useFrontmatter from
      @tabirun/pages/preact
- [x] `markdown.md` - Correct: shikiTheme config, markdown.wrapperClassName,
      imports
- [x] `pages-and-routing.md` - Correct: DocumentProps with head/children
- [x] `styling.md` - **WRONG**: Claimed UnoCSS auto-detection, actually uses
      PostCSS. REWRITTEN with correct Tailwind CSS 4 example.

### Verified App Docs

- [x] `validate.md` - Correct: validator factory pattern matches source

---

## Structure Review & Recommendations

### Current Navigation Structure

```
Home
Getting Started (general intro)
├── Tabirun App
│   ├── Installation, Philosophy
├── Core Concepts (6 items)
├── Middleware (12 items)
├── Utilities (1 item)
├── Guides (2 items)
├── Tabirun Pages
│   ├── Getting Started
├── Pages Concepts (7 items)
```

### Issues Found

1. **Undocumented exports** - `@tabirun/app/logs` and `@tabirun/app/status` are
   exported but not documented
   - `logs` exports `TabiLogger` with success/info/warn/error methods
   - `status` exports HTTP status code constants
   - Decision: Either document or mark as internal in source

2. **Naming collision** - Two "Getting Started" pages
   - Top-level `/docs/getting-started` is general intro
   - `/docs/pages/getting-started` is Pages-specific
   - Not confusing in navigation but slightly redundant

3. **Large middleware section** - 12 middleware items in one flat list
   - Works but could benefit from sub-grouping for discoverability

### Recommendations

**Keep as-is (working well):**

- Overall structure with App and Pages as separate sections
- Core Concepts as foundation before middleware
- Guides at end of each section
- "Next Steps" links at bottom of each page
- Right-side table of contents for long pages

**Consider improving:**

1. **Group middleware by category** (optional, if list grows):
   ```
   Middleware
   ├── Security
   │   └── CORS, CSRF, CSP, Security Headers
   ├── Performance
   │   └── Compression, Cache Control, Timeout
   ├── Request Processing
   │   └── Body Size, Request ID, Validation
   └── Utilities
       └── Serve Files, Rate Limiting
   ```

2. **Add missing documentation:**
   - `@tabirun/app/logs` - TabiLogger utility (if public)
   - `@tabirun/app/status` - HTTP status constants (if public)

3. **Add type reference pages** (optional):
   - Full TypeScript type exports for both packages
   - Useful for quick API lookup

**Not recommended:**

- Don't add overview/marketing pages - already removed as fluff
- Don't over-structure with too many nesting levels
- Don't duplicate content across pages

### Final Assessment

Documentation is now accurate and well-structured. The current navigation works
well for a project of this size. Main improvements would be:

1. Document the missing utilities if they're public API
2. Consider middleware grouping if more are added later
