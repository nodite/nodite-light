import { ApiKeyMiddleware, AuthorizedMiddleware } from '@nodite-light/admin-auth';
import {
  config,
  ErrorHandlingMiddleware,
  httpLogger,
  UniqueReqIdMiddleware,
} from '@nodite-light/admin-core';
import api from 'api';
import cors from 'cors';
import express, { Application } from 'express';
import httpContext from 'express-http-context';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { unless } from 'express-unless';
import helmet from 'helmet';

import http404 from '@/components/404/404.router';

const app: Application = express();

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 500,
  message: 'Too many requests from this IP, please try again after 10 minutes',
}) as RateLimitRequestHandler & { unless: typeof unless };
apiLimiter.unless = unless;

app.disable('x-powered-by');
app.use(
  cors({
    origin: [/localhost/],
  }),
);
app.use(helmet());
// app.use(apiLimiter.unless({ path: consts.RATELIMIT_WHITELIST }));
app.use(httpContext.middleware);
app.use(httpLogger.successHandler);
app.use(httpLogger.errorHandler);
app.use(UniqueReqIdMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  config.apiRootPath,
  [
    ApiKeyMiddleware.unless({
      path: [/^\/api-docs/, '/health'],
      useOriginalUrl: false,
    }),
    AuthorizedMiddleware.unless({
      path: [
        /^\/api-docs/,
        '/health',
        '/auth/login',
        '/auth/register',
        '/locale/i/available',
        '/locale/message/available',
      ],
      useOriginalUrl: false,
    }),
  ],
  api,
);
app.use(http404);

app.use(ErrorHandlingMiddleware);

export default app;
