/*
 * File: VDataTable.ts                                                         *
 * Project: @nodite-light/admin-web                                            *
 * Created Date: Sa Dec 2023                                                   *
 * Author: Oscaner Miao                                                        *
 * -----                                                                       *
 * Last Modified: Sat Dec 23 2023                                              *
 * Modified By: Oscaner Miao                                                   *
 * -----                                                                       *
 * Copyright (c) 2023 @nodite                                                  *
 * ----------	---	---------------------------------------------------------    *
 */

import type { VDataTable } from 'vuetify/components/index.mjs';

export type DataTableItemProps = InstanceType<typeof VDataTable>['$props'];

export type Headers = InstanceType<typeof VDataTable>['$props']['headers'];

export type GroupBy = InstanceType<typeof VDataTable>['$props']['groupBy'];

export type ItemSlot = InstanceType<typeof VDataTable>['$props'];

export interface Item {
  [key: string]: unknown;
  level?: number;
  children?: Item[];
}

export default DataTableItemProps;
