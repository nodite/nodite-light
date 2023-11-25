import BaseController from '@components/base.controller';
import { IUser } from '@components/user/user.interface';
import { UserCreationParams, UserService } from '@components/user/user.service';
import { AuthorizedRequest } from '@core/interfaces/authorizedRequest';
import { IResponse } from '@core/interfaces/httpResponse';
import validation from '@core/middlewares/validate.middleware';
import httpStatus from 'http-status';
import {
  Body,
  Delete,
  Get,
  Middlewares,
  OperationId,
  Path,
  Post,
  Put,
  Query,
  Request,
  Route,
  Tags,
} from 'tsoa';

import createUserValidation from './createUser.validation';

@Route('user')
@Tags('User')
export class UserController extends BaseController {
  userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  /**
   * @summary Get current user
   */
  @Get('curr')
  public async getCurr(
    @Request() req: AuthorizedRequest,
  ): Promise<IResponse<IUser>> {
    return this.formatResponse(this.userService.get(req.userId || ''));
  }

  /**
   * @summary Get user by id
   */
  @Get('{userId}')
  @OperationId('user:get')
  public async getUser(
    @Path() userId: string,
    @Query() name?: string,
  ): Promise<IResponse<IUser>> {
    this.setStatus(httpStatus.OK);
    return this.formatResponse(this.userService.get(userId, name));
  }

  /**
   * @summary Create user
   */
  @Post()
  @Middlewares([validation(createUserValidation)])
  @OperationId('user:create')
  public async createUser(
    @Body() requestBody: UserCreationParams,
  ): Promise<IResponse<IUser>> {
    this.setStatus(httpStatus.CREATED);
    return this.formatResponse(this.userService.create(requestBody));
  }

  /**
   * @summary Update user
   */
  @Put('{userId}')
  @OperationId('user:update')
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: IUser,
  ): Promise<IResponse<IUser>> {
    this.setStatus(httpStatus.ACCEPTED);
    return this.formatResponse(this.userService.update(userId, requestBody));
  }

  /**
   * @summary Delete user
   */
  @Delete('{userId}')
  @OperationId('user:delete')
  public async deleteUser(@Path() userId: string): Promise<IResponse<boolean>> {
    this.setStatus(httpStatus.ACCEPTED);
    return this.formatResponse(this.userService.delete(userId));
  }
}

export default UserController;
