import { build } from "vite";
import react from "@vitejs/plugin-react";
import { copyStaticFiles } from "./copyStaticFiles.ts";
import type { BuildConfig } from "./types.ts";

const viteConfig = {
  configFile: false as const,
  root: Deno.cwd(),
  plugins: [react()],
  build: {
    modulePreload: false,
    cssCodeSplit: false,
    write: true,
    sourcemap: true,
    minify: false,
    target: "esnext",
    emptyOutDir: false,
  },
};

export async function buildExtension(config?: BuildConfig) {
  const startTime = performance.now();

  try {
    // Build each entry point
    for (const [name, entry] of Object.entries(config?.entryPoints ?? {})) {
      await build({
        ...viteConfig,
        build: {
          ...viteConfig.build,
          sourcemap: !config?.isProd,
          minify: config?.isProd,
          rollupOptions: {
            input: entry,
            output: {
              dir: `dist/${name}`,
              entryFileNames: "index.js",
              format: "esm",
            },
          },
        },
        define: {
          __DEV__: JSON.stringify(!config?.isProd),
          "process.env.NODE_ENV": JSON.stringify(
            config?.isProd ? "production" : "development",
          ),
        },
      });
    }

    await copyStaticFiles(config?.staticFiles ?? [], config?.isWatch ?? false);

    const endTime = performance.now();
    const buildTime = (endTime - startTime).toFixed(2);

    console.log(
      `Build completed in ${buildTime}ms at ${new Date().toLocaleTimeString()}`,
    );
  } catch (error) {
    console.error("Build failed:", error);
  }
}
