<script setup lang="ts">
import lodash from 'lodash';
import moment from 'moment';

import { IRoleWithUsers, IUser } from '@/api/admin/data-contracts';
import DictElement from '@/components/form/DictElement.vue';
import { useUserStore } from '@/stores/modules/userStore';

const userStore = useUserStore();
const route = useRoute();

interface IRole extends IRoleWithUsers {
  assignStatus: IRoleWithUsers['status'];
}

const userId = computed(() => lodash.toInteger(route.params.id));

// Query params.
const queryParams = ref({
  roleName: undefined,
  roleKey: undefined,
  status: undefined,
  assignStatus: undefined,
});

// Local data.
const myRefStore = ref({
  loading: false,
  user: {} as IUser,
  roles: [] as IRole[],
  filterRoles: [] as IRole[],
});

// Methods.
const methods = {
  // Load user.
  async loadUser() {
    if (!userId.value) return;
    myRefStore.value.user = (await userStore.query(userId.value)) as IUser;
  },
  // Load user roles.
  async loadUserRoles() {
    if (!userId.value) return;

    myRefStore.value.loading = true;

    myRefStore.value.roles = lodash
      .chain((await userStore.listUserRoles(userId.value)) || [])
      .map((role) => {
        lodash.set(role, 'assignStatus', lodash.toInteger(!lodash.isEmpty(role.users)));
        if (userId.value === 1 && role.roleId === 1) {
          lodash.set(role, 'selectable', false);
        }
        return role as IRole;
      })
      .value();

    myRefStore.value.filterRoles = myRefStore.value.roles;

    myRefStore.value.loading = false;
  },
  // Search.
  search() {
    myRefStore.value.filterRoles = lodash.filter(myRefStore.value.roles, (role) => {
      let result = true;

      lodash.forEach(queryParams.value, (value, key) => {
        if (lodash.isUndefined(value) || lodash.isNull(value)) return;
        result = result && lodash.get(role, key, '')?.toString().includes(String(value));
      });

      return result;
    });
  },
  // Assign.
  async assign(items: IRole[]) {
    await userStore.assignRolesToUser(userId.value, lodash.map(items, 'roleId'));
    await methods.loadUserRoles();
  },
  // Unassign.
  async unassign(items: IRole[]) {
    await userStore.unassignRolesOfUser(userId.value, lodash.map(items, 'roleId'));
    await methods.loadUserRoles();
  },
};

// Lifecycle.
onMounted(async () => {
  await Promise.all([methods.loadUser(), methods.loadUserRoles()]);
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
          <DictElement
            component="VSelect"
            dict-key="status"
            v-model="queryParams.status"
            @update:model-value="methods.search"
            :component-props="{
              label: $ndt('Role Status'),
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
                    value: myRefStore.user.userId,
                  },
                  {
                    title: $ndt('Username'),
                    key: 'username',
                    value: myRefStore.user.username,
                  },
                  {
                    title: $ndt('Nickname'),
                    key: 'nickname',
                    value: myRefStore.user.nickname,
                  },
                  {
                    title: $ndt('Email'),
                    key: 'email',
                    value: myRefStore.user.email,
                  },
                  {
                    title: $ndt('Status'),
                    key: 'status',
                    value: myRefStore.user.status
                      ? $ndt('Enabled', undefined, { context: 'dict.type.status' })
                      : $ndt('Disabled', undefined, { context: 'dict.type.status' }),
                  },
                  {
                    title: $ndt('Create Time'),
                    key: 'createTime',
                    value: myRefStore.user.createTime
                      ? moment(myRefStore.user.createTime).format('YYYY-MM-DD HH:mm:ss')
                      : '',
                  },
                  {
                    title: $ndt('Update Time'),
                    key: 'updateTime',
                    value: myRefStore.user.updateTime
                      ? moment(myRefStore.user.updateTime).format('YYYY-MM-DD HH:mm:ss')
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
          :loading="myRefStore.loading"
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
          :items="myRefStore.filterRoles"
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
              v-if="lodash.isEmpty(item.users)"
              color="green"
              density="comfortable"
              @click="methods.assign([item])"
              prepend-icon="mdi-sticker-plus-outline"
            >
              <v-label>{{ $ndt('Assign') }}</v-label>
            </v-btn>
            <v-btn
              v-if="!lodash.isEmpty(item.users)"
              color="red"
              density="comfortable"
              @click="methods.unassign([item])"
              prepend-icon="mdi-delete"
              :disabled="userId === 1 && item.roleId === 1"
            >
              <v-label>{{ $ndt('Un-Assign') }}</v-label>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
