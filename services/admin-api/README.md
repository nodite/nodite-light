# nodite-express-template

Inside of this repoistory you will find fully configured and ready to use express based web application for Node.js runtime. It’s built on TypeScript and follows the best top-ranked content on Node.js best practices from <https://github.com/goldbergyoni/nodebestpractices> repository.

## Main features

- 🪩 TSOA OpenAPI-compliant Web API
- 🚄 [ExpressJS](http://expressjs.com) framework with [TypeScript](https://www.typescriptlang.org/) on the board
- ♻️ Live reload
- 🏇 minified and optimized code for production build
- ✏️ Linting via [ESLint](https://eslint.org) with Airbnb configuration
- 🚑 Code Formatter with [Prettier](https://prettier.io)
- 🚧 Jest for unit testing
- 🌐 PostgresSQL database
- 🏄 And many more...

## Security best practices

1. Embracing linter security rules
   The project eslint-plugin-security helps to identify potential security hotspots.

2. Disable the header X-Powered-By
   Your application won't show that was developed using Express.js, preventing to send this info to attackers.

3. Use environment variables to store SECRETS
   Very popular and good practice. We should use the package dotenv in order to use .env files in our application

4. Limit concurrent requests using a middleware: express-rate-limit
   From the NGINX blog:
   Rate limiting can be used for security purposes, for example to slow down brute‑force password‑guessing attacks. It can help protect against DDoS attacks by limiting the incoming request rate to a value typical for real users, and (with logging) identify the targeted URLs. More generally, it is used to protect upstream application servers from being overwhelmed by too many user requests at the same time.

5. Adjust the HTTP response headers for enhanced security
   Your application should be using secure headers to prevent attackers from using common attacks like cross-site scripting (XSS), clickjacking and other malicious attacks. These can be configured easily using modules like helmet.

6. Avoid using the Node.js crypto library for handling passwords, use Bcrypt
   We're using bcrypt.js for users passwords. This package offer an optimized implementation of Bcrypt for JavaScript and is widely trusted and used over the Internet.

## Getting started, standard way (no containerization)

If you want to run nodite-express-template "standard way" using the `npm` instead of `docker-compose`.
You are free to do it just keep in mind that I develop the project on node version 20 (`nvm use` at project root).
Note: you need to copy `.env.local` file to `.env`, and put some variables in it.

Install dependencies:

```sh
npm install
```

Run server in dev mode:

```sh
npm run server:dev
```

## Testing

The Jest test suites are run by executing

```sh
npm test
```

## Code linting

Run code quality analysis using

```sh
npm run lint
```

## Fixing problems

Automatically fix linter's problems

```sh
npm run lint:fix
```

## Logging

```javascript
import logger from "@nodite-light/admin-core/lib/utils/logger";

logger.error("message"); // level 0
logger.warn("message"); // level 1
logger.info("message"); // level 2
logger.http("message"); // level 3
logger.verbose("message"); // level 4
logger.debug("message"); // level 5
logger.silly("message"); // level 6
```

In development mode, log messages of all severity levels will be printed to the console.
In production mode, only `info`, `warn`, and `error` logs will be printed to the console.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

## Troubleshooting

To help you diagnose problems, a Unique Request ID is added to each incoming request and printed to a log. This allows you to correlate log entries for a given web request across multiple log data sources.

Here are some examples of log entries for a Create User request (/api/user):

```log
[1] 2023-11-26 14:24:29.247 bdbd13da-6133-4b62-97fe-8812b6201b1d info START Request Id: bdbd13da-6133-4b62-97fe-8812b6201b1d
[1] 2023-11-26 14:24:29.247 bdbd13da-6133-4b62-97fe-8812b6201b1d error Missing x-api-key in request header or it does not match with env variable
[1] 2023-11-26 14:24:29.249 bdbd13da-6133-4b62-97fe-8812b6201b1d error Access forbidden: invalid x-api-key
[1]  Error: Access forbidden: invalid x-api-key
[1]     at new AppError (/app/services/admin-api/src/core/utils/appError.ts:21:11)
[1]     at apiKey (/app/services/admin-api/src/core/middlewares/apiKey.middleware.ts:19:9)
[1]     at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
[1]     at trim_prefix (/app/node_modules/express/lib/router/index.js:328:13)
[1]     at /app/node_modules/express/lib/router/index.js:286:9
[1]     at Function.process_params (/app/node_modules/express/lib/router/index.js:346:12)
[1]     at next (/app/node_modules/express/lib/router/index.js:280:10)
[1]     at jsonParser (/app/node_modules/body-parser/lib/types/json.js:110:7)
[1]     at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
[1]     at trim_prefix (/app/node_modules/express/lib/router/index.js:328:13)
[1] 2023-11-26 14:24:29.251 bdbd13da-6133-4b62-97fe-8812b6201b1d error GET /admin-api/user/1 401 - 3.546 ms - message: -
[1] 2023-11-26 14:24:29.251 bdbd13da-6133-4b62-97fe-8812b6201b1d info END Request Id: bdbd13da-6133-4b62-97fe-8812b6201b1d
```

## SwaggerUI

An interactive API documentation of nodite-express-template can be accessed at the path: <baseURL>/api-docs \
For local development use this: <http://localhost:8080/api-docs> \
Remember to select correct protocol befor you try to call any endpoint, "http" is used only for local development. \
Important: swaggerUI is disabled for the production env

## Contributing

All contributions are welcome!

🙌 Thanks
