import { AuthorizedRequest, jwtAsync, JwtDestroyType } from '@nodite-light/admin-auth';
import { AppError, config } from '@nodite-light/admin-core';
import httpStatus from 'http-status';
import lodash from 'lodash';

import { LoginBody, LoginResponse, RegisterBody } from '@/components/auth/auth.interface';
import { IUser } from '@/components/user/user.model';
import UserService from '@/components/user/user.service';

/**
 * Class AuthService.
 */
export class AuthService {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Register
   * @param body
   * @returns
   */
  public async register(body: RegisterBody): Promise<void> {
    const user = {} as IUser;
    user.username = body.username;
    user.email = body.email;
    user.password = body.password;
    await this.userService.create(user);
  }

  /**
   * Login
   * @param body
   * @returns
   */
  public async login(body: LoginBody): Promise<LoginResponse> {
    let user: IUser | null = null;

    if (body.username) {
      user = await this.userService.getByUsername(body.username || '');
    } else if (body.email) {
      user = await this.userService.getByEmail(body.email || '');
    }

    if (lodash.isEmpty(user)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid username or email.');
    }

    // valid password.
    this.userService.validPassword(body.password, user.password);

    // generate jwt token.
    const payload: AuthorizedRequest['user'] = {
      userId: user.userId,
      username: user.username,
      email: user.email,
    };

    return {
      token: await jwtAsync().sign(payload as object, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      }),
      expiresIn: config.jwtExpiresIn,
    };
  }

  /**
   * Logout
   * @param user
   * @returns
   */
  public async logout(user: AuthorizedRequest['user']): Promise<JwtDestroyType> {
    return jwtAsync().destroy(user?.jti || '');
  }
}

export default AuthService;
