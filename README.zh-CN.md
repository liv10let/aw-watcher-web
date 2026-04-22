# aw-watcher-web

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/nglaklhklhcoonedhgnpgddginnjdadi.svg)][chrome]
[![Mozilla Add-on](https://img.shields.io/amo/v/aw-watcher-web.svg)][firefox]

一个跨浏览器的 WebExtension，用来把浏览器中的活动标签页信息记录到 [ActivityWatch][activitywatch]。

## 项目说明

这个项目采集的是当前活动标签页的浏览行为，并通过 ActivityWatch 标准接口上报。

默认采集字段包括：

- `url`
- `title`
- `audible`
- `incognito`
- `tabCount`

默认情况下，本项目会把数据发送到本机 ActivityWatch 服务端：

- `http://localhost:5600`

如果你需要改成其他 ActivityWatch 服务端地址，可以用两种方式：

1. 构建时设置环境变量 `VITE_ACTIVITYWATCH_BASE_URL`
2. 直接修改 `src/config.ts`

如果目标地址不是本机，还需要同步检查：

- `src/manifest.json`
  Firefox 需要显式放行目标 API 地址
- `src/popup/index.html`
  如果希望扩展弹窗中的 Web UI 链接也跳到新地址，需要一起修改

示例：构建一个连接远端 ActivityWatch 服务端的版本

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

如果是 Firefox，还需要在 `src/manifest.json` 里放行对应的 API 地址，例如：

```json
{
  "permissions": [
    "http://your-server:5600/api/*"
  ]
}
```

## 安装

### 官方版本

你可以直接从官方商店安装：

- [Chrome Web Store][chrome]
- [Firefox Add-ons][firefox]

### 开发版构建产物

也可以从 GitHub Actions 下载构建好的开发版本：

1. 打开最新一次成功的工作流
2. 下拉到 `Artifacts`
3. 下载 `firefox.zip` 或 `chrome.zip`

> [!NOTE]
>
> - 下载 Actions 产物通常需要登录 GitHub
> - 这些构建通常是未签名版本，需要浏览器开发者模式

### Firefox 企业策略

> [!NOTE]
> 由于 Mozilla 插件政策限制，Mozilla 商店中的版本无法直接跳过隐私说明。如果你使用的是自己构建的版本，可以通过 Firefox Enterprise Policy 预先接受该说明。

示例策略如下：

```json
{
  "policies": {
    "3rdparty": {
      "Extensions": {
        "{ef87d84c-2127-493f-b952-5b4e744245bc}": {
          "consentOfflineDataCollection": true
        }
      }
    }
  }
}
```

## 从源码构建

### 前置要求

- Node.js 23 或更高版本
- Git
- Make

### 构建步骤

1. 克隆仓库：

```sh
git clone --recurse-submodules https://github.com/ActivityWatch/aw-watcher-web.git
cd aw-watcher-web
```

2. 安装依赖：

```sh
make install
```

3. 构建扩展：

```sh
# Firefox
make build-firefox

# Chrome
make build-chrome
```

构建完成后会在 `artifacts` 目录中生成：

- `artifacts/firefox.zip`
- `artifacts/chrome.zip`

如果你在构建时设置了 `VITE_ACTIVITYWATCH_BASE_URL`，生成的扩展会连接到你指定的 ActivityWatch 服务端。

### 构建 Safari 版本

1. 先按上面的步骤完成基础构建：

```sh
make install
make build-safari
```

2. 再将扩展转换为 Safari 格式：

```sh
xcrun safari-web-extension-converter ./build
```

3. 然后在 Xcode 中：

- 选择 macOS 构建目标
- 执行构建
- 运行扩展

4. 最后在 Safari 中启用扩展：

- 打开 Safari
- 进入 `Safari > Settings > Extensions`
- 启用 `aw-watcher-web`

> [!NOTE]
>
> - 需要先安装 Xcode
> - Safari 扩展需要使用 Apple Developer 账号签名
> - Safari 扩展要求 macOS 11.0 及以上版本

## 安装开发版

### Chrome

1. 解压 `artifacts/chrome.zip`
2. 打开 `chrome://extensions`
3. 启用开发者模式
4. 点击“加载已解压的扩展程序”，选择解压后的目录

### Firefox

1. 打开 `about:addons`
2. 点击右上角齿轮图标，选择“从文件安装附加组件”
3. 选择 `artifacts/firefox.zip`

> [!NOTE]
> Firefox 安装未签名扩展通常需要 Developer Edition 或 Nightly。
> 在 Firefox Developer Edition 中，你还需要在 `about:config` 中将 `xpinstall.signatures.required` 设为 `false`。

[activitywatch]: https://github.com/ActivityWatch/activitywatch
[firefox]: https://addons.mozilla.org/en-US/firefox/addon/aw-watcher-web/
[chrome]: https://chromewebstore.google.com/detail/activitywatch-web-watcher/nglaklhklhcoonedhgnpgddginnjdadi
