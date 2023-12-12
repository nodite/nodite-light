import { UserModel } from '@components/user/user.model';
import { UserService } from '@components/user/user.service';
import config from '@config/config';
import { AuthorizedRequest } from '@core/interfaces/authorizedRequest';
import AppError from '@core/utils/appError';
import jwtAsync, { JwtDestroyType } from '@core/utils/jwt';
import httpStatus from 'http-status';
import lodash from 'lodash';

import { LoginBody, LoginResponse } from './auth.interface';

export class AuthService {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Login
   * @param body LoginBody
   * @returns LoginResponse
   */
  public async login(body: LoginBody): Promise<LoginResponse> {
    let user: UserModel | null = null;

    if (!lodash.isEmpty(body.username)) {
      user = await this.userService.getByUsername(body.username || '');
    } else if (!lodash.isEmpty(body.email)) {
      user = await this.userService.getByEmail(body.email || '');
    }

    if (lodash.isEmpty(user)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid username or email.');
    }

    // valid password.
    user.validPassword(body.password);

    // generate jwt token.
    const payload = {
      userId: user.getDataValue('userId'),
      username: user.getDataValue('username'),
      email: user.getDataValue('email'),
    } as AuthorizedRequest['user'];

    return {
      token: await jwtAsync().sign(payload as object, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      }),
      expiresIn: config.jwtExpiresIn,
    };
  }

  /**
   * Logout
   * @param user AuthorizedRequest['user']
   * @returns JwtDestroyType
   */
  public async logout(
    user: AuthorizedRequest['user'],
  ): Promise<JwtDestroyType> {
    return jwtAsync().destroy(user?.jti || '');
  }
}

export default AuthService;
