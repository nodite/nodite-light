<!--
* Component: ListPage.vue
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
import type { DataTableItemProps } from '@nodite-light/vuetify-tree-data-table';
import lodash from 'lodash';

import { IMenu, MenuTree } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useMenuStore } from '@/stores/modules/menuStore';
import * as menuUtil from '@/utils/menu';
import MenuForm from '@/views/menu/components/MenuForm.vue';

const menuStore = useMenuStore();

const talbeProps = {
  itemValue: 'menuId',
  selectDtrategy: 'all',
  itemsPerPage: -1,
  itemsPerPageOptions: [-1],
  showExpand: true,
} as DataTableItemProps;

const data = ref({
  loading: true,
  headers: [] as DataTableItemProps['headers'],
  items: [] as MenuTree[],
});

const menuFormData = ref({
  dialog: false,
  item: undefined as IMenu | undefined,
});

watchEffect(() => {
  data.value.headers = [
    {
      title: '',
      align: 'start',
      key: 'data-table-expand',
    },
    {
      title: i18n.global.t('views.menu.headers.menuName'),
      value: 'menuName',
    },
    {
      title: i18n.global.t('views.menu.headers.orderNum'),
      value: 'orderNum',
    },
    {
      title: i18n.global.t('views.menu.headers.path'),
      value: 'path',
    },
    {
      title: i18n.global.t('views.menu.headers.iType'),
      value: 'iType',
    },
    {
      title: i18n.global.t('views.menu.headers.hidden'),
      value: 'hidden',
    },
    {
      title: i18n.global.t('views.menu.headers.perms'),
      value: 'perms',
    },
    {
      key: 'actions',
      sortable: false,
    },
  ];
  menuStore.getMenuTree().then((res) => {
    data.value.loading = false;
    data.value.items = res;
  });
});

const methods = {
  closeMenuForm() {
    menuFormData.value.dialog = false;
    menuFormData.value.item = undefined;
  },
  openMenuForm(menu: IMenu) {
    menuFormData.value.dialog = true;
    menuFormData.value.item = lodash.cloneDeep(menu);
    // menuStore.editMenu(menu);
  },
  deleteMenu(menu: IMenu) {
    console.log('delete');
    // menuStore.deleteMenu(menu);
  },
};
</script>

<template>
  <v-tree-data-table
    :tree="{ ...talbeProps, loading: data.loading, headers: data.headers, items: data.items }"
    :offset-columns="['data-table-expand', 'menuName']"
  >
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <menu-form
          :dialog="menuFormData.dialog"
          :item="menuFormData.item"
          @close-menu-form="methods.closeMenuForm"
        />
      </v-toolbar>
    </template>
    <template v-slot:item.menuName="{ item }">
      {{ menuUtil.toI18TitleWithMenu(item) }}
    </template>

    <template v-slot:item.iType="{ value }">
      {{ $t(`views.menu.type.${value}`) }}
    </template>

    <template v-slot:item.path="{ value }">
      <router-link v-if="!!value" class="text" :to="value">{{ value }}</router-link>
      <span v-else>-</span>
    </template>

    <template v-slot:item.hidden="{ value }">
      <v-chip size="small" :color="value ? 'red' : 'green'">
        {{ value ? $t('common.visibility.hidden') : $t('common.visibility.show') }}
      </v-chip>
    </template>

    <template v-slot:item.perms="{ value }">
      {{ value || '-' }}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        class="px-0"
        variant="text"
        @click="methods.openMenuForm(item)"
        min-width="calc(var(--v-btn-height) + 0px)"
      >
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>

      <v-btn
        class="px-0"
        color="red"
        variant="text"
        @click="methods.deleteMenu(item)"
        :disabled="item.deleted === 9"
        min-width="calc(var(--v-btn-height) + 0px)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>

    <template v-slot:bottom></template>
  </v-tree-data-table>
</template>

<style scoped lang="scss">
.text {
  cursor: pointer;
  display: inline-block;
  border-bottom: 1px dashed;
}
.v-data-table :deep(.v-data-table__td) {
  white-space: nowrap;
}
</style>
