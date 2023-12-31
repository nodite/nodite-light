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

import { IMenu, MenuTree } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useMenuStore } from '@/stores/modules/menuStore';
import { useNavStore } from '@/stores/modules/navStore';
import * as menuUtil from '@/utils/menu';
import MenuForm from '@/views/menu/components/MenuForm.vue';

const menuStore = useMenuStore();
const navStore = useNavStore();

const talbeProps = {
  itemValue: 'menuId',
  selectStrategy: 'all',
  itemsPerPage: -1,
  itemsPerPageOptions: [-1],
  showExpand: true,
} as DataTableItemProps;

const data = ref({
  loading: true,
  headers: [] as DataTableItemProps['headers'],
  items: [] as MenuTree[],
  deleting: false,
});

const menuFormData = ref({
  dialog: false,
  menuId: 0,
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
      title: i18n.global.t('views.menu.headers.i18nName'),
      value: 'iKey',
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
  menuStore.listTree().then((res) => {
    data.value.items = res;
    data.value.loading = false;
  });
});

const methods = {
  closeMenuForm() {
    menuFormData.value.dialog = false;
    menuFormData.value.menuId = 0;
  },
  async cleanMenuStore() {
    await navStore.$reset();
  },
  openMenuForm(id: number) {
    menuFormData.value.dialog = true;
    menuFormData.value.menuId = id;
  },
  async delete(menu: IMenu) {
    // data.value.deleting = true;
    await menuStore.delete(menu.menuId);
    await methods.cleanMenuStore();
    // data.value.deleting = false;
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
          :menu-id="menuFormData.menuId"
          @close-menu-form="methods.closeMenuForm"
          @clean-menu-store="methods.cleanMenuStore"
        />
      </v-toolbar>
    </template>

    <template v-slot:item.menuName="{ item }">
      <v-label>
        {{ item.menuName }}
        <v-icon v-if="!!item.icon" size="small" class="ml-2">{{ item.icon }}</v-icon>
      </v-label>
    </template>

    <template v-slot:item.iKey="{ item }">
      <v-label>{{ menuUtil.toI18TitleWithMenu(item) }}</v-label>
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
        @click="methods.openMenuForm(item.menuId)"
        min-width="calc(var(--v-btn-height) + 0px)"
      >
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>

      <v-btn
        class="px-0"
        color="red"
        variant="text"
        @click="methods.delete(item)"
        min-width="calc(var(--v-btn-height) + 0px)"
        :disabled="item.deleted === 9 || data.deleting"
        :loading="data.deleting"
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
