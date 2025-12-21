---
title: "Configuration"
description: "All configuration options for Tabirun Pages"
---

# Configuration

Complete reference for Tabirun Pages configuration options.

## pages()

The main factory function that returns dev, build, and serve functions:

```typescript
import { pages } from "@tabirun/pages";

const { dev, build, serve } = pages({
  basePath: "/docs",
  shikiTheme: "github-dark",
  siteMetadata: {
    baseUrl: "https://example.com",
  },
  markdown: {
    wrapperClassName: "prose dark:prose-invert",
  },
});
```

### PagesConfig

| Option         | Type           | Default         | Description                                |
| -------------- | -------------- | --------------- | ------------------------------------------ |
| `basePath`     | `string`       | `""`            | URL base path (for subpath hosting)        |
| `shikiTheme`   | `string`       | `"github-dark"` | Shiki theme for syntax highlighting        |
| `siteMetadata` | `SiteMetadata` | `undefined`     | Site metadata (enables sitemap generation) |
| `markdown`     | `object`       | `undefined`     | Markdown processing options                |
| `css`          | `object`       | `undefined`     | CSS processing options                     |

### SiteMetadata

| Option    | Type     | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `baseUrl` | `string` | Base URL for sitemap (e.g., `https://example.com`) |

### Markdown Options

| Option             | Type     | Default     | Description                    |
| ------------------ | -------- | ----------- | ------------------------------ |
| `wrapperClassName` | `string` | `undefined` | CSS class for markdown wrapper |

### CSS Options

| Option  | Type     | Default                | Description                                         |
| ------- | -------- | ---------------------- | --------------------------------------------------- |
| `entry` | `string` | `"./styles/index.css"` | Path to CSS entry file (requires postcss.config.ts) |

## dev()

Registers the development server with hot reload:

```typescript
await dev(app, {
  pagesDir: "./pages",
});
```

### DevOptions

| Option     | Type     | Default     | Description                            |
| ---------- | -------- | ----------- | -------------------------------------- |
| `pagesDir` | `string` | `"./pages"` | Directory containing page source files |

### Features

- **On-demand rendering** - Pages rendered when requested
- **Hot reload** - WebSocket-based live reload on file changes
- **Error overlay** - Visual error display in browser
- **Bundle caching** - LRU cache for built bundles

## build()

Builds the site for production:

```typescript
await build({
  pagesDir: "./pages",
  outDir: "./dist",
});
```

### BuildOptions

| Option     | Type     | Default     | Description                            |
| ---------- | -------- | ----------- | -------------------------------------- |
| `pagesDir` | `string` | `"./pages"` | Directory containing page source files |
| `outDir`   | `string` | `"./dist"`  | Build output directory                 |

### Build Process

1. Clean output directory
2. Scan for pages and system files
3. Build asset map with content hashes
4. Process CSS via PostCSS (if postcss.config.ts exists)
5. Build client bundles (parallel)
6. Render pages to HTML (parallel)
7. Render 404 and error pages
8. Copy hashed assets
9. Generate sitemap.xml and robots.txt

## serve()

Serves pre-built static files:

```typescript
serve(app, {
  dir: "./dist",
});
```

### ServeOptions

| Option | Type     | Default    | Description                |
| ------ | -------- | ---------- | -------------------------- |
| `dir`  | `string` | `"./dist"` | Directory with built files |

### Features

- Serves static HTML files
- Cache headers for hashed assets
- 404 fallback to `_not-found.html`

## File Conventions

### System Files

| File             | Required | Location  | Purpose                |
| ---------------- | -------- | --------- | ---------------------- |
| `_html.tsx`      | No       | Root only | HTML document template |
| `_layout.tsx`    | No       | Any level | Page wrapper/layout    |
| `_not-found.tsx` | No       | Root only | Custom 404 page        |
| `_error.tsx`     | No       | Root only | Custom error page      |

### Page Files

| Extension | Frontmatter          | Description        |
| --------- | -------------------- | ------------------ |
| `.md`     | YAML block           | Markdown content   |
| `.tsx`    | `frontmatter` export | Interactive Preact |

### Frontmatter Schema

```typescript
interface Frontmatter {
  title: string; // Required
  description?: string; // Optional
  [key: string]: unknown; // Custom fields allowed
}
```

## TypeScript Types

All types and Preact APIs should be imported from `@tabirun/pages/preact`. Do
not import directly from `preact` - this ensures all code uses the same Preact
instance and avoids hook/context failures.

### LayoutProps

```typescript
import type { LayoutProps } from "@tabirun/pages/preact";

export default function Layout(props: LayoutProps) {
  return <div>{props.children}</div>;
}
```

### DocumentProps

```typescript
import type { DocumentProps } from "@tabirun/pages/preact";

export default function Document({ head, children }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {head}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

The `head` prop contains content from `<Head>` components (title, meta tags,
etc.).

### Frontmatter Access

```typescript
import { useFrontmatter } from "@tabirun/pages/preact";

function Component() {
  const { title, description, customField } = useFrontmatter();
}
```

### Head Component

```typescript
import { Head } from "@tabirun/pages/preact";

function Component() {
  return (
    <Head>
      <meta name="robots" content="noindex" />
    </Head>
  );
}
```

## Environment Detection

Detect development vs production:

```typescript
const { dev, serve } = pages();

const isDev = Deno.env.get("DENO_ENV") !== "production";

if (isDev) {
  await dev(app);
} else {
  serve(app);
}
```

## Shiki Themes

Available themes for code highlighting:

| Theme           | Description                   |
| --------------- | ----------------------------- |
| `github-dark`   | GitHub's dark theme (default) |
| `github-light`  | GitHub's light theme          |
| `one-dark-pro`  | Atom One Dark                 |
| `dracula`       | Dracula theme                 |
| `nord`          | Nord theme                    |
| `vitesse-dark`  | Vitesse dark                  |
| `vitesse-light` | Vitesse light                 |
| `min-dark`      | Minimal dark                  |
| `min-light`     | Minimal light                 |

See [Shiki themes](https://shiki.style/themes) for the complete list.

## Base Path

For sites hosted at a subpath (e.g., `https://example.com/docs/`):

```typescript
const { dev, build, serve } = pages({
  basePath: "/docs",
  siteMetadata: { baseUrl: "https://example.com" },
});

await build();
```

All internal links and assets will be prefixed with `/docs`.
