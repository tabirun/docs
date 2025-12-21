---
title: "Deploy"
description: "Deploy your Tabi application to production"
---

# Deploy

Tabi applications run anywhere Deno runs. No build step required—just deploy
your TypeScript files directly.

## Basic Application

A typical production entry point:

```typescript
// main.ts
import { TabiApp } from "@tabirun/app";
import { cors } from "@tabirun/app/cors";
import { securityHeaders } from "@tabirun/app/security-headers";

const app = new TabiApp();

app.use(cors({ origins: ["https://example.com"] }));
app.use(...securityHeaders());

app.get("/", (c) => c.json({ status: "ok" }));

Deno.serve(app.handler);
```

Run it:

```bash
deno run --allow-net main.ts
```

## Deployment Targets

### Deno Deploy

The simplest option. Push your code and it runs.

1. Connect your repository at [dash.deno.com](https://dash.deno.com)
2. Set the entry point to your main file (e.g., `main.ts`)
3. Deploy

Or use the CLI:

```bash
deployctl deploy --project=your-project main.ts
```

Environment variables are configured in the Deno Deploy dashboard.

### Docker

Create a `Dockerfile`:

```dockerfile
FROM denoland/deno:2.5.6

WORKDIR /app

# Cache dependencies
COPY deno.json deno.lock ./
RUN deno install

# Copy application
COPY . .

# Cache the main module
RUN deno cache main.ts

EXPOSE 8000

CMD ["deno", "run", "--allow-net", "--allow-env", "main.ts"]
```

Build and run:

```bash
docker build -t my-app .
docker run -p 8000:8000 my-app
```

### AWS Lambda

Use [Deno's Lambda layer](https://github.com/denoland/deno-lambda) or package
with [SAR](https://docs.deno.com/deploy/manual/aws-lambda):

```typescript
// handler.ts
import { TabiApp } from "@tabirun/app";

const app = new TabiApp();
app.get("/", (c) => c.json({ message: "Hello from Lambda" }));

export const handler = async (event: AWSLambdaEvent) => {
  const request = convertToRequest(event);
  const response = await app.handler(request);
  return convertToLambdaResponse(response);
};
```

### Traditional VPS

Use systemd to run as a service:

```ini
# /etc/systemd/system/my-app.service
[Unit]
Description=My Tabi App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/my-app
ExecStart=/home/deno/.deno/bin/deno run --allow-net --allow-env main.ts
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable my-app
sudo systemctl start my-app
```

## Configuration

### Environment Variables

Read configuration from environment variables:

```typescript
const port = parseInt(Deno.env.get("PORT") ?? "8000");
const dbUrl = Deno.env.get("DATABASE_URL");

if (!dbUrl) {
  throw new Error("DATABASE_URL is required");
}

Deno.serve({ port }, app.handler);
```

### Port Configuration

Most platforms set the `PORT` environment variable:

```typescript
const port = parseInt(Deno.env.get("PORT") ?? "8000");
Deno.serve({ port }, app.handler);
```

### Hostname Binding

For containers, bind to `0.0.0.0`:

```typescript
Deno.serve({ hostname: "0.0.0.0", port: 8000 }, app.handler);
```

## Health Checks

Add a health check endpoint for load balancers and orchestrators:

```typescript
app.get("/health", (c) => c.json({ status: "ok" }));

// Or with more detail
app.get("/health", async (c) => {
  const dbHealthy = await checkDatabase();
  const status = dbHealthy ? "ok" : "degraded";
  const statusCode = dbHealthy ? 200 : 503;

  return c.json({ status, database: dbHealthy }, statusCode);
});
```

## Graceful Shutdown

Handle shutdown signals to finish in-flight requests:

```typescript
const controller = new AbortController();

Deno.addSignalListener("SIGINT", () => controller.abort());
Deno.addSignalListener("SIGTERM", () => controller.abort());

const server = Deno.serve(
  { signal: controller.signal },
  app.handler,
);

await server.finished;
console.log("Server shut down gracefully");
```

## Logging

Use structured logging for production:

```typescript
app.use(async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  console.log(
    JSON.stringify({
      method: c.req.method,
      path: new URL(c.req.url).pathname,
      status: c.res.status,
      duration,
      timestamp: new Date().toISOString(),
    }),
  );
});
```

## Permissions

Run with minimal permissions:

```bash
# Production - only what's needed
deno run --allow-net --allow-env main.ts

# If reading files
deno run --allow-net --allow-env --allow-read=./public main.ts
```

Avoid `--allow-all` in production.

## Summary

Deploying Tabi applications:

1. **No build step** - Deploy TypeScript directly
2. **Configure via environment** - PORT, DATABASE_URL, etc.
3. **Add health checks** - For load balancers and orchestrators
4. **Handle shutdown** - Finish in-flight requests gracefully
5. **Minimal permissions** - Only allow what's needed

Works on Deno Deploy, Docker, AWS Lambda, or any platform that runs Deno.
