import lodash from 'lodash';
import { arrayToTree } from 'performant-array-to-tree';

import { BuildOptions, DataTree } from '@/interfaces/dataTree';

/**
 * Set tree level.
 * @param tree
 * @param level
 * @returns
 */
export function setLevel<T>(tree: DataTree<T>[], level: number = 0): DataTree<T>[] {
  return tree.map((m) => {
    // eslint-disable-next-line no-param-reassign
    m.level = level;
    if (m.children) setLevel(m.children, level + 1);
    return m;
  });
}

/**
 * Build tree.
 * @param items
 * @param options
 * @returns
 */
export function buildTree<T>(items: T[], options: BuildOptions): DataTree<T>[] {
  const idKey = options.idKey || 'id';
  const pidKey = options.pidKey || 'parentId';

  const tree = arrayToTree(items, {
    id: idKey,
    parentId: pidKey,
    dataField: null,
    rootParentIds: lodash.reduce(
      lodash.difference(lodash.map(items, pidKey), lodash.map(items, idKey)),
      (result, value) => ({ ...result, [value]: true }),
      {},
    ),
    childrenField: 'children',
  }) as DataTree<T>[];

  return setLevel<T>(tree);
}

export default {
  buildTree,
  setLevel,
};
