---
title: "Components"
description: "TSX pages and built-in components in Tabirun Pages"
---

# Components

Tabirun Pages supports TSX pages for interactive content and provides built-in
components for common patterns.

## Preact Imports

**Always import Preact APIs from `@tabirun/pages/preact`**, not directly from
`preact`. This ensures all code uses the same Preact instance, avoiding version
mismatch issues that cause hooks and context to fail.

```tsx
// Correct - use @tabirun/pages/preact
import {
  Head,
  useEffect,
  useFrontmatter,
  useState,
} from "@tabirun/pages/preact";
import type { LayoutProps } from "@tabirun/pages/preact";

// Wrong - do NOT import directly from preact
// import { useState } from "preact/hooks";
// import { h } from "preact";
```

The `@tabirun/pages/preact` module re-exports all Preact core APIs, hooks, and
Tabirun-specific components:

| Export                         | Description                    |
| ------------------------------ | ------------------------------ |
| `useState`, `useEffect`, etc.  | All Preact hooks               |
| `h`, `Fragment`, `Component`   | Preact core                    |
| `Head`                         | Add elements to `<head>`       |
| `Code`                         | Syntax-highlighted code blocks |
| `useFrontmatter`               | Access page frontmatter        |
| `useBasePath`                  | Get configured base path       |
| `LayoutProps`, `DocumentProps` | TypeScript types               |

## TSX Pages

Create `.tsx` files for pages that need Preact components:

```tsx
// pages/counter.tsx
import { useState } from "@tabirun/pages/preact";

export const frontmatter = {
  title: "Counter",
  description: "An interactive counter demo",
};

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}
```

### Frontmatter Export

TSX pages export frontmatter as a JavaScript object instead of YAML:

```tsx
export const frontmatter = {
  title: "Page Title", // Required
  description: "Description", // Optional
  customField: "any value", // Custom fields
};
```

### Default Export

The default export is the page component. It renders inside any applicable
layouts.

## Client Hydration

TSX pages are server-rendered and then hydrated on the client. This means:

1. **Fast initial load** - HTML is pre-rendered
2. **Interactive** - Preact takes over after load
3. **SEO friendly** - Content is in the HTML

State, effects, and event handlers work after hydration:

```tsx
import { useEffect, useState } from "@tabirun/pages/preact";

export const frontmatter = { title: "Interactive Page" };

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Runs after hydration on the client
    fetch("/api/data")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1>Data Fetching</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}
```

## Built-in Components

### Head

Add elements to `<head>` from anywhere in your component tree:

```tsx
import { Head } from "@tabirun/pages/preact";

export const frontmatter = { title: "My Page" };

export default function Page() {
  return (
    <div>
      <Head>
        <link rel="canonical" href="https://example.com/page" />
        <meta property="og:title" content="My Page" />
        <meta property="og:image" content="/public/og-image.png" />
        <script src="/public/analytics.js" defer />
      </Head>
      <h1>My Page</h1>
    </div>
  );
}
```

Use `<Head>` in layouts to add global elements:

```tsx
import type { LayoutProps } from "@tabirun/pages/preact";
import { Head, useFrontmatter } from "@tabirun/pages/preact";

export default function Layout(props: LayoutProps) {
  const { title, description } = useFrontmatter();

  return (
    <>
      <Head>
        <meta property="og:title" content={title} />
        {description && (
          <meta
            property="og:description"
            content={description}
          />
        )}
        <link rel="icon" href="/public/favicon.ico" />
      </Head>
      {props.children}
    </>
  );
}
```

### Code

Render syntax-highlighted code blocks in TSX pages:

```tsx
import { Code } from "@tabirun/pages/preact";

export const frontmatter = { title: "Code Example" };

export default function Page() {
  return (
    <div>
      <h1>Code Examples</h1>
      <Code lang="typescript">
        {`const greeting: string = "Hello";
console.log(greeting);`}
      </Code>
    </div>
  );
}
```

#### Props

| Prop       | Type     | Description                      |
| ---------- | -------- | -------------------------------- |
| `lang`     | `string` | Language for syntax highlighting |
| `children` | `string` | Code content to render           |

### useFrontmatter

Access page frontmatter from any component:

```tsx
import { useFrontmatter } from "@tabirun/pages/preact";

export default function PageHeader() {
  const { title, description, author } = useFrontmatter();

  return (
    <header>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {author && <p>By {author}</p>}
    </header>
  );
}
```

Works in layouts, pages, and any child components.

## Choosing TSX vs Markdown

Use TSX pages when you need:

- Interactive elements (forms, counters, tabs)
- Complex data fetching
- Conditional rendering
- State management

Use Markdown pages (`.md` files) for:

- Documentation
- Blog posts
- Static content

You can import components into layouts that wrap markdown pages:

```tsx
// pages/docs/_layout.tsx
import type { LayoutProps } from "@tabirun/pages/preact";
import { TableOfContents } from "../_components/toc.tsx";
import { SearchBox } from "../_components/search.tsx";

export default function DocsLayout(props: LayoutProps) {
  return (
    <div className="flex">
      <aside>
        <SearchBox />
        <TableOfContents />
      </aside>
      <main>{props.children}</main>
    </div>
  );
}
```

## Component Organization

Keep components outside the `pages/` directory or in `_` prefixed directories:

```
my-site/
├── components/         # Shared components
│   ├── button.tsx
│   └── header.tsx
├── pages/
│   ├── _components/    # Page-specific components (not routed)
│   │   └── hero.tsx
│   ├── _layout.tsx
│   └── index.tsx
└── main.ts
```

Import components as needed:

```tsx
// pages/index.tsx
import { Button } from "../components/button.tsx";
import { Hero } from "./_components/hero.tsx";

export const frontmatter = { title: "Home" };

export default function Home() {
  return (
    <div>
      <Hero />
      <Button>Get Started</Button>
    </div>
  );
}
```

## Props Type Reference

### LayoutProps

```typescript
interface LayoutProps {
  children: ComponentChildren;
}
```

### DocumentProps

```typescript
interface DocumentProps {
  head: ComponentChildren;
  children: ComponentChildren;
}
```

### Frontmatter

```typescript
interface Frontmatter {
  title: string;
  description?: string;
  [key: string]: unknown;
}
```

## Next Steps

- [Styling](/docs/pages/styling) - Add CSS and UnoCSS
- [Build & Deploy](/docs/pages/build-and-deploy) - Ship your site
