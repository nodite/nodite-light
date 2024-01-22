import { type DataTree, DataTreeUtil } from '@nodite-light/admin-core';
import lodash from 'lodash';

import DictGroupModel, { IDictGroup } from '@/components/dict/dict_group.model';

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
}
