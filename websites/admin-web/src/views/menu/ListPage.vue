<script setup lang="ts">
import {
  type ConfirmCallback,
  VDeleteConfirmForm,
} from '@nodite-light/vuetify-delete-confirm-form';
import { VTreeDataTable } from '@nodite-light/vuetify-tree-data-table';

import { DataTreeIMenu, IMenu } from '@/api/admin/data-contracts';
import { useMenuStore } from '@/stores/modules/menuStore';
import MenuForm from '@/views/menu/components/MenuForm.vue';

const menuStore = useMenuStore();

// Local data.
const myRefStore = ref({
  loading: true,
  items: [] as DataTreeIMenu[],
});

// Menu form.
const menuFormData = ref({
  dialog: false,
  menuId: '',
});

// Delete confirm.
const deleteConfirmFormData = ref({
  dialog: false,
  item: {} as IMenu,
});

// Methods.
const methods = {
  // Load menu tree.
  async loadMenuTree(force: boolean = false) {
    myRefStore.value.loading = true;
    myRefStore.value.items = await menuStore.listTree(force);
    myRefStore.value.loading = false;
  },
  // Open menu form.
  openMenuForm(id: string) {
    menuFormData.value.dialog = true;
    menuFormData.value.menuId = id;
  },
  // Open delete confirm form.
  openDeleteConfirmForm(item: IMenu) {
    deleteConfirmFormData.value.dialog = true;
    deleteConfirmFormData.value.item = item;
  },
  // Delete menu.
  async delete(menu: IMenu, cb: ConfirmCallback) {
    try {
      await menuStore.delete(menu.menuId);
      await methods.loadMenuTree(true);
      cb(true);
    } catch (error) {
      cb(false);
    }
  },
};

// Lifecycle.
onMounted(async () => {
  await methods.loadMenuTree();
});
</script>

<template>
  <VTreeDataTable
    :tableProps="{
      itemValue: 'menuId',
      selectStrategy: 'all',
      itemsPerPage: -1,
      itemsPerPageOptions: [-1],
      showExpand: true,
      loading: myRefStore.loading,
      headers: [
        { title: '', align: 'start', key: 'data-table-expand' },
        { title: $ndt('Menu Name'), value: 'menuName' },
        { title: $ndt('Order'), value: 'orderNum' },
        { title: $ndt('Path'), value: 'path' },
        { title: $ndt('Type'), value: 'iType' },
        { title: $ndt('Visibility'), value: 'hidden' },
        { title: $ndt('Perms'), value: 'perms' },
        { key: 'actions', sortable: false },
      ],
      items: myRefStore.items,
    }"
    :offset-columns="['data-table-expand', 'menuName']"
  >
    <template v-slot:top>
      <v-toolbar density="compact" color="inherit">
        <menu-form
          v-model:dialog="menuFormData.dialog"
          v-model:menu-id="menuFormData.menuId"
          @save="methods.loadMenuTree(true)"
        ></menu-form>
      </v-toolbar>
    </template>

    <template v-slot:item.menuName="{ item }">
      <v-label>
        {{ $ndt(item.menuName) }}
        <v-icon v-if="!!item.icon" size="small" class="ml-2">{{ item.icon }}</v-icon>
      </v-label>
    </template>

    <template v-slot:item.iType="{ value }">
      {{ $ndt(value) }}
    </template>

    <template v-slot:item.path="{ value }">
      <router-link v-if="!!value" class="text" :to="value">{{ value }}</router-link>
      <span v-else>-</span>
    </template>

    <template v-slot:item.hidden="{ value }">
      <v-chip size="small" :color="value ? 'red' : 'green'">
        {{ value ? $ndt('Hidden') : $ndt('Show') }}
      </v-chip>
    </template>

    <template v-slot:item.perms="{ value }">
      {{ value || '-' }}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        class="px-0"
        variant="text"
        @click="methods.openMenuForm(item.menuId)"
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
        :disabled="item.deleted === 9"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>

    <template v-slot:bottom></template>
  </VTreeDataTable>

  <!-- delete confirm -->
  <VDeleteConfirmForm
    v-model:dialog="deleteConfirmFormData.dialog"
    v-model:item="deleteConfirmFormData.item"
    @confirm="methods.delete"
  ></VDeleteConfirmForm>
</template>

<style scoped lang="scss">
.text {
  cursor: pointer;
  display: inline-block;
  border-bottom: 1px dashed;
}
.v-data-table :deep(.v-data-table__td) {
  white-space: nowrap;
}
</style>
