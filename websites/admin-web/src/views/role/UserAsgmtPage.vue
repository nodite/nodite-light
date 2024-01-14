<script setup lang="ts">
import { DataTableItemProps } from '@nodite-light/vuetify-tree-data-table';
import lodash from 'lodash';
import moment from 'moment';

import { IUserWithRoles } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useRoleStore } from '@/stores/modules/roleStore';

const roleStore = useRoleStore();
const route = useRoute();

type IUser = IUserWithRoles & {
  assignStatus: IUserWithRoles['status'];
};

const staticData = ref({
  roleId: lodash.toInteger(route.params.id),
  headers: [] as DataTableItemProps['headers'],
  status: [] as { title: string; value: number }[],
  assignStatus: [] as { title: string; value: number }[],
});

const queryParams = ref({
  username: undefined,
  nickname: undefined,
  email: undefined,
  status: undefined,
  assignStatus: undefined,
});

const localData = ref({
  loading: false,
  operating: false,
  users: [] as IUser[],
  filteredUsers: [] as IUser[],
});

const methods = {
  isAdminRole() {
    return staticData.value.roleId === 1;
  },
  async loadRoleUsers() {
    if (route.params.id) {
      localData.value.loading = true;
      localData.value.users = lodash
        .chain((await roleStore.listRoleUsers(staticData.value.roleId)) || [])
        .map((user) => {
          lodash.set(user, 'assignStatus', lodash.toInteger(!lodash.isEmpty(user.roles)));
          if (methods.isAdminRole() && user.userId === 1) {
            lodash.set(user, 'selectable', false);
          }
          return user as IUser;
        })
        .value();
      localData.value.filteredUsers = localData.value.users;
    }
    localData.value.loading = false;
  },
  search() {
    localData.value.filteredUsers = lodash
      .chain(localData.value.users)
      .filter((user) => {
        let result = true;
        lodash.forEach(queryParams.value, (value, key) => {
          if (lodash.isUndefined(value) || lodash.isNull(value)) return;
          if (typeof value === 'string') {
            result = result && lodash.get(user, key, '')?.includes(value);
          } else {
            result = result && lodash.get(user, key, '') === value;
          }
        });
        return result;
      })
      .value();
  },
  async assign(items: IUser[]) {
    localData.value.operating = true;
    await roleStore.assignRoleToUsers(staticData.value.roleId, lodash.map(items, 'userId'));
    await methods.loadRoleUsers();
    localData.value.operating = false;
  },
  async unassign(items: IUser[]) {
    localData.value.operating = true;
    await roleStore.unassignRoleOfUsers(staticData.value.roleId, lodash.map(items, 'userId'));
    await methods.loadRoleUsers();
    localData.value.operating = false;
  },
};

onMounted(async () => {
  await methods.loadRoleUsers();
});

watchEffect(() => {
  // watch i18n
  staticData.value.headers = [
    { title: '', align: 'start', key: 'data-table-select' },
    { title: i18n.global.t('views.user.headers.userId'), value: 'userId' },
    { title: i18n.global.t('views.user.headers.username'), value: 'username' },
    { title: i18n.global.t('views.user.headers.nickname'), value: 'nickname' },
    { title: i18n.global.t('views.user.headers.email'), value: 'email' },
    { title: i18n.global.t('common.form.status', ['']), value: 'status' },
    { title: i18n.global.t('common.form.createTime'), value: 'createTime' },
    { key: 'actions', sortable: false },
  ];
  staticData.value.status = [
    { title: i18n.global.t('common.status.enabled'), value: 1 },
    { title: i18n.global.t('common.status.disabled'), value: 0 },
  ];
  staticData.value.assignStatus = [
    { title: i18n.global.t('views.role.user_asgmt.assigned'), value: 1 },
    { title: i18n.global.t('views.role.user_asgmt.unassigned'), value: 0 },
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
            @update:model-value="methods.search"
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
            @update:model-value="methods.search"
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
            @update:model-value="methods.search"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-select
            density="compact"
            :label="$t('views.role.user_asgmt.status')"
            v-model="queryParams.status"
            @update:model-value="methods.search"
            variant="outlined"
            :items="staticData.status"
            hide-details
            clearable
          >
            <template v-slot:chip="{ item }">
              <v-chip density="comfortable">{{ item.title }}</v-chip>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-select
            density="compact"
            :label="$t('views.role.user_asgmt.assignStatus')"
            v-model="queryParams.assignStatus"
            @update:model-value="methods.search"
            variant="outlined"
            :items="staticData.assignStatus"
            hide-details
            clearable
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-data-table
    item-value="userId"
    :loading="localData.loading"
    :headers="staticData.headers"
    :items="localData.filteredUsers"
    item-selectable="selectable"
  >
    <template v-slot:item.status="{ value }">
      <v-chip :color="value == '1' ? 'green' : ''" density="comfortable">
        <v-label>
          {{ value == '1' ? $t('common.status.enabled') : $t('common.status.disabled') }}
        </v-label>
      </v-chip>
    </template>

    <template v-slot:item.createTime="{ value }">
      <v-label>{{ moment(value).format('YYYY-MM-DD HH:mm:ss') }}</v-label>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        v-if="lodash.isEmpty(item.roles)"
        color="green"
        density="comfortable"
        @click="methods.assign([item])"
        prepend-icon="mdi-sticker-plus-outline"
        :loading="localData.operating"
        :disabled="localData.operating"
      >
        <v-label>{{ $t('views.role.user_asgmt.assign') }}</v-label>
      </v-btn>
      <v-btn
        v-if="!lodash.isEmpty(item.roles)"
        color="red"
        density="comfortable"
        @click="methods.unassign([item])"
        prepend-icon="mdi-delete"
        :loading="localData.operating"
        :disabled="(methods.isAdminRole() && item.userId == 1) || localData.operating"
      >
        <v-label>{{ $t('views.role.user_asgmt.unassign') }}</v-label>
      </v-btn>
    </template>
  </v-data-table>
</template>
