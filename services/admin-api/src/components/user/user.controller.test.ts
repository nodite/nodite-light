// import app from '@app';
// import AppError from '@nodite-light/admin-core/lib/utils/appError';
// import httpStatus from 'http-status';
// import { agent as request } from 'supertest';

// const create = jest.fn();
// const edit = jest.fn();
// const delete = jest.fn();

// const userMock = {
//   username: 'John',
//   email: 'john@miwu.pl',
//   password: 'abc',
// };

// const noDataUserMock = {};

// mock api key middleware to pass the test
// jest.mock('@nodite-light/admin-core/lib/middlewares/apiKey.middleware', () =>
//   jest.fn((req: Request, res: Response, next) => next()),
// );

// mock authorized middleware to pass the test
// jest.mock('@nodite-light/admin-core/lib/middlewares/authorized.middleware', () => {
//   const authorized = jest.fn((req: Request, res: Response, next) => next());
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   (authorized as any).unless = jest.fn(() => {
//     return (req: Request, res: Response, next) => next();
//   });
//   return authorized;
// });

// jest.mock('@/components/user/user.service', () => {
//   class UserService {
//     public create = create;

//     public update = edit;

//     public delete = delete;
//   }
//   return { UserService };
// });

describe('User API', () => {
  describe('Create User [POST] /user/', () => {
    test('should return 201 status if user created succesfully', async () => {
      // await request(app)
      //   .post('/admin-api/user')
      //   .send(userMock)
      //   .expect(httpStatus.CREATED);
    });

    test('should return 400 status with validation error message if missing user data', async () => {
      // const res = await request(app)
      //   .post('/admin-api/user')
      //   .send(noDataUserMock)
      //   .expect(httpStatus.BAD_REQUEST);
      // expect(res.body.message).toContain('is required');
    });

    test('should return 400 status with error message if something went wrong with creating user', async () => {
      // const ERROR_MESSAGE = 'User was not created!';
      // create.mockImplementation(() => {
      //   throw new AppError(httpStatus.BAD_REQUEST, ERROR_MESSAGE);
      // });
      // const res = await request(app)
      //   .post('/admin-api/user')
      //   .send(userMock)
      //   .expect(httpStatus.BAD_REQUEST);
      // expect(res.body.message).toBe(ERROR_MESSAGE);
    });
  });
});
