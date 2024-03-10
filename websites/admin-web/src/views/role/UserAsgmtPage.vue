<script setup lang="ts">
import lodash from 'lodash';
import moment from 'moment';

import { IRole, IUserWithRoles } from '@/api/admin/data-contracts';
import DictElement from '@/components/form/DictElement.vue';
import { useRoleStore } from '@/stores/modules/roleStore';

const roleStore = useRoleStore();
const route = useRoute();

interface IUser extends IUserWithRoles {
  assignStatus: IUserWithRoles['status'];
}

interface QueryParams {
  username?: string;
  nickname?: string;
  email?: string;
  status?: 0 | 1;
  assignStatus?: 0 | 1;
}

const roleId = computed(() => lodash.toInteger(route.params.id));

// Local data.
const myRefStore = ref({
  loading: false,
  role: {} as IRole,
  users: [] as IUser[],
  filteredUsers: [] as IUser[],
});

// Query params
const queryParams = ref({} as QueryParams);

// Methods.
const methods = {
  // Load role.
  async lodaRole() {
    if (!roleId.value) return;
    myRefStore.value.role = (await roleStore.query(roleId.value)) as IRole;
  },
  // Load role users.
  async loadRoleUsers() {
    if (!roleId.value) return;

    myRefStore.value.loading = true;

    myRefStore.value.filteredUsers = myRefStore.value.users = lodash
      .chain((await roleStore.listRoleUsers(roleId.value)) || [])
      .map((user) => {
        lodash.set(user, 'assignStatus', lodash.toInteger(!lodash.isEmpty(user.roles)));
        if (user.userId === 1 && roleId.value === 1) {
          lodash.set(user, 'selectable', false);
        }
        return user as IUser;
      })
      .value();

    myRefStore.value.loading = false;
  },
  // Search.
  search() {
    myRefStore.value.filteredUsers = lodash.filter(myRefStore.value.users, (user) => {
      let result = true;
      lodash.forEach(queryParams.value, (value, key) => {
        if (lodash.isUndefined(value) || lodash.isNull(value)) return;
        result = result && lodash.get(user, key, '')?.toString().includes(String(value));
      });
      return result;
    });
  },
  // Assign.
  async assign(items: IUser[]) {
    await roleStore.assignRoleToUsers(roleId.value, lodash.map(items, 'userId'));
    await methods.loadRoleUsers();
  },
  // Unassign.
  async unassign(items: IUser[]) {
    await roleStore.unassignRoleOfUsers(roleId.value, lodash.map(items, 'userId'));
    await methods.loadRoleUsers();
  },
};

// Lifecycle.
onMounted(() => {
  methods.lodaRole();
  methods.loadRoleUsers();
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
            :label="$ndt('Username')"
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
            :label="$ndt('Nickname')"
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
            :label="$ndt('Email')"
            v-model="queryParams.email"
            @update:model-value="methods.search"
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
            @update:model-value="methods.search"
            :component-props="{
              label: $ndt('User Status'),
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
            <v-label>{{ $ndt('Role Overview') }}</v-label>
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                density="compact"
                class="px-0"
                v-for="item in [
                  {
                    title: $ndt('ID'),
                    key: 'roleId',
                    value: myRefStore.role.roleId,
                  },
                  {
                    title: $ndt('Role Name'),
                    key: 'roleName',
                    value: myRefStore.role.roleName,
                  },
                  {
                    title: $ndt('Role Key'),
                    key: 'roleKey',
                    value: myRefStore.role.roleKey,
                  },
                  {
                    title: $ndt('Status'),
                    key: 'status',
                    value: myRefStore.role.status
                      ? $ndt('Enabled', undefined, { context: 'dict.type.status' })
                      : $ndt('Disabled', undefined, { context: 'dict.type.status' }),
                  },
                  {
                    title: $ndt('Create Time'),
                    key: 'createTime',
                    value: myRefStore.role.createTime
                      ? moment(myRefStore.role.createTime).format('YYYY-MM-DD HH:mm:ss')
                      : '',
                  },
                  {
                    title: $ndt('Update Time'),
                    key: 'updateTime',
                    value: myRefStore.role.updateTime
                      ? moment(myRefStore.role.updateTime).format('YYYY-MM-DD HH:mm:ss')
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
          item-value="userId"
          :loading="myRefStore.loading"
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
          :items="myRefStore.filteredUsers"
          item-selectable="selectable"
        >
          <template #item.status="{ value }">
            <v-chip :color="value == '1' ? 'green' : ''" density="comfortable">
              <v-label>
                {{
                  value == '1'
                    ? $ndt('Enabled', undefined, { context: 'dict.type.status' })
                    : $ndt('Disabled', undefined, { context: 'dict.type.status' })
                }}
              </v-label>
            </v-chip>
          </template>

          <template #item.createTime="{ value }">
            <v-label>{{ moment(value).format('YYYY-MM-DD HH:mm:ss') }}</v-label>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              v-if="lodash.isEmpty(item.roles)"
              color="green"
              density="comfortable"
              @click="methods.assign([item])"
              prepend-icon="mdi-sticker-plus-outline"
            >
              <v-label>{{ $ndt('Assign') }}</v-label>
            </v-btn>
            <v-btn
              v-if="!lodash.isEmpty(item.roles)"
              color="red"
              density="comfortable"
              @click="methods.unassign([item])"
              prepend-icon="mdi-delete"
              :disabled="item.userId === 1 && roleId === 1"
            >
              <v-label>{{ $ndt('Un-Assign') }}</v-label>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
