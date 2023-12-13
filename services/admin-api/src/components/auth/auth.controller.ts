import {
  LoginBody,
  LoginResponse,
  RegisterBody,
} from '@components/auth/auth.interface';
import { AuthService } from '@components/auth/auth.service';
import {
  LoginBodyValidation,
  RegisterBodyValidation,
} from '@components/auth/auth.validate';
import BaseController from '@components/base.controller';
import { AuthorizedRequest } from '@core/interfaces/authorizedRequest';
import { IResponse } from '@core/interfaces/httpResponse';
import validate from '@core/middlewares/validate.middleware';
import { JwtDestroyType } from '@core/utils/jwt';
import httpStatus from 'http-status';
import { Body, Delete, Middlewares, Post, Request, Route, Tags } from 'tsoa';

@Route('auth')
@Tags('auth')
export class AuthController extends BaseController {
  authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  /**
   * @summary Register
   */
  @Post('register')
  @Middlewares([validate(RegisterBodyValidation)])
  public async register(@Body() body: RegisterBody): Promise<IResponse<true>> {
    await this.authService.register(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(true);
  }

  /**
   * @summary Login
   */
  @Post('login')
  @Middlewares([validate(LoginBodyValidation)])
  public async login(
    @Body() body: LoginBody,
  ): Promise<IResponse<LoginResponse>> {
    const result = await this.authService.login(body);
    this.setStatus(httpStatus.OK);
    return this.response(result);
  }

  /**
   * @summary Logout
   */
  @Delete('logout')
  public async logout(
    @Request() req: AuthorizedRequest,
  ): Promise<IResponse<JwtDestroyType>> {
    const result = await this.authService.logout(req.user);
    this.setStatus(httpStatus.OK);
    return this.response(result);
  }
}

export default AuthController;
