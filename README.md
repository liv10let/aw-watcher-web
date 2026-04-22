# aw-watcher-web

A browser extension that sends active tab activity to an ActivityWatch server.

This project is based on `aw-watcher-web`, but the README below documents this
repository as-is: how to configure it, build it, and use it with your own
ActivityWatch server.

## What It Collects

The extension reports the current active browser tab as ActivityWatch
`web.tab.current` events.

Each event includes:

- `url`
- `title`
- `audible`
- `incognito`
- `tabCount`

## How Server Configuration Works

This project supports two ways to choose the ActivityWatch server:

1. Runtime configuration in the extension settings page
2. Build-time default configuration through `VITE_ACTIVITYWATCH_BASE_URL`

The runtime setting is the one users should use in normal daily usage.

## Configure Server In The Extension

After installing the extension:

1. Open the extension settings page
2. Find `ActivityWatch Server URL`
3. Enter your server address, for example `http://localhost:5600`
4. Click `Save`
5. The extension will reload and start using the new server

This is the recommended way to use this project.

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

If the user later changes the server URL in the settings page, the saved runtime
value takes precedence over the build-time default.

## Firefox Notes

This repository currently allows Firefox to connect to configurable server
addresses by using broad host access in the extension manifest.

That is convenient for self-hosted deployments and internal use. If you plan to
publish this version publicly, you should review whether the permission scope is
appropriate for your release target.

## Development

### Requirements

- Node.js 23+
- npm

### Install Dependencies

```sh
npm ci
```

### Type Check

```sh
npx tsc --noEmit
```

### Build

```sh
# Chrome
VITE_TARGET_BROWSER=chrome npx vite build

# Firefox
VITE_TARGET_BROWSER=firefox npx vite build
```

The output is written to the `build` directory.

## Install The Built Extension

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

## Recommended Workflow

For most usage, the simplest workflow is:

1. Build the extension
2. Install it in the browser
3. Open settings
4. Set `ActivityWatch Server URL`
5. Save and start using it

## Chinese README

See [README.zh-CN.md](./README.zh-CN.md).
