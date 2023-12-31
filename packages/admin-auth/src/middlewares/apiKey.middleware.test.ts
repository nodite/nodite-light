import { config } from '@nodite-light/admin-core';
import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line node/no-unpublished-import
import httpMocks from 'node-mocks-http';

import apiKey from '@/middlewares/apiKey.middleware';

describe('ApiKey middleware', () => {
  test('should call next middleware in the stack if provided correct api key in the headers', () => {
    const next: NextFunction = jest.fn();
    const res: Response = httpMocks.createResponse();
    const req: Request = httpMocks.createRequest({
      headers: { 'x-api-key': config.xApiKey },
    });

    apiKey(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should throw Acccess forbiden exception if no api key in the headers', () => {
    const next: NextFunction = jest.fn();
    const res: Response = httpMocks.createResponse();
    const req: Request = httpMocks.createRequest();

    const executeApiKey = () => apiKey(req, res, next);

    expect(executeApiKey).toThrowError('Access forbidden');
  });

  test('should throw Acccess forbiden exception if wrong api key in the headers', () => {
    const next: NextFunction = jest.fn();
    const res: Response = httpMocks.createResponse();
    const req: Request = httpMocks.createRequest({
      headers: { 'x-api-key': 'incorrect-token' },
    });

    const executeApiKey = () => apiKey(req, res, next);

    expect(executeApiKey).toThrowError('Access forbidden');
  });
});
