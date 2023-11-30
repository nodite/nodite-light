import { exit } from 'node:process';

import app from '@app';
import config from '@config/config';
import logger from '@core/utils/logger';
import SequelizeStore from '@core/utils/sequelizeStore';
import errorHandler from 'core/utils/errorHandler';
import { Server } from 'http';

const { port } = config;

const server: Server = app.listen(port, (): void => {
  logger.info(`Aapplication listens on PORT: ${port}`);
  new SequelizeStore().connect({
    host: config.dbHost,
    port: config.dbPort,
    user: config.dbUser,
    pass: config.dbPass,
    dbName: config.dbName,
    engine: 'mysql',
    exitOnFail: true,
  });
});

const exitHandler = (): void => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      exit(1);
    });
  } else {
    exit(1);
  }
};

const unexpectedErrorHandler = (error: Error): void => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    exitHandler();
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', (reason: Error) => {
  throw reason;
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
