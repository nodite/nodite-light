import app from '@app';
import AppError from '@core/utils/appError';
import httpStatus from 'http-status';
import { agent as request } from 'supertest';

const createUser = jest.fn();
const updateUser = jest.fn();
const deleteUser = jest.fn();

const userMock = {
  name: 'John',
  email: 'john@miwu.pl',
};

const noDataUserMock = {};

// mock api key middleware to pass the test
jest.mock('@core/middlewares/apiKey.middleware', () =>
  jest.fn((req: Request, res: Response, next) => next()),
);

jest.mock('@components/user/user.service', () => ({
  create: () => createUser(),
  update: () => updateUser(),
  delete: () => deleteUser(),
}));

describe('User API', () => {
  describe('Create User [POST] /user/', () => {
    test('should return 201 status if user created succesfully', async () => {
      await request(app)
        .post('/admin-api/user')
        .send(userMock)
        .expect(httpStatus.CREATED);
    });

    test('should return 400 status with validation error message if missing user data', async () => {
      const res = await request(app)
        .post('/admin-api/user')
        .send(noDataUserMock)
        .expect(httpStatus.BAD_REQUEST);
      expect(res.body.error).toContain('is required');
    });

    test('should return 400 status with error message if something went wrong with creating user', async () => {
      const ERROR_MESSAGE = 'User was not created!';
      createUser.mockImplementation(() => {
        throw new AppError(httpStatus.BAD_REQUEST, ERROR_MESSAGE);
      });
      const res = await request(app)
        .post('/admin-api/user')
        .send(userMock)
        .expect(httpStatus.BAD_REQUEST);
      expect(res.body.error).toBe(ERROR_MESSAGE);
    });
  });
});
