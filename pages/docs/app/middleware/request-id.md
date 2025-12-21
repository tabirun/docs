---
title: "Request ID"
description: "Add unique request IDs for tracing and audit logging"
---

# Request ID

The Request ID middleware adds unique identifiers to each request, enabling
distributed tracing, audit logging, and request correlation across services.

## Quick Start

```typescript
import { TabiApp } from "@tabirun/app";
import { requestId } from "@tabirun/app/request-id";

const app = new TabiApp();

// Add request IDs (generates UUIDs by default)
app.use(requestId());

app.get("/api/users", (c) => {
  const id = c.get("requestId");
  console.log(`Processing request ${id}`);
  return c.json({ users: [] });
});

Deno.serve(app.handler);
```

## How It Works

The middleware generates or reuses a request ID for each incoming request. The
ID is stored in the context and added to the response headers. If a client
provides a request ID via the header, it is reused for distributed tracing.

## Options

| Option       | Type           | Default               | Description                      |
| ------------ | -------------- | --------------------- | -------------------------------- |
| `generator`  | `() => string` | `crypto.randomUUID()` | Function to generate request IDs |
| `headerName` | `string`       | `"X-Request-ID"`      | Header name for request ID       |

## Examples

### Custom Header Name

Use a different header name:

```typescript
import { TabiApp } from "@tabirun/app";
import { requestId } from "@tabirun/app/request-id";

const app = new TabiApp();

app.use(
  requestId({
    headerName: "X-Trace-ID",
  }),
);
```

### Custom ID Generator

Generate IDs in a custom format:

```typescript
import { TabiApp } from "@tabirun/app";
import { requestId } from "@tabirun/app/request-id";

let counter = 0;

const app = new TabiApp();

app.use(
  requestId({
    generator: () => `req-${Date.now()}-${++counter}`,
  }),
);
```

### Client-Provided IDs

The middleware automatically reuses request IDs provided by clients:

```typescript
import { TabiApp } from "@tabirun/app";
import { requestId } from "@tabirun/app/request-id";

const app = new TabiApp();

app.use(requestId());

// Client sends: X-Request-ID: abc123
// Server reuses: abc123
// Context: c.get("requestId") === "abc123"
// Response header: X-Request-ID: abc123
```

### Logging Integration

Use request IDs in your logging:

```typescript
import { TabiApp } from "@tabirun/app";
import { requestId } from "@tabirun/app/request-id";

const app = new TabiApp();

app.use(requestId());

app.get("/api/users", async (c) => {
  const id = c.get("requestId");
  console.log(`[${id}] Fetching users`);

  const users = await db.getUsers();

  console.log(`[${id}] Returning ${users.length} users`);
  return c.json(users);
});
```

### Accessing in Handlers

Access the request ID from context:

```typescript
import { TabiApp } from "@tabirun/app";
import { requestId } from "@tabirun/app/request-id";

const app = new TabiApp();

app.use(requestId());

app.get("/api/data", (c) => {
  const id = c.get("requestId");

  return c.json({
    data: "value",
    requestId: id,
  });
});
```

## Security Benefits

- **Audit Trails**: Correlate security events across requests
- **Incident Response**: Track malicious activity through request IDs
- **Rate Limiting**: Identify and block abusive clients
- **Compliance**: Meet logging requirements for regulated industries

## Notes

- Request IDs are available in context via `c.get("requestId")`
- IDs are added to response headers for client-side correlation
- If client provides a request ID, it is reused (enabling distributed tracing)
- Generated IDs are UUIDs by default (RFC 4122 compliant)
- Should be applied early in middleware chain for consistent availability
- Useful for:
  - Distributed tracing across microservices
  - Correlating logs across multiple systems
  - Security incident investigation
  - Debugging production issues
  - Rate limiting and abuse detection

## Related

- [Middleware System](/docs/app/core/middleware) - How middleware works
- [TabiContext](/docs/app/core/tabi-context) - Accessing context data
