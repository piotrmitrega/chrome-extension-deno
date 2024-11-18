# Chrome Extension Boilerplate with Deno + React + Vite

A modern boilerplate for building Chrome extensions using Deno for TypeScript
bundling, React for UI components, and Vite for fast builds and development
experience.

---

## Features:

- 🦕 **Deno-first approach** (no npm/node_modules needed)
- ⚡ **Vite** for blazing fast builds
- ⚛️ **React** support out of the box
- 🔥 **Hot reload** for development
- 🧩 **TypeScript** support
- 📦 **Production-ready builds**

---

## Getting Started:

1. Install Deno if you haven't already:
   ```bash
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

2. Clone the repository
3. Run `deno task dev` for development
   - Deno will automatically download and cache all dependencies on first run
   - No need to run any install commands
4. Load the `dist` directory as an unpacked extension in Chrome

Note: Unlike npm/node projects, Deno doesn't require a separate package
installation step. All dependencies are managed through the import map in
deno.json and are downloaded automatically when needed.

---

## Project Structure:

```
/background        - Background script files
  ├── index.ts    - Main background script
  └── hotReload.ts - Hot reload implementation
/content          - Content script files
  ├── index.tsx   - Content script entry
  └── ContentApp.tsx - React component for content
/popup            - Popup files
  ├── index.html  - Popup HTML
  ├── index.tsx   - Popup entry
  └── App.tsx     - React component for popup
/types           - TypeScript type definitions
build.config.ts  - Build configuration
deno.json       - Deno configuration
manifest.json   - Extension manifest
```

---

## Hot Reload System:

The hot reload system consists of three main parts:

### 1. Build Process (`build.config.ts`)

- Watches for file changes in development mode.
- Creates `reload-signal.js` with timestamp and changed files.
- Injects hot reload script into popup HTML in development mode.
- Handles multiple entry points and their builds.

### 2. Background Script Hot Reload (`background/hotReload.ts`)

- Monitors `reload-signal.js` for changes.
- Handles different types of changes:
  - Background script changes: Reloads entire extension.
  - Content script changes: Reloads extension and refreshesaffected tabs.
  - Popup changes: Sends reload message to popup which by default reloads the
    popup.
- Reads content script patterns from `manifest.json`.
- Shows reload indicator as a badge on the extension icon after hot reload takes
  place.

### 3. Popup Hot Reload (`popup/hotReload.ts`)

- Lightweight script injected only in development mode.
- Listens for reload messages from background script.
- Handles popup window refresh without extension reload (you can easily
  customize this behavior).

---

## Customizing Hot Reload:

### 1. Adding New Entry Points:

- Add new entry to `entryPoints` in `build.config.ts`.
- Add corresponding change detection in `ChangeInfo` interface.
- Handle new changes in `handleChanges` function.

### 2. Disabling Hot Reload:

- For all components: Run in production mode or remove `--watch` flag.
- For specific components: Remove from `entryPoints` or modify change detection.

### 3. Modifying Reload Behavior:

The hot reload system is highly customizable through the `handleChanges`
function in `background/hotReload.ts`. You can:

- Change check interval:
  ```typescript
  setInterval(checkForChanges, 1000); // Adjust interval
  ```

- Customize reload behavior per file pattern:
  ```typescript
  async function handleChanges(changes: ChangeInfo) {
    // Ignore changes in specific files
    if (changedFiles.includes("content/doNotReload.ts")) {
      return;
    }

    // Custom reload logic for specific files
    if (changedFiles.includes("content/special/")) {
      await customReloadLogic();
      return;
    }

    // Default reload behavior
    if (changes.hasBackgroundChanges) {
      // ...
    }
  }
  ```

- Add custom reload indicators:
  ```typescript
  const showReloadIndicator = async (text: string) => {
    // Customize indicator appearance/behavior
  };
  ```

### 4. Adding Static Assets:

1. Add your static files to the `staticFiles` array in `build.config.ts`:
   ```typescript
   const staticFiles = [
     "manifest.json",
     "popup/index.html",
     "assets/images/icon.png", // Add your static files
     "assets/styles/content.css",
   ];
   ```

2. To watch these files for changes, add their directories to `watchPaths`:
   ```typescript
   const watchPaths = [
     "./background",
     "./content",
     "./popup",
     "./manifest.json",
     "./assets", // Add your static directories
   ];
   ```

3. Customize reload behavior for static files:
   ```typescript
   async function handleChanges(changes: ChangeInfo) {
     if (changedFiles.includes("assets/styles/")) {
       // Custom reload logic for style changes
       await reloadStyles();
       return;
     }
     // ... rest of the logic
   }
   ```

---

## Development vs Production:

### Development Mode (`deno task dev`):

- Includes hot reload functionality.
- Source maps enabled.
- Development React mode.
- Watches for file changes.
- Injects hot reload script into popup.

### Production Mode (`deno task build-production`):

- No hot reload code included.
- Minified output.
- No source maps.
- Production React mode.
- Smaller bundle size.

---

## License: MIT
