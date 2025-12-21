---
title: "Build & Deploy"
description: "Build for production and deploy your Tabirun Pages site"
---

# Build & Deploy

Tabirun Pages generates a static site that can be deployed anywhere.

## Building for Production

Create a build script:

```typescript
// build.ts
import { pages } from "@tabirun/pages";

const { build } = pages({
  siteMetadata: {
    baseUrl: "https://example.com",
  },
});

await build();
```

Run the build:

```bash
deno run -A build.ts
```

This generates a `dist/` directory with your static site.

## Build Output

The build process creates:

```
dist/
├── index.html                    # /
├── about/
│   └── index.html                # /about
├── docs/
│   ├── index.html                # /docs
│   └── getting-started/
│       └── index.html            # /docs/getting-started
├── __bundles/
│   ├── index-a1b2c3d4.js         # Page bundles (hashed)
│   └── about-e5f6g7h8.js
├── __public/
│   └── styles-i9j0k1l2.css       # Static assets (hashed)
├── _not-found.html               # 404 page
├── sitemap.xml                   # Auto-generated sitemap
└── robots.txt                    # Auto-generated robots.txt
```

### Asset Hashing

All assets are content-hashed for cache busting:

- `/public/styles.css` → `/__public/styles-a1b2c3d4.css`
- Bundle filenames include content hashes

URLs in HTML are automatically rewritten to use hashed paths.

### Sitemap Generation

A `sitemap.xml` is generated with all pages:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
  </url>
  <url>
    <loc>https://example.com/about</loc>
  </url>
</urlset>
```

Requires `siteMetadata.baseUrl` to be set.

### Robots.txt

A basic `robots.txt` is generated:

```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

## Serving Static Files

For local testing or self-hosting, use the static server:

```typescript
// serve.ts
import { TabiApp } from "@tabirun/app";
import { pages } from "@tabirun/pages";

const app = new TabiApp();
const { serve } = pages();

serve(app);

Deno.serve(app.handler);
```

Run it:

```bash
deno run -A serve.ts
```

The static server handles:

- Serving pre-built HTML files
- Serving hashed assets with cache headers
- 404 fallback to `_not-found.html`

## Development vs Production

| Feature    | Development        | Production               |
| ---------- | ------------------ | ------------------------ |
| Rendering  | On-demand          | Pre-built                |
| Bundles    | Inline, unminified | Separate files, minified |
| Assets     | Direct paths       | Content-hashed paths     |
| Hot reload | Yes                | No                       |
| Sourcemaps | Inline             | None                     |

## Deployment Targets

### Deno Deploy

Create `main.ts`:

```typescript
import { TabiApp } from "@tabirun/app";
import { pages } from "@tabirun/pages";

const app = new TabiApp();
const { serve } = pages();

serve(app);

Deno.serve(app.handler);
```

Build locally and deploy:

```bash
deno run -A build.ts
deployctl deploy --project=your-project main.ts
```

Or build on deploy with a GitHub action.

### Cloudflare Pages

Build your site:

```bash
deno run -A build.ts
```

Configure Cloudflare Pages:

- **Build command**: `deno run -A build.ts`
- **Build output directory**: `dist`

### GitHub Pages

Use a GitHub Action:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: denoland/setup-deno@v1
        with:
          deno-version: v2.x

      - name: Build
        run: deno run -A build.ts

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Docker

Build and serve with the static server:

```typescript
// serve.ts
import { TabiApp } from "@tabirun/app";
import { pages } from "@tabirun/pages";

const app = new TabiApp();
const { serve } = pages();

serve(app);

const port = parseInt(Deno.env.get("PORT") ?? "8000");
Deno.serve({ hostname: "0.0.0.0", port }, app.handler);
```

Create a `Dockerfile`:

```dockerfile
FROM denoland/deno:2.5.6

WORKDIR /app

# Cache dependencies
COPY deno.json deno.lock ./
RUN deno install

# Copy source and build
COPY . .
RUN deno run -A build.ts

# Cache the serve module
RUN deno cache serve.ts

EXPOSE 8000

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "serve.ts"]
```

Build and run:

```bash
docker build -t my-site .
docker run -p 8000:8000 my-site
```

### Static File Hosting

Any static file host works. Just upload the `dist/` directory:

- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage
- nginx
- Apache

Configure your host to serve `_not-found.html` for 404 responses.

## Build Configuration

Build options are passed when calling `build()`:

```typescript
const { build } = pages({
  shikiTheme: "github-dark",
  markdown: { wrapperClassName: "prose" },
});

await build({
  pagesDir: "./pages", // Source directory (default: "./pages")
  outDir: "./dist", // Output directory (default: "./dist")
});
```

For sites hosted at a subpath (e.g., `https://example.com/docs/`):

```typescript
const { build } = pages({ basePath: "/docs" });

await build();
```

## Next Steps

- [Configuration](/docs/pages/configuration) - All configuration options
