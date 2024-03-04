<script setup lang="ts">
import { VDataTablePagination } from '@nodite-light/vuetify-data-table-pagination';
import moment from 'moment';

import { IRole, SequelizePaginationIRole } from '@/api/admin/data-contracts';
import DictElement from '@/components/form/DictElement.vue';
import i18n from '@/plugins/i18n';
import { useRoleStore } from '@/stores/modules/roleStore';
import dialogs from '@/utils/dialogs';
import MenuPermsView from '@/views/role/components/MenuPermsView.vue';
import RoleForm from '@/views/role/components/RoleForm.vue';

const roleStore = useRoleStore();
const router = useRouter();

interface QueryParams {
  roleName?: string;
  roleKey?: string;
  status?: 0 | 1;
}

// Local data.
const myRefStore = ref({
  loading: true,
  pageResult: {} as SequelizePaginationIRole,
  items: [] as IRole[],
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
  roleName: undefined,
  roleKey: undefined,
  status: undefined,
} as QueryParams);

// Role form.
const roleFormData = ref({
  dialog: false,
  roleId: 0,
});

// Menu perms view.
const menuPermsView = ref({
  drawer: false,
  roleId: 0,
  roleName: '',
  menuIds: [] as string[],
});

// Methods.
const methods = {
  // Load list.
  async loadList() {
    myRefStore.value.loading = true;

    const pageResult = await roleStore.list({
      page: queryParamPage.value,
      itemsPerPage: queryParamItemsPerPage.value,
      ...queryParams.value,
    });

    myRefStore.value.pageResult = pageResult || ({} as SequelizePaginationIRole);

    myRefStore.value.loading = false;
  },
  // Reset search.
  async resetSearch() {
    queryParams.value = {};
    await methods.loadList();
  },
  // Open role form.
  openRoleForm(id: number) {
    roleFormData.value.dialog = true;
    roleFormData.value.roleId = id;
  },
  // Open menu perms view.
  async openMenuPermsView(item: IRole) {
    menuPermsView.value.drawer = true;
    menuPermsView.value.roleId = item.roleId;
    menuPermsView.value.roleName = item.roleName;
  },
  // Open user asgmt page.
  async openUserAsgmtPage(item: IRole) {
    await router.push(`/role/${item.roleId}/users`);
  },
  // Change role status.
  async changeRoleStatus(id: number, status: number) {
    await roleStore.edit({ roleId: id, status: status } as IRole);
  },
  // Delete.
  async delete(item: IRole) {
    const confirm = await dialogs.deleteConfirm(
      i18n.ndt('Are you sure to delete this Role ({0})?', [item.roleName]),
    );

    if (!confirm) return;

    await roleStore.delete(item.roleId);
    await methods.loadList();
  },
};

// Lifecycle.
onMounted(async () => {
  await methods.loadList();
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
    :items="myRefStore.pageResult.items"
    :items-per-page="queryParamItemsPerPage"
  >
    <template #top>
      <v-toolbar density="compact" color="background">
        <RoleForm
          v-model:dialog="roleFormData.dialog"
          v-model:role-id="roleFormData.roleId"
          @save="methods.loadList()"
        ></RoleForm>
      </v-toolbar>
    </template>

    <template #item.roleName="{ value }">
      <v-label>{{ value }}</v-label>
      <br />
      <v-label class="text-caption text-disabled">
        {{ $ndt('Translation') }}: {{ $ndt(value) }}
      </v-label>
    </template>

    <template #item.status="{ item }">
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

    <template #item.createTime="{ value }">
      <v-label>{{ moment(value).format('YYYY-MM-DD HH:mm:ss') }}</v-label>
    </template>

    <template #item.actions="{ item }">
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
        @click="methods.delete(item)"
        min-width="calc(var(--v-btn-height) + 0px)"
        :disabled="item.deleted == 9 || item.roleId == 1"
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

  <!-- menu perms -->
  <MenuPermsView
    v-model:drawer="menuPermsView.drawer"
    v-model:role-id="menuPermsView.roleId"
    :label="`${$ndt('Menu Perms')} (${$ndt(menuPermsView.roleName)})`"
  ></MenuPermsView>
</template>
