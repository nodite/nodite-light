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
import i18n from '@/plugins/i18n';
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
 * Convert menu tree to routers.
 * @param menuTree
 * @returns
 */
export const convertMenuTreeToRouter = (
  menuTree?: MenuTree[],
): NavigationConfig.Router[] | undefined => {
  return lodash.map(menuTree, (menu) => {
    const router = {
      path: menu.path,
      redirect: menu.redirect || undefined,
      component: loadComponent(menu.component),
      meta: {
        icon: menu.icon || undefined,
        iKey: menu.iKey || undefined,
        iType: menu.iType as NavigationConfig.MenuType,
        parentId: menu.parentId || undefined,
        disabled: menu.status === 0,
        hidden: menu.hidden,
        layout: menu.layout,
        title: menu.menuName,
      },
    } as NavigationConfig.Router;

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

export const toi18Title = (router: NavigationConfig.Router): string | undefined => {
  return router.meta?.iKey && i18n.global.te(router.meta.iKey)
    ? i18n.global.t(router.meta.iKey)
    : router.meta?.title;
};
