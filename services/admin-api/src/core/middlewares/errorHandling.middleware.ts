import { IResponse } from '@core/interfaces/httpResponse';
import AppError from '@core/utils/appError';
import errorHandler from '@core/utils/errorHandler';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

// catch all unhandled errors
const errorHandling = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction,
) => {
  errorHandler.handleError(error);
  const isTrusted = errorHandler.isTrustedError(error);
  const httpStatusCode = isTrusted
    ? (error as AppError).httpCode
    : httpStatus.INTERNAL_SERVER_ERROR;
  const responseError = isTrusted
    ? error.message
    : httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  res.status(httpStatusCode).json({
    error: true,
    httpCode: httpStatusCode,
    message: responseError,
  } as IResponse<unknown>);
};

export default errorHandling;
