# BNUZ Feed · 北师珠通知聚合

<p align="center">
  <a href="https://abcabc123789456.github.io/BNUZ-Feed/">
    <img src="https://img.shields.io/badge/在线访问-点击体验-brightgreen?style=for-the-badge" alt="在线访问">
  </a>
  <img src="https://img.shields.io/badge/站点数量-9个-blue?style=for-the-badge" alt="9个站点">
  <img src="https://img.shields.io/badge/部署-GitHub%20Pages-orange?style=for-the-badge" alt="GitHub Pages">
</p>

北京师范大学珠海校区通知聚合平台，实时抓取 **9 个官方站点**的最新通知，一站式获取校园资讯。

🔗 **在线访问**: https://abcabc123789456.github.io/BNUZ-Feed/

---

## ✨ 特性

| 特性 | 说明 |
|------|------|
| 📡 **多站点聚合** | 实时抓取 9 个官方站点，包括教务、实践教学、团委、书院等 |
| 🎨 **Material You** | 采用 Google Material You 设计规范，界面美观现代 |
| ⚡ **纯前端实现** | 无需后端服务器，直接通过浏览器解析各站点 HTML |
| 📱 **响应式布局** | 完美适配桌面端、平板和移动设备 |
| 🔄 **自动刷新** | 每 5 分钟自动更新数据，始终保持最新 |
| 🔍 **筛选功能** | 支持按站点筛选通知，快速定位感兴趣的内容 |
| 🌓 **色标系统** | 每个站点配有独特颜色标识，一目了然 |

---

## 🚀 快速开始

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/abcabc123789456/BNUZ-Feed.git
cd BNUZ-Feed

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 🏗️ 技术栈

- **框架**: React 18 + Vite 6
- **样式**: CSS-in-JS（内联样式方案）
- **设计系统**: Material You（Material Design 3）
- **部署**: GitHub Actions → GitHub Pages
- **数据获取**: 纯前端抓取 + CORS 代理

---

## 📊 数据来源

本项目实时抓取以下 9 个官方站点的通知公告：

| 站点 | 名称 | 链接 |
|------|------|------|
| 🏫 校区通知 | 通知公示 | [tzgs](https://www.bnuzh.edu.cn/tzgs/index.htm) |
| 📚 教务 | 教务部 | [jwb](https://jwb.bnuzh.edu.cn/tzgg/index.htm) |
| 🔬 实践 | **实践教学** | [sjjx](https://jwb.bnuzh.edu.cn/sjjx/index.htm) |
| 🎖️ 团委 | 共青团委员会 | [youth](https://youth.bnuzh.edu.cn/tzgg/index.htm) |
| 📖 书院 | 会同书院 | [ht](https://ht.bnuzh.edu.cn/tzgg/index.htm) |
| 🌍 国际处 | 国际交流与合作办公室 | [io](https://io.bnuzh.edu.cn/xxgg/index.htm) |
| 🛠️ 后勤 | 后勤办公室 | [hqb](https://hqb.bnuzh.edu.cn/xwgg/tzgg/index.htm) |
| 🔭 科研 | 科研办公室 | [kyb](https://kyb.bnuzh.edu.cn/tzgg/kyhd/index.htm) |
| 💻 信息化 | 信息化办公室 | [nic](https://nic.bnuzh.edu.cn/tzgg/index.htm) |

> **实践教学** 为最新添加的站点，涵盖实习实践、学科竞赛、毕业论文、创新创业等通知。

---

## 📁 项目结构

```
BNUZ-Feed/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 自动部署配置
├── api/
│   └── proxy.js            # Vercel 代理函数（备用）
├── src/
│   ├── App.jsx             # 主应用组件
│   └── main.jsx            # 入口文件
├── dist/                   # 构建输出目录
├── index.html              # HTML 模板
├── package.json
├── README.md
└── vite.config.js          # Vite 配置
```

---

## 🔄 自动部署

项目已配置 GitHub Actions 工作流，每次推送到 `main` 分支会自动：

1. 运行 `npm ci` 安装依赖
2. 运行 `npm run build` 构建项目
3. 将 `dist/` 目录部署到 GitHub Pages

部署状态可在仓库的 [Actions](https://github.com/abcabc123789456/BNUZ-Feed/actions) 页面查看。

---

## ⚠️ 免责声明

1. 本项目仅供学习和个人使用，数据直接来源于各校官方网站的公开信息
2. 本项目不存储任何数据，所有通知均为实时抓取
3. 使用本项目时请遵守相关网站的使用条款
4. 如侵犯权益，请联系删除

---

## 🙏 致谢

- 设计灵感来自 [Material You](https://m3.material.io/)
- 开发辅助：Claude Opus 4.6 & Kimi K2.5

---

<p align="center">
  Made with ❤️ for BNUZ
</p>
