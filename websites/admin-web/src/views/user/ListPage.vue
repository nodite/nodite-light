<script setup lang="ts">
import { VDataTablePagination } from '@nodite-light/vuetify-data-table-pagination';
import moment from 'moment';

import { IUser, SequelizePaginationIUser } from '@/api/admin/data-contracts';
import DictElement from '@/components/form/DictElement.vue';
import i18n from '@/plugins/i18n';
import { useProfileStore } from '@/stores/modules/profileStore';
import { useUserStore } from '@/stores/modules/userStore';
import dialogs from '@/utils/dialogs';
import PassForm from '@/views/user/components/PassForm.vue';
import UserForm from '@/views/user/components/UserForm.vue';

const userStore = useUserStore();
const profileStore = useProfileStore();
const router = useRouter();

interface QueryParams {
  username?: string;
  nickname?: string;
  email?: string;
  status?: 0 | 1;
}

// Local data.
const myRefStore = ref({
  loading: true,

  pageResult: {} as SequelizePaginationIUser,
  items: [] as IUser[],

  page: 1,
  itemsPerPage: 10,
});

// Query params.
const queryParamPage = computed({
  get: () => myRefStore.value.page || 1,
  set: (v: number) => {
    myRefStore.value.page = v;
    methods.loadList();
  },
});

const queryParamItemsPerPage = computed({
  get: () => myRefStore.value.itemsPerPage || 10,
  set: (v: number) => {
    myRefStore.value.itemsPerPage = v;
    methods.loadList();
  },
});

const queryParams = ref({
  username: undefined,
  nickname: undefined,
  email: undefined,
  status: undefined,
} as QueryParams);

// User form.
const userFormData = ref({
  dialog: false,
  userId: 0,
});

// Pass form.
const passFormData = ref({
  dialog: false,
  username: '',
  userId: 0,
});

// Methods.
const methods = {
  // Load list.
  async loadList() {
    myRefStore.value.loading = true;

    const pageResult = await userStore.list({
      page: queryParamPage.value,
      itemsPerPage: queryParamItemsPerPage.value,
      ...queryParams.value,
    });

    myRefStore.value.pageResult = pageResult || ({} as SequelizePaginationIUser);

    myRefStore.value.loading = false;
  },
  // Is self.
  isSelf(item: IUser) {
    return item.userId === profileStore.profile?.userId;
  },
  // Reset search.
  async resetSearch() {
    queryParams.value = {};
    await methods.loadList();
  },
  // Open user form.
  openUserForm(id: number) {
    userFormData.value.dialog = true;
    userFormData.value.userId = id;
  },
  // Open pass form.
  openPassForm(username: string, id: number) {
    passFormData.value.dialog = true;
    passFormData.value.username = username;
    passFormData.value.userId = id;
  },
  // Open role asgmt page.
  async openRoleAsgmtPage(item: IUser) {
    await router.push(`/user/${item.userId}/roles`);
  },
  // Change user status.
  async changeUserStatus(id: number, status: number) {
    await userStore.edit({ userId: id, status: status } as IUser);
  },
  // Delete.
  async delete(item: IUser) {
    const confirm = await dialogs.deleteConfirm(
      i18n.ndt('Are you sure to delete this User ({0})?', [item.username]),
    );

    if (!confirm) return;

    await userStore.delete(item.userId);
    await methods.loadList();
  },
};

// Lifecycle.
onMounted(async () => {
  await methods.loadList();
});
</script>

<template>
  <!-- search -->
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
          <DictElement
            component="VSelect"
            dict-key="status"
            v-model="queryParams.status"
            :component-props="{
              density: 'compact',
              variant: 'outlined',
              hideDetails: true,
              clearable: true,
            }"
          >
            <template #chip="{ item }">
              <v-chip density="comfortable">{{ item.title }}</v-chip>
            </template>
          </DictElement>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-2 align-self-center"
          color="primary"
          prepend-icon="mdi-magnify"
          density="comfortable"
          @click="
            myRefStore.page = 1;
            methods.loadList();
          "
        >
          {{ $ndt('Search') }}
        </v-btn>
        <v-btn
          class="align-self-center"
          prepend-icon="mdi-sync"
          density="comfortable"
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
    :items="myRefStore.pageResult.items"
    :items-per-page="queryParamItemsPerPage"
  >
    <template #top>
      <v-toolbar density="compact" color="background">
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

    <template #item.status="{ item }">
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

    <template #item.createTime="{ value }">
      <v-label>{{ moment(value).format('YYYY-MM-DD HH:mm:ss') }}</v-label>
    </template>

    <template #item.actions="{ item }">
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
        :disabled="item.deleted === 9 || methods.isSelf(item)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <!-- expand actions -->
      <v-menu transition="scroll-y-transition">
        <template #activator="{ props }">
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

    <template #bottom>
      <VDataTablePagination
        v-model:page="queryParamPage"
        v-model:items-per-page="queryParamItemsPerPage"
        :current-count="myRefStore.pageResult.count"
        :total-count="myRefStore.pageResult.totalCount"
        :total-page="myRefStore.pageResult.totalPage"
      ></VDataTablePagination>
    </template>
  </v-data-table>
</template>

<style scoped lang="css"></style>
