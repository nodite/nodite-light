<script setup lang="ts">
import { VDataTablePagination } from '@nodite-light/vuetify-data-table-pagination';
import {
  type ConfirmCallback,
  VDeleteConfirmForm,
} from '@nodite-light/vuetify-delete-confirm-form';
import moment from 'moment';

import { IUser, QueryParams, SequelizePaginationIUser } from '@/api/admin/data-contracts';
import { useProfileStore } from '@/stores/modules/profileStore';
import { useUserStore } from '@/stores/modules/userStore';
import PassForm from '@/views/user/components/PassForm.vue';
import UserForm from '@/views/user/components/UserForm.vue';

const userStore = useUserStore();
const profileStore = useProfileStore();
const router = useRouter();

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
  async loadList() {
    localData.value.loading = true;
    localData.value.pageResult =
      (await userStore.list(queryParams.value)) || ({} as SequelizePaginationIUser);
    localData.value.loading = false;
  },
  isSelf(item: IUser) {
    return item.userId === profileStore.profile?.userId;
  },
  setItemsPerPage(v: number) {
    queryParams.value.itemsPerPage = v;
    methods.loadList();
  },
  setPage(v: number) {
    queryParams.value.page = v;
    methods.loadList();
  },
  async searchList() {
    localData.value.searching = true;
    try {
      await methods.loadList();
    } finally {
      localData.value.searching = false;
    }
  },
  async resetSearch() {
    localData.value.searchResetting = true;
    try {
      queryParams.value = {};
      await methods.loadList();
    } finally {
      localData.value.searchResetting = false;
    }
  },
  openUserForm(id: number) {
    userFormData.value.dialog = true;
    userFormData.value.userId = id;
  },
  openPassForm(username: string, id: number) {
    passFormData.value.dialog = true;
    passFormData.value.username = username;
    passFormData.value.userId = id;
  },
  openDeleteConfirmForm(item: IUser) {
    deleteConfirmFormData.value.dialog = true;
    deleteConfirmFormData.value.item = item;
  },
  async openRoleAsgmtPage(item: IUser) {
    await router.push(`/user/${item.userId}/roles`);
  },
  async changeUserStatus(id: number, status: number) {
    await userStore.edit({ userId: id, status: status } as IUser);
  },
  async delete(item: IUser, cb: ConfirmCallback) {
    try {
      await userStore.delete(item.userId);
      await methods.loadList();
      cb(true);
    } catch (error) {
      cb(false);
    }
  },
};

onMounted(() => {
  methods.loadList();
});
</script>

<template>
  <v-card density="compact" class="mb-2 search">
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$ndt('Username')"
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
            :label="$ndt('Nickname')"
            v-model="queryParams.nickname"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$ndt('Email')"
            v-model="queryParams.email"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-select
            density="compact"
            :label="$ndt('Status')"
            v-model="queryParams.status"
            variant="outlined"
            :items="[
              { title: $ndt('Enabled'), value: 1 },
              { title: $ndt('Disabled'), value: 0 },
            ]"
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
          {{ $ndt('Search') }}
        </v-btn>
        <v-btn
          class="align-self-center"
          color="inherit"
          prepend-icon="mdi-sync"
          density="comfortable"
          :loading="localData.searchResetting"
          @click="methods.resetSearch"
        >
          {{ $ndt('Reset') }}
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>

  <v-data-table
    item-value="userId"
    :headers="[
      { title: '', align: 'start', key: 'data-table-select' },
      { title: $ndt('ID'), value: 'userId' },
      { title: $ndt('Username'), value: 'username' },
      { title: $ndt('Nickname'), value: 'nickname' },
      { title: $ndt('Email'), value: 'email' },
      { title: $ndt('Status'), value: 'status' },
      { title: $ndt('Create Time'), value: 'createTime' },
      { key: 'actions', sortable: false },
    ]"
    :items="localData.pageResult.items"
  >
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <UserForm
          v-model:dialog="userFormData.dialog"
          v-model:user-id="userFormData.userId"
          @save="methods.loadList()"
        ></UserForm>
        <PassForm
          v-model:dialog="passFormData.dialog"
          v-model:user-id="passFormData.userId"
          :username="passFormData.username"
          @save="methods.loadList()"
        ></PassForm>
      </v-toolbar>
    </template>

    <template v-slot:item.status="{ item }">
      <!-- status -->
      <v-switch
        v-model="item.status"
        color="success"
        :true-value="1"
        :false-value="0"
        @change="methods.changeUserStatus(item.userId, Number(item.status))"
        :disabled="item.userId == 1 || methods.isSelf(item)"
        hide-details
      ></v-switch>
    </template>

    <template v-slot:item.createTime="{ value }">
      <v-label>{{ moment(value).format('YYYY-MM-DD HH:mm:ss') }}</v-label>
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

      <!-- expand actions -->
      <v-menu transition="scroll-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="px-0"
            variant="text"
            min-width="calc(var(--v-btn-height) + 0px)"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list density="compact">
          <v-list-item>
            <v-btn
              color="primary"
              variant="tonal"
              density="comfortable"
              @click="methods.openRoleAsgmtPage(item)"
              prepend-icon="mdi-checkbox-multiple-marked-outline"
            >
              <v-label>{{ $ndt('Role Asgmt') }}</v-label>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <template v-slot:bottom>
      <VDataTablePagination
        :items-per-page="queryParams.itemsPerPage"
        :items-per-page-options="[
          { value: 10, title: '10' },
          { value: 25, title: '25' },
          { value: 50, title: '50' },
          { value: -1, title: $ndt('$vuetify.dataFooter.itemsPerPageAll') },
        ]"
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
    v-model:dialog="deleteConfirmFormData.dialog"
    v-model:item="deleteConfirmFormData.item"
    @confirm="methods.delete"
  ></VDeleteConfirmForm>
</template>

<style scoped lang="css"></style>
