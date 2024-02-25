import { Permissions } from '@nodite-light/admin-auth';
import { type DataTree, IResponse, validate } from '@nodite-light/admin-core';
import { Cacheable, CacheClear } from '@nodite-light/admin-database';
import httpStatus from 'http-status';
import { Body, Delete, Get, Middlewares, OperationId, Path, Post, Put, Route, Tags } from 'tsoa';

import BaseController from '@/components/base.controller';
import { IDictGroupCreate, IDictGroupUpdate } from '@/components/dict/dict.interface';
import { CreateGroupValidation, UpdateGroupValidation } from '@/components/dict/dict.validation';
import { IDictGroup } from '@/components/dict/dict_group.model';
import DictGroupService from '@/components/dict/dict_group.service';

@Route('dict/group')
@Tags('dict')
export class DictController extends BaseController {
  dictGroupService: DictGroupService;

  constructor() {
    super();
    this.dictGroupService = new DictGroupService();
  }

  /**
   * @summary List dict groups.
   */
  @Get('list')
  @OperationId('admin:dict:group:list')
  @Permissions('admin:dict:list')
  public async list(): Promise<IResponse<IDictGroup[]>> {
    const groups = await this.dictGroupService.selectDictGroupList();
    this.setStatus(httpStatus.OK);
    return this.response(groups);
  }

  /**
   * @summary List dict group tree.
   */
  @Get('tree')
  @OperationId('admin:dict:group:tree')
  @Permissions('admin:dict:list')
  @Cacheable({ hashKey: 'dict:group:tree' })
  public async listTree(): Promise<IResponse<DataTree<IDictGroup>[]>> {
    const tree = await this.dictGroupService.selectDictGroupTree();
    this.setStatus(httpStatus.OK);
    return this.response(tree);
  }

  /**
   * @summary Get dict group by id.
   */
  @Get('{id}')
  @OperationId('admin:dict:group:query')
  @Permissions('admin:dict:query')
  public async query(@Path() id: string): Promise<IResponse<IDictGroup>> {
    const group = await this.dictGroupService.selectDictGroupById(id);
    this.setStatus(httpStatus.OK);
    return this.response(group);
  }

  /**
   * @summary Create dict group.
   */
  @Post('')
  @Middlewares([validate(CreateGroupValidation)])
  @OperationId('admin:dict:group:create')
  @Permissions('admin:dict:group:create')
  @CacheClear({ hashKey: 'dict:group:tree' })
  public async create(@Body() body: IDictGroupCreate): Promise<IResponse<IDictGroup>> {
    const group = await this.dictGroupService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(group);
  }

  /**
   * @summary Update dict group.
   */
  @Put('{id}')
  @Middlewares([validate(UpdateGroupValidation)])
  @OperationId('admin:dict:group:edit')
  @Permissions('admin:dict:group:edit')
  @CacheClear({ hashKey: 'dict:group:tree' })
  public async update(
    @Path() id: string,
    @Body() body: IDictGroupUpdate,
  ): Promise<IResponse<IDictGroup>> {
    const group = await this.dictGroupService.update(id, body);
    this.setStatus(httpStatus.OK);
    return this.response(group);
  }

  /**
   * @summary Delete dict group.
   */
  @Delete('{id}')
  @OperationId('admin:dict:group:delete')
  @Permissions('admin:dict:group:delete')
  @CacheClear({ hashKey: 'dict:group:tree' })
  public async delete(@Path() id: string): Promise<IResponse<void>> {
    await this.dictGroupService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default DictController;
