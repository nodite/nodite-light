<script setup lang="ts">
import { DataTableItemProps } from '@nodite-light/vuetify-tree-data-table';
import lodash from 'lodash';
import moment from 'moment';

import { IRoleWithUsers, IUser } from '@/api/admin/data-contracts';
import { $ndt } from '@/plugins/i18n';
import { useUserStore } from '@/stores/modules/userStore';

const userStore = useUserStore();
const route = useRoute();

type IRole = IRoleWithUsers & {
  assignStatus: IRoleWithUsers['status'];
};

const staticData = ref({
  userId: lodash.toInteger(route.params.id),
  headers: [] as DataTableItemProps['headers'],
  overList: [] as { title: string; key: string; value: unknown }[],
  status: [] as { title: string; value: number }[],
  assignStatus: [] as { title: string; value: number }[],
});

const queryParams = ref({
  roleName: undefined,
  roleKey: undefined,
  status: undefined,
  assignStatus: undefined,
});

const localData = ref({
  loading: false,
  operating: false,
  user: {} as IUser,
  roles: [] as IRole[],
  filterRoles: [] as IRole[],
});

const methods = {
  isAdminUser() {
    return staticData.value.userId === 1;
  },
  async loadUser() {
    if (!route.params.id) return;
    localData.value.user = (await userStore.query(staticData.value.userId)) as IUser;
  },
  async loadUserRoles() {
    if (!route.params.id) return;

    localData.value.loading = true;

    localData.value.roles = lodash
      .chain((await userStore.listUserRoles(staticData.value.userId)) || [])
      .map((role) => {
        lodash.set(role, 'assignStatus', lodash.toInteger(!lodash.isEmpty(role.users)));
        if (methods.isAdminUser() && role.roleId === 1) {
          lodash.set(role, 'selectable', false);
        }
        return role as IRole;
      })
      .value();

    localData.value.filterRoles = localData.value.roles;

    localData.value.loading = false;
  },
  search() {
    localData.value.filterRoles = lodash.filter(localData.value.roles, (role) => {
      let result = true;

      lodash.forEach(queryParams.value, (value, key) => {
        if (lodash.isUndefined(value) || lodash.isNull(value)) return;

        result = lodash.isString(value)
          ? result && lodash.get(role, key, '')?.includes(value)
          : result && lodash.get(role, key, '') === value;
      });

      return result;
    });
  },
  async assign(items: IRole[]) {
    localData.value.operating = true;
    await userStore.assignRolesToUser(staticData.value.userId, lodash.map(items, 'roleId'));
    await methods.loadUserRoles();
    localData.value.operating = false;
  },
  async unassign(items: IRole[]) {
    localData.value.operating = true;
    await userStore.unassignRolesOfUser(staticData.value.userId, lodash.map(items, 'roleId'));
    await methods.loadUserRoles();
    localData.value.operating = false;
  },
};

onMounted(() => {
  methods.loadUser();
  methods.loadUserRoles();
});

watchEffect(() => {
  // watch i18n
  staticData.value.headers = [
    { title: '', align: 'start', key: 'data-table-select' },
    { title: $ndt('views.role.headers.roleId'), value: 'roleId' },
    { title: $ndt('views.role.headers.roleName'), value: 'roleName' },
    { title: $ndt('views.role.headers.roleKey'), value: 'roleKey' },
    { title: $ndt('views.role.headers.orderNum'), value: 'orderNum' },
    { title: $ndt('common.form.status', ['']), value: 'status' },
    { title: $ndt('common.form.createTime'), value: 'createTime' },
    { key: 'actions', sortable: false },
  ];
  staticData.value.overList = [
    {
      title: $ndt('views.user.headers.userId'),
      key: 'userId',
      value: localData.value.user.userId,
    },
    {
      title: $ndt('views.user.headers.username'),
      key: 'username',
      value: localData.value.user.username,
    },
    {
      title: $ndt('views.user.headers.nickname'),
      key: 'nickname',
      value: localData.value.user.nickname,
    },
    {
      title: $ndt('views.user.headers.email'),
      key: 'email',
      value: localData.value.user.email,
    },
    {
      title: $ndt('common.form.status'),
      key: 'status',
      value: localData.value.user.status
        ? $ndt('common.status.enabled')
        : $ndt('common.status.diabled'),
    },
    {
      title: $ndt('common.form.createTime'),
      key: 'createTime',
      value: localData.value.user.createTime
        ? moment(localData.value.user.createTime).format('YYYY-MM-DD HH:mm:ss')
        : '',
    },
  ];
  staticData.value.status = [
    { title: $ndt('common.status.enabled'), value: 1 },
    { title: $ndt('common.status.disabled'), value: 0 },
  ];
  staticData.value.assignStatus = [
    { title: $ndt('common.assignment.assigned'), value: 1 },
    { title: $ndt('common.assignment.unassigned'), value: 0 },
  ];
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
            :label="$ndt('views.role.form.roleName')"
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
            :label="$ndt('views.role.form.roleKey')"
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
            :label="$ndt('views.user.role_asgmt.status')"
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
            <v-label>{{ $ndt('common.overview', [$ndt('views.user.title')]) }}</v-label>
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
          item-value="roleId"
          :loading="localData.loading"
          :headers="staticData.headers"
          :items="localData.filterRoles"
          item-selectable="selectable"
        >
          <template v-slot:item.status="{ value }">
            <v-chip :color="value == '1' ? 'green' : ''" density="comfortable">
              <v-label>
                {{ value == '1' ? $ndt('common.status.enabled') : $ndt('common.status.disabled') }}
              </v-label>
            </v-chip>
          </template>

          <template v-slot:item.createTime="{ value }">
            <v-label>{{ moment(value).format('YYYY-MM-DD HH:mm:ss') }}</v-label>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              v-if="lodash.isEmpty(item.users)"
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
              v-if="!lodash.isEmpty(item.users)"
              color="red"
              density="comfortable"
              @click="methods.unassign([item])"
              prepend-icon="mdi-delete"
              :loading="localData.operating"
              :disabled="(methods.isAdminUser() && item.roleId == 1) || localData.operating"
            >
              <v-label>{{ $ndt('common.assignment.unassign') }}</v-label>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
