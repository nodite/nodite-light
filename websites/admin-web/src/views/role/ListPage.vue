<!--
* Component: ListPage.vue
* Project: @nodite-light/admin-web
* Created Date: Tu Jan 2024
* Author: Oscaner Miao
-----
* Last Modified: Tue Jan 02 2024
* Modified By: Oscaner Miao
-----
* Copyright (c) 2024 @nodite
-->

<script setup lang="ts">
import {
  ItemsPerPageOption,
  VDataTablePagination,
} from '@nodite-light/vuetify-data-table-pagination';
import { VDeleteConfirmForm } from '@nodite-light/vuetify-delete-confirm-form';
import { DataTableItemProps } from '@nodite-light/vuetify-tree-data-table';
import lodash from 'lodash';
import { toast } from 'vuetify-sonner';

import { IRole, QueryParams, SequelizePaginationIRole } from '@/api/admin/data-contracts';
import MenuTreeView from '@/components/treeview/MenuTreeView.vue';
import i18n, { $tnd } from '@/plugins/i18n';
import { useRoleStore } from '@/stores/modules/roleStore';
import RoleForm from '@/views/role/components/RoleForm.vue';

const roleStore = useRoleStore();

const staticData = ref({
  itemsPerPageOptions: [] as ItemsPerPageOption[],
  headers: [] as DataTableItemProps['headers'],
  status: [] as { title: string; value: number }[],
});

const localData = ref({
  loading: true,
  searching: false,
  searchResetting: false,
  pageResult: {} as SequelizePaginationIRole,
  items: [] as IRole[],
});

const queryParams = ref({
  page: 1,
  itemsPerPage: 10,
  roleName: undefined,
  status: undefined,
} as QueryParams);

const roleFormData = ref({
  dialog: false,
  roleId: 0,
});

const deleteConfirmFormData = ref({
  dialog: false,
  item: {} as IRole,
});

const menuPermsView = ref({
  drawer: false,
  item: {} as IRole,
  menuIds: [] as number[],
});

const methods = {
  async getList(showLoading: boolean = true) {
    if (showLoading) localData.value.loading = true;
    localData.value.pageResult =
      (await roleStore.list(queryParams.value)) || ({} as SequelizePaginationIRole);
    localData.value.loading = false;
  },
  setItemsPerPage(v: number) {
    queryParams.value.itemsPerPage = v;
    methods.getList();
  },
  setPage(v: number) {
    queryParams.value.page = v;
    methods.getList();
  },
  async searchList() {
    localData.value.searching = true;
    try {
      await methods.getList();
    } finally {
      localData.value.searching = false;
    }
  },
  async resetSearch() {
    localData.value.searchResetting = true;
    try {
      queryParams.value = {};
      await methods.getList();
    } finally {
      localData.value.searchResetting = false;
    }
  },
  openRoleForm(id: number) {
    roleFormData.value.dialog = true;
    roleFormData.value.roleId = id;
  },
  closeRoleForm() {
    roleFormData.value.dialog = false;
    roleFormData.value.roleId = 0;
  },
  openDeleteConfirmForm(item: IRole) {
    deleteConfirmFormData.value.dialog = true;
    deleteConfirmFormData.value.item = item;
  },
  closeDeleteConfirmForm() {
    deleteConfirmFormData.value.dialog = false;
    deleteConfirmFormData.value.item = {} as IRole;
  },
  async initialMenuPermsView(item: IRole) {
    return lodash.map(await roleStore.listMenuPerms(item.roleId), 'menuId');
  },
  async openMenuPermsView(item: IRole) {
    menuPermsView.value.drawer = true;
    menuPermsView.value.item = item;
    menuPermsView.value.menuIds = lodash.map(await roleStore.listMenuPerms(item.roleId), 'menuId');
  },
  closeMenuPermsView() {
    menuPermsView.value.drawer = false;
    menuPermsView.value.item = {} as IRole;
    menuPermsView.value.menuIds = [];
  },
  async openUserAsgmtPage(item: IRole) {
    toast.warning('Not implemented yet.');
  },
  async saveMenuTreeView(ids: number[], cb: (close: boolean) => void) {
    try {
      roleStore.updateMenuPerms(menuPermsView.value.item.roleId, ids);
      toast.success(i18n.global.t('common.form.success'));
      cb(true);
    } catch (e) {
      cb(false);
    }
  },
  async opRoleStatus(id: number, status: number) {
    await roleStore.edit({ roleId: id, status: status } as IRole);
  },
  async delete(item: IRole, cb: () => void) {
    await roleStore.delete(item.roleId);
    await methods.getList();
    methods.closeDeleteConfirmForm();
    cb();
  },
};

onMounted(() => {
  methods.getList(true);
});

