import { ApiKeyMiddleware, AuthorizedMiddleware } from '@nodite-light/admin-auth';
import {
  consts,
  ErrorHandlingMiddleware,
  httpLogger,
  UniqueReqIdMiddleware,
} from '@nodite-light/admin-core';
import api from 'api';
import cors from 'cors';
import express, { Application } from 'express';
import httpContext from 'express-http-context';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import http404 from '@/components/404/404.router';
import healthCheck from '@/components/healthcheck/healthCheck.router';
import swaggerApiDocs from '@/components/swagger-ui/swagger.router';

const app: Application = express();

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 500,
  message: 'Too many requests from this IP, please try again after 10 minutes',
});

app.disable('x-powered-by');
app.use(
  cors({
    origin: [/localhost/],
  }),
);
app.use(helmet());
app.use(apiLimiter);
app.use(httpContext.middleware);
app.use(httpLogger.successHandler);
app.use(httpLogger.errorHandler);
app.use(UniqueReqIdMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  consts.API_ROOT_PATH,
  [ApiKeyMiddleware, AuthorizedMiddleware.unless({ path: consts.AUTH_WHITELIST })],
  api,
);
app.use(swaggerApiDocs);
app.use(healthCheck);
app.use(http404);

app.use(ErrorHandlingMiddleware);

export default app;
