import { Permissions } from '@nodite-light/admin-auth';
import { type DataTree, IResponse } from '@nodite-light/admin-core';
import { Cacheable } from '@nodite-light/admin-database';
import httpStatus from 'http-status';
import { Get, OperationId, Route, Tags } from 'tsoa';

import BaseController from '@/components/base.controller';
import { IDictGroup } from '@/components/dict/dict_group.model';
import DictGroupService from '@/components/dict/dict_group.service';

@Route('dict/group')
@Tags('dict')
export class DictGroupController extends BaseController {
  dictGroupService: DictGroupService;

  constructor() {
    super();
    this.dictGroupService = new DictGroupService();
  }

  /**
   * @summary List dict groups.
   */
  @Get('/list')
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
  @Get('/tree')
  @OperationId('admin:dict:group:tree')
  @Permissions('admin:dict:list')
  @Cacheable({ hashKey: 'dict:group:tree' })
  public async listTree(): Promise<IResponse<DataTree<IDictGroup>[]>> {
    const tree = await this.dictGroupService.selectDictGroupTree();
    this.setStatus(httpStatus.OK);
    return this.response(tree);
  }
}

export default DictGroupController;
