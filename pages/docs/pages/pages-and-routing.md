---
title: "Pages & Routing"
description: "File conventions and URL mapping in Tabirun Pages"
---

# Pages & Routing

Tabirun Pages uses file-based routing. Your directory structure in `pages/`
directly maps to URLs.

## Page Types

Pages can be either Markdown (`.md`) or TSX (`.tsx`):

| File Type | Use Case                           |
| --------- | ---------------------------------- |
| `.md`     | Content-focused pages              |
| `.tsx`    | Interactive pages with Preact code |

Both require frontmatter with at least a `title` field.

## URL Mapping

Files map to URLs predictably:

| File Path               | URL             |
| ----------------------- | --------------- |
| `pages/index.md`        | `/`             |
| `pages/about.md`        | `/about`        |
| `pages/docs/index.md`   | `/docs`         |
| `pages/docs/intro.md`   | `/docs/intro`   |
| `pages/docs/api/ref.md` | `/docs/api/ref` |

### Index Pages

Files named `index.md` or `index.tsx` represent their directory:

```
pages/
├── index.md           # → /
└── docs/
    ├── index.md       # → /docs
    └── api/
        └── index.md   # → /docs/api
```

## System Files

Files starting with `_` are system files. They're not routed but provide special
functionality. All are optional—sensible defaults are used when omitted:

| File             | Purpose                | Location  |
| ---------------- | ---------------------- | --------- |
| `_html.tsx`      | HTML document template | Root only |
| `_layout.tsx`    | Layout wrapper         | Any level |
| `_not-found.tsx` | Custom 404 page        | Root only |
| `_error.tsx`     | Custom error page      | Root only |

### `_html.tsx`

Controls the HTML document structure. Receives `DocumentProps`:

```tsx
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

### `_layout.tsx`

Wraps pages with shared UI. See [Layouts](/docs/pages/layouts) for details.

### `_not-found.tsx`

Custom 404 page:

```tsx
export const frontmatter = {
  title: "Not Found",
};

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found.</p>
      <a href="/">Go home</a>
    </div>
  );
}
```

### `_error.tsx`

Custom error page for server errors:

```tsx
export const frontmatter = {
  title: "Error",
};

export default function Error() {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>Please try again later.</p>
    </div>
  );
}
```

## Excluded Files

Files and directories starting with `_` (except system files) are excluded from
routing:

```
pages/
├── _components/       # Not routed (component library)
│   └── button.tsx
├── _drafts/           # Not routed (draft content)
│   └── upcoming.md
└── about.md           # → /about
```

This is useful for colocating components or draft content with your pages.

## Example Structure

A typical documentation site:

```
pages/
├── _html.tsx              # Document template
├── _layout.tsx            # Root layout (header/footer)
├── _not-found.tsx         # Custom 404
├── index.md               # → /
├── about.md               # → /about
└── docs/
    ├── _layout.tsx        # Docs layout (sidebar)
    ├── index.md           # → /docs
    ├── getting-started.md # → /docs/getting-started
    └── api/
        ├── index.md       # → /docs/api
        └── reference.md   # → /docs/api/reference
```

## Next Steps

- [Markdown](/docs/pages/markdown) - Learn frontmatter and content authoring
- [Layouts](/docs/pages/layouts) - Build consistent page structure
