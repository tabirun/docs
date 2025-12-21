---
title: "Styling"
description: "CSS and UnoCSS integration in Tabirun Pages"
---

# Styling

Tabirun Pages supports plain CSS and has built-in [UnoCSS](https://unocss.dev)
integration.

## Static CSS

Place CSS files in your `public/` directory and reference them in `_html.tsx`:

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

During build, assets in `public/` are copied to the output with content hashing
for cache busting.

## UnoCSS Integration

Tabirun Pages automatically detects UnoCSS when a `uno.config.ts` file exists in
your project root.

### Setup

Add UnoCSS to your imports in `deno.json`:

```json
{
  "imports": {
    "unocss": "npm:unocss@^66"
  }
}
```

Create `uno.config.ts`:

```typescript
import { defineConfig, presetTypography, presetUno } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
  ],
});
```

That's it. Tabirun Pages will:

1. Scan all pages, layouts, and components for class usage
2. Generate only the CSS you use
3. Inject the CSS into your pages automatically

See the [UnoCSS documentation](https://unocss.dev) for configuration options,
presets, and utility class reference.

### Markdown Typography

Use `presetTypography` with the `wrapperClassName` option to style markdown
content:

```typescript
const { dev } = pages({
  markdown: {
    wrapperClassName: "prose dark:prose-invert",
  },
});
```

Or apply prose classes in your layout:

```tsx
import type { LayoutProps } from "@tabirun/pages/preact";

export default function DocsLayout(props: LayoutProps) {
  return (
    <article className="prose dark:prose-invert max-w-none">
      {props.children}
    </article>
  );
}
```

## Asset Hashing

During production builds, all assets including CSS files are content-hashed:

```
/public/styles.css → /__public/styles-a1b2c3d4.css
```

This enables aggressive caching while ensuring updates are always served.

## Next Steps

- [Build & Deploy](/docs/pages/build-and-deploy) - Build for production
- [Configuration](/docs/pages/configuration) - All configuration options
