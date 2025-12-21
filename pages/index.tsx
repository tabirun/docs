import { Code, Frontmatter } from "@tabirun/pages/preact";
import { Button } from "../components/button.tsx";
import { LibraryIcon } from "../components/icons/library.tsx";
import { PagesIcon } from "../components/icons/pages.tsx";
import { GithubIcon } from "../components/icons/github.tsx";

export const frontmatter: Frontmatter = {
  title: "Home",
  description: "Web framework and static site generator for Deno",
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-94px)]">
      {/* Hero */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Tabirun</h1>
          <p className="text-xl lg:text-2xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            A web framework and static site generator for Deno. Build APIs with
            Tabirun App. Build documentation sites with Tabirun Pages.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button as="a" href="/docs/getting-started" theme="brand">
              Get Started
            </Button>
            <Button
              as="a"
              href="https://github.com/tabirun"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex items-center gap-2">
                <GithubIcon />
                GitHub
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="px-6 py-16 bg-zinc-100 dark:bg-zinc-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Tabirun App */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <LibraryIcon />
                </div>
                <h2 className="text-xl font-bold">Tabirun App</h2>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Web framework for building APIs and web applications. Middleware
                system, routing, request validation, and security utilities.
              </p>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">-</span>
                  File-based or programmatic routing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">-</span>
                  Type-safe request validation with Standard Schema
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">-</span>
                  Security middleware (CORS, CSRF, CSP, rate limiting)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">-</span>
                  Built for Deno Deploy
                </li>
              </ul>
              <Button as="a" href="/docs/app/installation" size="small">
                View Docs
              </Button>
            </div>

            {/* Tabirun Pages */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <PagesIcon />
                </div>
                <h2 className="text-xl font-bold">Tabirun Pages</h2>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Static site generator for documentation and content sites.
                Markdown with frontmatter, Preact components, and file-based
                routing.
              </p>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">-</span>
                  Markdown with YAML frontmatter
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">-</span>
                  Shiki syntax highlighting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">-</span>
                  Preact components with hydration
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">-</span>
                  Opt-in PostCSS support
                </li>
              </ul>
              <Button as="a" href="/docs/pages/getting-started" size="small">
                View Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Quick Look</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* App Example */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tabirun App</h3>
              <div className="rounded-lg overflow-hidden">
                <Code lang="typescript">
                  {`import { TabiApp } from "@tabirun/app";
import { validator } from "@tabirun/app/validate";
import { z } from "zod";

const app = new TabiApp();

const schema = z.object({
  name: z.string().min(1),
});

const { validate, valid } = validator({
  json: schema,
});

app.post("/hello", validate, (c) => {
  const { json } = valid(c);
  return c.json({ message: \`Hello, \${json.name}!\` });
});

Deno.serve(app.handler);`}
                </Code>
              </div>
            </div>

            {/* Pages Example */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Tabirun Pages</h3>
              <div className="rounded-lg overflow-hidden">
                <Code lang="typescript">
                  {`import { TabiApp } from "@tabirun/app";
import { pages } from "@tabirun/pages";

const app = new TabiApp();

const { dev, build, serve } = pages({
  shikiTheme: "github-dark",
  markdown: {
    wrapperClassName: "prose",
  },
});

// Development with hot reload
await dev(app);

Deno.serve(app.handler);`}
                </Code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="px-6 py-16 bg-zinc-100 dark:bg-zinc-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Install</h2>
          <div className="rounded-lg overflow-hidden text-left">
            <Code lang="json">
              {`{
  "imports": {
    "@tabirun/app": "jsr:@tabirun/app",
    "@tabirun/pages": "jsr:@tabirun/pages"
  }
}`}
            </Code>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mt-4 text-sm">
            Add to your deno.json imports
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-zinc-200 dark:border-zinc-700">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            MIT License
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/tabirun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
            <a
              href="https://jsr.io/@tabirun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              JSR
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
