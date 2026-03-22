> **项目迁移说明** 该仓库已转为旧版本入口，最新版本请前往 [BNUZ Feed V2](https://github.com/abcabc123789456/BNUZ-Feed-V2)  
> **V2 在线访问** https://abcabc123789456.github.io/BNUZ-Feed-V2/

# BNUZ Feed

北京师范大学珠海校区通知聚合平台，实时抓取 9 个官方站点的最新通知。

**在线访问** https://abcabc123789456.github.io/BNUZ-Feed/

## 特性

- **多站点聚合** — 教务、实践教学、团委、书院等 9 个官方站点，统一时间线
- **深色 / 浅色主题** — 一键切换，跟随系统偏好，刷新后保持选择
- **纯前端** — 无后端，浏览器直接抓取解析，通过 CORS 代理获取数据
- **响应式** — 桌面、平板、手机自适应
- **自动刷新** — 每 5 分钟拉取最新通知

## 数据来源

| 站点 | 名称 | 链接 |
|------|------|------|
| 校区通知 | 通知公示 | [tzgs](https://www.bnuzh.edu.cn/tzgs/index.htm) |
| 教务 | 教务部 | [jwb](https://jwb.bnuzh.edu.cn/tzgg/index.htm) |
| 实践 | 实践教学 | [sjjx](https://jwb.bnuzh.edu.cn/sjjx/index.htm) |
| 团委 | 共青团委员会 | [youth](https://youth.bnuzh.edu.cn/tzgg/index.htm) |
| 书院 | 会同书院 | [ht](https://ht.bnuzh.edu.cn/tzgg/index.htm) |
| 国际处 | 国际交流与合作办公室 | [io](https://io.bnuzh.edu.cn/xxgg/index.htm) |
| 后勤 | 后勤办公室 | [hqb](https://hqb.bnuzh.edu.cn/xwgg/tzgg/index.htm) |
| 科研 | 科研办公室 | [kyb](https://kyb.bnuzh.edu.cn/tzgg/kyhd/index.htm) |
| 信息化 | 信息化办公室 | [nic](https://nic.bnuzh.edu.cn/tzgg/index.htm) |

## 快速开始

```bash
git clone https://github.com/abcabc123789456/BNUZ-Feed.git
cd BNUZ-Feed
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

## 实现方法

此网站完全使用 Claude Opus/Sonnet 4.6 和 Kimi K2.5 编写。

## 技术栈

- React 18 + Vite 6
- CSS-in-JS（内联样式 + CSS 变量）
- Zinc 色阶扁平设计系统，Inter 字体
- GitHub Actions → GitHub Pages 自动部署

## 项目结构

```
BNUZ-Feed/
├── .github/workflows/deploy.yml   # CI/CD
├── src/
│   ├── App.jsx                    # 主应用组件
│   └── main.jsx                   # 入口
├── index.html                     # HTML 模板 + 主题初始化脚本
├── vite.config.js
└── package.json
```

## 免责声明

本项目仅供学习和个人使用。数据来源于各校官方网站公开信息，不存储任何数据。如侵犯权益，请联系删除。
