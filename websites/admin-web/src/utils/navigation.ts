/*
 * File: nav.ts                                                                *
 * Project: @nodite-light/admin-web                                            *
 * Created Date: Th Dec 2023                                                   *
 * Author: Oscaner Miao                                                        *
 * -----                                                                       *
 * Last Modified: Thu Dec 21 2023                                              *
 * Modified By: Oscaner Miao                                                   *
 * -----                                                                       *
 * Copyright (c) 2023 @nodite                                                  *
 * ----------	---	---------------------------------------------------------    *
 */

import lodash from 'lodash';

import { MenuTree } from '@/api/admin/data-contracts';
import { NavigationConfig } from '@/types/config';

// load all views.
const views = import.meta.glob('@/views/**/*.vue');

/**
 * Load component.
 * @param component
 * @returns
 */
export const loadComponent = (component: string) => {
  const importView = lodash.find(views, (value, key) => {
    return key.endsWith(`views/${component}.vue`);
  });
  return importView ? () => importView() : undefined;
};

/**
 * Convert menu to router.
 * @param menu
 * @returns
 */
export const convertMenuToRouter = (menu: MenuTree): NavigationConfig.Router => {
  return {
    path: menu.path,
    redirect: menu.redirect || undefined,
    component: loadComponent(menu.component),
    meta: {
      icon: menu.icon || '',
      iKey: menu.iKey || '',
      iType: menu.iType as NavigationConfig.MenuType,
      parentId: menu.parentId || 0,
      disabled: false, // lodash.toInteger(menu.status) === 0, // not need to disable menu.
      hidden: Boolean(menu.hidden),
      layout: menu.layout || 'ui',
      title: menu.menuName,
      level: menu.level || 0,
    },
  } as NavigationConfig.Router;
};

/**
 * Convert menu tree to routers.
 * @param menuTree
 * @returns
 */
export const convertMenuTreeToRouter = (
  menuTree?: MenuTree[],
): NavigationConfig.Router[] | undefined => {
  return lodash.map(menuTree, (menu) => {
    const router = convertMenuToRouter(menu);

    if (!router.component) {
      delete router.component;
    }

    if (menu.children && menu.children.length > 0) {
      router.children = convertMenuTreeToRouter(menu.children);
    } else {
      delete router.children;
    }

    return router;
  });
};
