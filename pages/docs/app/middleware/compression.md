---
title: "Compression"
description: "Gzip compression for response bodies"
---

# Compression

The Compression middleware compresses response bodies using gzip encoding,
reducing bandwidth usage and improving load times for clients. It uses a hybrid
approach to balance memory efficiency with optimal HTTP behavior.

## Quick Start

```typescript
import { TabiApp } from "@tabirun/app";
import { compression } from "@tabirun/app/compression";

const app = new TabiApp();

// Enable compression with defaults
app.use(compression());

app.get("/api/data", (c) => {
  return c.json({ large: "response data..." });
});

Deno.serve(app.handler);
```

## How It Works

The middleware checks if the client supports gzip via `Accept-Encoding` header.
If supported, it compresses the response body and sets appropriate headers.
Small responses below the threshold are not compressed to avoid overhead.

## Options

| Option            | Type       | Default                         | Description                                                   |
| ----------------- | ---------- | ------------------------------- | ------------------------------------------------------------- |
| `threshold`       | `number`   | `1024`                          | Minimum response size (bytes) to compress                     |
| `maxSize`         | `number`   | `10485760` (10MB)               | Maximum response size to compress (prevents OOM)              |
| `bufferThreshold` | `number`   | `1048576` (1MB)                 | Max size to buffer in memory (larger responses use streaming) |
| `contentTypes`    | `string[]` | text/\*, application/json, etc. | Content types to compress                                     |

## Examples

### Custom Thresholds

Adjust compression thresholds for your use case:

```typescript
import { TabiApp } from "@tabirun/app";
import { compression } from "@tabirun/app/compression";

const app = new TabiApp();

app.use(
  compression({
    threshold: 2048, // Only compress >2KB responses
    maxSize: 5242880, // Limit to 5MB (prevent OOM)
  }),
);
```

### Custom Content Types

Specify which content types to compress:

```typescript
import { TabiApp } from "@tabirun/app";
import { compression } from "@tabirun/app/compression";

const app = new TabiApp();

app.use(
  compression({
    contentTypes: ["text/*", "application/json", "application/xml"],
  }),
);
```

### Memory-Constrained Environments

For servers with limited memory:

```typescript
import { TabiApp } from "@tabirun/app";
import { compression } from "@tabirun/app/compression";

const app = new TabiApp();

app.use(
  compression({
    bufferThreshold: 512 * 1024, // 512KB - more aggressive streaming
    maxSize: 5 * 1024 * 1024, // 5MB - lower ceiling
  }),
);
```

## Memory Management

This middleware uses a **hybrid compression approach** to balance memory
efficiency with optimal HTTP behavior:

### Buffered Compression (responses < `bufferThreshold`)

- Response is buffered in memory and compressed
- Sets `Content-Length` header for optimal client behavior
- Enables progress bars, range requests, and accurate caching
- **Trade-off:** Uses 2x memory (original + compressed) during compression

### Streaming Compression (responses >= `bufferThreshold`)

- Response is compressed as a stream without buffering
- Uses **constant memory** regardless of response size
- Uses chunked transfer encoding (no `Content-Length` header)
- **Trade-off:** No progress indicators or range request support

## When to Use Compression

**Use this middleware when:**

- You don't have compression at the CDN/proxy level
- Serving dynamic, uncacheable API responses (user-specific data, real-time
  content)
- Network bandwidth is more expensive than CPU (mobile networks, pay-per-GB
  scenarios)

**Don't use this middleware when:**

- Static files (pre-compress at build time instead)
- Behind a CDN or reverse proxy (they handle compression with caching)
- Responses are cacheable (CDN/proxy compression is more efficient)
- Local/fast networks where CPU cost outweighs bandwidth savings

**Performance note:** On-demand compression is CPU-intensive. Benchmarks show
70-80% reduction in requests/sec for 10-100KB responses. Only use when bandwidth
savings justify the CPU cost.

## Notes

- Only compresses if client sends `Accept-Encoding: gzip`
- Only uses compressed version if it's actually smaller (buffered path only)
- Streaming path always compresses if conditions are met (can't compare sizes
  without buffering)
- In production, compression is typically handled by CDN/reverse proxy (nginx,
  Cloudflare)
- Use this middleware for development, self-hosted deployments, or Deno Deploy

## Related

- [Cache Control](/docs/app/middleware/cache-control) - Set caching headers
- [Middleware System](/docs/app/core/middleware) - How middleware works
