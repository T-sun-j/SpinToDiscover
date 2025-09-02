# Spin to Discover

一个现代化的移动端网站，采用深色太空主题设计，支持多语言切换。

## 技术栈

- **框架**: Next.js 14
- **样式**: Tailwind CSS v4
- **组件库**: shadcn/ui
- **图标**: Lucide React
- **动画**: LottieFiles
- **语言**: 支持英语和中文切换

## 功能特性

- 🌍 响应式移动端设计
- 🌙 深色太空主题
- 🌐 多语言支持 (英语/中文)
- ✨ 流畅的动画效果
- 🎨 现代化的 UI 设计

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   └── LanguageSwitcher.tsx # 语言切换组件
├── contexts/             # React Context
│   └── LanguageContext.tsx # 语言管理上下文
├── lib/                  # 工具函数
│   ├── i18n.ts          # 国际化配置
│   └── utils.ts         # 通用工具函数
└── public/              # 静态资源
```

## 语言切换

项目支持英语和中文两种语言，用户可以通过页面底部的语言切换器进行切换。语言设置会保存在浏览器的 localStorage 中。

## 构建部署

```bash
npm run build
npm start
```