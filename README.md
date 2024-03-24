<p align="center">
  <a href="https://docs.nodite.com/nodite-light" target="_blank">
    <img alt="Nodite Logo" width="100" src="/assets/logo.png">
  </a>
</p>

<p align="center">
  <a href="https://github.com/nodite/nodite-light/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/nodite/nodite-light" />
  </a>
  <br />
  <a href="https://github.com/nodite/nodite-light/actions/workflows/test.yml?query=branch%3Amain">
    <img src="https://github.com/nodite/nodite-light/actions/workflows/test.yml/badge.svg?branch=main" />
  </a>
  <a href="https://github.com/nodite/nodite-light/actions/workflows/docs.yml?query=branch%3Amain">
    <img src="https://github.com/nodite/nodite-light/actions/workflows/docs.yml/badge.svg?branch=main" />
  </a>
  <br />
  <a href="https://github.com/nodite/nodite-light">
    <img src="https://img.shields.io/github/languages/code-size/nodite/nodite-light" />
  </a>
  <a href="https://github.com/nodite/nodite-light">
    <img src="https://img.shields.io/github/repo-size/nodite/nodite-light" />
  </a>
</p>

README: English | [简体中文](./README_zh.md)

### 🚀 Introduction

[Nodite-Light](https://github.com/nodite/nodite-light) is admin management software. It is based on [vue3](https://github.com/vuejs/vue) and uses the UI Toolkit [vuetify](https://github.com/vuetifyjs/vuetify), using [Typescript](https://github.com/microsoft/TypeScript) everything, no pressure for code language.

[Nodite-Light](https://github.com/nodite/nodite-light) has great standard features, like easy user management, locale/translation management, reliable performance, and excellent security. Some highlights include:

- [F] **Customizable:** Extensive customization options with [SASS/SCSS](https://vuetifyjs.com/features/sass-variables/) and [Default configuration](https://vuetifyjs.com/features/presets/) and [Blueprints](https://vuetifyjs.com/features/blueprints/).
- [F] **Responsive Layout:** The default configuration of Vuetify components is responsive, allowing your application to adapt to different screen sizes.
- [F] **Vite Support:** _Smaller_ bundle sizes with **automatic** tree-shaking.
- [F] **Internationalization:** 42+ supported languages.
- [B] **TSOA Support:** [Tsoa](https://github.com/lukeautry/tsoa) is a TypeScript library that generates OpenAPI documentation ([Swagger](https://swagger.io/specification/)) based on your TypeScript code.
- [B] **Express Support:** [ExpressJS](http://expressjs.com) framework with [TypeScript](https://www.typescriptlang.org/) on the board.
- 🏇 minified and optimized code for production build.
- ♻️ Live reload
- 🏄 And many more...

#### Browser Support

Nodite-Light supports all modern browsers, including Safari 13+ (using [polyfills](https://vuetifyjs.com/getting-started/browser-support)). Components are designed for a minimum width of 320px.

#### Security best practices

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

### 🖥️ Documentation (coming soon...)

To check out the docs, visit [https://docs.nodite.com/nodite-light](https://docs.nodite.com/nodite-light)

<!--
```shell
# development
npm install
docker-compose up -d
npm run start
# prod
docker-compose -f deployment/docker/docker-compose.mysql.yml up
``` -->

### 🌍 Example (coming soon...)

### 📝 Changelog (coming soon...)

Detailed changes for each release are documented in the [release notes](./CHANGELOG.md).

### 💖 Supporting Nodite-Light

The [Nodite-Light](https://github.com/nodite/nodite-light) is open source software that is developed and maintained part-time by [Oscaner](https://github.com/oscaner).

Anyone can download, use, work on, and share it with others. It's built on principles like collaboration, globalism, and innovation. It's distributed under the terms of the [Apache-2.0](https://www.apache.org/licenses/). There are no licensing fees, ever. [Nodite-Light](https://github.com/nodite/nodite-light) will always be free.

If you find this project useful, please buy me a coffee. Really thanks!!!

- [PayPal](https://paypal.me/oscaner)

- WeChat

  <img width="200" src="/assets/wechat.jpg" />

- Alipay

  <img width="200" src="/assets/alipay.jpg" />

---

This project exists thanks to all the people who contribute 😍!

<a href="https://github.com/nodite/nodite-light/graphs/contributors"><img src="https://contrib.rocks/image?repo=nodite/nodite-light" anon="1" /></a>
