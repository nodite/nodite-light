import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import lodash from 'lodash';
import { ValidateError } from 'tsoa';

import { IResponse } from '@/interfaces/httpResponse';
import AppError from '@/utils/appError';
import errorHandler from '@/utils/errorHandler';

// catch all unhandled errors
const errorHandling = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction,
) => {
  let wrappedError = error;

  // tsoa - validate error
  if (error instanceof ValidateError) {
    wrappedError = new AppError(
      httpStatus.BAD_REQUEST,
      lodash.values(lodash.mapValues(error.fields, (f) => f.message)).toString(),
    );
  }

  errorHandler.handleError(wrappedError);

  const isTrusted = errorHandler.isTrustedError(wrappedError);

  const httpStatusCode = isTrusted
    ? (wrappedError as AppError).httpCode
    : httpStatus.INTERNAL_SERVER_ERROR;

  const responseError = isTrusted
    ? wrappedError.message
    : httpStatus[httpStatus.INTERNAL_SERVER_ERROR];

  res.status(httpStatusCode).json({
    error: true,
    httpCode: httpStatusCode,
    message: responseError,
  } as IResponse<unknown>);
};

export default errorHandling;
