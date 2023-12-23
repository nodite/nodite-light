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
import { DataTableItemProps } from '../types/VDataTable';
import VTreeDataTableRows from './VTreeDataTableRows.vue';

defineProps({
  tree: {
    type: Object as PropType<DataTableItemProps>,
    required: true,
  },
  offsetColumns: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});
</script>

<template>
  <v-data-table v-bind="$props.tree">
    <template v-for="(_, name) in $slots" v-slot:[name]="data">
      <!-- slots -->
      <slot :name="name" v-bind="data"></slot>
    </template>

    <template v-slot:expanded-row="{ columns, item }">
      <v-tree-data-table-rows
        :level="1"
        :items="item.children || []"
        :columns="columns"
        :item-value="$props.tree.itemValue"
        :offset-columns="$props.offsetColumns"
      >
        <template v-for="(_, name) in $slots" v-slot:[name]="data">
          <!-- slots -->
          <slot :name="name" v-bind="data"></slot>
        </template>
      </v-tree-data-table-rows>
    </template>
  </v-data-table>
</template>
