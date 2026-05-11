# 蔡嘉骏 · Cai Jiajun — Personal Homepage

> Agent 赋能的系统架构的学习者 · 北京邮电大学硕士在读

个人主页源码，托管在 GitHub Pages：[jdkjdkjdk.top](https://jdkjdkjdk.top) / [jdk455.github.io](https://jdk455.github.io)

## 结构

```
├── index.html                     主页
├── css/style.css                  样式
├── js/main.js                     交互（目录自动生成 / 浮动返回按钮 / 滚动揭示）
├── images/avatar.jpg              头像
├── projects/
│   ├── agent-ops.html             电商秒杀 + Agent 自动运维告警系统
│   ├── maxbft.html                长安链 MaxBFT 共识算法纠错与增强
│   ├── satellite-qos.html         太赫兹卫星网络协议栈与智能路由仿真
│   ├── 5g-intent.html             5G 核心网意图驱动配置系统
│   ├── experience-huawei.html     华为无线预研部门 6G 能力开放部实习
│   └── img/                       页面引用的图片资源
└── publications/
    ├── icct-2025-5g-intent.html   ICCT 2025 EI 会议论文详情
    ├── patent-5g-intent.html      5G 意图驱动配置生成专利详情
    └── patent-satellite-qos.html  卫星 QoS 分簇路由专利详情
```

## 本地预览

任意静态服务器即可：

```bash
python -m http.server 3457
# 然后访问 http://localhost:3457/
```

## 部署

托管于 GitHub Pages，仓库根目录的 `index.html` 即首页。每次 `git push` 后 GitHub Pages 会自动构建。

## 联系

- 邮箱：jiajuncai@bupt.edu.cn
- 微信：pipipijdkgyqazc
- 电话：+86 134-3227-0705

---

© 2025–2026 蔡嘉骏 · Built from scratch
