<script setup lang="ts">
import 'vue3-treeview/dist/style.css';

import lodash from 'lodash';
import { useI18n } from 'vue-i18n';
import VueTreeView from 'vue3-treeview';
import { toast } from 'vuetify-sonner';

import { IMenu } from '@/api/admin/data-contracts';
import { $tnd } from '@/plugins/i18n';
import { useMenuStore } from '@/stores/modules/menuStore';

const menuStore = useMenuStore();
const { t: $t } = useI18n();

const emit = defineEmits(['close', 'save']);

type TreeNode = {
  id: string;
  text: string;
  item: IMenu;
  state: {
    opened?: boolean;
    disabled?: boolean;
    checked?: boolean;
    indeterminate?: boolean;
  };
  children: string[];
};

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  drawer: {
    type: Boolean,
    default: false,
  },
  initMethod: {
    type: Function,
    required: true,
  },
  initMethodParam: {
    type: Object,
    default: () => ({}),
  },
  checkboxes: {
    type: Boolean,
    default: false,
  },
});

const defLocalData = {
  drawer: props.drawer,
  treeConfig: {
    checkboxes: props.checkboxes,
  },
  selectedIds: [] as number[],
  expand: false,
  selectAll: false,
  linkage: false,
  treeNodes: {} as Record<string, TreeNode>,
  isSaving: false,
};

const localData = ref(lodash.cloneDeep(defLocalData));

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
          id: String(menu.menuId),
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
        .filter((node) => node.item.parentId === 0)
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
  checkOrUncheck(node: TreeNode) {
    const _linkage = (node: TreeNode, checked?: boolean) => {
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
  closeTreeView(drawer: boolean = false) {
    if (drawer) return;

    if (localData.value.isSaving) {
      toast.warning($t('common.form.saving'));
      return;
    }

    localData.value = lodash.cloneDeep(defLocalData);

    emit('close');
  },
  /**
   * save
   */
  save() {
    localData.value.isSaving = true;

    const ids = localData.value.selectAll
      ? [0]
      : lodash
          .chain(localData.value.treeNodes)
          .filter((node) => Boolean(node.state.checked))
          .map((m) => Number(m.id))
          .value();

    emit('save', ids, (close: boolean = true) => {
      localData.value.isSaving = false;
      if (close) methods.closeTreeView(false);
    });
  },
  /**
   * _parentState
   * @param node
   */
  _updateNodeState(node: TreeNode) {
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
  localData.value.drawer = props.drawer;
  localData.value.treeConfig.checkboxes = props.checkboxes;

  if (!lodash.isEmpty(props.initMethodParam)) {
    localData.value.selectedIds = await props.initMethod(props.initMethodParam);
    localData.value.selectAll = localData.value.selectedIds.includes(0);
    await methods.getNodes();
  }
});
</script>

<template>
  <v-navigation-drawer
    v-model="localData.drawer"
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
          :label="$t('views.menu.treeview.expandOrCollapse')"
          :disabled="localData.isSaving"
          hide-details
        ></v-checkbox>

        <v-checkbox
          v-model="localData.selectAll"
          @update:model-value="methods.selectAllOrNone"
          :label="$t('views.menu.treeview.selectAllOrNone')"
          :disabled="localData.isSaving"
          hide-details
        ></v-checkbox>

        <v-checkbox
          v-model="localData.linkage"
          :label="$t('views.menu.treeview.linkageOrNot')"
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
        <template v-slot:after-input="{ node }">
          <v-label class="text-subtitle-2">
            {{ $tnd(node.item.iKey, node.item.menuName) }}
            {{ node.item.perms ? `[${node.item.perms}]` : '' }}
          </v-label>
        </template>
      </vue-tree-view>

      <v-card-actions>
        <!-- actions -->
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          @click="methods.closeTreeView(false)"
          :disabled="localData.isSaving"
        >
          {{ $t('common.form.cancel') }}
        </v-btn>
        <v-btn @click="methods.save" :loading="localData.isSaving" :disabled="localData.isSaving">
          {{ $t('common.form.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<style scoped lang="css">
.menu-treeview {
  overflow: auto;
}
:deep(.node-wrapper) {
  min-height: 30px !important;
}
:deep(.checkbox-wrapper:after) {
  left: -0.1em;
}
</style>
