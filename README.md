# ActivityWatch Web Watcher Plus

A configurable fork of `aw-watcher-web` that adds runtime server configuration
for ActivityWatch-compatible deployments.

## Overview

This extension tracks the currently active browser tab and sends
ActivityWatch-compatible `web.tab.current` events to a configured
ActivityWatch server.

The main difference from upstream is that this fork allows the server URL to be
configured from the extension settings page after installation, instead of
requiring a fixed server target at build time.

## Fork Changes

Compared to upstream `aw-watcher-web`, this fork includes:

- Runtime-configurable `ActivityWatch Server URL` in the settings page
- Persistent storage of the configured server URL in browser local storage
- Runtime server URL precedence over the build-time default
- Optional build-time default server support through
  `VITE_ACTIVITYWATCH_BASE_URL`
- Popup Web UI link synchronized with the active configured server
- Firefox review metadata for browsing activity collection
- A fork-specific Firefox add-on ID
- Static assets required for packaging and Firefox validation

## Data Collected

The extension reports the active browser tab as ActivityWatch
`web.tab.current` events.

Each event includes:

- `url`
- `title`
- `audible`
- `incognito`
- `tabCount`

## Server Configuration

This fork supports two ways to choose the ActivityWatch server:

1. Runtime configuration in the extension settings page
2. Build-time default configuration through `VITE_ACTIVITYWATCH_BASE_URL`

If both are present, the saved runtime setting takes precedence.

### Configure The Server In The Extension

After installing the extension:

1. Open the extension settings page
2. Find `ActivityWatch Server URL`
3. Enter the server address, for example `http://localhost:5600`
4. Click `Save`
5. The extension reloads and starts using the new server

### Build-Time Default Server

To ship a packaged build with a predefined default server:

```sh
# Chrome
VITE_ACTIVITYWATCH_BASE_URL=http://your-server:5600 \
VITE_TARGET_BROWSER=chrome \
npx vite build

# Firefox
VITE_ACTIVITYWATCH_BASE_URL=http://your-server:5600 \
VITE_TARGET_BROWSER=firefox \
npx vite build
```

## Firefox-Specific Notes

This fork includes several Firefox-specific adjustments:

- `browser_specific_settings.gecko.data_collection_permissions` declares
  `browsingActivity`
- The Firefox add-on ID is `aw-watcher-web-configurable@local`
- Broad host access is used so the configured server URL can be changed without
  rebuilding

## Build Environment

### Operating System

Recommended:

- Linux or macOS
- Windows is also supported for local development

### Required Tools

- Node.js 23 or newer
- npm 10 or newer

Primary build tool versions are defined in `package.json`:

- TypeScript `5.7.3`
- Vite `6.0.11`
- `vite-plugin-web-extension` `4.4.3`

## Install Dependencies

```sh
npm ci
```

## Build

This repository includes a `Makefile` with build targets:

- `make install`
- `make compile`
- `make build-chrome`
- `make build-firefox`
- `make build-safari`

Equivalent direct commands:

```sh
# Type check
npx tsc --noEmit

# Chrome build
VITE_TARGET_BROWSER=chrome npx vite build

# Firefox build
VITE_TARGET_BROWSER=firefox npx vite build
```

The generated extension is written to the `build/` directory.

## Packaging Firefox

For local Firefox testing, load:

- `build/manifest.json`

To create a Firefox zip package on Windows:

```powershell
$env:VITE_TARGET_BROWSER='firefox'
npx vite build
tar.exe -a -c -f artifacts\firefox.zip -C build .
```

`tar.exe` is recommended over `Compress-Archive` because Firefox rejects zip
archives that contain Windows-style backslash paths.

## Installing The Built Extension

### Chrome / Edge

1. Build the project for Chrome
2. Open `chrome://extensions`
3. Enable Developer Mode
4. Click `Load unpacked`
5. Select the `build/` directory

### Firefox

1. Build the project for Firefox
2. Open `about:debugging#/runtime/this-firefox`
3. Click `Load Temporary Add-on`
4. Select `build/manifest.json`

## Firefox Source Submission

When submitting source code for Firefox review, the source archive should
include the repository source and build instructions.

Relevant repository contents include:

- `README.md`
- `package.json`
- `package-lock.json`
- `Makefile`
- `vite.config.ts`
- `tsconfig.json`
- `src/`
- `public/`

Minimal Firefox build steps:

```sh
npm ci
VITE_TARGET_BROWSER=firefox npx vite build
```

Expected output:

- a Firefox extension build under `build/`
- generated `build/manifest.json`

## Chinese README

See [README.zh-CN.md](./README.zh-CN.md).
