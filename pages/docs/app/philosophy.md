---
title: "Philosophy"
description: "Design principles and trade-offs"
---

# Philosophy

This page explains Tabi's design decisions and trade-offs so you can decide if
it fits your needs.

## Predictability Over Cleverness

Routes are functions. Middleware is functions that run before routes. Context is
an object with your request and response. When you read a stack trace, you see
your code.

Trade-offs:

- No automatic dependency injection
- No decorators that hide control flow
- No implicit global state

You write more explicit code. That code is easier to debug and test.

## Security Features

Included security middleware:

- Path traversal protection in routing and file serving
- Schema validation with [Standard Schema](https://standardschema.dev) support
  (Zod, Valibot, ArkType)
- CSRF middleware using Sec-Fetch-Site headers
- Rate limiting, security headers, CSP, CORS
- Body size limits

This doesn't replace proper auth or input handling—it covers common cases.

## Simple Abstractions

Good abstractions hide complexity. Bad abstractions hide too much.

Tabi's abstractions are thin:

- `TabiRequest` wraps `Request` to add memoized body parsing—you can read the
  body multiple times without errors
- `TabiResponse` delays creating the Response object until the end—middleware
  can modify headers without creating multiple Response objects
- `TabiContext` bundles request, response, and helper methods—one object instead
  of passing three parameters

These solve real problems (reading body multiple times causes errors in vanilla
[Deno](https://deno.com), creating multiple Response objects is wasteful), but
you can still see through them. You know you're handling HTTP requests, not
framework-specific constructs.

## Fast Enough

Tabi prioritizes developer experience and security over raw performance. It's
fast enough for production, but it's not the fastest [Deno](https://deno.com)
framework.

We use linear search (O(n)) for routing instead of radix trees. Why? Linear
search has near-zero overhead at startup, making it ideal for serverless where
cold start matters more than routing thousands of requests in one instance. For
most applications with dozens or hundreds of routes, the difference is
microseconds.

If you need maximum throughput for thousands of routes, use a different
framework. If you need fast cold starts and reasonable performance for typical
apps, Tabi works well.

## Explicit Over Implicit

Implicit behavior causes surprises. Tabi makes you write things explicitly:

- Middleware doesn't run unless you add it with `app.use()` or on specific
  routes
- Routes don't automatically parse JSON—call `c.req.json()` when you need it
- Nothing happens globally without you asking for it

This means more typing, but fewer surprises. When you look at a route handler,
you see what runs and in what order.

## Batteries Included, But Optional

Common tasks shouldn't require external dependencies. Tabi includes:

- Middleware for CORS, CSRF, compression, rate limiting, validation
- Cookie handling with signing support
- Static file serving
- Logging utilities
- Status code helpers

Use what you need, ignore the rest. Want to use a different CORS library? Don't
use Tabi's. Prefer structured logging? Use your own logger. The included tools
work well for most cases, but nothing forces you to use them.

## Flexible by Design

The `TabiRouter` interface means you can swap routing implementations. Today
there's only LinearRouter, but you could build a radix tree router, a
regex-based router, or something domain-specific.

Middleware is just functions—write your own or use third-party middleware.
Authentication, database connections, caching, whatever your application needs.

Tabi doesn't include a database layer, ORM, template engine, or authentication
system. Those are application concerns, not framework concerns. Use what fits
your project.

## Production First

Tabi's defaults assume you're building for production:

- Security headers are available and easy to apply
- Error handling is explicit (throw `TabiError` for HTTP errors)
- Request IDs for tracing
- Rate limiting with pluggable stores
- Validation errors can be hidden from clients

These aren't afterthoughts—they're part of the core design.

## What Tabi Isn't

Tabi isn't trying to be everything:

- Not a full-stack framework with opinions on database, auth, and frontend
- Not a mature ecosystem with hundreds of plugins
- Not a Rails or Django equivalent with scaffolding and conventions for
  everything

If you need those things, use a different tool. Tabi is for developers who want
a solid foundation with good defaults, not a complete application framework.

## The Goal

Build predictable software. Get security right by default. Let TypeScript catch
mistakes. Be fast enough for production.

That's Tabi. Thanks for being interested enough to read this far!
