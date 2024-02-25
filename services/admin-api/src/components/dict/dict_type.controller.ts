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
import { IDictTypeCreate, IDictTypeUpdate } from '@/components/dict/dict.interface';
import { CreateTypeValidation, UpdateTypeValidation } from '@/components/dict/dict.validation';
import { IDictType } from '@/components/dict/dict_type.model';
import DictTypeService from '@/components/dict/dict_type.service';
import { QueryParams } from '@/interfaces';

@Route('dict/type')
@Tags('dict')
export class DictTypeController extends BaseController {
  dictTypeService: DictTypeService;

  constructor() {
    super();
    this.dictTypeService = new DictTypeService();
  }

  /**
   * @summary Get all dict types
   */
  @Get('list')
  @OperationId('admin:dict:type:list')
  @Permissions('admin:dict:list')
  public async list(
    @Queries() params?: QueryParams,
  ): Promise<IResponse<SequelizePagination<IDictType>>> {
    const page = await this.dictTypeService.selectDictTypeList(params);
    this.setStatus(200);
    return this.response(page);
  }

  /**
   * @summary Get dict type by id
   */
  @Get('{id}')
  @OperationId('admin:dict:type:query')
  @Permissions('admin:dict:query')
  public async query(@Path() id: string): Promise<IResponse<IDictType>> {
    const dictType = await this.dictTypeService.selectDictTypeById(id);
    this.setStatus(200);
    return this.response(dictType);
  }

  /**
   * @summary Create dict type
   */
  @Post('')
  @Middlewares([validate(CreateTypeValidation)])
  @OperationId('admin:dict:type:create')
  @Permissions('admin:dict:type:create')
  public async create(@Body() body: IDictTypeCreate): Promise<IResponse<IDictType>> {
    const dictType = await this.dictTypeService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(dictType);
  }

  /**
   * @summary Update dict type
   */
  @Put('{id}')
  @Middlewares([validate(UpdateTypeValidation)])
  @OperationId('admin:dict:type:edit')
  @Permissions('admin:dict:type:edit')
  public async update(
    @Path() id: string,
    @Body() body: IDictTypeUpdate,
  ): Promise<IResponse<IDictType>> {
    const dictType = await this.dictTypeService.update(id, body);
    this.setStatus(httpStatus.OK);
    return this.response(dictType);
  }

  /**
   * @summary Delete dict type
   */
  @Delete('{id}')
  @OperationId('admin:dict:type:delete')
  @Permissions('admin:dict:type:delete')
  public async delete(@Path() id: string): Promise<IResponse<void>> {
    await this.dictTypeService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default DictTypeController;
