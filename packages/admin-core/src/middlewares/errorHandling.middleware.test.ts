import { Response } from 'express';
import httpStatus from 'http-status';
// eslint-disable-next-line node/no-unpublished-import
import httpMocks from 'node-mocks-http';

import errorHandling from '@/middlewares/errorHandling.middleware';
import errorHandler from '@/utils/errorHandler';

describe('Error middleware', () => {
  test('should delegate error to the centralized error handler and send 500 response', () => {
    const error: Error = new Error('Very sophisticated error');
    const res: Response = httpMocks.createResponse();
    const statusSpy = jest.spyOn(res, 'status');
    const errorHandlerSpy = jest.spyOn(errorHandler, 'handleError');
    const next = jest.fn();

    errorHandling(error, httpMocks.createRequest(), res, next);

    expect(statusSpy).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(errorHandlerSpy).toHaveBeenCalledWith(error);
  });
});
