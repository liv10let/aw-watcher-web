# ActivityWatch Web Watcher Plus

A configurable fork of `aw-watcher-web` that lets users choose the
ActivityWatch server URL from the extension settings page.

This README is written for the current fork, not the upstream project. It is
intended to help with:

- day-to-day usage of this repository
- preparing a pull request back to the upstream project
- submitting source code for Firefox add-on review

## Why This Fork Exists

The upstream extension is designed around a fixed or build-time server target.
This fork adds a user-configurable server URL workflow so the extension can be
installed once and then pointed at any compatible ActivityWatch server from the
browser settings UI.

## What Changed Compared To Upstream

This fork currently adds or changes the following behavior:

- Adds an `ActivityWatch Server URL` field to the extension settings page
- Stores the configured server URL in browser local storage
- Uses the saved runtime server URL when creating the ActivityWatch client
- Keeps support for a build-time default server through
  `VITE_ACTIVITYWATCH_BASE_URL`
- Updates popup behavior so the Web UI link follows the active configured server
- Adds Firefox manifest metadata required for modern review
  (`data_collection_permissions`)
- Uses a fork-specific Firefox add-on ID so it does not collide with the
  upstream add-on
- Adds local static assets required for packaging and validation
- Rewrites repository documentation for this fork and its build/review workflow

## Data Collected

The extension reports the currently active browser tab as ActivityWatch
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

In normal usage, the runtime setting is the preferred method.

## Configure The Server In The Extension

After installing the extension:

1. Open the extension settings page
2. Find `ActivityWatch Server URL`
3. Enter your server address, for example `http://localhost:5600`
4. Click `Save`
5. The extension reloads and starts using the new server

If a runtime server URL is saved, it takes precedence over the build-time
default.

## Build-Time Default Server

If you want the packaged extension to ship with a predefined default server,
build it with `VITE_ACTIVITYWATCH_BASE_URL`.

Example:

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

## Firefox Review Notes

This fork is intentionally different from upstream in a few Firefox-specific
ways:

- It declares `browser_specific_settings.gecko.data_collection_permissions`
  because the add-on collects browsing activity and sends it to a user-chosen
  ActivityWatch server
- It uses a fork-specific add-on ID:
  `aw-watcher-web-configurable@local`
- It currently uses broad host access in Firefox so the configured server URL
  can be changed by the user without rebuilding

If this fork is proposed upstream, the permissions strategy may need separate
discussion depending on AMO policy expectations.

## Build Environment

### Operating System

Recommended:

- Linux or macOS
- Windows also works for local development, but note the packaging caveat below

### Required Tools

- Node.js 23 or newer
- npm 10+ or newer

This repository currently uses the following build tooling:

- TypeScript `5.7.3`
- Vite `6.0.11`
- `vite-plugin-web-extension` `4.4.3`

These versions come from `package.json`.

## Install Dependencies

```sh
npm ci
```

## Build Scripts

This repository includes a `Makefile` with build targets:

- `make install`
- `make compile`
- `make build-chrome`
- `make build-firefox`
- `make build-safari`

For direct manual builds, the equivalent commands are:

```sh
# Type check
npx tsc --noEmit

# Chrome build
VITE_TARGET_BROWSER=chrome npx vite build

# Firefox build
VITE_TARGET_BROWSER=firefox npx vite build
```

The output is written to the `build` directory.

## Packaging Firefox

For Firefox local testing, the simplest workflow is to load:

- `build/manifest.json`

For a packaged Firefox zip, build first and then archive the contents of
`build/`.

Recommended command on Windows:

```powershell
$env:VITE_TARGET_BROWSER='firefox'
npx vite build
tar.exe -a -c -f artifacts\firefox.zip -C build .
```

Why `tar.exe` instead of `Compress-Archive`:

- `Compress-Archive` can produce Windows-style backslash paths inside the zip
- Firefox validation rejects those archive entry names

## Installing The Built Extension

### Chrome / Edge

1. Build the project for Chrome
2. Open `chrome://extensions`
3. Enable Developer Mode
4. Click `Load unpacked`
5. Select the `build` directory

### Firefox

1. Build the project for Firefox
2. Open `about:debugging#/runtime/this-firefox`
3. Click `Load Temporary Add-on`
4. Select `build/manifest.json`

## Source Code Submission For Firefox Review

If you submit this add-on to Firefox and need to upload source code, include the
repository source and keep these points in mind:

- Submit source files, not transpiled or minified source authored by you
- Third-party dependencies remain installable through `npm ci`
- Build instructions must be included in the source package README or reviewer
  notes
- The source package should contain:
  - this README
  - `package.json`
  - `package-lock.json`
  - `Makefile`
  - the `src/` directory
  - the `public/` directory
  - other repository files needed to reproduce the build

Minimal reviewer build steps:

```sh
npm ci
VITE_TARGET_BROWSER=firefox npx vite build
```

Expected output:

- a Firefox extension build in `build/`
- `manifest.json` generated under `build/`

## Suggested PR Summary

If you plan to open a PR against upstream, the change can be summarized as:

- add runtime-configurable ActivityWatch server URL support
- keep build-time default server support for packaged deployments
- make popup and background client use the configured runtime server
- add Firefox review metadata required by modern submission flow
- keep ActivityWatch event format unchanged

## Chinese README

See [README.zh-CN.md](./README.zh-CN.md).
