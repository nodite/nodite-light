<script setup lang="ts">
import moment from 'moment';

import { IRoleWithUsers, IUser } from '@/api/admin/data-contracts';
import { useUserStore } from '@/stores/modules/userStore';
import lodash from '@/utils/lodash';

const userStore = useUserStore();
const route = useRoute();

interface IRole extends IRoleWithUsers {
  assignStatus: IRoleWithUsers['status'];
}

const userId = computed(() => lodash.toInteger(route.params.id));

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
  async loadUser() {
    if (!route.params.id) return;
    localData.value.user = (await userStore.query(userId.value)) as IUser;
  },
  async loadUserRoles() {
    if (!route.params.id) return;

    localData.value.loading = true;

    localData.value.roles = lodash
      .chain((await userStore.listUserRoles(userId.value)) || [])
      .map((role) => {
        lodash.set(role, 'assignStatus', lodash.toInteger(!lodash.isEmpty(role.users)));
        if (userId.value === 1 && role.roleId === 1) {
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
    await userStore.assignRolesToUser(userId.value, lodash.map(items, 'roleId'));
    await methods.loadUserRoles();
    localData.value.operating = false;
  },
  async unassign(items: IRole[]) {
    localData.value.operating = true;
    await userStore.unassignRolesOfUser(userId.value, lodash.map(items, 'roleId'));
    await methods.loadUserRoles();
    localData.value.operating = false;
  },
};

onMounted(() => {
  methods.loadUser();
  methods.loadUserRoles();
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
            :label="$ndt('Role Status')"
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
            :label="$ndt('Assign Status')"
            v-model="queryParams.assignStatus"
            @update:model-value="methods.search"
            variant="outlined"
            :items="[
              { title: $ndt('Assigned'), value: 1 },
              { title: $ndt('Unassigned'), value: 0 },
            ]"
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
            <v-label>{{ $ndt('User Overview') }}</v-label>
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                density="compact"
                class="px-0"
                v-for="item in [
                  {
                    title: $ndt('ID'),
                    key: 'userId',
                    value: localData.user.userId,
                  },
                  {
                    title: $ndt('Username'),
                    key: 'username',
                    value: localData.user.username,
                  },
                  {
                    title: $ndt('Nickname'),
                    key: 'nickname',
                    value: localData.user.nickname,
                  },
                  {
                    title: $ndt('Email'),
                    key: 'email',
                    value: localData.user.email,
                  },
                  {
                    title: $ndt('Status'),
                    key: 'status',
                    value: localData.user.status ? $ndt('Enabled') : $ndt('Disabled'),
                  },
                  {
                    title: $ndt('Create Time'),
                    key: 'createTime',
                    value: localData.user.createTime
                      ? moment(localData.user.createTime).format('YYYY-MM-DD HH:mm:ss')
                      : '',
                  },
                ]"
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
          :items="localData.filterRoles"
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
              v-if="lodash.isEmpty(item.users)"
              color="green"
              density="comfortable"
              @click="methods.assign([item])"
              prepend-icon="mdi-sticker-plus-outline"
              :loading="localData.operating"
              :disabled="localData.operating"
            >
              <v-label>{{ $ndt('Assign') }}</v-label>
            </v-btn>
            <v-btn
              v-if="!lodash.isEmpty(item.users)"
              color="red"
              density="comfortable"
              @click="methods.unassign([item])"
              prepend-icon="mdi-delete"
              :loading="localData.operating"
              :disabled="(userId === 1 && item.roleId === 1) || localData.operating"
            >
              <v-label>{{ $ndt('Un-Assign') }}</v-label>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
