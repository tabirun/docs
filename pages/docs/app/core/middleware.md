---
title: "Middleware"
description: "How middleware works in Tabi and patterns for composition"
---

# Middleware

Middleware are functions that run during the request lifecycle, before your
route handler executes. They're perfect for tasks like logging, authentication,
adding headers, or validating requests.

## Quick Start

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

// Simple logging middleware
app.use(async (c, next) => {
  console.log(`${c.req.method} ${c.req.url.pathname}`);
  await next();
});

app.get("/", (c) => c.text("Hello!"));

Deno.serve(app.handler);
```

## How Middleware Works

Middleware functions receive two parameters:

```typescript
import type { TabiMiddleware } from "@tabirun/app";

const myMiddleware: TabiMiddleware = async (c, next) => {
  // c: TabiContext - the request/response context
  // next: function - calls the next middleware in the chain

  // Code here runs BEFORE the handler
  console.log("Before");

  await next();

  // Code here runs AFTER the handler
  console.log("After");
};
```

**Key concepts:**

- Calling `next()` continues to the next middleware or handler
- Not calling `next()` stops the chain and returns the current response
- Middleware can modify the context before and after calling `next()`
- Middleware can be synchronous or asynchronous

## Middleware Signature

The middleware type signature is:

```typescript
type TabiMiddleware = (
  context: TabiContext,
  next: () => Promise<void> | void,
) => Promise<void> | void;
```

Both the middleware function and `next()` can return either `void` or
`Promise<void>`, allowing for both synchronous and asynchronous middleware.

## Execution Order

Middleware executes in a specific order:

1. **Global middleware** (registered with `app.use()`)
2. **Route-specific middleware** (registered with route methods)
3. **Route handler** (the final function)

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

// 1. Global middleware - runs first
app.use(async (c, next) => {
  console.log("Global middleware");
  await next();
});

// 2. Route middleware - runs second
// 3. Handler - runs last
app.get(
  "/users",
  async (c, next) => {
    console.log("Route middleware");
    await next();
  },
  (c) => {
    console.log("Handler");
    return c.json({ users: [] });
  },
);

// Output on GET /users:
// Global middleware
// Route middleware
// Handler
```

Within each category (global, route-specific), middleware executes in
registration order.

## Global Middleware

Global middleware runs for every request, regardless of the route or HTTP
method.

```typescript
import { TabiApp } from "@tabirun/app";
import { cors } from "@tabirun/app/cors";
import { requestId } from "@tabirun/app/request-id";

const app = new TabiApp();

// These run for ALL requests
app.use(cors({ origins: "*" }));
app.use(requestId());
app.use(async (c, next) => {
  console.log(`${c.req.method} ${c.req.url.pathname}`);
  await next();
});

app.get("/", (c) => c.text("Hello!"));
app.post("/users", (c) => c.json({ created: true }));
```

## Route-Specific Middleware

Apply middleware to specific routes by passing them to route methods:

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

const requireAuth = async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (token !== "secret-token") {
    throw new TabiError("Unauthorized", 401);
  }
  await next();
};

// Middleware only runs for this route
app.get("/admin", requireAuth, (c) => {
  return c.json({ admin: true });
});

// Public route - no auth middleware
app.get("/", (c) => c.text("Hello!"));
```

You can chain multiple middleware on a single route:

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

const requireAuth = async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (token !== "secret-token") {
    throw new TabiError("Unauthorized", 401);
  }
  await next();
};

const validateBody = async (c, next) => {
  const body = await c.req.json();

  if (!body.name) {
    throw new TabiError("Name is required", 400);
  }

  c.set("validatedBody", body);
  await next();
};

// Auth runs first, then validation, then handler
app.post("/users", requireAuth, validateBody, (c) => {
  const body = c.get("validatedBody");
  return c.json({ id: 1, ...body }, 201);
});
```

## Cross-Method Middleware

Use `app.all()` to apply middleware to all HTTP methods for a route:

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

