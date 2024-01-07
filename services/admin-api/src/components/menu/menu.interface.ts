import { IMenu } from '@/components/menu/menu.model';

export const MenuType = ['overline', 'directory', 'menu', 'action'];

/**
 * Type MenuTree.
 */
export type MenuTree = IMenu & { level?: number; children?: MenuTree[] };
