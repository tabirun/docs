---
title: "Installation"
description: "Install Tabi and set up your development environment"
---

# Installation

## Prerequisites

Tabi requires [Deno](https://deno.com) 2.0 or later.

```bash
# Install Deno (macOS/Linux)
curl -fsSL https://deno.land/install.sh | sh

# Install Deno (Windows)
irm https://deno.land/install.ps1 | iex
```

Verify your installation:

```bash
deno --version
```

## Install Tabi

Add Tabi to your project:

```bash
deno add @tabirun/app
```

This adds Tabi to your `deno.json` imports and you're ready to start building.

## Verify Installation

Create a simple `main.ts` to verify everything works:

```typescript
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();

app.get("/", (c) => {
  return c.text("Hello, Tabi!");
});

Deno.serve(app.handler);
```

Run it:

```bash
deno run --allow-net main.ts
```

Visit [http://localhost:8000](http://localhost:8000) and you should see "Hello,
Tabi!"

## Next Steps

Head over to [Getting Started](/docs/getting-started) to build your first real
application.
