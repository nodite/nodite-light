import { AppError } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
import httpStatus from 'http-status';
import lodash from 'lodash';

import { IDictItemCreate, IDictItemUpdate } from '@/components/dict/dict.interface';
import DictItemModel, { IDictItem } from '@/components/dict/dict_item.model';
import { QueryParams } from '@/interfaces';

/**
 * Class DictItemService.
 */
export default class DictItemService {
  /**
   * Select dict items.
   * @param dictType
   * @returns
   */
  public async selectDictItemList(params?: QueryParams): Promise<SequelizePagination<IDictItem>> {
    return DictItemModel.paginate({
      where: DictItemModel.buildQueryWhere(params),
      ...lodash.pick(params, ['itemsPerPage', 'page']),
      order: [
        ['orderNum', 'ASC'],
        ['itemId', 'ASC'],
      ],
    });
  }

  /**
   * Select dict item by id.
   * @param id
   * @returns
   */
  public async selectDictItemById(id: number): Promise<IDictItem> {
    const dictItem = await DictItemModel.findOne({ where: { itemId: id } });
    if (!dictItem) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Dict Item not found');
    }
    return dictItem.toJSON();
  }

  /**
   * Create dict item.
   * @param dictItem
   * @returns
   */
  public async create(dictItem: IDictItemCreate): Promise<IDictItem> {
    return DictItemModel.create(dictItem);
  }

  /**
   * Update dict item.
   * @param id
   * @param body
   * @returns
   */
  public async update(id: number, body: IDictItemUpdate): Promise<IDictItem> {
    const preDictItem = await DictItemModel.findOne({ where: { itemId: id } });
    if (!preDictItem) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Dict Item not found');
    }
    const dictItem = await preDictItem.update(body);
    return dictItem.toJSON();
  }

  /**
   * Delete dict item.
   * @param id
   */
  public async delete(id: number): Promise<void> {
    const dictItem = await DictItemModel.findOne({ where: { itemId: id } });
    if (!dictItem) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Dict Item not found');
    }
    await dictItem.destroy();
  }
}
