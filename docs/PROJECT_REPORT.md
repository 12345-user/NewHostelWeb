# NewHostelWeb 项目检查报告

检查时间：2026-06-08

## 1. Git 仓库状态

- 本地路径：`D:\AIStorage\P1\Hostel_Web`
- 远程仓库：`git@github.com:12345-user/NewHostelWeb.git`
- 当前分支：`main`
- 最近提交：`b407e8d Adjust desktop nav link background color.`
- 工作区状态：干净，无未提交改动

信息来源：`git remote -v`、`git branch --show-current`、`git log -1 --oneline --decorate`、`git status --short`

## 2. 技术栈

该项目是一个前后端同仓的客栈展示系统：

- 前端：Vite、React 19、TypeScript、React Router、Tailwind CSS、GSAP、lucide-react
- 后端：Hono、tRPC
- 数据库：MySQL、Drizzle ORM
- 鉴权：Kimi OAuth + JWT Cookie 会话
- 构建与质量检查：Vite、esbuild、TypeScript、ESLint、Vitest
- 容器化：提供 `Dockerfile`

信息来源：`package.json`、`README.md`、`vite.config.ts`、`api/boot.ts`、`db/schema.ts`

## 3. 已实现功能

### 3.1 公开展示端

- 首页 `/`
  - 大图轮播 Hero
  - 最新活动展示
  - 数据统计：活动数量、人员数量、物品数量
  - 活动、人员、物品快捷入口
  - 客栈简介与地址展示

- 活动页 `/activities`
  - 时间线形式展示全部活动
  - 活动卡片包含日期、摘要、参与人员、封面图

- 活动详情 `/activities/:id`
  - 展示单个活动详情
  - 支持主图、正文、相册

- 人员页 `/people`
  - 展示客栈成员/伙伴
  - 支持头像、简介、技能、联系方式

- 物品页 `/items`
  - 展示客栈物品/纪念物
  - 支持图片、日期、介绍

- 登录页 `/login`
  - 通过 Kimi OAuth 登录

信息来源：`src/App.tsx`、`src/pages/Home.tsx`、`src/pages/Activities.tsx`、`src/pages/ActivityDetail.tsx`、`src/pages/People.tsx`、`src/pages/Items.tsx`、`src/pages/Login.tsx`

### 3.2 管理后台

后台入口：`/admin`

已实现三个管理模块：

- 活动管理
  - 新增活动
  - 编辑活动
  - 删除活动
  - 支持日期、参与人员、摘要、详情、图片

- 人员管理
  - 新增人员
  - 编辑人员
  - 删除人员
  - 支持姓名、简介、技能、联系方式、头像

- 物品管理
  - 新增物品
  - 编辑物品
  - 删除物品
  - 支持名称、日期、介绍、图片

后台只允许 `admin` 角色访问。

信息来源：`src/pages/Admin.tsx`、`src/hooks/useAuth.ts`、`api/middleware.ts`

### 3.3 后端接口

tRPC 路由：

- `ping`
- `auth.me`
- `auth.logout`
- `activity.list`
- `activity.getById`
- `activity.create`
- `activity.update`
- `activity.delete`
- `people.list`
- `people.getById`
- `people.create`
- `people.update`
- `people.delete`
- `item.list`
- `item.getById`
- `item.create`
- `item.update`
- `item.delete`

公开查询接口用于展示端；新增、修改、删除接口需要管理员权限。

信息来源：`api/router.ts`、`api/auth-router.ts`、`api/activity-router.ts`、`api/people-router.ts`、`api/item-router.ts`、`api/middleware.ts`

## 4. 数据库结构

数据库表：

- `users`
  - OAuth 用户信息
  - 字段包括 `unionId`、`name`、`email`、`avatar`、`role`

- `activities`
  - 客栈活动
  - 字段包括 `title`、`date`、`participants`、`summary`、`description`、`images`

- `people`
  - 客栈人员/伙伴
  - 字段包括 `name`、`bio`、`skills`、`contact`、`avatar`、`images`

- `items`
  - 客栈物品
  - 字段包括 `name`、`date`、`description`、`image`

信息来源：`db/schema.ts`

## 5. 当前启动检查结果

目前未能在当前 Codex PowerShell 环境中实际启动服务，原因如下：

- 本地 PATH 中没有 `node` 命令
- 本地 PATH 中没有 `npm` 命令
- 仓库中没有 `node_modules`
- 因此无法执行 `npm ci`、`npm run dev`、`npm run build`、`npm run check`

Codex 内置 Node 可用，版本为 `v24.14.0`，但没有配套 npm，不能完成依赖安装。

