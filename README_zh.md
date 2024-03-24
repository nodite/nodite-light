<p align="center">
  <a href="https://docs.nodite.com/nodite-light" target="_blank">
    <img alt="Nodite Logo" width="100" src="/assets/logo.png">
  </a>
</p>

<p align="center">
  <a href="https://github.com/nodite/nodite-light/actions/workflows/test.yml?query=branch%3Amain">
    <img src="https://github.com/nodite/nodite-light/actions/workflows/test.yml/badge.svg" />
  </a>
  <a href="https://github.com/nodite/nodite-light/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/nodite/nodite-light" />
  </a>
  <br />
  <a href="https://github.com/nodite/nodite-light">
    <img src="https://img.shields.io/github/languages/code-size/nodite/nodite-light" />
  </a>
  <a href="https://github.com/nodite/nodite-light">
    <img src="https://img.shields.io/github/repo-size/nodite/nodite-light" />
  </a>
</p>

README: [English](./README.md) | 简体中文

### 🚀 介绍

[Nodite-Light](https://github.com/nodite/nodite-light) 是一款 Admin 管理软件。基于 [vue3](https://github.com/vuejs/vue) 和 [vuetify](https://github.com/vuetifyjs/vuetify) UI 框架。前后端均采用 [Typescript](https://github.com/microsoft/TypeScript)，减少编程语言带来的负担。

[Nodite-Light](https://github.com/nodite/nodite-light) 具有完善的基础功能，如用户管理、区域设置/翻译管理、可靠的性能和出色的安全性。一些亮点包括：

- [F] **Customizable:** Extensive customization options with [SASS/SCSS](https://vuetifyjs.com/features/sass-variables/) and [Default configuration](https://vuetifyjs.com/features/presets/) and [Blueprints](https://vuetifyjs.com/features/blueprints/).
- [F] **Responsive Layout:** The default configuration of Vuetify components is responsive, allowing your application to adapt to different screen sizes.
- [F] **Vite Support:** _Smaller_ bundle sizes with **automatic** tree-shaking.
- [F] **Internationalization:** 42+ supported languages.
- [B] **TSOA Support:** [Tsoa](https://github.com/lukeautry/tsoa) is a TypeScript library that generates OpenAPI documentation ([Swagger](https://swagger.io/specification/)) based on your TypeScript code.
- [B] **Express Support:** [ExpressJS](http://expressjs.com) framework with [TypeScript](https://www.typescriptlang.org/) on the board.
- 🏇 minified and optimized code for production build.
- ♻️ Live reload
- 🏄 And many more...

#### 浏览器支持

Nodite-Light 支持所有现代浏览器，包括 Safari 13+ (使用[polyfills](https://vuetifyjs.com/getting-started/browser-support))。组件的最小宽度为 320 像素。

#### 安全最佳实践

1. Embracing linter security rules
   The project [eslint-plugin-security](https://github.com/eslint-community/eslint-plugin-security) helps to identify potential security hotspots.

2. Disable the header X-Powered-By
   Your application won't show that was developed using Express.js, preventing to send this info to attackers.

3. Use environment variables to store SECRETS
   Very popular and good practice. We should use the package dotenv in order to use .env files in our application

4. Limit concurrent requests using a middleware: [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
   From the NGINX blog:
   Rate limiting can be used for security purposes, for example to slow down brute‑force password‑guessing attacks. It can help protect against DDoS attacks by limiting the incoming request rate to a value typical for real users, and (with logging) identify the targeted URLs. More generally, it is used to protect upstream application servers from being overwhelmed by too many user requests at the same time.

5. Adjust the HTTP response headers for enhanced security
   Your application should be using secure headers to prevent attackers from using common attacks like cross-site scripting (XSS), clickjacking and other malicious attacks. These can be configured easily using modules like helmet.

6. Avoid using the Node.js crypto library for handling passwords, use [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
   We're using [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js) for users passwords. This package offer an optimized implementation of Bcrypt for JavaScript and is widely trusted and used over the Internet.

### 🖥️ 文档 (coming soon...)

查看文档，请访问[https://docs.nodite.com/nodite-light](https://docs.nodite.com/nodite-light)

### 🌍 在线预览 (coming soon...)

### 📝 变更日志 (coming soon...)

每个版本的详细更改记录在 [release notes](./CHANGELOG.md)。

### 💖 捐赠

[Nosite Light](https://github.com/nodite/nodite-light) 是由 [Oscaner](https://github.com/oscaner) 兼职开发和维护的开源软件。

任何人都可以下载、使用、处理并与他人共享。它建立在合作、全球主义和创新等原则之上。它是根据 [Apache-2.0](https://www.apache.org/licenses/) 的条款分发的. 从来没有许可费。[Nodite-Light](https://github.com/nodite/nodite-light) 永远是免费的。

如果你觉得这个项目有用，请给我买杯咖啡。非常感谢！！！

- [PayPal](https://paypal.me/oscaner)

- WeChat

  <img width="200" src="/assets/wechat.jpg" />

- Alipay

  <img width="200" src="/assets/alipay.jpg" />

---

这个项目的存在要感谢所有做出贡献的人😍!

<a href="https://github.com/nodite/nodite-light/graphs/contributors"><img src="https://contrib.rocks/image?repo=nodite/nodite-light" anon="1" /></a>
