<script setup lang="ts">
import { VTreeDataTable } from '@nodite-light/vuetify-tree-data-table';

import { DataTreeIMenu, IMenu } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useMenuStore } from '@/stores/modules/menuStore';
import dialogs from '@/utils/dialogs';
import MenuForm from '@/views/menu/components/MenuForm.vue';

const menuStore = useMenuStore();

// Local data.
const myRefStore = ref({
  loading: true,
  menus: [] as IMenu[],
  menuTree: [] as DataTreeIMenu[],
});

// Menu form.
const menuFormData = ref({
  dialog: false,
  menuId: '',
});

// Methods.
const methods = {
  // Load menu tree.
  async loadMenuTree(force: boolean = false) {
    myRefStore.value.loading = true;
    myRefStore.value.menuTree = await menuStore.listTree(force);
    myRefStore.value.menus = await menuStore.list();
    myRefStore.value.loading = false;
  },
  // Open menu form.
  openMenuForm(id: string) {
    menuFormData.value.dialog = true;
    menuFormData.value.menuId = id;
  },
  // Delete menu.
  async delete(item: IMenu) {
    const confirm = await dialogs.deleteConfirm(
      i18n.ndt('Are your sure to delete this menu ({0})', [item.menuName]),
    );

    if (!confirm) return;

    await menuStore.delete(item.menuId);
    await methods.loadMenuTree(true);
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
      items: myRefStore.menuTree,
    }"
    :offset-columns="['data-table-expand', 'menuName']"
  >
    <template #top>
      <v-toolbar density="compact" color="background">
        <MenuForm
          v-model:dialog="menuFormData.dialog"
          v-model:menu-id="menuFormData.menuId"
          :menus="myRefStore.menus"
          @save="methods.loadMenuTree(true)"
        ></MenuForm>
      </v-toolbar>
    </template>

    <template #item.menuName="{ item }">
      <v-label>
        {{ item.menuName }}
        <v-icon v-if="!!item.icon" size="small" class="ml-2">{{ item.icon }}</v-icon>
      </v-label>
      <br />
      <v-label class="text-caption text-disabled">
        {{ $ndt('Translation') }}: {{ $ndt(item.menuName) }}
      </v-label>
    </template>

    <template #item.iType="{ value }">
      {{ $ndt(value) }}
    </template>

    <template #item.path="{ value }">
      <router-link v-if="!!value" class="link" :to="value" target="_blank">{{ value }}</router-link>
      <span v-else>-</span>
    </template>

    <template #item.hidden="{ value }">
      <v-chip size="small" :color="value ? 'red' : 'green'">
        {{ value ? $ndt('Hidden') : $ndt('Show') }}
      </v-chip>
    </template>

    <template #item.perms="{ value }">
      {{ value || '-' }}
    </template>

    <template #item.actions="{ item }">
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
        @click="methods.delete(item)"
        min-width="calc(var(--v-btn-height) + 0px)"
        :disabled="item.deleted === 9"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>

    <template #bottom></template>
  </VTreeDataTable>
</template>

<style scoped lang="scss">
.v-data-table :deep(.v-data-table__td) {
  white-space: nowrap;
}
</style>
