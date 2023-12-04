import http404 from '@components/404/404.router';
import healthCheck from '@components/healthcheck/healthCheck.router';
import swaggerApiDocs from '@components/swagger-ui/swagger.router';
import consts from '@config/consts';
import protectedByApiKey from '@core/middlewares/apiKey.middleware';
import authorized from '@core/middlewares/authorized.middleware';
import errorHandling from '@core/middlewares/errorHandling.middleware';
import uniqueReqId from '@core/middlewares/uniqueReqId.middleware';
import httpLogger from '@core/utils/httpLogger';
import api from 'api';
import express, { Application } from 'express';
import httpContext from 'express-http-context';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app: Application = express();

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 500,
  message: 'Too many requests from this IP, please try again after 10 minutes',
});

app.disable('x-powered-by');
app.use(helmet());
app.use(apiLimiter);
app.use(httpContext.middleware);
app.use(httpLogger.successHandler);
app.use(httpLogger.errorHandler);
app.use(uniqueReqId);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  consts.API_ROOT_PATH,
  [
    protectedByApiKey,
    authorized.unless({
      path: [`${consts.API_ROOT_PATH}/auth/login`],
    }),
  ],
  api,
);
app.use(swaggerApiDocs);
app.use(healthCheck);
app.use(http404);

app.use(errorHandling);

export default app;
