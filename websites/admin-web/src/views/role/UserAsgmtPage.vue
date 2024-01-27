<script setup lang="ts">
import { DataTableItemProps } from '@nodite-light/vuetify-tree-data-table';
import lodash from 'lodash';
import moment from 'moment';

import { IRole, IUserWithRoles } from '@/api/admin/data-contracts';
import { $ndt } from '@/plugins/i18n';
import { useRoleStore } from '@/stores/modules/roleStore';

const roleStore = useRoleStore();
const route = useRoute();

interface IUser extends IUserWithRoles {
  assignStatus: IUserWithRoles['status'];
}

const staticData = ref({
  roleId: lodash.toInteger(route.params.id),
  headers: [] as DataTableItemProps['headers'],
  overList: [] as { title: string; key: string; value: unknown }[],
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
  role: {} as IRole,
  users: [] as IUser[],
  filteredUsers: [] as IUser[],
});

const methods = {
  isAdminRole() {
    return staticData.value.roleId === 1;
  },
  async lodaRole() {
    if (route.params.id) {
      localData.value.role = (await roleStore.query(staticData.value.roleId)) as IRole;
    }
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
    localData.value.filteredUsers = lodash.filter(localData.value.users, (user) => {
      let result = true;
      lodash.forEach(queryParams.value, (value, key) => {
        if (lodash.isUndefined(value) || lodash.isNull(value)) return;
        if (lodash.isString(value)) {
          result = result && lodash.get(user, key, '')?.includes(value);
        } else {
          result = result && lodash.get(user, key, '') === value;
        }
      });
      return result;
    });
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

onMounted(() => {
  methods.lodaRole();
  methods.loadRoleUsers();
});

watchEffect(() => {
  // watch i18n
  staticData.value.headers = [
    { title: '', align: 'start', key: 'data-table-select' },
    { title: $ndt('views.user.headers.userId'), value: 'userId' },
    { title: $ndt('views.user.headers.username'), value: 'username' },
    { title: $ndt('views.user.headers.nickname'), value: 'nickname' },
    { title: $ndt('views.user.headers.email'), value: 'email' },
    { title: $ndt('Status'), value: 'status' },
    { title: $ndt('common.form.createTime'), value: 'createTime' },
    { key: 'actions', sortable: false },
  ];
  staticData.value.overList = [
    {
      title: $ndt('views.role.headers.roleId'),
      key: 'roleId',
      value: localData.value.role.roleId,
    },
    {
      title: $ndt('views.role.headers.roleName'),
      key: 'roleName',
      value: localData.value.role.roleName,
    },
    {
      title: $ndt('views.role.headers.roleKey'),
      key: 'roleKey',
      value: localData.value.role.roleKey,
    },
    {
      title: $ndt('Status'),
      key: 'status',
      value: localData.value.role.status ? $ndt('Enabled') : $ndt('common.status.diabled'),
    },
    {
      title: $ndt('common.form.createTime'),
      key: 'createTime',
      value: moment(localData.value.role.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];
  staticData.value.assignStatus = [
    { title: $ndt('common.assignment.assigned'), value: 1 },
    { title: $ndt('common.assignment.unassigned'), value: 0 },
  ];
});
</script>

<template>
  <!-- search-->
  <v-card density="compact" class="mb-2 search">
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="2" md="3" sm="6">
          <v-text-field
            density="compact"
            :label="$ndt('views.user.form.username')"
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
            :label="$ndt('views.user.form.nickname')"
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
            :label="$ndt('views.user.form.email')"
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
            :label="$ndt('views.role.user_asgmt.status')"
            v-model="queryParams.status"
            @update:model-value="methods.search"
            variant="outlined"
            :items="[
              { title: $ndt('Enabled'), value: 1 },
              { title: $ndt('Disabled'), value: 0 },
            ]"
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
            :label="$ndt('common.assignment.assignStatus')"
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

  <v-container class="pa-0" style="max-width: unset">
    <v-row dense>
      <!-- overview -->
      <v-col cols="12" lg="3" md="3" sm="3">
        <v-card density="compact">
          <v-card-title>
            <v-label>{{ $ndt('common.overview', [$ndt('Role')]) }}</v-label>
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                density="compact"
                class="px-0"
                v-for="item in staticData.overList"
                :key="item.key"
              >
                {{ item.title }}: <v-label>{{ item.value }}</v-label>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- data table -->
      <v-col cols="12" lg="9" md="9" sm="9">
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
                {{ value == '1' ? $ndt('Enabled') : $ndt('Disabled') }}
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
              <v-label>{{ $ndt('common.assignment.assign') }}</v-label>
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
              <v-label>{{ $ndt('common.assignment.unassign') }}</v-label>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