const requireAuth = async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (token !== "secret-token") {
    throw new TabiError("Unauthorized", 401);
  }
  await next();
};

// Applies to GET, POST, PUT, DELETE, etc. on /admin
app.all("/admin", requireAuth);

app.get("/admin", (c) => c.json({ data: "admin data" }));
app.post("/admin", (c) => c.json({ updated: true }));
app.delete("/admin", (c) => c.empty(204));
```

## Route Grouping

Apply middleware to multiple routes using wildcard patterns:

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

const requireAuth = async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (token !== "secret-token") {
    throw new TabiError("Unauthorized", 401);
  }
  await next();
};

// Apply auth to all routes starting with /admin
app.all("/admin/*", requireAuth);

app.get("/admin/users", (c) => c.json({ users: [] }));
app.get("/admin/settings", (c) => c.json({ settings: {} }));
app.post("/admin/users", (c) => c.json({ created: true }));

// Public routes - no auth required
app.get("/", (c) => c.text("Hello!"));
app.get("/about", (c) => c.text("About"));
```

Middleware registered with patterns executes according to route specificity:

- Static routes match first (`/admin/users`)
- Parameterized routes match next (`/admin/:section`)
- Wildcard routes match last (`/admin/*`)

## Middleware Composition

You can pass multiple middleware at once using arrays:

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

const logRequest = async (c, next) => {
  console.log(`${c.req.method} ${c.req.url.pathname}`);
  await next();
};

const addTimestamp = async (c, next) => {
  c.set("timestamp", Date.now());
  await next();
};

const addHeader = async (c, next) => {
  c.header("X-Custom", "value");
  await next();
};

// All three run in order
app.use([logRequest, addTimestamp, addHeader]);

// Or mix arrays and individual middleware
app.use(logRequest, [addTimestamp, addHeader]);

app.get("/", (c) => c.text("Hello!"));
```

Creating reusable middleware groups:

```typescript
import { TabiApp } from "@tabirun/app";
import { cors } from "@tabirun/app/cors";
import { requestId } from "@tabirun/app/request-id";

const app = new TabiApp();

// Define a group of common middleware
const commonMiddleware = [
  cors({ origins: "*" }),
  requestId(),
  async (c, next) => {
    console.log(`${c.req.method} ${c.req.url.pathname}`);
    await next();
  },
];

// Apply the group
app.use(commonMiddleware);

app.get("/", (c) => c.text("Hello!"));
```

## Context Sharing

Middleware can share data using `c.set()` and `c.get()`:

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

// Middleware sets data
app.use(async (c, next) => {
  const startTime = Date.now();
  c.set("startTime", startTime);

  await next();

  const duration = Date.now() - startTime;
  console.log(`Request took ${duration}ms`);
});

// Handler reads data
app.get("/", (c) => {
  const startTime = c.get<number>("startTime");
  return c.json({ startTime });
});
```

TypeScript tip: Use generics with `c.get()` for type safety:

```typescript
interface User {
  id: number;
  name: string;
}

app.use(async (c, next) => {
  const user = { id: 1, name: "Alice" };
  c.set("user", user);
  await next();
});

app.get("/profile", (c) => {
  // TypeScript knows user is of type User
  const user = c.get<User>("user");
  return c.json(user);
});
```

## Early Returns

Stop the middleware chain by not calling `next()`:

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

const checkMaintenance = async (c, next) => {
  const isMaintenanceMode = true;

  if (isMaintenanceMode) {
    // Don't call next() - return early
    return c.text("Service unavailable", 503);
  }

  await next();
};

app.use(checkMaintenance);

// This handler won't run during maintenance
app.get("/", (c) => c.text("Hello!"));
```

Another example with authentication:

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

const requireAuth = async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    // Stop here - don't call next()
    throw new TabiError("Unauthorized", 401);
  }

  const user = await validateToken(token);
  c.set("user", user);
  await next();
};

app.get("/protected", requireAuth, (c) => {
  return c.json({ message: "You're authenticated!" });
});
```

