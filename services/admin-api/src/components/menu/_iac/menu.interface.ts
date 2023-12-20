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
   * Parent menu ID
   */
  parentId: number;

  /**
   * Menu name
   */
  name: string;

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
   * Menu icon
   */
  icon: string;

  /**
   * Menu hidden
   */
  hidden: boolean;

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
