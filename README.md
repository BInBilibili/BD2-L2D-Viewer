# 棕色尘埃2 L2D 立绘查看器（中文版）

在线查看抽卡游戏《棕色尘埃2》（Brown Dust 2）角色立绘动画的网站。

本项目是 [Jelosus2/BD2-L2D-Viewer](https://github.com/Jelosus2/BD2-L2D-Viewer) 的简体中文汉化版。

**在线地址：<https://binbilibili.github.io/BD2-L2D-Viewer-cn/>**

## 中文版改动

- 新增轻量 i18n 系统（`src/i18n/`，零第三方依赖），支持简体中文与英文切换。
- 站内所有界面文案均已汉化（导航栏、侧边栏、设置、更新日志、上传弹窗、动画查看器、新手引导）。
- 更新日志 36 条全部译为中文。
- 角色名与服装名使用官方简体中文译名（见 `src/utils/nameTranslations.json`）；无法确认中文译名的条目保留英文原名。
- **默认语言为简体中文**，可在「设置 → 界面语言」中切换为英文，选择会保存在浏览器本地。
- 以下名称来自 Spine 模型文件本身（属于美术资源名，不是界面文案），保持原样：图层名、动画名、皮肤（Skins）名、上传的自定义模型名。

## 本地开发

```sh
pnpm install
pnpm dev          # 启动开发服务器
pnpm build        # 构建到 dist/
pnpm type-check   # 类型检查
pnpm lint         # 代码检查
```

> 注意：`pnpm build` 会通过 `scripts/copy-assets.js` 把 `src/assets/spines` 与 `src/assets/audios`（体积很大）复制到 `dist/`，因此首次构建需要完整的仓库内容。

## 部署

推送到 `zh-cn` 分支后，GitHub Actions（`.github/workflows/gh-pages.yml`）会自动构建并发布到 GitHub Pages。

如果推送后没有自动触发（fork 仓库偶尔会这样），手动触发一次即可：

```sh
gh workflow run gh-pages.yml --repo BInBilibili/BD2-L2D-Viewer-cn --ref zh-cn
```

> 注意：`zh-cn` 分支必须已加入仓库 `github-pages` 环境的「部署分支」白名单，否则 deploy 步骤会被环境保护规则拦截。

## 许可证

本项目沿用上游的 MIT 许可证。为保持法律文本原意，以下许可证正文保留英文原文：

MIT License

Copyright (c) 2025 Jelosus2

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
