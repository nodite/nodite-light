import { AuthorizedRequest } from '@nodite-light/admin-auth/lib/interfaces/authorizedRequest';
import { Permissions } from '@nodite-light/admin-auth/lib/middlewares/authorized.middleware';
import { IResponse } from '@nodite-light/admin-core/lib/interfaces/httpResponse';
import validation from '@nodite-light/admin-core/lib/middlewares/validate.middleware';
import { Pagination } from '@nodite-light/admin-database/lib/nodite-sequelize/interface';
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
import { IPasswordReset, IUser } from '@/components/user/user.interface';
import { UserService } from '@/components/user/user.service';
import {
  createValidation,
  editValidation,
  ResetPasswordValidation,
} from '@/components/user/user.validation';

import { QueryParams } from '../base.interface';

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
  public async list(@Queries() params?: QueryParams): Promise<IResponse<Pagination<IUser>>> {
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
  @Middlewares([validation(createValidation)])
  @OperationId('admin:user:create')
  @Permissions('admin:user:create')
  public async create(@Body() body: IUser): Promise<IResponse<IUser>> {
    const user = await this.userService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(user);
  }

  /**
   * @summary Update user
   */
  @Put('{id}')
  @Middlewares([validation(editValidation)])
  @OperationId('admin:user:edit')
  @Permissions('admin:user:edit')
  public async update(
    @Path() id: number,
    @Body() body: Omit<IUser, 'username' | 'password'>,
  ): Promise<IResponse<IUser>> {
    const user = await this.userService.update(id, body as IUser);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(user);
  }

  /**
   * @summary Reset password
   */
  @Put('{id}/password')
  @Middlewares([validation(ResetPasswordValidation)])
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
