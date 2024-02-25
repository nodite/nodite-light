import { type DataTree, DataTreeUtil } from '@nodite-light/admin-core';

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
    return group.toJSON();
  }

  /**
   * Create dict group.
   * @param group
   * @returns
   */
  public async create(group: IDictGroupCreate): Promise<IDictGroup> {
    const createdGroup = await DictGroupModel.create({ ...group });
    return createdGroup.toJSON();
  }

  /**
   * Update dict group.
   * @param id
   * @param group
   * @returns
   */
  public async update(id: string, group: IDictGroupUpdate): Promise<IDictGroup> {
    const storedGroup = await DictGroupModel.findOne({ where: { groupId: id } });
    const updatedGroup = await storedGroup.update(group);
    return updatedGroup.toJSON();
  }

  /**
   * Delete dict group.
   * @param id
   */
  public async delete(id: string): Promise<void> {
    const storedGroup = await DictGroupModel.findOne({ where: { groupId: id } });
    await storedGroup.destroy();
  }
}
