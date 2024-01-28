<script setup lang="ts">
import { VDataTablePagination } from '@nodite-light/vuetify-data-table-pagination';
import {
  type ConfirmCallback,
  VDeleteConfirmForm,
} from '@nodite-light/vuetify-delete-confirm-form';
import moment from 'moment';

import { IRole, QueryParams, SequelizePaginationIRole } from '@/api/admin/data-contracts';
import { useRoleStore } from '@/stores/modules/roleStore';
import MenuTreeView from '@/views/role/components/MenuTreeView.vue';
import RoleForm from '@/views/role/components/RoleForm.vue';

const roleStore = useRoleStore();
const router = useRouter();

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
  roleKey: undefined,
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
  roleId: 0,
  roleName: '',
  menuIds: [] as string[],
});

const methods = {
  async loadList() {
    localData.value.loading = true;
    localData.value.pageResult =
      (await roleStore.list(queryParams.value)) || ({} as SequelizePaginationIRole);
    localData.value.loading = false;
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
  openRoleForm(id: number) {
    roleFormData.value.dialog = true;
    roleFormData.value.roleId = id;
  },
  openDeleteConfirmForm(item: IRole) {
    deleteConfirmFormData.value.dialog = true;
    deleteConfirmFormData.value.item = item;
  },
  async openMenuPermsView(item: IRole) {
    menuPermsView.value.drawer = true;
    menuPermsView.value.roleId = item.roleId;
    menuPermsView.value.roleName = item.roleName;
  },
  async openUserAsgmtPage(item: IRole) {
    await router.push(`/role/${item.roleId}/users`);
  },
  async changeRoleStatus(id: number, status: number) {
    await roleStore.edit({ roleId: id, status: status } as IRole);
  },
  async delete(item: IRole, cb: ConfirmCallback) {
    try {
      await roleStore.delete(item.roleId);
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
            :label="$ndt('Role Name')"
            v-model="queryParams.roleName"
            variant="outlined"
            hide-details
            hide-spin-buttons
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$ndt('Role Key')"
            v-model="queryParams.roleKey"
            variant="outlined"
            hide-details
            hide-spin-buttons
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
    item-value="roleId"
    :headers="[
      { title: '', align: 'start', key: 'data-table-select' },
      { title: $ndt('ID'), value: 'roleId' },
      { title: $ndt('Role Name'), value: 'roleName' },
      { title: $ndt('Role Key'), value: 'roleKey' },
      { title: $ndt('Order'), value: 'orderNum' },
      { title: $ndt('Status'), value: 'status' },
      { title: $ndt('Create Time'), value: 'createTime' },
      { key: 'actions', sortable: false },
    ]"
    :items="localData.pageResult.items"
  >
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <RoleForm
          v-model:dialog="roleFormData.dialog"
          v-model:role-id="roleFormData.roleId"
          @save="methods.loadList()"
        ></RoleForm>
      </v-toolbar>
    </template>

    <template v-slot:item.status="{ item }">
      <!-- status -->
      <v-switch
        color="success"
        density="compact"
        v-model="item.status"
        :true-value="1"
        :false-value="0"
        @change="methods.changeRoleStatus(item.roleId, Number(item.status))"
        :disabled="item.roleId == 1"
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
              @click="methods.openMenuPermsView(item)"
              prepend-icon="mdi-eye"
            >
              <v-label>{{ $ndt('Menu Perms') }}</v-label>
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
              <v-label>{{ $ndt('User Asgmt') }}</v-label>
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

  <!-- menu perms -->
  <MenuTreeView
    v-model:drawer="menuPermsView.drawer"
    v-model:role-id="menuPermsView.roleId"
    :label="`${$ndt('Menu Perms')} (${$ndt(menuPermsView.roleName)})`"
  ></MenuTreeView>
</template>
