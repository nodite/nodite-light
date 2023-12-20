import { Request, Response } from 'express';
import morgan from 'morgan';

import config from '@/config/config';
import logger from '@/utils/logger';

morgan.token('message', (req: Request, res: Response) => res.locals.errorMessage || '');

const clientRemoteAddr = (): string => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${clientRemoteAddr()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${clientRemoteAddr()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

export default { successHandler, errorHandler };
