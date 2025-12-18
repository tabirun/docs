import { pages } from "@tabirun/pages";

const { build } = pages({
  css: { entry: "./styles/index.css" },
  markdown: {
    wrapperClassName: "prose dark:prose-invert",
  },
});

await build();
