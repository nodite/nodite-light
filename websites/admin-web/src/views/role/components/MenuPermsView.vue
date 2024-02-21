<script setup lang="ts">
import '@employee87/vue3-treeview/dist/style.css';

import VueTreeView from '@employee87/vue3-treeview';
import { toast } from 'vuetify-sonner';

import { IMenu } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useMenuStore } from '@/stores/modules/menuStore';
import { useRoleStore } from '@/stores/modules/roleStore';
import { VueTreeview as VueTreeViewConfig } from '@/types/config';
import lodash from '@/utils/lodash';

const menuStore = useMenuStore();
const roleStore = useRoleStore();

const emit = defineEmits(['update:drawer', 'update:roleId']);

const props = defineProps({
  drawer: {
    type: Boolean,
    default: false,
  },
  roleId: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
});

const drawer = computed({
  get: () => props.drawer,
  set: (v) => emit('update:drawer', v),
});

const roleId = computed({
  get: () => props.roleId,
  set: (v) => emit('update:roleId', v),
});

// Local data.
const myRefStore = ref({
  treeConfig: {
    checkboxes: true,
  },
  selectedIds: [] as string[],
  treeNodes: {} as Record<string, VueTreeViewConfig.TreeNode<IMenu>>,
  expand: false,
  selectAll: false,
  linkage: false,
  isSaving: false,
});

// Methods.
const methods = {
  // Get nodes.
  async getNodes() {
    const menus = await menuStore.list();

    myRefStore.value.treeNodes = lodash
      .chain(menus)
      .mapValues((menu) => {
        return {
          id: menu.menuId,
          text: i18n.ndt(menu.menuName) + (menu.perms ? ` [${menu.perms}]` : ''),
          item: menu,
          state: {
            opened: myRefStore.value.expand,
            checked:
              myRefStore.value.selectAll || myRefStore.value.selectedIds.includes(menu.menuId),
            disabled: myRefStore.value.selectAll,
          },
          children: lodash
            .chain(menus)
            .filter((m) => m.parentId === menu.menuId)
            .map((m) => String(m.menuId))
            .value(),
        };
      })
      .keyBy('id')
      .value();

    lodash.set(
      myRefStore.value.treeConfig,
      'roots',
      lodash
        .chain(myRefStore.value.treeNodes)
        .filter((node) => !node.item.parentId)
        .map('id')
        .value(),
    );

    lodash.forEach(myRefStore.value.treeNodes, (node) => {
      methods._updateNodeState(node);
    });
  },
  // Expand or collapse.
  async expandOrCollapse(expand: boolean) {
    lodash.forEach(myRefStore.value.treeNodes, (node) => {
      node.state.opened = expand;
    });
  },
  // Select all or none.
  async selectAllOrNone(check: boolean) {
    lodash.forEach(myRefStore.value.treeNodes, (node) => {
      node.state.disabled = check;
      node.state.indeterminate = false;
      node.state.checked = check;
    });
  },
  // Check or uncheck.
  checkOrUncheck(node: VueTreeViewConfig.TreeNode<IMenu>) {
    const _linkage = (node: VueTreeViewConfig.TreeNode<IMenu>, checked?: boolean) => {
      node.state.indeterminate = false;
      node.state.checked = checked;
      lodash.forEach(node.children, (id) => {
        _linkage(myRefStore.value.treeNodes[id], checked);
      });
    };

    if (myRefStore.value.linkage) {
      _linkage(node, node.state.checked);
    }

    methods._updateNodeState(node);
  },
  // Close tree view.
  closeTreeView() {
    if (myRefStore.value.isSaving) {
      toast.warning(i18n.ndt("It's saving, please wait a moment."));
      return;
    }
    drawer.value = false;
    roleId.value = 0;
  },
  // Save.
  async save() {
    myRefStore.value.isSaving = true;

    try {
      const ids = myRefStore.value.selectAll
        ? ['*']
        : lodash
            .chain(myRefStore.value.treeNodes)
            .filter((node) => Boolean(node.state.checked))
            .map((m) => m.id)
            .value();

      await roleStore.updateMenuPerms(roleId.value, ids);

      toast.success(i18n.ndt('Save successfully.'));
    } finally {
      myRefStore.value.isSaving = false;
    }

    methods.closeTreeView();
  },
  // Update node state.
  _updateNodeState(node: VueTreeViewConfig.TreeNode<IMenu>) {
    // the current checked, the current not indeterminate.
    if (node.state.checked) node.state.indeterminate = false;

    // the current indeterminate, the current not checked.
    if (node.state.indeterminate) node.state.checked = false;

    // some children indeterminate/checked, the current must indeterminate.
    if (!node.state.checked && !node.state.indeterminate) {
      node.state.indeterminate = lodash.some(node.children, (id) => {
        return (
          myRefStore.value.treeNodes[id].state.indeterminate ||
          myRefStore.value.treeNodes[id].state.checked
        );
      });
    }

    // to parent.
    const parent = myRefStore.value.treeNodes[node.item.parentId];

    if (!parent) return;

    // the current indeterminate, the parent must indeterminate.
    if (node.state.indeterminate) {
      parent.state.indeterminate = true;
    }

    // some parent's children indeterminate/checked, the parent must indeterminate.
    if (parent.state.indeterminate) {
      parent.state.indeterminate = lodash.some(parent.children, (id) => {
        return (
          myRefStore.value.treeNodes[id].state.indeterminate ||
          myRefStore.value.treeNodes[id].state.checked
        );
      });
    }

    // the parent is opened if current is checked/opened.
    if (node.state.checked || node.state.opened) {
      parent.state.opened = true;
    }

    methods._updateNodeState(parent);
  },
};

