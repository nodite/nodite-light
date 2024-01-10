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
export const convertMenuToRouter = (
  menu: MenuTree,
  routerView: boolean = true,
): NavigationConfig.Router => {
  const router = {
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
          .chain(lodash.cloneDeep(router))
          .omit('redirect', 'component')
          .set('children', [lodash.set(router, 'path', '')])
          .value()
      : router
  ) as NavigationConfig.Router;
};

/**
 * Convert menu tree to routers.
 * @param menuTree
 * @returns
 */
export const convertTreeToRoute = (
  menuTree?: MenuTree[],
  routerView: boolean = true,
): NavigationConfig.Router[] | undefined => {
  return lodash
    .chain(menuTree)
    .map((menu) => {
      const router = convertMenuToRouter(menu, routerView);

      if (!router.component) {
        delete router.component;
      }

      if (!lodash.isEmpty(menu.children)) {
        router.children = lodash.concat(
          router.children || [],
          convertTreeToRoute(menu.children, routerView) || [],
        );
      }

      if (lodash.isEmpty(router.children)) {
        delete router.children;
      }

      return router;
    })
    .filter()
    .value() as NavigationConfig.Router[];
};
