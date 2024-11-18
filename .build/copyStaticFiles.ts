import { copy, ensureDir } from "@std/fs";
import { StaticFile } from "./types.ts";

export async function copyStaticFiles(
  staticFiles: StaticFile[],
  isWatch: boolean,
) {
  await ensureDir("./dist");

  for (const file of staticFiles) {
    try {
      const destPath = `./dist/${file.to || file.from}`;

      await ensureDir(destPath.substring(0, destPath.lastIndexOf("/")));

      if (file.from.endsWith("popup/index.html")) {
        // Read the file content
        const content = await Deno.readTextFile(file.from);

        // Add hot reload script in watch mode
        const hotReloadScript = isWatch
          ? '<script type="module" src="./hot-reload.js"></script>'
          : "";

        // Insert hot reload script before the closing body tag
        const updatedContent = content.replace(
          "</body>",
          `${hotReloadScript}</body>`,
        );

        // Write to dist
        await Deno.writeTextFile(destPath, updatedContent);
      } else {
        await copy(file.from, destPath, { overwrite: true });
      }
    } catch (error) {
      console.error(`Error copying ${file.from}:`, error);
    }
  }

  console.log("Static files copied to dist/");
}
