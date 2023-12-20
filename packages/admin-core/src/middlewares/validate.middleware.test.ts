import { Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
// eslint-disable-next-line node/no-unpublished-import
import httpMocks from 'node-mocks-http';

import { ValidationSchema } from '@/interfaces/validationSchema';
import validate from '@/middlewares/validate.middleware';
import AppError from '@/utils/appError';

// example validation schema for node request with provided all three options to valid
const validationSchemaWithAllOptions: ValidationSchema = {
  body: Joi.object().keys({
    input: Joi.object().keys({
      name: Joi.string().required(),
    }),
  }),
  params: Joi.object().keys({
    action: Joi.string().valid('update', 'add'),
  }),
  query: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};

const skip = null;

describe('Validate middleware', () => {
  test('should call next middleware in the stack with no errors if validation passes', () => {
    const next = jest.fn();
    const res: Response = httpMocks.createResponse();
    const req: Request = httpMocks.createRequest({
      method: 'POST',
      url: '/admin-api/user/:action/?id=999',
      body: {
        input: {
          name: 'John Doe',
        },
      },
      params: {
        action: 'update',
      },
    });

    validate(validationSchemaWithAllOptions)(req, res, next);

    // next function is called with zero arguments if request object is valid
    expect(next.mock.calls[0][0]).toBe(undefined);
    expect(next).toHaveBeenCalled();
  });

  test.each`
    body                        | params                     | query                  | validationErr
    ${{ input: {} }}            | ${skip}                    | ${skip}                | ${'"name" is required'}
    ${{ input: { name: 123 } }} | ${skip}                    | ${skip}                | ${'"name" must be a string'}
    ${skip}                     | ${{ action: 'incorrect' }} | ${skip}                | ${'"action" must be one of [update, add]'}
    ${skip}                     | ${skip}                    | ${{ id: 'string-id' }} | ${'"id" must be a number'}
  `(
    'should throw an app error with error message=$validationErr when request body= $body params=$params and query=$query',
    ({ body, params, query, validationErr }) => {
      const next = jest.fn();
      const res: Response = httpMocks.createResponse();
      const req: Request = httpMocks.createRequest({
        method: 'POST',
        url: '/admin-api/user/:action/?id=999',
        body,
        params,
        query,
      });

      validate(validationSchemaWithAllOptions)(req, res, next);

      expect(next).toHaveBeenCalledWith(new AppError(httpStatus.BAD_REQUEST, validationErr));
    },
  );
});
