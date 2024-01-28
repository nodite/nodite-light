import { Permissions } from '@nodite-light/admin-auth';
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
  Route,
  Tags,
} from 'tsoa';

import BaseController from '@/components/base.controller';
import { IMenu } from '@/components/menu/menu.model';
import { IRoleCreate, IRoleUpdate } from '@/components/role/role.interface';
import { IRole } from '@/components/role/role.model';
import RoleService from '@/components/role/role.service';
import { CreateValidation, UpdateValidation } from '@/components/role/role.validation';
import { IUserWithRoles } from '@/components/role/role_user.model';
import { QueryParams } from '@/interfaces';

/**
 * Class RoleController.
 */
@Route('role')
@Tags('role')
export class RoleController extends BaseController {
  roleService: RoleService;

  constructor() {
    super();
    this.roleService = new RoleService();
  }

  /**
   * @summary Get all roles
   */
  @Get('list')
  @OperationId('admin:role:list')
  @Permissions('admin:role:list')
  public async list(
    @Queries() params?: QueryParams,
  ): Promise<IResponse<SequelizePagination<IRole>>> {
    const page = await this.roleService.selectRoleList(params);
    this.setStatus(httpStatus.OK);
    return this.response(page);
  }

  /**
   * @summary Get role by id
   */
  @Get('{id}')
  @OperationId('admin:role:query')
  @Permissions('admin:role:query')
  public async query(@Path() id: number): Promise<IResponse<IRole>> {
    const role = await this.roleService.selectRoleById(id);
    this.setStatus(httpStatus.OK);
    return this.response(role);
  }

  /**
   * @summary Create role
   */
  @Post()
  @Middlewares([validate(CreateValidation)])
  @OperationId('admin:role:create')
  @Permissions('admin:role:create')
  public async create(@Body() body: IRoleCreate): Promise<IResponse<IRole>> {
    const role = await this.roleService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(role);
  }

  /**
   * @summary Update user
   */
  @Put('{id}')
  @Middlewares([validate(UpdateValidation)])
  @OperationId('admin:role:edit')
  @Permissions('admin:role:edit')
  public async update(@Path() id: number, @Body() body: IRoleUpdate): Promise<IResponse<IRole>> {
    const role = await this.roleService.update(id, body);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(role);
  }

  /**
   * @summary Delete role
   */
  @Delete('{id}')
  @OperationId('admin:role:delete')
  @Permissions('admin:role:delete')
  @CacheClear({ hashKey: 'role:perm:list', cacheKey: (args) => args[0] })
  @CacheClear({ hashKey: 'role:user:list', cacheKey: (args) => args[0] })
  public async delete(@Path() id: number): Promise<IResponse<void>> {
    await this.roleService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }

  @Get('{id}/perms')
  @OperationId('admin:role:perm:list')
  @Permissions('admin:role:perm:list')
  @Cacheable({ hashKey: 'role:perm:list', cacheKey: (args) => args[0] })
  public async listMenuPerms(
    @Path() id: number,
  ): Promise<IResponse<Pick<IMenu, 'menuId' | 'perms'>[]>> {
    const menuPerms = await this.roleService.selectMenuPerms(id);
    this.setStatus(httpStatus.OK);
    return this.response(menuPerms);
  }

  @Put('{id}/perms')
  @OperationId('admin:role:perm:update')
  @Permissions('admin:role:perm:update')
  @CacheClear({ hashKey: 'role:perm:list', cacheKey: (args) => args[0] })
  public async updateMenuPerms(
    @Path() id: number,
    @Body() menuIds: string[],
  ): Promise<IResponse<void>> {
    await this.roleService.updateMenuPerms(id, menuIds);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }

  @Get('{id}/users')
  @OperationId('admin:role:user:list')
  @Permissions('admin:role:user:list')
  @Cacheable({ hashKey: 'role:user:list', cacheKey: (args) => args[0] })
  public async listRoleUsers(@Path() id: number): Promise<IResponse<IUserWithRoles[]>> {
    const users = await this.roleService.selectUsersOfRole(id);
    this.setStatus(httpStatus.OK);
    return this.response(users);
  }

  @Put('{id}/users')
  @OperationId('admin:role:user:assign')
  @Permissions('admin:role:user:assign')
  @CacheClear({ hashKey: 'role:user:list', cacheKey: (args) => args[0] })
  public async assignRoleToUsers(
    @Path() id: number,
    @Body() userIds: number[],
  ): Promise<IResponse<void>> {
    await this.roleService.assignRoleToUsers(id, userIds);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }

  @Delete('{id}/users')
  @OperationId('admin:role:user:unassign')
  @Permissions('admin:role:user:unassign')
  @CacheClear({ hashKey: 'role:user:list', cacheKey: (args) => args[0] })
  public async unassignRoleOfUsers(
    @Path() id: number,
    @Body() userIds: number[],
  ): Promise<IResponse<void>> {
    await this.roleService.unassignRoleOfUsers(id, userIds);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default RoleController;
