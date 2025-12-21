---
title: "Cookies"
description: "Cookie management with optional HMAC-SHA256 signing"
---

# Cookies

The Cookies utility provides functions for managing HTTP cookies with optional
HMAC-SHA256 signing for tamper detection.

## Quick Start

```typescript
import { TabiApp } from "@tabirun/app";
import { deleteCookie, getCookie, setCookie } from "@tabirun/app/cookies";

const app = new TabiApp();

app.post("/login", async (c) => {
  await setCookie(c, "sessionId", "abc123", {
    secret: "my-secret-key",
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 3600,
  });
  return c.text("Logged in");
});

app.get("/profile", async (c) => {
  const sessionId = await getCookie(c, "sessionId", "my-secret-key");
  if (!sessionId) {
    return c.text("Unauthorized", 401);
  }
  return c.text(`Session: ${sessionId}`);
});

app.post("/logout", (c) => {
  deleteCookie(c, "sessionId");
  return c.text("Logged out");
});

Deno.serve(app.handler);
```

## API

### setCookie

Set a cookie with optional signing and attributes:

```typescript
await setCookie(c, name, value, options?);
```

### getCookie

Get a cookie value, optionally verifying its signature:

```typescript
const value = await getCookie(c, name, secret?);
// Returns string | null
```

### deleteCookie

Delete a cookie by setting its expiration in the past:

```typescript
deleteCookie(c, name, options?);
```

## Options

| Option     | Type                          | Description                   |
| ---------- | ----------------------------- | ----------------------------- |
| `secret`   | `string`                      | Sign cookies with HMAC-SHA256 |
| `maxAge`   | `number`                      | Max age in seconds            |
| `expires`  | `Date`                        | Expiration date               |
| `path`     | `string`                      | Cookie path                   |
| `domain`   | `string`                      | Cookie domain                 |
| `secure`   | `boolean`                     | HTTPS only                    |
| `httpOnly` | `boolean`                     | No JavaScript access          |
| `sameSite` | `"Strict" \| "Lax" \| "None"` | Cross-site behavior           |

## Examples

### Signed Session Cookie

Use signed cookies for session management:

```typescript
import { TabiApp } from "@tabirun/app";
import { getCookie, setCookie } from "@tabirun/app/cookies";

const SECRET = Deno.env.get("COOKIE_SECRET")!;

const app = new TabiApp();

app.post("/login", async (c) => {
  const user = await authenticate(c);

  await setCookie(c, "session", user.id, {
    secret: SECRET,
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60, // 1 week
  });

  return c.json({ success: true });
});

app.get("/me", async (c) => {
  const userId = await getCookie(c, "session", SECRET);
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = await getUser(userId);
  return c.json(user);
});
```

### Unsigned Preferences Cookie

For non-sensitive data that doesn't need signing:

```typescript
import { TabiApp } from "@tabirun/app";
import { getCookie, setCookie } from "@tabirun/app/cookies";

const app = new TabiApp();

app.post("/preferences", async (c) => {
  const { theme } = await c.req.json();

  await setCookie(c, "theme", theme, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: "Lax",
  });

  return c.json({ theme });
});

app.get("/preferences", async (c) => {
  const theme = await getCookie(c, "theme") ?? "light";
  return c.json({ theme });
});
```

### Delete Cookie with Path

When deleting cookies, match the path used when setting:

```typescript
import { TabiApp } from "@tabirun/app";
import { deleteCookie, setCookie } from "@tabirun/app/cookies";

const app = new TabiApp();

app.post("/api/login", async (c) => {
  await setCookie(c, "token", "abc123", {
    path: "/api",
    httpOnly: true,
  });
  return c.json({ success: true });
});

app.post("/api/logout", (c) => {
  // Must specify same path to delete
  deleteCookie(c, "token", { path: "/api" });
  return c.json({ success: true });
});
```

### Remember Me Cookie

Implement remember-me functionality:

```typescript
import { TabiApp } from "@tabirun/app";
import { deleteCookie, getCookie, setCookie } from "@tabirun/app/cookies";

const SECRET = Deno.env.get("COOKIE_SECRET")!;

const app = new TabiApp();

app.post("/login", async (c) => {
  const { email, password, rememberMe } = await c.req.json();
  const user = await authenticate(email, password);

  const cookieOptions = {
    secret: SECRET,
    httpOnly: true,
    secure: true,
    sameSite: "Strict" as const,
    maxAge: rememberMe
      ? 30 * 24 * 60 * 60 // 30 days
      : undefined, // Session cookie
  };

  await setCookie(c, "session", user.id, cookieOptions);
  return c.json({ success: true });
});
```

## Security Considerations

**Signed cookies**: When a `secret` is provided, cookies are signed using
HMAC-SHA256. This prevents tampering but doesn't encrypt the value.

**Tampered cookies**: `getCookie` returns `null` for cookies with invalid
signatures, treating them as if they don't exist.

**Best practices**:

- Always use `httpOnly: true` for session cookies
- Use `secure: true` in production (HTTPS only)
- Use `sameSite: "Strict"` or `"Lax"` to prevent CSRF
- Store secrets in environment variables, never in code
- Use strong, random secrets (at least 32 characters)

**SameSite options**:

- `"Strict"` - Cookie only sent for same-site requests (most secure)
- `"Lax"` - Cookie sent for same-site and top-level navigation (default)
- `"None"` - Cookie sent for all requests (requires `secure: true`)

## Notes

- When `secret` is provided, cookies are signed and verified automatically
- Signature verification returns `null` for tampered cookies
- `maxAge` takes precedence over `expires`
- Cookies without `maxAge` or `expires` are session cookies (deleted on browser
  close)

## Related

- [CSRF](/docs/app/middleware/csrf) - Cross-site request forgery protection
- [TabiContext](/docs/app/core/tabi-context) - Request/response context