watchEffect(() => {
  // watch i18n.
  staticData.value.itemsPerPageOptions = [
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
    { value: -1, title: i18n.global.t('$vuetify.dataFooter.itemsPerPageAll') },
  ];
  staticData.value.headers = [
    { title: '', align: 'start', key: 'data-table-select' },
    { title: i18n.global.t('views.role.headers.roleId'), value: 'roleId' },
    { title: i18n.global.t('views.role.headers.roleName'), value: 'roleName' },
    { title: i18n.global.t('views.role.headers.i18nName'), value: 'iKey' },
    { title: i18n.global.t('views.role.headers.roleKey'), value: 'roleKey' },
    { title: i18n.global.t('views.role.headers.orderNum'), value: 'orderNum' },
    { title: i18n.global.t('common.form.status', ['']), value: 'status' },
    { key: 'actions', sortable: false },
  ];
  staticData.value.status = [
    { title: i18n.global.t('common.status.enabled'), value: 1 },
    { title: i18n.global.t('common.status.disabled'), value: 0 },
  ];
});
</script>

<template>
  <v-card density="compact" class="mb-2 search">
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$t('views.role.form.roleName')"
            v-model="queryParams.roleName"
            variant="outlined"
            hide-details
            hide-spin-buttons
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-select
            density="compact"
            :label="$t('common.form.status')"
            v-model="queryParams.status"
            variant="outlined"
            :items="staticData.status"
            item-title="title"
            item-value="value"
            hide-details
            clearable
          >
            <template v-slot:chip="{ item }">
              <v-chip density="comfortable">{{ item.title }}</v-chip>
            </template>
          </v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-2 align-self-center"
          color="primary"
          prepend-icon="mdi-magnify"
          density="comfortable"
          :loading="localData.searching"
          @click="methods.searchList"
        >
          {{ $t('common.form.search') }}
        </v-btn>
        <v-btn
          class="align-self-center"
          color="inherit"
          prepend-icon="mdi-sync"
          density="comfortable"
          :loading="localData.searchResetting"
          @click="methods.resetSearch"
        >
          {{ $t('common.form.reset') }}
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>

  <v-data-table
    item-value="roleId"
    :headers="staticData.headers"
    :items="localData.pageResult.items"
  >
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <role-form
          :dialog="roleFormData.dialog"
          :role-id="roleFormData.roleId"
          @close="methods.closeRoleForm"
          @save="methods.getList()"
        />
      </v-toolbar>
    </template>

    <template v-slot:item.iKey="{ value }">
      <v-label>{{ $te(value) ? $t(value) : value }}</v-label>
    </template>

    <template v-slot:item.status="{ item }">
      <!-- status -->
      <v-switch
        v-model="item.status"
        color="success"
        :true-value="1"
        :false-value="0"
        @change="methods.opRoleStatus(item.roleId, Number(item.status))"
        :disabled="item.roleId == 1"
        hide-details
      ></v-switch>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        class="px-0"
        variant="text"
        @click="methods.openRoleForm(item.roleId)"
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
        :disabled="item.deleted == 9 || item.roleId == 1"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-menu transition="scroll-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="px-0"
            variant="text"
            min-width="calc(var(--v-btn-height) + 0px)"
          >
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list density="compact">
          <v-list-item>
            <v-btn
              color="primary"
              variant="tonal"
              density="comfortable"
              @click="methods.openMenuPermsView(item)"
              :disabled="item.roleId == 1"
              prepend-icon="mdi-eye"
            >
              <v-label>{{ $t('views.role.form.menuPerms') }}</v-label>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
              color="primary"
              variant="tonal"
              density="comfortable"
              @click="methods.openUserAsgmtPage(item)"
              prepend-icon="mdi-checkbox-multiple-marked-outline"
            >
              <v-label>{{ $t('views.role.user_asgmt.title') }}</v-label>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <template v-slot:bottom>
      <VDataTablePagination
        :items-per-page="queryParams.itemsPerPage"
        :items-per-page-options="staticData.itemsPerPageOptions"
        :page="queryParams.page"
        :current-count="localData.pageResult.count"
        :total-count="localData.pageResult.totalCount"
        :total-page="localData.pageResult.totalPage"
        @update-items-per-page="methods.setItemsPerPage"
        @update-page="methods.setPage"
      ></VDataTablePagination>
    </template>
  </v-data-table>

  <!-- delete confirm -->
  <VDeleteConfirmForm
    :dialog="deleteConfirmFormData.dialog"
    :item="deleteConfirmFormData.item"
    @confirm="methods.delete"
    @cancel="methods.closeDeleteConfirmForm"
  ></VDeleteConfirmForm>

  <!-- menu perms -->
  <MenuTreeView
    :label="`${$t('views.role.form.menuPerms')} (${$tnd(
      menuPermsView.item.iKey,
      menuPermsView.item.roleName,
    )})`"
    :drawer="menuPermsView.drawer"
    :init-method="methods.initialMenuPermsView"
    :init-method-param="menuPermsView.item"
    @close="methods.closeMenuPermsView"
    @save="methods.saveMenuTreeView"
    checkboxes
  ></MenuTreeView>
</template>
