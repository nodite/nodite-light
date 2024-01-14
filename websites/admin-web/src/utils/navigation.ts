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

/**
 * Load component.
 * @param component
 * @returns
 */
export const loadComponent = (component: string) => {
  const importView = lodash.find(import.meta.glob('@/views/**/*.vue'), (value, key) => {
    return key.endsWith(`views/${component}.vue`);
  });
  return importView ? () => importView() : undefined;
};

/**
 * Convert menu to route.
 * @param menu
 * @returns
 */
export const convertMenuItemToRoute = (
  menu: MenuTree,
  routerView: boolean = true,
): NavigationConfig.Router => {
  const route = {
    path: menu.path,
    redirect: menu.redirect || undefined,
    component: routerView ? loadComponent(menu.component) : undefined,
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

  return (
    routerView
      ? lodash
          .chain(lodash.cloneDeep(route))
          .omit('redirect', 'component')
          .set('children', [lodash.set(route, 'path', '')])
          .value()
      : route
  ) as NavigationConfig.Router;
};

/**
 * Convert menu tree to routes.
 * @param menuTree
 * @returns
 */
export const convertMenuTreeToRoutes = (
  menuTree?: MenuTree[],
  routerView: boolean = true,
): NavigationConfig.Router[] | undefined => {
  return lodash
    .chain(menuTree)
    .map((menu) => {
      const route = convertMenuItemToRoute(menu, routerView);

      if (!route.component) {
        delete route.component;
      }

      if (!lodash.isEmpty(menu.children)) {
        route.children = lodash.concat(
          route.children || [],
          convertMenuTreeToRoutes(menu.children, routerView) || [],
        );
      }

      if (lodash.isEmpty(route.children)) {
        delete route.children;
      }

      return route;
    })
    .filter()
    .value() as NavigationConfig.Router[];
};
