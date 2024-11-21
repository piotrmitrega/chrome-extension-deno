import { buildExtension } from "./.build/build.ts";
import { watchFiles } from "./.build/watch.ts";
import type { StaticFile } from "./.build/types.ts";

const isWatch = Deno.args.includes("--watch");
const isProd = Deno.args.includes("--prod");

const staticFiles: StaticFile[] = [
  { from: "manifest.json" },
  { from: "popup/index.html" },
  { from: "assets/icons" },
  { from: "devtools/devtools.html" },
  { from: "devtools/panel.html" },
];

const entryPoints = {
  background: "background/index.ts",
  content: "content/index.tsx",
  popup: "popup/index.tsx",
  devtools: "devtools/index.ts",
  devtoolsPanel: "devtools/panel.tsx",
  ...(isWatch && { 
    popupHotReload: "popup/hotReload.ts",
    devtoolsHotReload: "devtools/hotReload.ts" 
  }),
};

const config = {
  isWatch,
  isProd,
  staticFiles,
  entryPoints,
};

await buildExtension(config);

if (isWatch) {
  const watchPaths = [
    "./background",
    "./content",
    "./popup",
    "./devtools",
    "./shared",
    "./manifest.json",
  ];

  await watchFiles(watchPaths, config);
}
