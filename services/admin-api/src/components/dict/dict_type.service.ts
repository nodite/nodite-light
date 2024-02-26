import { AppError } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
import httpStatus from 'http-status';

import { IDictTypeCreate, IDictTypeUpdate } from '@/components/dict/dict.interface';
import DictTypeModel, { IDictType } from '@/components/dict/dict_type.model';
import { QueryParams } from '@/interfaces';
import lodash from '@/utils/lodash';

/**
 * Class DictTypeService.
 */
export default class DictTypeService {
  /**
   * Search dict types.
   * @param params
   * @returns
   */
  public async selectDictTypeList(params?: QueryParams): Promise<SequelizePagination<IDictType>> {
    const page = await DictTypeModel.paginate({
      where: DictTypeModel.buildQueryWhere(params),
      ...lodash.pick(params, ['itemsPerPage', 'page']),
      order: [
        ['orderNum', 'ASC'],
        ['dictId', 'ASC'],
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
  public async selectDictTypeById(id: string): Promise<IDictType> {
    const dictType = await DictTypeModel.findOne({ where: { dictId: id } });

    if (lodash.isEmpty(dictType)) {
      throw new AppError(httpStatus.NOT_FOUND, 'Dict type not found');
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
   * @param dictType
   * @returns
   */
  public async update(id: string, dictType: IDictTypeUpdate): Promise<IDictType> {
    const storedDictType = await DictTypeModel.findOne({ where: { dictId: id } });
    const updatedDictType = await storedDictType.update(dictType);
    return updatedDictType.toJSON();
  }

  /**
   * Delete dict type.
   * @param id
   * @returns
   */
  public async delete(id: string): Promise<void> {
    const storedDictType = await DictTypeModel.findOne({ where: { dictId: id } });
    await storedDictType.destroy();
  }
}
