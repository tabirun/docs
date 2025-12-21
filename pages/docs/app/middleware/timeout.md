---
title: "Timeout"
description: "Enforce maximum request duration to prevent slow requests"
---

# Timeout

The Timeout middleware protects your application from slow requests by enforcing
a maximum request duration. When a request exceeds the configured timeout, the
middleware aborts processing and returns a 408 Request Timeout response.

## Quick Start

```typescript
import { TabiApp } from "@tabirun/app";
import { timeout } from "@tabirun/app/timeout";

const app = new TabiApp();

// Timeout requests after 30 seconds
app.use(
  timeout({
    ms: 30000,
  }),
);

app.get("/api/data", async (c) => {
  const data = await fetchSlowData();
  return c.json(data);
});

Deno.serve(app.handler);
```

## How It Works

The middleware starts a timer when it executes. If the downstream middleware and
handler don't complete within the specified time, the request is aborted and a
408 response is returned. The timeout duration includes all downstream
middleware execution time.

## Options

| Option | Type     | Default          | Description                    |
| ------ | -------- | ---------------- | ------------------------------ |
| `ms`   | `number` | `30000` (30 sec) | Maximum request duration in ms |

## Examples

### Short Timeout for APIs

For API endpoints that should respond quickly:

```typescript
import { TabiApp } from "@tabirun/app";
import { timeout } from "@tabirun/app/timeout";

const app = new TabiApp();

// 5 second timeout for API routes
app.use("/api/*", timeout({ ms: 5000 }));

app.get("/api/users", async (c) => {
  const users = await db.getUsers();
  return c.json(users);
});

Deno.serve(app.handler);
```

### Different Timeouts for Different Routes

Apply different timeouts based on expected response times:

```typescript
import { TabiApp } from "@tabirun/app";
import { timeout } from "@tabirun/app/timeout";

const app = new TabiApp();

// Quick timeout for health checks
app.get("/health", timeout({ ms: 1000 }), (c) => {
  return c.json({ status: "ok" });
});

// Longer timeout for file uploads
app.post("/upload", timeout({ ms: 300000 }), async (c) => {
  const file = await c.req.formData();
  // Process file...
  return c.json({ status: "uploaded" });
});

// Default timeout for other routes
app.use(timeout({ ms: 30000 }));

Deno.serve(app.handler);
```

### Protecting Against Slow External Services

When calling external services that might hang:

```typescript
import { TabiApp } from "@tabirun/app";
import { timeout } from "@tabirun/app/timeout";

const app = new TabiApp();

app.get(
  "/external",
  timeout({ ms: 10000 }),
  async (c) => {
    // If external service is slow, request will timeout
    const data = await fetch("https://slow-api.example.com/data");
    return c.json(await data.json());
  },
);

Deno.serve(app.handler);
```

## Security Considerations

**Protects against**: Slowloris attacks, resource exhaustion from hanging
requests, slow external service dependencies

**Best practices**:

- Apply early in middleware chain to cover all downstream processing
- Use shorter timeouts for API endpoints
- Combine with body-size middleware for complete DoS protection
- Log timeout events for monitoring

## Notes

- Returns 408 Request Timeout when limit exceeded
- Aborts request processing after timeout
- Prevents hanging requests from consuming resources
- Should be applied early in middleware chain
- Timeout starts when middleware executes, includes all downstream middleware

## Related

- [Body Size](/docs/app/middleware/body-size) - Limit request body size
- [Rate Limit](/docs/app/middleware/rate-limit) - Limit request rates
- [Middleware System](/docs/app/core/middleware) - How middleware works
