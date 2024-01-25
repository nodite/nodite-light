import { IMenu } from '@/components/menu/menu.model';

export const MenuType = ['overline', 'directory', 'menu', 'action'];

export type IMenuCreate = Omit<IMenu, 'menuId'>;

export type IMenuUpdate = Omit<IMenu, 'menuId'>;

export default {};
