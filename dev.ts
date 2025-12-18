import { TabiApp } from "@tabirun/app";
import { pages } from "@tabirun/pages";

const app = new TabiApp();

const { dev } = pages({
  css: { entry: "./styles/index.css" },
  markdown: {
    wrapperClassName: "prose dark:prose-invert",
  },
});

await dev(app);

Deno.serve({ port: 3000 }, app.handler);
