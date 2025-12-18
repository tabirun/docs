import { TabiApp } from "@tabirun/app";
import { pages } from "@tabirun/pages";

const app = new TabiApp();
const { serve } = pages();
serve(app);

Deno.serve({ port: 3000 }, app.handler);
