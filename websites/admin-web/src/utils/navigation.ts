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

import { DataTreeIMenu } from '@/api/admin/data-contracts';
import { useMenuStore } from '@/stores/modules/menuStore';
import { useNavStore } from '@/stores/modules/navStore';
import { NavigationConfig } from '@/types/config';

const views = import.meta.glob('@/views/**/*.vue');

/**
 * Load component.
 * @param component
 * @returns
 */
export function loadComponent(component: string) {
  const importView = lodash.find(views, (value, key) => {
    return key.endsWith(`views/${component}.vue`);
  });
  return importView ? () => importView() : undefined;
}

/**
 * Convert menu to route.
 * @param menu
 * @returns
 */
export function convertMenuItemToRoute(
  menu: DataTreeIMenu,
  routerView: boolean = true,
): NavigationConfig.Router {
  const route = {
    path: menu.path,
    redirect: menu.redirect || undefined,
    component: routerView ? loadComponent(menu.component) : undefined,
    meta: {
      icon: menu.icon || '',
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
}

/**
 * Convert menu tree to routes.
 * @param menuTree
 * @returns
 */
export function convertMenuTreeToRoutes(
  menuTree?: DataTreeIMenu[],
  routerView: boolean = true,
): NavigationConfig.Router[] | undefined {
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
}

/**
 * Filter sidebar.
 * @param routes
 * @returns
 */
export function filterSidebar(routes?: NavigationConfig.Router[]): NavigationConfig.Router[] {
  return lodash
    .chain(routes || [])
    .map((route) => {
      if (route.meta?.disabled) return null; // remove disabled menu.
      if (route.meta?.hidden) return null; // remove hidden menu.
      route.children = filterSidebar(route.children);
      return route;
    })
    .filter()
    .value() as NavigationConfig.Router[];
}

/**
 * Get routes
 * @returns
 */
export async function getRoutes(): Promise<NavigationConfig.Router[]> {
  const navStore = useNavStore();

  if (!navStore.routesLoaded) {
    navStore.routes = convertMenuTreeToRoutes(await useMenuStore().listTree(), true) || [];
    navStore.routesLoaded = true;
  }

  return navStore.routes;
}

/**
 * Get sidebar.
 * @returns
 */
export async function getSidebar(): Promise<NavigationConfig.Menu[]> {
  const navStore = useNavStore();

  if (!navStore.sidebarLoaded) {
    const routes = convertMenuTreeToRoutes(await useMenuStore().listTree(), false) || [];

    navStore.sidebar = filterSidebar([...routes]).filter((route) => {
      // remove non-root menu on sidebar root.
      return lodash.toInteger(route.meta?.parentId) === 0;
    });

    navStore.sidebarLoaded = true;
  }

  return navStore.sidebar;
}
