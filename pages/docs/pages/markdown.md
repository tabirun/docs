---
title: "Markdown"
description: "Content authoring with frontmatter and syntax highlighting"
---

# Markdown

Tabirun Pages uses GitHub Flavored Markdown (GFM) with YAML frontmatter and
Shiki-powered syntax highlighting.

## Frontmatter

Every markdown page requires YAML frontmatter with at least a `title`:

```markdown
---
title: "My Page Title"
description: "Optional meta description"
---

# Content starts here
```

### Required Fields

| Field   | Type   | Description           |
| ------- | ------ | --------------------- |
| `title` | string | Page title (required) |

### Optional Fields

| Field         | Type   | Description              |
| ------------- | ------ | ------------------------ |
| `description` | string | Meta description for SEO |

### Custom Fields

Add any custom fields you need. Access them via `useFrontmatter()` in layouts
and components:

```markdown
---
title: "Blog Post"
author: "Jane Doe"
publishedAt: "2024-01-15"
tags:
  - typescript
  - deno
---
```

```tsx
import type { LayoutProps } from "@tabirun/pages/preact";
import { useFrontmatter } from "@tabirun/pages/preact";

export default function BlogLayout(props: LayoutProps) {
  const { author, publishedAt, tags } = useFrontmatter();

  return (
    <article>
      <header>
        <p>By {author} on {publishedAt}</p>
        <div>{tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </header>
      {props.children}
    </article>
  );
}
```

## GitHub Flavored Markdown

All GFM features are supported:

### Tables

```markdown
| Feature | Status |
| ------- | ------ |
| Tables  | Yes    |
| Lists   | Yes    |
```

Renders as:

| Feature | Status |
| ------- | ------ |
| Tables  | Yes    |
| Lists   | Yes    |

### Task Lists

```markdown
- [x] Completed task
- [ ] Pending task
```

### Autolinks

URLs and email addresses are automatically linked:

```markdown
Visit https://example.com or email hello@example.com
```

### Strikethrough

```markdown
~~deleted text~~
```

## Code Highlighting

Code blocks are highlighted with [Shiki](https://shiki.style). Specify the
language identifier after the opening fence (e.g., `typescript`, `python`,
`json`):

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

### Supported Languages

Shiki supports 200+ languages including TypeScript, JavaScript, Python, Rust,
Go, and more. Use the language identifier after the opening fence.

### Theme Configuration

Configure the theme in your pages options:

```typescript
const { dev } = pages({
  shikiTheme: "github-dark", // Default
});
```

Available themes include:

- `github-dark` (default)
- `github-light`
- `one-dark-pro`
- `dracula`
- `nord`

See [Shiki themes](https://shiki.style/themes) for the full list.

## Wrapper Class

Apply a CSS class to the markdown content wrapper:

```typescript
const { dev } = pages({
  markdown: {
    wrapperClassName: "prose dark:prose-invert",
  },
});
```

This wraps the rendered markdown in:

```html
<div class="prose dark:prose-invert">
  <!-- rendered markdown -->
</div>
```

Useful with typography utilities like Tailwind's `@tailwindcss/typography` or
UnoCSS's `@unocss/preset-typography`.

## Inline HTML

You can use HTML directly in markdown:

```markdown
# My Page

<div class="custom-component">
  Custom HTML content
</div>

Back to regular markdown.
```

## Links

Internal links work as expected:

```markdown
See the [Getting Started](/docs/pages/getting-started) guide.
```

External links open normally:

```markdown
Visit [Deno](https://deno.com) for more info.
```

## Images

Reference images from your `public` directory:

```markdown
![Alt text](/public/images/screenshot.png)
```

Or use external URLs:

```markdown
![Deno logo](https://deno.land/logo.svg)
```

## Next Steps

- [Layouts](/docs/pages/layouts) - Wrap content with consistent structure
- [Components](/docs/pages/components) - Build interactive TSX pages
