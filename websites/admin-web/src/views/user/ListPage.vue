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
import { DataTableItemProps } from '@nodite-light/vuetify-tree-data-table';

import { IUser, PaginationIUser, QueryParams } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useProfileStore } from '@/stores/modules/profileStore';
import { useUserStore } from '@/stores/modules/userStore';
import PassForm from '@/views/user/components/PassForm.vue';
import UserForm from '@/views/user/components/UserForm.vue';

const userStore = useUserStore();
const profileStore = useProfileStore();

const localData = ref({
  loading: true,
  searching: false,
  searchResetting: false,
  headers: [] as DataTableItemProps['headers'],
  pageResult: {} as PaginationIUser,
  items: [] as IUser[],
  deleting: false,
  status: [] as { title: string; value: number }[],
  queryParams: {
    page: 1,
    itemsPerPage: 25,
    username: undefined,
    nickname: undefined,
    email: undefined,
    status: undefined,
  } as QueryParams,
});

const userFormData = ref({
  dialog: false,
  userId: 0,
});

const passFormData = ref({
  dialog: false,
  username: '',
  userId: 0,
});

const methods = {
  isSelf(item: IUser) {
    return item.userId === profileStore.profile?.userId;
  },
  async getList() {
    localData.value.loading = true;

    localData.value.pageResult =
      (await userStore.list(localData.value.queryParams)) || ({} as PaginationIUser);

    localData.value.loading = false;
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
      await methods.getList();
    } finally {
      localData.value.searchResetting = false;
    }
  },
  async cleanUserStore(isSelf?: boolean) {
    isSelf && (await profileStore.$reset());
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
  async opUserStatus(id: number, status: number) {
    await userStore.edit({ userId: id, status: status } as IUser);
  },
  async delete(item: IUser) {
    // data.value.deleting = true;
    await userStore.delete(item.userId);
    await methods.cleanUserStore(item.userId === profileStore.profile?.userId);
    // data.value.deleting = false;
  },
};

onMounted(() => {
  methods.getList();
});

watchEffect(() => {
  localData.value.status = [
    { title: i18n.global.t('common.status.enabled'), value: 1 },
    { title: i18n.global.t('common.status.disabled'), value: 0 },
  ];

  localData.value.headers = [
    {
      title: '',
      align: 'start',
      key: 'data-table-select',
    },
    {
      title: i18n.global.t('views.user.headers.userId'),
      value: 'userId',
    },
    {
      title: i18n.global.t('views.user.headers.username'),
      value: 'username',
    },
    {
      title: i18n.global.t('views.user.headers.nickname'),
      value: 'nickname',
    },
    {
      title: i18n.global.t('views.user.headers.email'),
      value: 'email',
    },
    {
      title: i18n.global.t('views.user.headers.status'),
      value: 'status',
    },
    {
      key: 'actions',
      sortable: false,
    },
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
            v-model="localData.queryParams.username"
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
            v-model="localData.queryParams.nickname"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$t('views.user.form.email')"
            v-model="localData.queryParams.email"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-select
            density="compact"
            :label="$t('common.form.status')"
            v-model="localData.queryParams.status"
            variant="outlined"
            :items="localData.status"
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
    :headers="localData.headers"
    :items="localData.pageResult.items"
  >
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <user-form
          :dialog="userFormData.dialog"
          :user-id="userFormData.userId"
          @close-user-form="methods.closeUserForm"
          @clean-user-form="methods.cleanUserStore"
        ></user-form>
        <pass-form
          :dialog="passFormData.dialog"
          :username="passFormData.username"
          :user-id="passFormData.userId"
          @close-pass-form="methods.closePassForm"
          @clean-pass-form="methods.cleanUserStore"
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
        @click="methods.opUserStatus(item.userId, Number(!item.status))"
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
        @click="methods.delete(item)"
        min-width="calc(var(--v-btn-height) + 0px)"
        :disabled="item.deleted === 9 || methods.isSelf(item) || localData.deleting"
        :loading="localData.deleting"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>

    <template v-slot:bottom>
      <v-pagination
        v-model="localData.queryParams.page"
        :length="localData.pageResult.totalPage"
        density="comfortable"
        rounded
        show-first-last-page
        variant="plain"
      ></v-pagination>
    </template>
  </v-data-table>
</template>

<style scoped lang="css"></style>
