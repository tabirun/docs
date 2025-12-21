---
title: "Layouts"
description: "Nested layout composition in Tabirun Pages"
---

# Layouts

Layouts wrap pages with shared UI like headers, footers, and navigation. Tabirun
Pages supports nested layouts that compose from root to leaf.

## Creating a Layout

Create `_layout.tsx` in any directory:

```tsx
import type { LayoutProps } from "@tabirun/pages/preact";

export default function Layout(props: LayoutProps) {
  return (
    <div>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
      <main>{props.children}</main>
      <footer>Copyright 2024</footer>
    </div>
  );
}
```

The layout receives `LayoutProps` with a `children` prop containing the page
content.

## Rendering Children

Layouts **must** render `props.children` or page content will be lost:

```tsx
// Correct - renders children
export default function Layout(props: LayoutProps) {
  return (
    <div>
      <nav>...</nav>
      {props.children}
    </div>
  );
}

// Wrong - children not rendered, page content lost
export default function Layout(props: LayoutProps) {
  return (
    <div>
      <nav>...</nav>
    </div>
  );
}
```

## Nested Layouts

Layouts nest automatically based on directory structure. Each layout wraps its
children:

```
pages/
├── _layout.tsx        # Root layout (header/footer)
├── index.md
└── docs/
    ├── _layout.tsx    # Docs layout (sidebar)
    ├── index.md
    └── api/
        ├── _layout.tsx  # API layout (version selector)
        └── reference.md
```

For `/docs/api/reference`, the composition order is:

```
RootLayout
  └── DocsLayout
        └── ApiLayout
              └── PageContent
```

Each layout wraps the next, creating a nested structure.

## Accessing Frontmatter

Use `useFrontmatter()` to access page metadata in layouts:

```tsx
import type { LayoutProps } from "@tabirun/pages/preact";
import { useFrontmatter } from "@tabirun/pages/preact";

export default function DocsLayout(props: LayoutProps) {
  const { title, description } = useFrontmatter();

  return (
    <div className="docs-container">
      <aside>
        <nav>
          <h2>Documentation</h2>
          {/* Navigation items */}
        </nav>
      </aside>
      <article>
        <h1>{title}</h1>
        {description && <p className="lead">{description}</p>}
        {props.children}
      </article>
    </div>
  );
}
```

Custom frontmatter fields are also available:

```tsx
const { author, category, tags } = useFrontmatter();
```

## Layout Patterns

### Documentation Layout

Sidebar navigation with table of contents:

```tsx
import type { LayoutProps } from "@tabirun/pages/preact";

const navItems = [
  { label: "Introduction", href: "/docs" },
  { label: "Getting Started", href: "/docs/getting-started" },
  { label: "API Reference", href: "/docs/api" },
];

export default function DocsLayout(props: LayoutProps) {
  return (
    <div className="flex">
      <aside className="w-64 p-4">
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="block py-2">
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4">
        {props.children}
      </main>
    </div>
  );
}
```

### Blog Layout

Author info and publish date:

```tsx
import type { LayoutProps } from "@tabirun/pages/preact";
import { useFrontmatter } from "@tabirun/pages/preact";

export default function BlogLayout(props: LayoutProps) {
  const { title, author, publishedAt } = useFrontmatter();

  return (
    <article className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600">
          By {author} on {new Date(publishedAt).toLocaleDateString()}
        </p>
      </header>
      {props.children}
    </article>
  );
}
```

### Marketing Layout

Different header for marketing pages:

```tsx
import type { LayoutProps } from "@tabirun/pages/preact";

export default function MarketingLayout(props: LayoutProps) {
  return (
    <div>
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <nav className="max-w-6xl mx-auto p-4 flex justify-between">
          <a href="/" className="text-xl font-bold">Brand</a>
          <div className="space-x-4">
            <a href="/features">Features</a>
            <a href="/pricing">Pricing</a>
            <a href="/docs">Docs</a>
          </div>
        </nav>
      </header>
      {props.children}
      <footer className="bg-gray-900 text-white p-8">
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

## Layout vs HTML Template

| File          | Purpose                            | Scope     |
| ------------- | ---------------------------------- | --------- |
| `_html.tsx`   | HTML document (`<html>`, `<head>`) | Root only |
| `_layout.tsx` | Page wrapper UI                    | Any level |

`_html.tsx` controls the document structure. `_layout.tsx` controls page UI.

## Next Steps

- [Components](/docs/pages/components) - Build interactive TSX pages
- [Styling](/docs/pages/styling) - Add CSS and UnoCSS
