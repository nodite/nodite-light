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

import { IUser } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useProfileStore } from '@/stores/modules/profileStore';
import { useUserStore } from '@/stores/modules/userStore';
import PassForm from '@/views/user/components/PassForm.vue';
import UserForm from '@/views/user/components/UserForm.vue';

const userStore = useUserStore();
const profileStore = useProfileStore();

const data = ref({
  loading: true,
  headers: [] as DataTableItemProps['headers'],
  items: [] as any[],
  deleting: false,
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

watchEffect(() => {
  data.value.headers = [
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
  userStore.list().then((res) => {
    data.value.items = res;
    data.value.loading = false;
  });
});

const methods = {
  isSelf(item: IUser) {
    return item.userId === profileStore.profile?.userId;
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
</script>

<template>
  <v-data-table item-value="userId" :headers="data.headers" :items="data.items">
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
        :disabled="item.deleted === 9 || methods.isSelf(item) || data.deleting"
        :loading="data.deleting"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
