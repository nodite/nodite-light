<script setup lang="ts">
import { isEmpty as _isEmpty } from 'lodash';

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
  if (_isEmpty(item.children) && column.key === 'data-table-expand') {
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
    <template v-for="(_, name) in $slots" #[name]="data">
      <!-- slots -->
      <slot :name="name" v-bind="data"></slot>
    </template>

    <template #expanded-row="{ columns, item }">
      <v-tree-data-table-rows
        :level="1"
        :items="item.children || []"
        :columns="columns"
        :item-value="$props.tableProps.itemValue"
        :offset-columns="$props.offsetColumns"
        :cell-props="cellProps"
      >
        <template v-for="(_, name) in $slots" #[name]="data">
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
