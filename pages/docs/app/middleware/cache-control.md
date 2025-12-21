---
title: "Cache Control"
description: "Set HTTP Cache-Control headers for response caching"
---

# Cache Control

The Cache Control middleware sets HTTP Cache-Control headers on responses,
enabling browsers and CDNs to cache content appropriately. Proper caching
improves performance and reduces server load.

## Quick Start

```typescript
import { TabiApp } from "@tabirun/app";
import { cacheControl } from "@tabirun/app/cache-control";

const app = new TabiApp();

// Cache responses for 1 hour
app.use(
  cacheControl({
    maxAge: 3600,
    public: true,
  }),
);

app.get("/api/data", (c) => {
  return c.json({ data: "cacheable" });
});

Deno.serve(app.handler);
```

## How It Works

The middleware adds a `Cache-Control` header to responses based on the
configured directives. These directives instruct browsers and intermediate
caches (like CDNs) on how to cache the response.

## Options

| Option                 | Type      | Description                             |
| ---------------------- | --------- | --------------------------------------- |
| `maxAge`               | `number`  | Seconds the response can be cached      |
| `sMaxAge`              | `number`  | Seconds for shared cache (CDN)          |
| `noCache`              | `boolean` | Must check origin before use            |
| `noStore`              | `boolean` | No caching allowed                      |
| `noTransform`          | `boolean` | Don't transform cached content          |
| `mustRevalidate`       | `boolean` | Must revalidate stale cache             |
| `proxyRevalidate`      | `boolean` | Must revalidate (shared cache only)     |
| `mustUnderstand`       | `boolean` | Cache only if understood                |
| `private`              | `boolean` | Private cache only (browser)            |
| `public`               | `boolean` | Public cache allowed                    |
| `immutable`            | `boolean` | Response won't change while fresh       |
| `staleWhileRevalidate` | `number`  | Seconds to use stale while revalidating |
| `staleIfError`         | `number`  | Seconds to use stale if origin down     |

## Examples

### Public Caching for Static Content

For content that can be cached by CDNs:

```typescript
import { TabiApp } from "@tabirun/app";
import { cacheControl } from "@tabirun/app/cache-control";

const app = new TabiApp();

// Cache static assets for 1 year
app.use(
  "/assets/*",
  cacheControl({
    maxAge: 31536000, // 1 year
    public: true,
    immutable: true,
  }),
);
```

### Private Caching for User Data

For user-specific content that shouldn't be cached by CDNs:

```typescript
import { TabiApp } from "@tabirun/app";
import { cacheControl } from "@tabirun/app/cache-control";

const app = new TabiApp();

app.get(
  "/api/profile",
  cacheControl({
    maxAge: 300, // 5 minutes
    private: true,
  }),
  (c) => {
    return c.json({ user: "data" });
  },
);
```

### CDN Caching with Stale-While-Revalidate

Enable background revalidation for better performance:

```typescript
import { TabiApp } from "@tabirun/app";
import { cacheControl } from "@tabirun/app/cache-control";

const app = new TabiApp();

app.use(
  cacheControl({
    maxAge: 60, // Fresh for 1 minute
    sMaxAge: 300, // CDN caches for 5 minutes
    staleWhileRevalidate: 3600, // Serve stale for up to 1 hour while revalidating
    public: true,
  }),
);
```

### No Caching for Sensitive Data

Prevent caching entirely:

```typescript
import { TabiApp } from "@tabirun/app";
import { cacheControl } from "@tabirun/app/cache-control";

const app = new TabiApp();

app.use(
  "/api/sensitive/*",
  cacheControl({
    noStore: true,
  }),
);
```

### Must Revalidate

Ensure stale content is revalidated:

```typescript
import { TabiApp } from "@tabirun/app";
import { cacheControl } from "@tabirun/app/cache-control";

const app = new TabiApp();

app.use(
  cacheControl({
    maxAge: 3600,
    mustRevalidate: true,
    public: true,
  }),
);
```

## Security Considerations

**Sensitive data**: Use `private` or `noStore` for user-specific or sensitive
content to prevent CDNs from caching and serving to other users.

**Best practices**:

- Use `noStore` for authentication endpoints
- Use `private` for user-specific data
- Use `public` only for content safe to cache at CDN level
- Set appropriate `maxAge` based on how often content changes

## Notes

- Throws `TabiError` if conflicting directives are used (e.g., `public` +
  `private`)
- Cannot use `noStore` with `maxAge` or `sMaxAge`
- CDNs respect `sMaxAge` over `maxAge` when present

## Related

- [Compression](/docs/app/middleware/compression) - Compress response bodies
- [Middleware System](/docs/app/core/middleware) - How middleware works
- [MDN: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) -
  Complete header reference
