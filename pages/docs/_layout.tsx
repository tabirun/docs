import type { JSX, LayoutProps } from "@tabirun/pages/preact";
import { type NavEntry, SideNav } from "../../components/side-nav.tsx";
import { ArticleToc } from "../../components/article-toc.tsx";

const navigationItems: NavEntry[] = [
  { label: "Home", href: "/" },
  { label: "Getting Started", href: "/docs/getting-started" },

  // Tabirun App (Backend Framework)
  {
    title: "Tabirun App",
    items: [
      { label: "Installation", href: "/docs/app/installation" },
      { label: "Philosophy", href: "/docs/app/philosophy" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { label: "TabiApp", href: "/docs/app/core/tabi-app" },
      { label: "TabiContext", href: "/docs/app/core/tabi-context" },
      { label: "Routing", href: "/docs/app/core/routing" },
      { label: "Request & Response", href: "/docs/app/core/request-response" },
      { label: "Middleware", href: "/docs/app/core/middleware" },
      { label: "Error Handling", href: "/docs/app/core/error-handling" },
    ],
  },
  {
    title: "Middleware",
    items: [
      { label: "CORS", href: "/docs/app/middleware/cors" },
      { label: "CSRF", href: "/docs/app/middleware/csrf" },
      { label: "CSP", href: "/docs/app/middleware/csp" },
      {
        label: "Security Headers",
        href: "/docs/app/middleware/security-headers",
      },
      { label: "Rate Limiting", href: "/docs/app/middleware/rate-limit" },
      { label: "Body Size", href: "/docs/app/middleware/body-size" },
      { label: "Timeout", href: "/docs/app/middleware/timeout" },
      { label: "Compression", href: "/docs/app/middleware/compression" },
      { label: "Cache Control", href: "/docs/app/middleware/cache-control" },
      { label: "Request ID", href: "/docs/app/middleware/request-id" },
      { label: "Serve Files", href: "/docs/app/middleware/serve-files" },
      { label: "Validation", href: "/docs/app/middleware/validate" },
    ],
  },
  {
    title: "Utilities",
    items: [{ label: "Cookies", href: "/docs/app/utilities/cookies" }],
  },
  {
    title: "Guides",
    items: [
      { label: "Testing", href: "/docs/app/guides/testing" },
      { label: "Deployment", href: "/docs/app/guides/deploy" },
    ],
  },

  // Tabirun Pages (Static Site Generator)
  {
    title: "Tabirun Pages",
    items: [
      { label: "Getting Started", href: "/docs/pages/getting-started" },
    ],
  },
  {
    title: "Pages Concepts",
    items: [
      { label: "Pages & Routing", href: "/docs/pages/pages-and-routing" },
      { label: "Layouts", href: "/docs/pages/layouts" },
      { label: "Markdown", href: "/docs/pages/markdown" },
      { label: "Components", href: "/docs/pages/components" },
      { label: "Styling", href: "/docs/pages/styling" },
      { label: "Configuration", href: "/docs/pages/configuration" },
      { label: "Build & Deploy", href: "/docs/pages/build-and-deploy" },
    ],
  },
];

/** Root layout providing site header and full-height container. */
export default function RootLayout(props: LayoutProps): JSX.Element {
  return (
    <>
      <main className="max-w-7xl mx-auto">
        <div className="flex lg:gap-8">
          <SideNav items={navigationItems} />
          <article
            id="tabi-article"
            className="flex-1 min-w-0 prose dark:prose-invert px-6 lg:px-0 pt-6"
          >
            {props.children}
          </article>
          <ArticleToc />
        </div>
      </main>
    </>
  );
}
