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

const localData = ref({
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

const methods = {
  /**
   * getNodes
   */
  async getNodes() {
    const menus = await menuStore.list();

    localData.value.treeNodes = lodash
      .chain(menus)
      .mapValues((menu) => {
        return {
          id: menu.menuId,
          text: '',
          item: menu,
          state: {
            opened: localData.value.expand,
            checked: localData.value.selectAll || localData.value.selectedIds.includes(menu.menuId),
            disabled: localData.value.selectAll,
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
      localData.value.treeConfig,
      'roots',
      lodash
        .chain(localData.value.treeNodes)
        .filter((node) => !node.item.parentId)
        .map('id')
        .value(),
    );

    lodash.forEach(localData.value.treeNodes, (node) => {
      methods._updateNodeState(node);
    });
  },
  /**
   * expandOrCollapse
   * @param expand
   */
  async expandOrCollapse(expand: boolean) {
    lodash.forEach(localData.value.treeNodes, (node) => {
      node.state.opened = expand;
    });
  },
  /**
   * selectAllOrNone
   * @param all
   */
  async selectAllOrNone(check: boolean) {
    lodash.forEach(localData.value.treeNodes, (node) => {
      node.state.disabled = check;
      node.state.indeterminate = false;
      node.state.checked = check;
    });
  },
  /**
   * checkOrUncheck
   * @param node
   */
  checkOrUncheck(node: VueTreeViewConfig.TreeNode<IMenu>) {
    const _linkage = (node: VueTreeViewConfig.TreeNode<IMenu>, checked?: boolean) => {
      node.state.indeterminate = false;
      node.state.checked = checked;
      lodash.forEach(node.children, (id) => {
        _linkage(localData.value.treeNodes[id], checked);
      });
    };

    if (localData.value.linkage) {
      _linkage(node, node.state.checked);
    }

    methods._updateNodeState(node);
  },
  /**
   * closeTreeView
   * @param drawer
   */
  closeTreeView() {
    if (localData.value.isSaving) {
      toast.warning(i18n.ndt("It's saving, please wait a moment."));
      return;
    }
    drawer.value = false;
    roleId.value = 0;
  },
  /**
   * save
   */
  async save() {
    localData.value.isSaving = true;

    try {
      const ids = localData.value.selectAll
        ? ['*']
        : lodash
            .chain(localData.value.treeNodes)
            .filter((node) => Boolean(node.state.checked))
            .map((m) => m.id)
            .value();

      await roleStore.updateMenuPerms(roleId.value, ids);

      toast.success(i18n.ndt('Save successfully.'));
    } finally {
      localData.value.isSaving = false;
    }

    methods.closeTreeView();
  },
  /**
   * _parentState
   * @param node
   */
  _updateNodeState(node: VueTreeViewConfig.TreeNode<IMenu>) {
    // the current checked, the current not indeterminate.
    if (node.state.checked) node.state.indeterminate = false;

    // the current indeterminate, the current not checked.
    if (node.state.indeterminate) node.state.checked = false;

    // some children indeterminate/checked, the current must indeterminate.
    if (!node.state.checked && !node.state.indeterminate) {
      node.state.indeterminate = lodash.some(node.children, (id) => {
        return (
          localData.value.treeNodes[id].state.indeterminate ||
          localData.value.treeNodes[id].state.checked
        );
      });
    }

    // to parent.
    const parent = localData.value.treeNodes[node.item.parentId];

    if (!parent) return;

    // the current indeterminate, the parent must indeterminate.
    if (node.state.indeterminate) {
      parent.state.indeterminate = true;
    }

    // some parent's children indeterminate/checked, the parent must indeterminate.
    if (parent.state.indeterminate) {
      parent.state.indeterminate = lodash.some(parent.children, (id) => {
        return (
          localData.value.treeNodes[id].state.indeterminate ||
          localData.value.treeNodes[id].state.checked
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

watchEffect(async () => {
  if (roleId.value) {
    localData.value.selectedIds = lodash.map(await roleStore.listMenuPerms(roleId.value), 'menuId');
    localData.value.selectAll = localData.value.selectedIds.includes('*');
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

      <v-divider class="my-3" inset></v-divider>

      <v-row>
        <v-spacer></v-spacer>

        <v-checkbox
          v-model="localData.expand"
          @update:model-value="methods.expandOrCollapse"
          :label="$ndt('Expand/Collapse')"
          :disabled="localData.isSaving"
          hide-details
        ></v-checkbox>

        <v-checkbox
          v-model="localData.selectAll"
          @update:model-value="methods.selectAllOrNone"
          :label="$ndt('Select All/None')"
          :disabled="localData.isSaving || roleId === 1"
          hide-details
        ></v-checkbox>

        <v-checkbox
          v-model="localData.linkage"
          :label="$ndt('Linkage/Not')"
          :disabled="localData.isSaving"
          hide-details
        ></v-checkbox>

        <v-spacer></v-spacer>
      </v-row>

      <v-divider class="my-3" inset></v-divider>

      <vue-tree-view
        class="menu-treeview"
        :nodes="localData.treeNodes"
        :config="localData.treeConfig"
        @node-checked="methods.checkOrUncheck"
        @node-unchecked="methods.checkOrUncheck"
      >
        <template v-slot:input="{ node }">
          {{ $ndt(node.item.menuName) }}
          {{ node.item.perms ? `[${node.item.perms}]` : '' }}
        </template>
      </vue-tree-view>

      <v-card-actions>
        <!-- actions -->
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          @click="methods.closeTreeView()"
          :disabled="localData.isSaving"
        >
          {{ $ndt('Cancel') }}
        </v-btn>
        <v-btn
          @click="methods.save"
          :loading="localData.isSaving"
          :disabled="localData.isSaving || roleId === 1"
        >
          {{ $ndt('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>
