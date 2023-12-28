import { IBase } from '@components/base.interface';

export const MenuType = ['overline', 'directory', 'menu', 'action'];

/**
 * Interface IMenu.
 */
export interface IMenu extends IBase {
  /**
   * Menu ID
   */
  menuId: number;

  /**
   * Menu name
   */
  menuName: string;

  /**
   * Parent menu ID
   */
  parentId: number;

  /**
   * Order number
   */
  orderNum: number;

  /**
   * Menu icon
   */
  icon: string;

  /**
   * Menu name i18n key
   */
  iKey: string;

  /**
   * Menu type
   */
  iType: string;

  /**
   * Menu path
   */
  path: string;

  /**
   * Menu redirect
   */
  redirect: string;

  /**
   * Menu component
   */
  component: string;

  /**
   * Menu hidden
   */
  hidden: 0 | 1;

  /**
   * Menu layout
   */
  layout: string;

  /**
   * Menu perms
   */
  perms: string;
}

/**
 * Type MenuTree.
 */
export type MenuTree = IMenu & { children?: MenuTree[] };

export default {};
