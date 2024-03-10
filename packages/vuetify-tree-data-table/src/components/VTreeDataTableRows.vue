<script setup lang="ts">
import { isEmpty as _isEmpty } from 'lodash';
import { useDataTableItems } from 'vuetify/lib/components/VDataTable/composables/items.mjs';

import { DataTableItemProps } from '../types/VDataTable';

const props = defineProps({
  level: {
    type: Number,
    default: 0,
  },
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  itemValue: {
    type: String as PropType<DataTableItemProps['itemValue']>,
    required: true,
  },
  offsetColumns: {
    type: Array,
    default: () => [],
  },
  cellProps: {
    type: Function,
    default: () => ({}),
  },
} as any);

const { items: tableItems } = useDataTableItems(props, { value: props.columns });
</script>

<template>
  <v-data-table-rows v-bind="{ ...$props }" :items="tableItems" :cell-props="cellProps">
    <template v-for="(_, name) in $slots" #[name]="data">
      <!-- slots -->
      <slot :name="name" v-bind="data"></slot>
    </template>

    <template #expanded-row="expandedProps">
      <v-tree-data-table-rows
        v-if="!_isEmpty((expandedProps.item as any)?.children)"
        :level="level + 1"
        :items="(expandedProps.item as any)?.children || []"
        :columns="expandedProps.columns || []"
        :item-value="itemValue"
        :offset-columns="offsetColumns"
        :cell-props="cellProps"
      >
        <template v-for="(_, name) in $slots" #[name]="data">
          <!-- slots -->
          <slot :name="name" v-bind="data"></slot>
        </template>
      </v-tree-data-table-rows>
    </template>
  </v-data-table-rows>
</template>
