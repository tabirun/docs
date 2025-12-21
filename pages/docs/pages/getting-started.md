---
title: "Getting Started"
description: "Set up your first Tabirun Pages project"
---

# Getting Started

This guide walks you through creating a Tabirun Pages site from scratch. By the
end, you'll have a working site with multiple pages, a layout, and styled
content.

## Prerequisites

Install [Deno](https://deno.com) if you haven't already:

```bash
curl -fsSL https://deno.land/install.sh | sh
```

## Project Setup

Create a new directory and initialize it:

```bash
mkdir my-site && cd my-site
deno init
```

Create a `deno.json` with the required imports:

```json
{
  "imports": {
    "@tabirun/app": "jsr:@tabirun/app",
    "@tabirun/pages": "jsr:@tabirun/pages"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@tabirun/pages/preact"
  }
}
```

**Important:** Do not add `preact` as a direct dependency. Tabirun Pages bundles
Preact internally, and using `@tabirun/pages/preact` as the JSX import source
ensures all code uses the same Preact instance. See
[Components](/docs/pages/components#preact-imports) for details.

## Create the Server

Create `main.ts`:

```typescript
import { TabiApp } from "@tabirun/app";
import { pages } from "@tabirun/pages";

const app = new TabiApp();
const { dev } = pages();

await dev(app);

Deno.serve(app.handler);
```

## Create Your First Page

Create a `pages` directory with an index page:

```bash
mkdir pages
```

Create `pages/index.md`:

```markdown
---
title: "Home"
description: "Welcome to my site"
---

# Welcome

This is my site built with Tabirun Pages.

## Features

- Markdown content
- Automatic routing
- Fast development
```

## Run the Development Server

```bash
deno run -A main.ts
```

Visit [http://localhost:8000](http://localhost:8000). You'll see your rendered
markdown page.

## Add More Pages

Create `pages/about.md`:

```markdown
---
title: "About"
description: "About this site"
---

# About

This page is available at `/about`.
```

The file `pages/about.md` automatically becomes the `/about` URL.

## Add a Layout

Layouts wrap your pages with consistent structure. Create `pages/_layout.tsx`:

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
      <footer>Built with Tabirun Pages</footer>
    </div>
  );
}
```

Refresh the page. Both `/` and `/about` now share the same header and footer.

## Add Styles

Create a `public` directory for static assets:

```bash
mkdir public
```

Create `public/styles.css`:

```css
body {
  font-family: system-ui, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

nav a {
  margin-right: 1rem;
}
```

Create `pages/_html.tsx` to include the stylesheet:

```tsx
import type { DocumentProps } from "@tabirun/pages/preact";

export default function Document({ head, children }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/public/styles.css" />
        {head}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

The `head` prop contains content from `<Head>` components (title, meta tags,
etc.).

## Project Structure

Your site now looks like this:

```
my-site/
├── pages/
│   ├── _html.tsx      # HTML document template
│   ├── _layout.tsx    # Root layout
│   ├── index.md       # → /
│   └── about.md       # → /about
├── public/
│   └── styles.css
├── deno.json
└── main.ts
```

## Next Steps

- [Pages & Routing](/docs/pages/pages-and-routing) - Learn file conventions and
  URL mapping
- [Markdown](/docs/pages/markdown) - Frontmatter, code highlighting, and more
- [Layouts](/docs/pages/layouts) - Nested layouts and composition
- [Components](/docs/pages/components) - Build interactive TSX pages
