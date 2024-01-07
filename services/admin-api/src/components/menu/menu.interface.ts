import { IMenu } from '@/components/menu/menu.model';

export const MenuType = ['overline', 'directory', 'menu', 'action'];

export type MenuTree = IMenu & { level?: number; children?: MenuTree[] };
