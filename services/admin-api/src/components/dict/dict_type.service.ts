import { AppError } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
import httpStatus from 'http-status';
import lodash from 'lodash';
import { Op } from 'sequelize';

import { IDictTypeCreate, IDictTypeUpdate } from '@/components/dict/dict.interface';
import DictItemModel from '@/components/dict/dict_item.model';
import DictTypeModel, { IDictType, IDictTypeWithItems } from '@/components/dict/dict_type.model';
import { QueryParams } from '@/interfaces';

/**
 * Class DictTypeService.
 */
export default class DictTypeService {
  /**
   * Search dict types.
   * @param params
   * @returns
   */
  public async selectDictTypeList(
    params?: QueryParams,
  ): Promise<SequelizePagination<IDictTypeWithItems>> {
    const page = await DictTypeModel.paginate({
      where: DictTypeModel.buildQueryWhere(params),
      ...lodash.pick(params, ['itemsPerPage', 'page']),
      order: [
        ['orderNum', 'ASC'],
        ['dictId', 'ASC'],
      ],
      include: [
        {
          model: DictItemModel,
          required: false,
          attributes: ['itemId'],
          order: [
            ['orderNum', 'ASC'],
            ['itemId', 'ASC'],
          ],
        },
      ],
    });

    return {
      ...page,
      items: page.items.map((i) => i.toJSON()),
    };
  }

  /**
   * Select dict type by id.
   * @param id
   * @returns
   */
  public async selectDictTypeById(id: string): Promise<IDictTypeWithItems> {
    const dictType = await DictTypeModel.findOne({
      where: { [Op.or]: { dictId: id, dictKey: id } },
      include: [
        {
          model: DictItemModel,
          required: false,
          order: [
            ['orderNum', 'ASC'],
            ['itemId', 'ASC'],
          ],
        },
      ],
    });
    if (!dictType) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Dict Type not found');
    }
    return dictType.toJSON();
  }

  /**
   * Create dict type.
   * @param dictType
   * @returns
   */
  public async create(dictType: IDictTypeCreate): Promise<IDictType> {
    return DictTypeModel.create(dictType);
  }

  /**
   * Update dict type.
   * @param id
   * @param body
   * @returns
   */
  public async update(id: string, body: IDictTypeUpdate): Promise<IDictType> {
    const preDictType = await DictTypeModel.findOne({
      where: { [Op.or]: { dictId: id, dictKey: id } },
    });
    if (!preDictType) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Dict Type not found');
    }
    const dictType = await preDictType.update(body);
    return dictType.toJSON();
  }

  /**
   * Delete dict type.
   * @param id
   */
  public async delete(id: string): Promise<void> {
    const dictType = await DictTypeModel.findOne({
      where: { [Op.or]: { dictId: id, dictKey: id } },
    });
    if (!dictType) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Dict Type not found');
    }
    await dictType.destroy();
  }
}
