import {
  type DocumentProps,
  type JSX,
  useFrontmatter,
} from "@tabirun/pages/preact";

/**
 * Root HTML template wrapping all pages.
 * Includes theme initialization script that runs before hydration.
 */
export default function Html(props: DocumentProps): JSX.Element {
  const frontmatter = useFrontmatter();

  return (
    <html lang="en" class="scroll-pa-9xl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{frontmatter.title} | Tabirun</title>
        <meta name="description" content={frontmatter.description} />
        <link rel="icon" href="/favicon.png" />
        {props.head}
        {
          // Theme initialization script
        }
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const stored = localStorage.getItem('theme');
              const system = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              const theme = stored || system;
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            })();
          `,
          }}
        />
      </head>
      <body className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 fill-zinc-900 dark:fill-zinc-50">
        {props.children}
      </body>
    </html>
  );
}
