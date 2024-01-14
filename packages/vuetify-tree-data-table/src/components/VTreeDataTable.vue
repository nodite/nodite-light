<!--
* Component: VTreeDataTable.vue
* Project: @nodite-light/admin-web
* Created Date: Su Dec 2023
* Author: Oscaner Miao
-----
* Last Modified: Sun Dec 24 2023
* Modified By: Oscaner Miao
-----
* Copyright (c) 2023 @nodite
-->
<script setup lang="ts">
import lodash from 'lodash';

import { DataTableItemProps, Item } from '../types/VDataTable';
import VTreeDataTableRows from './VTreeDataTableRows.vue';

defineProps({
  tableProps: {
    type: Object as PropType<DataTableItemProps>,
    required: true,
  },
  offsetColumns: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const cellProps = ({ item, column }: { item: Item; column: { key: string } }) => {
  if (lodash.isEmpty(item.children) && column.key === 'data-table-expand') {
    return { class: 'd-none-children' };
  } else if (['data-table-expand', 'data-table-select'].includes(column.key)) {
    return {
      class: `pl-${1 * (Number(item.level) + 1)}`,
    };
  }
  return {};
};
</script>

<template>
  <v-data-table v-bind="$props.tableProps" :cell-props="cellProps">
    <template v-for="(_, name) in $slots" v-slot:[name]="data">
      <!-- slots -->
      <slot :name="name" v-bind="data"></slot>
    </template>

    <template v-slot:expanded-row="{ columns, item }">
      <v-tree-data-table-rows
        :level="1"
        :items="item.children || []"
        :columns="columns"
        :item-value="$props.tableProps.itemValue"
        :offset-columns="$props.offsetColumns"
        :cell-props="cellProps"
      >
        <template v-for="(_, name) in $slots" v-slot:[name]="data">
          <!-- slots -->
          <slot :name="name" v-bind="data"></slot>
        </template>
      </v-tree-data-table-rows>
    </template>
  </v-data-table>
</template>

<style scoped lang="css">
.v-data-table :deep(.d-none-children) > * {
  display: none !important;
}
.v-data-table :deep(.v-data-table-rows-no-data) {
  display: none !important;
}
</style>
