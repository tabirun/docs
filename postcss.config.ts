import type { Config } from "postcss";
import tailwindcss from "@tailwindcss/postcss";

export default {
  plugins: [tailwindcss()],
} satisfies Config;
