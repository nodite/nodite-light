import { AuthorizedRequest, Permissions } from '@nodite-light/admin-auth';
import { IResponse, validate } from '@nodite-light/admin-core';
import { Cacheable, CacheClear, SequelizePagination } from '@nodite-light/admin-database';
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
import { IRoleWithUsers } from '@/components/role/role_user.model';
import {
  IPasswordReset,
  IProfile,
  IUserCreate,
  IUserUpdate,
} from '@/components/user/user.interface';
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
@Tags('user')
export class UserController extends BaseController {
  userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  /**
   * @summary Get all users
   */
  @Get('list')
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
  @Get('profile')
  @OperationId('admin:user:profile')
  public async profile(@Request() req: AuthorizedRequest): Promise<IResponse<IProfile>> {
    const profile = await this.userService.selectProfile(req.user?.userId);
    this.setStatus(httpStatus.OK);
    return this.response(profile);
  }

  /**
   * @summary Get user by id
   */
  @Get('{id}')
  @OperationId('admin:user:query')
  @Permissions('admin:user:query', { selfBypass: true, userIdDetector: (args) => args[0] })
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
  public async create(@Body() body: IUserCreate): Promise<IResponse<IUser>> {
    const user = await this.userService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(user);
  }

  /**
   * @summary Update user
   */
  @Put('{id}')
  @Middlewares([validate(EditValidation)])
  @OperationId('admin:user:edit')
  @Permissions('admin:user:edit', { selfBypass: true, userIdDetector: (args) => args[0] })
  public async update(@Path() id: number, @Body() body: IUserUpdate): Promise<IResponse<IUser>> {
    const user = await this.userService.update(id, body);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(user);
  }

  /**
   * @summary Reset password
   */
  @Put('{id}/password')
  @Middlewares([validate(ResetPasswordValidation)])
  @OperationId('admin:user:resetPassword')
  @Permissions('admin:user:resetPassword', { selfBypass: true, userIdDetector: (args) => args[0] })
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
  @CacheClear({ hashKey: 'user:role:list', cacheKey: (args) => args[0] })
  public async delete(@Path() id: number): Promise<IResponse<void>> {
    await this.userService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }

  @Get('{id}/roles')
  @OperationId('admin:user:role:list')
  @Permissions('admin:user:role:list')
  @Cacheable({ hashKey: 'user:role:list', cacheKey: (args) => args[0] })
  public async listUserRoles(@Path() id: number): Promise<IResponse<IRoleWithUsers[]>> {
    const roles = await this.userService.selectRolesWithUser(id);
    this.setStatus(httpStatus.OK);
    return this.response(roles);
  }

  @Put('{id}/roles')
  @OperationId('admin:user:role:assign')
  @Permissions('admin:user:role:assign')
  @CacheClear({ hashKey: 'user:role:list', cacheKey: (args) => args[0] })
  public async assignRolesToUser(
    @Path() id: number,
    @Body() roleIds: number[],
  ): Promise<IResponse<void>> {
    await this.userService.assignRolesToUser(roleIds, id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }

  @Delete('{id}/roles')
  @OperationId('admin:user:role:unassign')
  @Permissions('admin:user:role:unassign')
  @CacheClear({ hashKey: 'user:role:list', cacheKey: (args) => args[0] })
  public async unassignRolesOfUser(
    @Path() id: number,
    @Body() roleIds: number[],
  ): Promise<IResponse<void>> {
    await this.userService.unassignRolesOfUser(roleIds, id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default UserController;
