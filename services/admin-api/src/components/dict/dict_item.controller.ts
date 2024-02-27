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
import { IDictItemCreate, IDictItemUpdate } from '@/components/dict/dict.interface';
import { CreateItemValidation, UpdateItemValidation } from '@/components/dict/dict.validation';
import { IDictItem } from '@/components/dict/dict_item.model';
import DictItemService from '@/components/dict/dict_item.service';
import { QueryParams } from '@/interfaces';

@Route('dict/item')
@Tags('dict')
export class DictItemConroller extends BaseController {
  dictItemService: DictItemService;

  constructor() {
    super();
    this.dictItemService = new DictItemService();
  }

  /**
   * @summary Get all dict items
   */
  @Get('list')
  @OperationId('admin:dict:item:list')
  @Permissions('admin:dict:list')
  public async list(
    @Queries() params?: QueryParams,
  ): Promise<IResponse<SequelizePagination<IDictItem>>> {
    const page = await this.dictItemService.selectDictItemList(params);
    this.setStatus(200);
    return this.response(page);
  }

  /**
   * @summary Get dict item by id
   */
  @Get('{id}')
  @OperationId('admin:dict:item:query')
  @Permissions('admin:dict:query')
  public async query(@Path() id: number): Promise<IResponse<IDictItem>> {
    const dictItem = await this.dictItemService.selectDictItemById(id);
    this.setStatus(200);
    return this.response(dictItem);
  }

  /**
   * @summary Create dict item
   */
  @Post('')
  @Middlewares([validate(CreateItemValidation)])
  @OperationId('admin:dict:item:create')
  @Permissions('admin:dict:item:create')
  public async create(@Body() body: IDictItemCreate): Promise<IResponse<IDictItem>> {
    const dictItem = await this.dictItemService.create(body);
    this.setStatus(httpStatus.CREATED);
    return this.response(dictItem);
  }

  /**
   * @summary Update dict item
   */
  @Put('{id}')
  @Middlewares([validate(UpdateItemValidation)])
  @OperationId('admin:dict:item:edit')
  @Permissions('admin:dict:item:edit')
  public async update(
    @Path() id: number,
    @Body() body: IDictItemUpdate,
  ): Promise<IResponse<IDictItem>> {
    const dictItem = await this.dictItemService.update(id, body);
    this.setStatus(httpStatus.OK);
    return this.response(dictItem);
  }

  /**
   * @summary Delete dict item
   */
  @Delete('{id}')
  @OperationId('admin:dict:item:delete')
  @Permissions('admin:dict:item:delete')
  public async delete(@Path() id: number): Promise<IResponse<void>> {
    await this.dictItemService.delete(id);
    this.setStatus(httpStatus.NO_CONTENT);
    return this.response();
  }
}

export default DictItemConroller;
