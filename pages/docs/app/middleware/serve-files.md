---
title: "Serve Files"
description: "Serve static files from a directory"
---

# Serve Files

The Serve Files middleware serves static files from a directory, with support
for index files and custom not-found handling. It prevents path traversal
attacks automatically.

## Quick Start

```typescript
import { TabiApp } from "@tabirun/app";
import { serveFiles } from "@tabirun/app/serve-files";

const app = new TabiApp();

// Serve files from ./public directory
app.get(
  "/static/*",
  serveFiles({
    directory: "./public",
  }),
);

Deno.serve(app.handler);
```

## How It Works

The middleware maps URL paths to files in the specified directory. When a
request matches the route pattern, it attempts to serve the corresponding file.
Directory requests can optionally serve an index.html file.

## Options

| Option       | Type                                  | Default        | Description                           |
| ------------ | ------------------------------------- | -------------- | ------------------------------------- |
| `directory`  | `string`                              | (required)     | Directory to serve files from         |
| `serveIndex` | `boolean`                             | `true`         | Serve index.html for directories      |
| `onNotFound` | `(c: TabiContext) => void \| Promise` | `c.notFound()` | Custom handler when file is not found |

## Examples

### Basic Static File Serving

Serve files from a public directory:

```typescript
import { TabiApp } from "@tabirun/app";
import { serveFiles } from "@tabirun/app/serve-files";

const app = new TabiApp();

app.get(
  "/static/*",
  serveFiles({
    directory: "./public",
    serveIndex: true,
  }),
);

Deno.serve(app.handler);
```

### Custom Not Found Handler

Provide custom logic when a file is not found:

```typescript
import { TabiApp } from "@tabirun/app";
import { serveFiles } from "@tabirun/app/serve-files";

const app = new TabiApp();

app.get(
  "/static/*",
  serveFiles({
    directory: "./public",
    onNotFound: (c) => {
      return c.html("<h1>Custom 404</h1><p>File not found.</p>", 404);
    },
  }),
);
```

### Serve a Custom 404 Page

Serve a pre-built 404 page:

```typescript
import { TabiApp } from "@tabirun/app";
import { serveFiles } from "@tabirun/app/serve-files";

const notFoundHtml = await Deno.readTextFile("./public/404.html");

const app = new TabiApp();

app.get(
  "/*",
  serveFiles({
    directory: "./dist",
    onNotFound: (c) => {
      return c.html(notFoundHtml, 404);
    },
  }),
);
```

### Async Not Found Handler

Use async operations in the not-found handler:

```typescript
import { TabiApp } from "@tabirun/app";
import { serveFiles } from "@tabirun/app/serve-files";

const app = new TabiApp();

app.get(
  "/*",
  serveFiles({
    directory: "./dist",
    onNotFound: async (c) => {
      const html = await Deno.readTextFile("./errors/404.html");
      return c.html(html, 404);
    },
  }),
);
```

### Serving a Single-Page Application

Serve an SPA with fallback to index.html:

```typescript
import { TabiApp } from "@tabirun/app";
import { serveFiles } from "@tabirun/app/serve-files";

const indexHtml = await Deno.readTextFile("./dist/index.html");

const app = new TabiApp();

app.get(
  "/*",
  serveFiles({
    directory: "./dist",
    onNotFound: (c) => {
      // Serve index.html for SPA routing
      return c.html(indexHtml);
    },
  }),
);
```

## Security Considerations

**Path traversal**: The middleware automatically prevents path traversal attacks
(e.g., `../../../etc/passwd`).

**Best practices**:

- Only serve from intended directories
- Don't expose sensitive files in public directories
- Use appropriate cache headers for static assets
- Consider using a CDN for production deployments

## Notes

- Only serves on GET and HEAD requests (returns 405 for others)
- Must be used with wildcard routes (e.g., `/static/*`)
- Prevents path traversal attacks automatically
- Returns 404 if file doesn't exist
- When `serveIndex: true`, `/folder/` serves `/folder/index.html`

## Related

- [Routing](/docs/app/core/routing) - Route patterns and wildcards
- [Cache Control](/docs/app/middleware/cache-control) - Set caching headers
- [Compression](/docs/app/middleware/compression) - Compress responses
