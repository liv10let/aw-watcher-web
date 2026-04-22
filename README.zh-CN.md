# ActivityWatch Web Watcher Plus

这是 `aw-watcher-web` 的一个可配置分支版本，用于支持在扩展安装后通过设置页配置 ActivityWatch 服务端地址。

## 项目概述

该扩展会跟踪当前活动浏览器标签页，并将数据按照 ActivityWatch 的
`web.tab.current` 事件格式发送到已配置的 ActivityWatch 服务端。

与上游版本相比，这个 fork 的核心差异是：

- 服务端地址可以在扩展设置页中运行时修改
- 不再要求只能在构建时固定服务器地址

## Fork 改动

相较于上游 `aw-watcher-web`，当前 fork 包含以下改动：

- 在设置页新增 `ActivityWatch Server URL`
- 将服务器地址持久化到浏览器本地存储
- 后台优先使用运行时保存的服务器地址
- 保留 `VITE_ACTIVITYWATCH_BASE_URL` 作为构建时默认值
- 让弹窗中的 Web UI 链接与当前配置的服务器保持一致
- 增加 Firefox 浏览活动采集声明元数据
- 使用 fork 独立的 Firefox 扩展 ID
- 补充打包和 Firefox 校验所需的静态资源

## 采集数据

扩展会上报当前活动标签页，并使用 ActivityWatch 的
`web.tab.current` 事件类型。

每条事件包含：

- `url`
- `title`
- `audible`
- `incognito`
- `tabCount`

## 服务器配置

当前 fork 支持两种方式指定 ActivityWatch 服务端：

1. 在扩展设置页中运行时配置
2. 在构建时通过 `VITE_ACTIVITYWATCH_BASE_URL` 指定默认值

如果两者同时存在，则优先使用运行时保存的服务器地址。

### 在扩展设置页中配置服务器

安装扩展后：

1. 打开扩展设置页
2. 找到 `ActivityWatch Server URL`
3. 输入服务器地址，例如 `http://localhost:5600`
4. 点击 `Save`
5. 扩展会自动重载并开始使用新的服务器地址

### 构建时设置默认服务器

如果需要在打包时提供默认服务器地址，可以在构建时传入：

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

## Firefox 相关说明

当前 fork 包含以下 Firefox 相关配置：

- `browser_specific_settings.gecko.data_collection_permissions` 声明了
  `browsingActivity`
- Firefox 扩展 ID 为 `aw-watcher-web-configurable@local`
- 为支持运行时修改服务器地址，当前使用了较宽的 host 权限

## 构建环境

### 操作系统

推荐：

- Linux 或 macOS
- Windows 也支持本地开发

### 所需工具

- Node.js 23 及以上
- npm 10 及以上

主要构建工具版本定义在 `package.json` 中：

- TypeScript `5.7.3`
- Vite `6.0.11`
- `vite-plugin-web-extension` `4.4.3`

## 安装依赖

```sh
npm ci
```

## 构建

仓库中包含 `Makefile`，可用目标包括：

- `make install`
- `make compile`
- `make build-chrome`
- `make build-firefox`
- `make build-safari`

对应的直接命令为：

```sh
# 类型检查
npx tsc --noEmit

# Chrome 构建
VITE_TARGET_BROWSER=chrome npx vite build

# Firefox 构建
VITE_TARGET_BROWSER=firefox npx vite build
```

构建结果输出到 `build/` 目录。

## Firefox 打包

本地调试时，Firefox 可直接加载：

- `build/manifest.json`

在 Windows 上生成 Firefox zip 包的推荐方式：

```powershell
$env:VITE_TARGET_BROWSER='firefox'
npx vite build
tar.exe -a -c -f artifacts\firefox.zip -C build .
```

推荐使用 `tar.exe` 而不是 `Compress-Archive`，因为 Firefox 会拒绝包含
Windows 反斜杠路径的 zip 包。

## 安装构建后的扩展

### Chrome / Edge

1. 构建 Chrome 版本
2. 打开 `chrome://extensions`
3. 开启开发者模式
4. 点击“加载已解压的扩展程序”
5. 选择 `build/` 目录

### Firefox

1. 构建 Firefox 版本
2. 打开 `about:debugging#/runtime/this-firefox`
3. 点击“加载临时附加组件”
4. 选择 `build/manifest.json`

## Firefox 源代码提交

提交 Firefox 源码包时，应包含仓库源码和构建说明。

建议包含的内容：

- `README.zh-CN.md`
- `README.md`
- `package.json`
- `package-lock.json`
- `Makefile`
- `vite.config.ts`
- `tsconfig.json`
- `src/`
- `public/`

最小 Firefox 构建步骤：

```sh
npm ci
VITE_TARGET_BROWSER=firefox npx vite build
```

预期输出：

- `build/` 下生成 Firefox 扩展
- 生成 `build/manifest.json`

## English README

See [README.md](./README.md).
