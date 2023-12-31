import app from '@app';
import { config, errorHandler, logger } from '@nodite-light/admin-core';
import { Server } from 'http';

const { port } = config;
const { exit } = process;

const server: Server = app.listen(port, (): void => {
  logger.info(`Aapplication listens on PORT: ${port}`);
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