## Writing Custom Middleware

Middleware can be a simple function or a factory function that returns
middleware:

### Simple Middleware

```typescript
import type { TabiMiddleware } from "@tabirun/app";

const logRequest: TabiMiddleware = async (c, next) => {
  console.log(`${c.req.method} ${c.req.url.pathname}`);
  await next();
};

app.use(logRequest);
```

### Factory Function

Create configurable middleware using factory functions:

```typescript
import type { TabiMiddleware } from "@tabirun/app";

interface LogOptions {
  includeTimestamp?: boolean;
  includeHeaders?: boolean;
}

const logger = (options?: LogOptions): TabiMiddleware => {
  return async (c, next) => {
    const parts: string[] = [];

    if (options?.includeTimestamp) {
      parts.push(new Date().toISOString());
    }

    parts.push(`${c.req.method} ${c.req.url.pathname}`);

    if (options?.includeHeaders) {
      parts.push(JSON.stringify(Object.fromEntries(c.req.headers)));
    }

    console.log(parts.join(" - "));
    await next();
  };
};

// Use with options
app.use(
  logger({
    includeTimestamp: true,
    includeHeaders: false,
  }),
);
```

### Middleware with Before/After Logic

Run code before and after the handler:

```typescript
import type { TabiMiddleware } from "@tabirun/app";

const timer: TabiMiddleware = async (c, next) => {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;
  c.header("X-Response-Time", `${duration}ms`);
};

app.use(timer);
```

## Async Middleware

Middleware can be asynchronous to handle async operations:

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

const loadUser = async (c, next) => {
  const userId = c.req.header("X-User-ID");

  if (userId) {
    // Async database call
    const user = await db.users.findById(userId);
    c.set("user", user);
  }

  await next();
};

app.use(loadUser);

app.get("/profile", (c) => {
  const user = c.get("user");
  return c.json(user ?? { guest: true });
});
```

Always `await next()` when using async middleware to ensure proper error
handling and execution order.

## Error Handling

Middleware can throw errors using `TabiError` or catch errors from other
middleware using try-catch:

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

// Throwing errors in middleware
const validateApiKey = async (c, next) => {
  const apiKey = c.req.header("X-API-Key");

  if (!apiKey) {
    throw new TabiError("API key required", 401);
  }

  await next();
};

// Catching errors in middleware
const errorHandler = async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof TabiError) {
      return c.text(error.message, error.status);
    }
    return c.text("Internal Server Error", 500);
  }
};

app.use(errorHandler);
app.use(validateApiKey);
```

For comprehensive error handling patterns, see
[Error Handling](/docs/app/core/error-handling).

## Important Notes

### Don't Call next() Multiple Times

Calling `next()` more than once in the same middleware will throw an error:

```typescript
const bad = async (c, next) => {
  await next();
  await next(); // Error: next() called multiple times
};
```

This prevents bugs where middleware accidentally continues the chain twice.

### Order Matters

Middleware executes in registration order. Register middleware in the order you
want it to run:

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

// CORS must run before other middleware to handle preflight
app.use(cors({ origins: "*" }));

// Auth runs after CORS
app.use(requireAuth);

// Logger runs last
app.use(logRequest);
```

### Global vs Route-Specific

Choose the appropriate scope for your middleware:

- **Use global middleware** (`app.use()`) for cross-cutting concerns: logging,
  CORS, request IDs, error handling
- **Use route-specific middleware** for features tied to specific routes:
  authentication, validation, rate limiting

## Related

- [TabiApp](/docs/app/core/tabi-app) - Registering middleware with the app
- [TabiContext](/docs/app/core/tabi-context) - The context object passed to
  middleware
- [Error Handling](/docs/app/core/error-handling) - Handling errors in
  middleware
- [Routing](/docs/app/core/routing) - Route patterns and wildcards for
  middleware
