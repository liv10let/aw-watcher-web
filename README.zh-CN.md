# aw-watcher-web

这是一个浏览器扩展，用来把当前活动标签页的数据发送到 ActivityWatch 服务端。

这个仓库基于 `aw-watcher-web` 改造而来，但下面这份说明只面向当前这个项目本身：怎么配置、怎么构建、怎么安装、怎么连接你自己的 ActivityWatch 服务端。

## 采集内容

扩展会上报当前活动标签页，并按照 ActivityWatch 的 `web.tab.current` 事件类型发送数据。

每条事件包含这些字段：

- `url`
- `title`
- `audible`
- `incognito`
- `tabCount`

## 服务器地址如何配置

这个项目支持两种方式指定 ActivityWatch 服务端地址：

1. 在扩展设置页里手动填写
2. 构建时通过 `VITE_ACTIVITYWATCH_BASE_URL` 指定默认值

日常使用时，推荐优先使用第一种，也就是在扩展设置页里配置。

## 在扩展设置页里配置服务器地址

安装扩展后：

1. 打开扩展设置页
2. 找到 `ActivityWatch Server URL`
3. 输入你的服务端地址，例如 `http://localhost:5600`
4. 点击 `Save`
5. 扩展会自动重载，并开始使用新的地址

这也是当前项目最推荐的使用方式。

## 构建时写入默认服务器地址

如果你希望打包出来的扩展自带一个默认服务器地址，可以在构建时传入 `VITE_ACTIVITYWATCH_BASE_URL`。

示例：

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

如果用户之后又在设置页里修改了服务器地址，那么运行时保存的地址会优先生效，覆盖构建时默认值。

## Firefox 说明

为了支持在 Firefox 中填写可配置的服务器地址，这个仓库当前使用了较宽的 host 权限配置。

这对自托管、内部使用和个人部署很方便；但如果你将来要把这个版本公开发布到扩展商店，建议再单独评估一下权限范围是否需要收紧。

## 开发说明

### 环境要求

- Node.js 23 及以上
- npm

### 安装依赖

```sh
npm ci
```

### 类型检查

```sh
npx tsc --noEmit
```

### 构建

```sh
# Chrome
VITE_TARGET_BROWSER=chrome npx vite build

# Firefox
VITE_TARGET_BROWSER=firefox npx vite build
```

构建结果会输出到 `build` 目录。

## 安装构建后的扩展

### Chrome / Edge

1. 先构建 Chrome 版本
2. 打开 `chrome://extensions`
3. 开启开发者模式
4. 点击“加载已解压的扩展程序”
5. 选择 `build` 目录

### Firefox

1. 先构建 Firefox 版本
2. 打开 `about:debugging#/runtime/this-firefox`
3. 点击“加载临时附加组件”
4. 选择 `build/manifest.json`

## 推荐使用流程

对大多数场景，最简单的流程是：

1. 构建扩展
2. 在浏览器中安装
3. 打开设置页
4. 填写 `ActivityWatch Server URL`
5. 保存后开始使用

## English README

参见 [README.md](./README.md)。
