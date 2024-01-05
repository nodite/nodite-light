<!--
* Component: ListPage.vue
* Project: @nodite-light/admin-web
* Created Date: Su Dec 2023
* Author: Oscaner Miao
-----
* Last Modified: Sun Dec 31 2023
* Modified By: Oscaner Miao
-----
* Copyright (c) 2023 @nodite
-->

<script setup lang="ts">
import {
  ItemsPerPageOption,
  VDataTablePagination,
} from '@nodite-light/vuetify-data-table-pagination';
import { VDeleteConfirmForm } from '@nodite-light/vuetify-delete-confirm-form';
import { DataTableItemProps } from '@nodite-light/vuetify-tree-data-table';

import { IUser, QueryParams, SequelizePaginationIUser } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useProfileStore } from '@/stores/modules/profileStore';
import { useUserStore } from '@/stores/modules/userStore';
import PassForm from '@/views/user/components/PassForm.vue';
import UserForm from '@/views/user/components/UserForm.vue';

const userStore = useUserStore();
const profileStore = useProfileStore();

const staticData = ref({
  itemsPerPageOptions: [] as ItemsPerPageOption[],
  headers: [] as DataTableItemProps['headers'],
  status: [] as { title: string; value: number }[],
});

const localData = ref({
  loading: true,
  searching: false,
  searchResetting: false,
  pageResult: {} as SequelizePaginationIUser,
  items: [] as IUser[],
});

const queryParams = ref({
  page: 1,
  itemsPerPage: 10,
  username: undefined,
  nickname: undefined,
  email: undefined,
  status: undefined,
} as QueryParams);

const userFormData = ref({
  dialog: false,
  userId: 0,
});

const passFormData = ref({
  dialog: false,
  username: '',
  userId: 0,
});

const deleteConfirmFormData = ref({
  dialog: false,
  item: {} as IUser,
});

const methods = {
  async getList(showLoading: boolean = false) {
    if (showLoading) localData.value.loading = true;

    localData.value.pageResult =
      (await userStore.list(queryParams.value)) || ({} as SequelizePaginationIUser);

    localData.value.loading = false;
  },
  isSelf(item: IUser) {
    return item.userId === profileStore.profile?.userId;
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
  openUserForm(id: number) {
    userFormData.value.dialog = true;
    userFormData.value.userId = id;
  },
  closeUserForm() {
    userFormData.value.dialog = false;
    userFormData.value.userId = 0;
  },
  openPassForm(username: string, id: number) {
    passFormData.value.dialog = true;
    passFormData.value.username = username;
    passFormData.value.userId = id;
  },
  closePassForm() {
    passFormData.value.dialog = false;
    passFormData.value.username = '';
    passFormData.value.userId = 0;
  },
  openDeleteConfirmForm(item: IUser) {
    deleteConfirmFormData.value.dialog = true;
    deleteConfirmFormData.value.item = item;
  },
  closeDeleteConfirmForm() {
    deleteConfirmFormData.value.dialog = false;
    deleteConfirmFormData.value.item = {} as IUser;
  },
  async opUserStatus(id: number, status: number) {
    await userStore.edit({ userId: id, status: status } as IUser);
  },
  async delete(item: IUser, cb: () => void) {
    await userStore.delete(item.userId);
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
    { title: i18n.global.t('views.user.headers.userId'), value: 'userId' },
    { title: i18n.global.t('views.user.headers.username'), value: 'username' },
    { title: i18n.global.t('views.user.headers.nickname'), value: 'nickname' },
    { title: i18n.global.t('views.user.headers.email'), value: 'email' },
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
            :label="$t('views.user.form.username')"
            v-model="queryParams.username"
            variant="outlined"
            hide-details
            hide-spin-buttons
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$t('views.user.form.nickname')"
            v-model="queryParams.nickname"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$t('views.user.form.email')"
            v-model="queryParams.email"
            variant="outlined"
            hide-details
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
    item-value="userId"
    :headers="staticData.headers"
    :items="localData.pageResult.items"
  >
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <user-form
          :dialog="userFormData.dialog"
          :user-id="userFormData.userId"
          @close="methods.closeUserForm"
          @save="methods.getList()"
        ></user-form>
        <pass-form
          :dialog="passFormData.dialog"
          :username="passFormData.username"
          :user-id="passFormData.userId"
          @close="methods.closePassForm"
          @save="methods.getList()"
        ></pass-form>
      </v-toolbar>
    </template>

    <template v-slot:item.status="{ item }">
      <!-- status -->
      <v-switch
        v-model="item.status"
        color="success"
        :true-value="1"
        :false-value="0"
        @change="methods.opUserStatus(item.userId, Number(item.status))"
        :disabled="item.userId == 1 || methods.isSelf(item)"
        hide-details
      ></v-switch>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        class="px-0"
        variant="text"
        @click="methods.openUserForm(item.userId)"
        min-width="calc(var(--v-btn-height) + 0px)"
      >
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>

      <v-btn
        class="px-0"
        variant="text"
        @click="methods.openPassForm(item.username, item.userId)"
        min-width="calc(var(--v-btn-height) + 0px)"
      >
        <v-icon>mdi-lock-reset</v-icon>
      </v-btn>

      <v-btn
        class="px-0"
        color="red"
        variant="text"
        @click="methods.openDeleteConfirmForm(item)"
        min-width="calc(var(--v-btn-height) + 0px)"
        :disabled="item.deleted === 9 || methods.isSelf(item)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
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
</template>

<style scoped lang="css"></style>
