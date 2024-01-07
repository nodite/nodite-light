import { AuthorizedRequest, Permissions } from '@nodite-light/admin-auth';
import { IResponse, validate } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
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
  Queries,
  Request,
  Route,
  Tags,
} from 'tsoa';

import BaseController from '@/components/base.controller';
import { IPasswordReset } from '@/components/user/user.interface';
import { IUser } from '@/components/user/user.model';
import UserService from '@/components/user/user.service';
import {
  CreateValidation,
  EditValidation,
  ResetPasswordValidation,
} from '@/components/user/user.validation';
import { QueryParams } from '@/interfaces';

/**
 * Class UserController.
 */
@Route('user')
@Tags('User')
export class UserController extends BaseController {
  userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  /**
   * @summary Get all users
   */
  @Get('/list')
  @OperationId('admin:user:list')
  @Permissions('admin:user:list')
  public async list(
    @Queries() params?: QueryParams,
  ): Promise<IResponse<SequelizePagination<IUser>>> {
    const page = await this.userService.selectUserList(params);
    this.setStatus(httpStatus.OK);
    return this.response(page);
  }

  /**
   * @summary Get current user
   */
  @Get()
  @OperationId('admin:user:curr')
  public async curr(@Request() req: AuthorizedRequest): Promise<IResponse<IUser>> {
    const user = await this.userService.selectUserById(req.user?.userId);
    this.setStatus(httpStatus.OK);
    return this.response(user);
  }

  /**
   * @summary Get user by id
   */
  @Get('{id}')
  @OperationId('admin:user:query')
  @Permissions('admin:user:query')
  public async query(@Path() id: number): Promise<IResponse<IUser>> {
    const user = await this.userService.selectUserById(id);
    this.setStatus(httpStatus.OK);
    return this.response(user);
  }

  /**
   * @summary Create user
   */
  @Post()
  @Middlewares([validate(CreateValidation)])
  @OperationId('admin:user:create')
  @Permissions('admin:user:create')
  public async create(@Body() body: Omit<IUser, 'userId'>): Promise<IResponse<IUser>> {
    const user = await this.userService.create(body as IUser);
    this.setStatus(httpStatus.CREATED);
    return this.response(user);
  }

  /**
   * @summary Update user
   */
  @Put('{id}')
  @Middlewares([validate(EditValidation)])
  @OperationId('admin:user:edit')
  @Permissions('admin:user:edit')
  public async update(
    @Path() id: number,
    @Body() body: Omit<IUser, 'userId' | 'username' | 'password'>,
  ): Promise<IResponse<IUser>> {
    const user = await this.userService.update(id, body as IUser);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(user);
  }

  /**
   * @summary Reset password
   */
  @Put('{id}/password')
  @Middlewares([validate(ResetPasswordValidation)])
  @OperationId('admin:user:resetPassword')
  @Permissions('admin:user:resetPassword')
  public async resetPassword(
    @Path() id: number,
    @Body() body: IPasswordReset,
  ): Promise<IResponse<IUser>> {
    const user = await this.userService.resetPassword(id, body);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(user);
  }

  /**
   * @summary Delete user
   */
  @Delete('{id}')
  @OperationId('admin:user:delete')
  @Permissions('admin:user:delete')
  public async delete(@Path() id: number): Promise<IResponse<void>> {
    await this.userService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default UserController;
