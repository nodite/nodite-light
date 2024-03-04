import { AppError, type DataTree, DataTreeUtil } from '@nodite-light/admin-core';
import httpStatus from 'http-status';

import { IDictGroupCreate, IDictGroupUpdate } from '@/components/dict/dict.interface';
import DictGroupModel, { IDictGroup } from '@/components/dict/dict_group.model';
import lodash from '@/utils/lodash';

/**
 * Class DictGroupService.
 */
export default class DictGroupService {
  /**
   * Select dict group.
   * @returns
   */
  public async selectDictGroupList(): Promise<IDictGroup[]> {
    return lodash.map(
      await DictGroupModel.findAll({
        order: [
          ['orderNum', 'ASC'],
          ['groupId', 'ASC'],
        ],
      }),
      (m) => m.toJSON(),
    );
  }

  /**
   * Select dict group tree.
   * @returns
   */
  public async selectDictGroupTree(): Promise<DataTree<IDictGroup>[]> {
    return DataTreeUtil.buildTree(await this.selectDictGroupList(), {
      idKey: 'groupId',
      pidKey: 'parentId',
    });
  }

  /**
   * Select dict group by id.
   * @param id
   * @returns
   */
  public async selectDictGroupById(id: string): Promise<IDictGroup> {
    const group = await DictGroupModel.findOne({ where: { groupId: id } });
    if (!group) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Dict Group not found');
    }
    return group.toJSON();
  }

  /**
   * Create dict group.
   * @param group
   * @returns
   */
  public async create(group: IDictGroupCreate): Promise<IDictGroup> {
    return DictGroupModel.create(group);
  }

  /**
   * Update dict group.
   * @param id
   * @param body
   * @returns
   */
  public async update(id: string, body: IDictGroupUpdate): Promise<IDictGroup> {
    const preGroup = await DictGroupModel.findOne({ where: { groupId: id } });
    if (!preGroup) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Dict Group not found');
    }
    const group = await preGroup.update(body);
    return group.toJSON();
  }

  /**
   * Delete dict group.
   * @param id
   */
  public async delete(id: string): Promise<void> {
    const group = await DictGroupModel.findOne({ where: { groupId: id } });
    if (!group) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Dict Group not found');
    }
    await group.destroy();
  }
}