信息来源：`node --version`、`npm --version`、`Test-Path node_modules`、Codex workspace dependencies

## 6. 你需要提供或配置的内容

### 6.1 必需

- Node.js 20+ 和 npm 10+
- MySQL 数据库
- `.env` 文件

建议先安装 Node.js LTS，然后执行：

```powershell
cd D:\AIStorage\P1\Hostel_Web
npm ci
copy .env.example .env
npm run dev
```

### 6.2 `.env` 配置项

需要填写：

- `APP_ID`
- `APP_SECRET`
- `DATABASE_URL`
- `KIMI_AUTH_URL`
- `KIMI_OPEN_URL`
- `VITE_KIMI_AUTH_URL`
- `VITE_APP_ID`
- `OWNER_UNION_ID`

其中：

- `DATABASE_URL` 是 MySQL 连接串，例如 `mysql://user:password@host:3306/database`
- `APP_ID` / `APP_SECRET` / `VITE_APP_ID` / `KIMI_AUTH_URL` / `KIMI_OPEN_URL` 来自 Kimi OAuth/Open Platform
- `OWNER_UNION_ID` 用于指定首次拥有管理员角色的用户

信息来源：`.env.example`、`api/lib/env.ts`、`api/kimi/auth.ts`、`README.md`

## 7. 当前风险和问题

### 7.1 无法无配置运行

首页、活动页、人员页、物品页都会调用 tRPC 接口，接口会连接数据库。没有 `DATABASE_URL` 和数据库表时，页面数据请求会失败。

### 7.2 图片上传只是临时实现

后台图片上传当前使用 `FileReader` 转成 base64/Data URL 并存入数据库字段，并未真正上传到服务器或对象存储。数据量变大后会拖慢数据库和接口。

建议后续改为：

- 本地上传目录 `/uploads`
- 或 S3/OSS/COS 对象存储
- 数据库只保存图片 URL

信息来源：`src/pages/Admin.tsx`、`api/boot.ts`

### 7.3 模板组件偏多

`src/components/ui` 下有 40 多个 shadcn 组件，但当前业务主要使用：

- `button`
- `card`
- `dialog`
- `input`
- `tabs`
- `textarea`
- 以及 `avatar`、`dropdown-menu`、`sidebar` 等认证布局相关组件

若确定不使用复杂后台侧边栏和额外表单控件，可以删除未引用组件并同步减少依赖。

信息来源：`src/components/ui` 文件列表、`rg "components/ui" src api contracts db`

### 7.4 品牌和内容仍是示例状态

当前内容是“猫驼旅者客栈”、示例活动、示例成员和示例物品。上线前需要替换为真实客栈信息：

- 客栈名称
- 真实地址
- 联系电话/微信/邮箱
- 房型与价格
- 入住须知
- 真实照片
- 真实活动和博文内容
- 备案/版权信息

信息来源：`src/pages/Home.tsx`、`src/components/Navbar.tsx`、`src/components/Footer.tsx`、`db/seed.ts`

## 8. 精简建议

### 8.1 代码结构精简

保留核心结构：

```text
api/
  boot.ts
  router.ts
  *-router.ts
  middleware.ts
  context.ts
  lib/
  kimi/
  queries/

contracts/

db/
  schema.ts
  relations.ts
  seed.ts

public/
  images/

src/
  components/
    Navbar.tsx
    Footer.tsx
    ui/
  hooks/
  pages/
  providers/
  App.tsx
  main.tsx
```

可考虑删除或延后使用：

- 未被业务引用的 `src/components/ui/*`
- 未使用的复杂布局组件 `AuthLayout.tsx`、`AuthLayoutSkeleton.tsx`，前提是确认不会做复杂后台壳
- 未使用依赖，如 Recharts、AWS S3 SDK、复杂 Radix 组件等，需在安装后用依赖分析工具二次确认

### 8.2 产品内容精简

如果你作为客栈老板博主，第一版建议聚焦：

- 首页：客栈名、真实照片、位置、联系方式、预订入口
- 房间/物品：把 `/items` 改成“房型展示”或“客栈空间”
- 活动：保留为博客/动态
- 人员：可改为“关于我们”
- 后台：先只保留活动/房型/人员三个内容管理模块

## 9. 建议下一步

1. 在本机安装 Node.js 20+。
2. 在项目目录执行 `npm ci`。
3. 创建并填写 `.env`。
4. 准备 MySQL 数据库并执行 `npm run db:push`。
5. 执行 `npm run dev`，访问 `http://localhost:3000`。
6. 替换真实品牌内容和图片。
7. 再做一次构建检查：`npm run check`、`npm run build`。

