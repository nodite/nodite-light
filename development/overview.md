# Nodite-Light 项目概览

## 项目简介

Nodite-Light 是一个基于 Vue3 和 Express.js 的全栈管理系统框架，使用 TypeScript 开发，采用 Vuetify UI 组件库。

## 项目架构

### Monorepo 结构

项目采用 Lerna + Workspaces 的 Monorepo 架构，主要分为以下几个部分：

```
nodite-light/
├── packages/          # 共享包
├── services/          # 后端服务
├── websites/          # 前端应用
├── docs/             # 文档
├── deployment/       # 部署配置
└── development/      # 开发相关文档
```

## 核心模块

### 1. Packages (共享包)

- **admin-auth**: 认证授权模块
  - JWT 认证
  - Casbin 权限控制
  - API Key 中间件
- **admin-core**: 核心功能模块
  - 错误处理
  - 日志记录
  - 数据验证
  - 缓存中间件
- **admin-database**: 数据库模块
  - Sequelize ORM
  - Redis 缓存
  - 数据库连接管理
- **eslint-config-\***: ESLint 配置包
  - eslint-config-base: 基础配置
  - eslint-config-admin-api: API 项目配置
  - eslint-config-admin-web: Web 项目配置
- **vuetify-\***: Vuetify 扩展组件
  - vuetify-data-table-pagination: 数据表分页
  - vuetify-icon-picker: 图标选择器
  - vuetify-tree-data-table: 树形数据表

### 2. Services (后端服务)

- **admin-api**: 管理后台 API 服务
  - Express.js 框架
  - TSOA 自动生成 OpenAPI 文档
  - 模块化架构 (auth, user, role, menu, dict, locale 等)

### 3. Websites (前端应用)

- **admin-web**: 管理后台前端
  - Vue 3 + Composition API
  - Vuetify 3 UI 框架
  - Pinia 状态管理
  - Vue Router 路由管理
  - Vue I18n 国际化

## 技术栈

### 前端技术栈

- **框架**: Vue 3.2.47
- **UI 库**: Vuetify 3.4.6
- **状态管理**: Pinia 2.0.34
- **路由**: Vue Router 4.1.6
- **国际化**: Vue I18n 9.2.2
- **构建工具**: Vite 5.0.6
- **HTTP 客户端**: Axios 1.3.5
- **图表**: ECharts 5.4.2, Vue3-ApexCharts 1.4.1
- **动画**: Lottie-web 5.12.2
- **工具库**: Lodash 4.17.21, Moment 2.30.1

### 后端技术栈

- **运行时**: Node.js (>=10)
- **框架**: Express.js 4.17.1
- **语言**: TypeScript 5.3.2
- **ORM**: Sequelize 6.35.2 + Sequelize-TypeScript 2.1.6
- **数据库**: MySQL (mysql2 3.6.5)
- **缓存**: Redis 4.6.11
- **认证**: JWT (jsonwebtoken 9.0.2)
- **权限**: Casbin 5.28.0
- **密码加密**: Bcrypt 5.1.1
- **API 文档**: TSOA 6.0.0 + Swagger UI Express 5.0.0
- **安全**: Helmet 7.1.0, Express Rate Limit 7.1.5
- **日志**: Winston 3.11.0, Morgan 1.10.0

### 开发工具

- **包管理**: Lerna 8.1.2 + npm workspaces
- **代码规范**: ESLint + Prettier
- **Git 钩子**: Husky 9.0.11 + lint-staged 15.2.0
- **提交规范**: Commitlint (Conventional Commits)
- **测试**: Jest 29.7.0, Vitest 1.0.4
- **文档**: VitePress 1.0.0-rc.45

## 主要依赖

### 核心依赖

```json
{
  "vue": "^3.2.47",
  "vuetify": "^3.4.6",
  "express": "^4.17.1",
  "sequelize": "^6.35.2",
  "typescript": "^5.3.2"
}
```

### 开发依赖

```json
{
  "lerna": "^8.1.2",
  "vite": "^5.0.6",
  "jest": "^29.7.0",
  "husky": "9.0.11",
  "eslint": "配置在各子包中"
}
```

## 功能特性

### 前端特性

- 响应式布局设计
- 多主题支持 (明暗主题切换)
- 国际化支持 (42+ 语言)
- 组件懒加载
- 虚拟滚动
- 图表可视化
- 富文本编辑器

### 后端特性

- RESTful API 设计
- 自动生成 OpenAPI 文档
- JWT 认证 + Redis 会话管理
- 基于 Casbin 的 RBAC 权限控制
- 数据字典管理
- 多语言本地化管理
- 缓存机制
- 请求限流
- 安全头设置

### 安全特性

1. ESLint 安全规则检查
2. 禁用 X-Powered-By 头
3. 环境变量存储敏感信息
4. Express Rate Limit 防止暴力攻击
5. Helmet 安全头设置
6. Bcrypt 密码加密

## 开发环境

### 系统要求

- Node.js >= 10
- npm 或 yarn
- MySQL 数据库
- Redis 缓存

### 启动命令

```bash
# 安装依赖
npm install

# 启动所有服务
npm run start

# 单独启动后端 API
npm run start:admin-api

# 单独启动前端
npm run start:admin-web

# 构建项目
npm run build

# 运行测试
npm run test

# 代码检查
npm run lint
```

## 部署

项目支持 Docker 部署，配置文件位于 `deployment/docker/` 目录。

## 文档

- 在线文档: https://docs.nodite.com/nodite-light
- 本地文档: `npm run docs:dev`

## 许可证

Apache-2.0 License
