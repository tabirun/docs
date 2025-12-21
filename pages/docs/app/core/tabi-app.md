---
title: "TabiApp"
description: "The main class for creating and running Tabi applications"
---

# TabiApp

`TabiApp` is the main entry point for creating Tabi applications. It wraps a
router and provides methods for registering routes, middleware, and handling
HTTP requests.

## Quick Start

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

app.get("/", (c) => {
  return c.text("Hello, Tabi!");
});

Deno.serve(app.handler);
```

## Creating an Instance

Create a new Tabi application with optional configuration:

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();
```

By default, TabiApp uses the `LinearRouter` which is optimized for applications
with fewer than 100 routes. You can provide a custom router implementation:

```typescript
import { TabiApp } from "@tabirun/app";
import { CustomRouter } from "./custom-router.ts";

const app = new TabiApp({
  router: new CustomRouter(),
});
```

See [Routing](/docs/app/core/routing) for details on custom router
implementations.

## Route Registration Methods

TabiApp provides methods for registering routes and middleware for specific HTTP
methods:

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

// GET requests
app.get("/users", (c) => {
  return c.json({ users: [] });
});

// POST requests
app.post("/users", async (c) => {
  const body = await c.req.json();
  return c.json({ id: 1, ...body }, 201);
});

// PUT, DELETE, PATCH, HEAD, OPTIONS also available
app.put("/users/:id", (c) => c.json({ updated: true }));
app.delete("/users/:id", (c) => c.empty(204));
app.patch("/users/:id", (c) => c.json({ patched: true }));
```

Each method accepts either:

- Middleware only: `app.get(middleware)`
- Route pattern + middleware: `app.get("/path", middleware)`
- Route pattern + multiple middleware:
  `app.get("/path", auth, validate, handler)`

See [Routing](/docs/app/core/routing) for route patterns, parameters, and
wildcards.

## Middleware Registration

### Global Middleware

Use `app.use()` to register middleware that runs on every request:

```typescript
import { TabiApp } from "@tabirun/app";
import { cors } from "@tabirun/app/cors";
import { requestId } from "@tabirun/app/request-id";

const app = new TabiApp();

app.use(cors({ origins: "*" }));
app.use(requestId());

app.get("/", (c) => c.text("Hello!"));
```

### All Methods Middleware

Use `app.all()` to register middleware for all HTTP methods on specific routes:

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

// Custom auth middleware for /admin routes
const requireAuth = async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (token !== "secret") {
    throw new TabiError("Unauthorized", 401);
  }
  await next();
};

app.all("/admin/*", requireAuth);

app.get("/admin/users", (c) => c.json({ users: [] }));
app.post("/admin/settings", (c) => c.json({ updated: true }));
```

See [Middleware](/docs/app/core/middleware) for middleware patterns, execution
order, and custom middleware.

## Handler

The `handler` property is a function that processes incoming requests and
returns responses. Pass it to `Deno.serve()` to start your application:

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

app.get("/", (c) => c.text("Hello!"));

// Start the server
Deno.serve(app.handler);
```

Configure the server with options:

```typescript
Deno.serve(
  {
    port: 3000,
    hostname: "0.0.0.0",
  },
  app.handler,
);
```

## Automatic Behavior

TabiApp provides several automatic behaviors without configuration.

### OPTIONS Requests

TabiApp automatically handles OPTIONS requests for CORS preflight. It returns
the allowed HTTP methods for the requested route:

```typescript
// You define:
app.get("/users", (c) => c.json({ users: [] }));
app.post("/users", (c) => c.json({ created: true }));

// OPTIONS /users automatically returns:
// Allow: GET, POST, OPTIONS
```

### 404 Not Found

When no route matches the request path, TabiApp automatically returns a 404 Not
Found response:

```typescript
const app = new TabiApp();

app.get("/users", (c) => c.json({ users: [] }));

// GET /unknown → 404 Not Found
```

### 405 Method Not Allowed

When a route pattern matches but the HTTP method doesn't, TabiApp returns 405
Method Not Allowed with the allowed methods:

```typescript
const app = new TabiApp();

app.get("/users", (c) => c.json({ users: [] }));

// POST /users → 405 Method Not Allowed
// Allow: GET, OPTIONS
```

## Error Handling

TabiApp catches errors thrown during request processing. Use `TabiError` to
throw HTTP errors:

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

app.get("/users/:id", (c) => {
  const user = findUser(c.req.params.id);

  if (!user) {
    throw new TabiError("User not found", 404);
  }

  return c.json(user);
});
```

Errors are converted to HTTP responses with the appropriate status code.
Unhandled errors return 500 Internal Server Error.

See [Error Handling](/docs/app/core/error-handling) for error handling patterns
and best practices.

## Options

### TabiAppOptions

Configuration options when creating a TabiApp instance.

| Option   | Type          | Default        | Description                  |
| -------- | ------------- | -------------- | ---------------------------- |
| `router` | `TabiRouter?` | `LinearRouter` | Custom router implementation |

## Related

- [Getting Started](/docs/getting-started) - Build your first Tabi application
- [Routing](/docs/app/core/routing) - Route patterns, parameters, and custom
  routers
- [Middleware](/docs/app/core/middleware) - Middleware patterns and execution
  order
- [TabiContext](/docs/app/core/tabi-context) - The context object passed to
  handlers
- [Error Handling](/docs/app/core/error-handling) - Error handling patterns