// Lifecycle.
watchEffect(async () => {
  if (roleId.value) {
    myRefStore.value.selectedIds = lodash.map(
      await roleStore.listMenuPerms(roleId.value),
      'menuId',
    );
    myRefStore.value.selectAll = myRefStore.value.selectedIds.includes('*');
    await methods.getNodes();
  }
});
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    @update:model-value="methods.closeTreeView"
    location="right"
    temporary
    width="450"
  >
    <v-card class="pa-5" density="compact">
      <v-card-title>
        <v-label class="text-h6">
          {{ label }}
        </v-label>
      </v-card-title>

      <hr class="my-3 linear" />

      <v-row>
        <v-spacer></v-spacer>

        <v-checkbox
          v-model="myRefStore.expand"
          @update:model-value="methods.expandOrCollapse"
          :label="$ndt('Expand/Collapse')"
          :disabled="myRefStore.isSaving"
          hide-details
        ></v-checkbox>

        <v-checkbox
          v-model="myRefStore.selectAll"
          @update:model-value="methods.selectAllOrNone"
          :label="$ndt('Select All/None')"
          :disabled="myRefStore.isSaving || roleId === 1"
          hide-details
        ></v-checkbox>

        <v-checkbox
          v-model="myRefStore.linkage"
          :label="$ndt('Linkage/Not')"
          :disabled="myRefStore.isSaving"
          hide-details
        ></v-checkbox>

        <v-spacer></v-spacer>
      </v-row>

      <hr class="my-3 linear" />

      <VueTreeView
        class="menu-treeview"
        :nodes="myRefStore.treeNodes"
        :config="myRefStore.treeConfig"
        @node-checked="methods.checkOrUncheck"
        @node-unchecked="methods.checkOrUncheck"
      ></VueTreeView>

      <v-card-actions>
        <!-- actions -->
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          @click="methods.closeTreeView()"
          :disabled="myRefStore.isSaving"
        >
          {{ $ndt('Cancel') }}
        </v-btn>
        <v-btn
          @click="methods.save"
          :loading="myRefStore.isSaving"
          :disabled="myRefStore.isSaving || roleId === 1"
        >
          {{ $ndt('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>
