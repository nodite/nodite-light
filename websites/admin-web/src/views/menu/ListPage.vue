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
import { DeleteConfirmForm } from '@nodite-light/vuetify-delete-confirm-form';
import type { DataTableItemProps } from '@nodite-light/vuetify-tree-data-table';

import { IMenu, MenuTree } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useMenuStore } from '@/stores/modules/menuStore';
import MenuForm from '@/views/menu/components/MenuForm.vue';

const menuStore = useMenuStore();

const staticData = ref({
  headers: [] as DataTableItemProps['headers'],
});

const localData = ref({
  loading: true,
  items: [] as MenuTree[],
});

const menuFormData = ref({
  dialog: false,
  menuId: 0,
});

const deleteConfirmFormData = ref({
  dialog: false,
  item: {} as IMenu,
});

const methods = {
  async getMenuTree(showLoading: boolean = false) {
    if (showLoading) localData.value.loading = true;
    localData.value.items = await menuStore.listTree();
    localData.value.loading = false;
  },
  openMenuForm(id: number) {
    menuFormData.value.dialog = true;
    menuFormData.value.menuId = id;
  },
  closeMenuForm() {
    menuFormData.value.dialog = false;
    menuFormData.value.menuId = 0;
  },
  openDeleteConfirmForm(item: IMenu) {
    deleteConfirmFormData.value.dialog = true;
    deleteConfirmFormData.value.item = item;
  },
  closeDeleteConfirmForm() {
    deleteConfirmFormData.value.dialog = false;
    deleteConfirmFormData.value.item = {} as IMenu;
  },
  async opMenuStatus(id: number, status: number) {
    await menuStore.edit({ menuId: id, status: status } as IMenu);
  },
  async delete(menu: IMenu, cb: () => void) {
    await menuStore.delete(menu.menuId);
    await methods.getMenuTree();
    methods.closeDeleteConfirmForm();
    cb();
  },
};

onMounted(() => {
  methods.getMenuTree();
});

watchEffect(() => {
  // watch i18n.
  staticData.value.headers = [
    { title: '', align: 'start', key: 'data-table-expand' },
    { title: i18n.global.t('views.menu.headers.menuName'), value: 'menuName' },
    { title: i18n.global.t('views.menu.headers.i18nName'), value: 'iKey' },
    { title: i18n.global.t('views.menu.headers.orderNum'), value: 'orderNum' },
    { title: i18n.global.t('views.menu.headers.path'), value: 'path' },
    { title: i18n.global.t('views.menu.headers.iType'), value: 'iType' },
    { title: i18n.global.t('views.menu.headers.hidden'), value: 'hidden' },
    { title: i18n.global.t('views.menu.headers.perms'), value: 'perms' },
    { title: i18n.global.t('common.form.status', ['']), value: 'status' },
    { key: 'actions', sortable: false },
  ];
});
</script>

<template>
  <v-tree-data-table
    :tableProps="{
      itemValue: 'menuId',
      selectStrategy: 'all',
      itemsPerPage: -1,
      itemsPerPageOptions: [-1],
      showExpand: true,
      loading: localData.loading,
      headers: staticData.headers,
      items: localData.items,
    }"
    :offset-columns="['data-table-expand', 'menuName']"
  >
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <menu-form
          :dialog="menuFormData.dialog"
          :menu-id="menuFormData.menuId"
          @close-menu-form="methods.closeMenuForm"
          @saved="methods.getMenuTree()"
        />
        <delete-confirm-form
          :dialog="deleteConfirmFormData.dialog"
          :item="deleteConfirmFormData.item"
          @confirm="methods.delete"
          @cancel="methods.closeDeleteConfirmForm"
        />
      </v-toolbar>
    </template>

    <template v-slot:item.menuName="{ item }">
      <v-label>
        {{ item.menuName }}
        <v-icon v-if="!!item.icon" size="small" class="ml-2">{{ item.icon }}</v-icon>
      </v-label>
    </template>

    <template v-slot:item.iKey="{ value }">
      <v-label>{{ $te(value) ? $t(value) : value }}</v-label>
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

    <template v-slot:item.status="{ item }">
      <!-- status -->
      <v-switch
        v-model="item.status"
        color="success"
        :true-value="1"
        :false-value="0"
        @change="methods.opMenuStatus(item.menuId, item.status)"
        hide-details
      />
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
        @click="methods.openDeleteConfirmForm(item)"
        min-width="calc(var(--v-btn-height) + 0px)"
        :disabled="item.deleted === 9"
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
