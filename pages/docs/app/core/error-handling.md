---
title: "Error Handling"
description: "Error handling with TabiError and custom error middleware"
---

# Error Handling

Tabi provides structured error handling through the `TabiError` class. Throw
errors from anywhere in your request handling, and Tabi automatically converts
them to appropriate HTTP responses.

## Quick Start

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

app.get("/users/:id", async (c) => {
  const user = await db.findUser(c.req.params.id);

  if (!user) {
    throw new TabiError("User not found", 404);
  }

  return c.json(user);
});

Deno.serve(app.handler);
```

## TabiError

`TabiError` extends JavaScript's `Error` class and adds an HTTP status code.

```typescript
new TabiError(message: string, status?: number, options?: ErrorOptions)
```

**Parameters:**

- `message` - Error message
- `status` - HTTP status code (defaults to 500)
- `options` - Standard `ErrorOptions` (includes `cause` for error chaining)

**Properties:**

- `message` - The error message
- `status` - The HTTP status code
- `name` - Always "TabiError"

## Throwing Errors

You can throw `TabiError` from handlers, middleware, or any function called
during request handling.

### In Handlers

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

app.post("/users", async (c) => {
  const body = await c.req.json();

  if (!body.email) {
    throw new TabiError("Email is required", 400);
  }

  if (await db.emailExists(body.email)) {
    throw new TabiError("Email already exists", 409);
  }

  const user = await db.createUser(body);
  return c.json(user, 201);
});
```

### In Middleware

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

const requireAuth = async (c, next) => {
  const token = c.req.header("Authorization");

  if (!token) {
    throw new TabiError("Unauthorized", 401);
  }

  const user = await validateToken(token);
  c.set("user", user);

  await next();
};

app.get("/admin", requireAuth, (c) => {
  return c.json({ admin: true });
});
```

### In Helper Functions

```typescript
async function getUser(id: string) {
  const user = await db.findUser(id);

  if (!user) {
    throw new TabiError("User not found", 404);
  }

  return user;
}

app.get("/users/:id", async (c) => {
  const user = await getUser(c.req.params.id);
  return c.json(user);
});
```

## Automatic Error Handling

TabiApp automatically catches errors and converts them to HTTP responses:

- **TabiError instances** - Returns the error's status code and message
- **Other errors** - Returns 500 Internal Server Error with generic message

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

app.get("/error-example", () => {
  throw new TabiError("Something went wrong", 400);
  // TabiApp automatically returns:
  // HTTP 400 Bad Request
  // Body: "Something went wrong"
});

app.get("/unexpected-error", () => {
  throw new Error("Unexpected!");
  // TabiApp automatically returns:
  // HTTP 500 Internal Server Error
  // Body: "Internal Server Error"
});

Deno.serve(app.handler);
```

This automatic handling works for errors thrown anywhere in the request
lifecycle - handlers, middleware, or helper functions.

## Custom Error Handler Middleware

For more control over error handling (logging, telemetry, custom responses),
register global error handler middleware:

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

const app = new TabiApp();

// Error handler middleware - register FIRST
app.use(async (c, next) => {
  try {
    await next();
  } catch (error) {
    // Log errors with request context
    console.error("Error:", {
      method: c.req.method,
      path: c.req.url.pathname,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Send to telemetry/monitoring
    // await telemetry.captureError(error, { requestId: c.get("requestId") });

    // Return appropriate response
    if (error instanceof TabiError) {
      return c.json({ error: error.message }, error.status);
    }

    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Other middleware and routes
app.get("/", (c) => c.text("Hello!"));

Deno.serve(app.handler);
```

**Important:** Register the error handler middleware **first** in your
application so it wraps all other middleware and routes.

**Use cases for custom error handlers:**

- Logging errors with request context
- Sending errors to monitoring/telemetry services
- Custom error response formats (JSON, XML, etc.)
- Environment-specific responses (detailed errors in dev, generic in prod)
- Error correlation with request IDs

## Error Chaining

Use the `cause` option to chain errors and preserve context:

```typescript
import { TabiApp, TabiError } from "@tabirun/app";

async function fetchUserData(id: string) {
  try {
    return await externalApi.getUser(id);
  } catch (error) {
    throw new TabiError("Failed to fetch user data", 502, { cause: error });
  }
}

app.get("/users/:id", async (c) => {
  const data = await fetchUserData(c.req.params.id);
  return c.json(data);
});
```

The underlying error is preserved in the `cause` property, useful for debugging
and logging.

## Common Error Patterns

### Not Found (404)

```typescript
app.get("/users/:id", async (c) => {
  const user = await db.findUser(c.req.params.id);

  if (!user) {
    throw new TabiError("User not found", 404);
  }

  return c.json(user);
});
```

### Unauthorized (401)

```typescript
const requireAuth = async (c, next) => {
  const token = c.req.header("Authorization");

  if (!token) {
    throw new TabiError("Unauthorized", 401);
  }

  await next();
};
```

### Forbidden (403)

```typescript
app.delete("/users/:id", async (c) => {
  const currentUser = c.get("user");
  const targetId = c.req.params.id;

  if (currentUser.id !== targetId && !currentUser.isAdmin) {
    throw new TabiError("Forbidden", 403);
  }

  await db.deleteUser(targetId);
  return c.empty(204);
});
```

### Bad Request (400)

```typescript
app.post("/users", async (c) => {
  const body = await c.req.json();

  if (!body.email || !body.email.includes("@")) {
    throw new TabiError("Valid email is required", 400);
  }

  const user = await db.createUser(body);
  return c.json(user, 201);
});
```

## Related

- [TabiApp](/docs/app/core/tabi-app) - Automatic error handling behavior
- [Middleware](/docs/app/core/middleware) - Writing middleware that can throw
  errors
- [TabiContext](/docs/app/core/tabi-context) - The context object in error
  handlers
