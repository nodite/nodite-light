/*
 * File: menu.ts                                                               *
 * Project: @nodite-light/admin-web                                            *
 * Created Date: We Dec 2023                                                   *
 * Author: Oscaner Miao                                                        *
 * -----                                                                       *
 * Last Modified: Wed Dec 27 2023                                              *
 * Modified By: Oscaner Miao                                                   *
 * -----                                                                       *
 * Copyright (c) 2023 @nodite                                                  *
 * ----------	---	---------------------------------------------------------    *
 */

import { IMenu } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { NavigationConfig } from '@/types/config';

export const toI18Title = (meta: NavigationConfig.Menu['meta']): string | undefined => {
  return meta?.iKey && i18n.global.te(meta.iKey) ? i18n.global.t(meta.iKey) : meta?.title;
};

export const toI18TitleWithMenu = (menu: IMenu): string | undefined => {
  return toI18Title({ iKey: menu.iKey, title: menu.menuName });
};
