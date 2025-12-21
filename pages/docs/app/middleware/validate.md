---
title: "Validate"
description: "Type-safe request validation with automatic type inference"
---

# Validate

The Validate middleware provides type-safe request validation using a factory
function pattern. It supports multiple validation sources and works with any
Standard Schema compliant library (Zod, Valibot, ArkType, etc.).

## Quick Start

```typescript
import { TabiApp } from "@tabirun/app";
import { validator } from "@tabirun/app/validate";
import { z } from "zod";

const app = new TabiApp();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { validate, valid } = validator({ json: loginSchema });

app.post("/login", validate, (c) => {
  // valid(c).json is automatically typed as { email: string; password: string }
  const { json } = valid(c);
  return c.json({ email: json.email });
});

Deno.serve(app.handler);
```

## How It Works

The `validator` function creates a middleware and a type-safe accessor. The
middleware validates request data against your schemas, and the accessor
provides typed access to validated data. Validation errors return 400 Bad
Request by default.

## API

### Factory Pattern

```typescript
const { validate, valid } = validator(config, options?);

app.post(path, validate, (c) => {
  const validated = valid(c);
});
```

### Validation Config

Specify which request sources to validate:

| Source   | Description          | Example Data                    |
| -------- | -------------------- | ------------------------------- |
| `json`   | Request body as JSON | `{ "name": "Alice" }`           |
| `form`   | Form data            | `firstName=John&lastName=Doe`   |
| `search` | URL query parameters | `?year=2021&month=01`           |
| `params` | Route parameters     | `/users/:id` -> `{ id: "123" }` |

### Validation Options

| Option         | Type                                      | Default | Description                           |
| -------------- | ----------------------------------------- | ------- | ------------------------------------- |
| `reportErrors` | `boolean`                                 | `false` | Include validation errors in response |
| `onError`      | `(errors: ValidationError[]) => Response` | -       | Custom error handler                  |

## Examples

### Multiple Source Validation

Validate multiple request sources at once:

```typescript
import { TabiApp } from "@tabirun/app";
import { validator } from "@tabirun/app/validate";
import { z } from "zod";

const app = new TabiApp();

const idSchema = z.object({ id: z.string().uuid() });
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const { validate, valid } = validator({
  params: idSchema,
  json: userSchema,
});

app.put("/users/:id", validate, (c) => {
  // Both params and json are automatically typed
  const { params, json } = valid(c);
  return c.json({ id: params.id, name: json.name, email: json.email });
});
```

### With Other Middleware

Combine with authentication and logging:

```typescript
import { TabiApp } from "@tabirun/app";
import { validator } from "@tabirun/app/validate";
import { z } from "zod";

const app = new TabiApp();

const { validate, valid } = validator({ json: loginSchema });

app.post("/protected", auth, logging, validate, (c) => {
  const { json } = valid(c);
  return c.json(json);
});
```

### Error Reporting

Include validation errors in responses:

```typescript
import { TabiApp } from "@tabirun/app";
import { validator } from "@tabirun/app/validate";
import { z } from "zod";

const app = new TabiApp();

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const { validate, valid } = validator(
  { json: userSchema },
  { reportErrors: true },
);

app.post("/users", validate, (c) => {
  const { json } = valid(c);
  return c.json(json);
});
```

### Custom Error Handler

Provide custom error handling:

```typescript
import { TabiApp } from "@tabirun/app";
import { validator } from "@tabirun/app/validate";
import { z } from "zod";

const app = new TabiApp();

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const { validate, valid } = validator(
  { json: userSchema },
  {
    onError: (errors) => {
      return new Response(
        JSON.stringify({ message: "Validation failed", errors }),
        { status: 422 },
      );
    },
  },
);

app.post("/users", validate, (c) => {
  const { json } = valid(c);
  return c.json(json);
});
```

### Query Parameter Validation

Validate URL search parameters:

```typescript
import { TabiApp } from "@tabirun/app";
import { validator } from "@tabirun/app/validate";
import { z } from "zod";

const app = new TabiApp();

const searchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(["asc", "desc"]).default("desc"),
});

const { validate, valid } = validator({ search: searchSchema });

app.get("/users", validate, (c) => {
  const { search } = valid(c);
  // search is typed as { page: number; limit: number; sort: "asc" | "desc" }
  return c.json({ page: search.page, limit: search.limit });
});
```

### Form Data Validation

Validate form submissions:

```typescript
import { TabiApp } from "@tabirun/app";
import { validator } from "@tabirun/app/validate";
import { z } from "zod";

const app = new TabiApp();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

const { validate, valid } = validator({ form: contactSchema });

app.post("/contact", validate, (c) => {
  const { form } = valid(c);
  // Process contact form...
  return c.json({ received: true });
});
```

## Notes

- Uses [Standard Schema V1](https://github.com/standard-schema/standard-schema)
  specification (works with Zod, Valibot, ArkType, etc.)
- Type inference is automatic - no manual type annotations needed
- Validated data is readonly to prevent accidental modification
- Validates all sources before returning errors (error accumulation, not
  fail-fast)
- Returns 400 Bad Request by default on validation failure
- Uses unique string-based context storage to avoid key collisions
- Empty config `validator({})` is a no-op but still provides `valid(c)`
- Standard middleware pattern - works with all other Tabi middleware

## Related

- [Middleware System](/docs/app/core/middleware) - How middleware works
- [Request/Response](/docs/app/core/request-response) - Accessing request data
- [Error Handling](/docs/app/core/error-handling) - Handling validation errors
