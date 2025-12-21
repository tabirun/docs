---
title: "Styling"
description: "CSS processing with PostCSS in Tabirun Pages"
---

# Styling

Tabirun Pages uses PostCSS for CSS processing. You provide a CSS entry file and
a PostCSS config, and the framework handles the rest - processing, hashing, and
injecting the stylesheet link into all pages automatically.

## Setup

### 1. Add Dependencies

Add PostCSS and Tailwind CSS to your `deno.json`:

```json
{
  "imports": {
    "@tabirun/app": "jsr:@tabirun/app",
    "@tabirun/pages": "jsr:@tabirun/pages",
    "postcss": "npm:postcss@^8",
    "tailwindcss": "npm:tailwindcss@^4",
    "@tailwindcss/postcss": "npm:@tailwindcss/postcss@^4",
    "@tailwindcss/typography": "npm:@tailwindcss/typography@^0.5"
  },
  "nodeModulesDir": "auto"
}
```

### 2. Create PostCSS Config

Create `postcss.config.ts` at your project root:

```typescript
import tailwindcss from "@tailwindcss/postcss";

export default {
  plugins: [tailwindcss()],
};
```

### 3. Create CSS Entry File

Create `styles/index.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));
```

That's it. Tabirun Pages will:

1. Detect `postcss.config.ts` and process your CSS
2. Generate a content-hashed output file (`/__styles/A1B2C3D4.css`)
3. Inject the `<link rel="stylesheet">` into all pages automatically

No need to manually add stylesheet links to your `_html.tsx`.

## Configuration

The CSS entry file defaults to `./styles/index.css`. To use a different path:

```typescript
const { dev, build } = pages({
  css: { entry: "./src/styles/main.css" },
});
```

## Markdown Typography

Use Tailwind's typography plugin with the `wrapperClassName` option to style
markdown content:

```typescript
const { dev } = pages({
  markdown: {
    wrapperClassName: "prose dark:prose-invert",
  },
});
```

This wraps rendered markdown in:

```html
<div class="prose dark:prose-invert">
  <!-- rendered markdown -->
</div>
```

## Next Steps

- [Build & Deploy](/docs/pages/build-and-deploy) - Build for production
- [Configuration](/docs/pages/configuration) - All configuration options
