import { Permissions } from '@nodite-light/admin-auth';
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
  Route,
  Tags,
} from 'tsoa';

import BaseController from '@/components/base.controller';
import { IRole } from '@/components/role/role.model';
import RoleService from '@/components/role/role.service';
import { CreateValidation, EditValidation } from '@/components/role/role.validation';
import { QueryParams } from '@/interfaces';

/**
 * Class RoleController.
 */
@Route('role')
@Tags('Role')
export class RoleController extends BaseController {
  roleService: RoleService;

  constructor() {
    super();
    this.roleService = new RoleService();
  }

  /**
   * @summary Get all roles
   */
  @Get('/list')
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
  public async create(@Body() body: Omit<IRole, 'roleId'>): Promise<IResponse<IRole>> {
    const role = await this.roleService.create(body as IRole);
    this.setStatus(httpStatus.CREATED);
    return this.response(role);
  }

  /**
   * @summary Update user
   */
  @Put('{id}')
  @Middlewares([validate(EditValidation)])
  @OperationId('admin:role:edit')
  @Permissions('admin:role:edit')
  public async update(
    @Path() id: number,
    @Body() body: Omit<IRole, 'roleId' | 'roleKey'>,
  ): Promise<IResponse<IRole>> {
    const role = await this.roleService.update(id, body as IRole);
    this.setStatus(httpStatus.ACCEPTED);
    return this.response(role);
  }

  /**
   * @summary Delete role
   */
  @Delete('{id}')
  @OperationId('admin:role:delete')
  @Permissions('admin:role:delete')
  public async delete(@Path() id: number): Promise<IResponse<void>> {
    await this.roleService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default RoleController;
