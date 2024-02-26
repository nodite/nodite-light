<script setup lang="ts">
import '@employee87/vue3-treeview/dist/style.css';

import VueTreeView from '@employee87/vue3-treeview';
import { PropType } from 'vue';

import i18n from '@/plugins/i18n';
import { VueTreeView as VueTreeViewConfig } from '@/types/config';
import lodash from '@/utils/lodash';

const emit = defineEmits(['update:modelValue', 'update:dialog', 'update:error']);

const props = defineProps({
  modelValue: {
    type: null as unknown as PropType<any>,
    default: null,
  },
  dialog: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: Number,
    default: 450,
  },
  label: {
    type: String,
    default: undefined,
  },
  items: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  itemTitle: {
    type: String,
    default: 'title',
  },
  itemTitleContext: {
    type: String,
    default: '',
  },
  itemValue: {
    type: String,
    default: 'value',
  },
  parentValue: {
    type: String,
    default: 'parent',
  },
  disabledItems: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  prependInnerIcon: {
    type: String,
    default: 'mdi-sort-variant',
  },
  variant: {
    type: String as PropType<
      | 'outlined'
      | 'filled'
      | 'plain'
      | 'underlined'
      | 'solo'
      | 'solo-inverted'
      | 'solo-filled'
      | undefined
    >,
    default: 'outlined',
  },
  rules: {
    type: Array as PropType<((v: any) => boolean | string)[]>,
    default: () => [],
  },
  error: {
    type: Boolean,
    default: false,
  },
  chips: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  checkboxes: {
    type: Boolean,
    default: false,
  },
  showRoot: {
    type: Boolean,
    default: false,
  },
  rootValue: {
    type: null as unknown as PropType<any>,
    default: '',
  },
  rootTitle: {
    type: String,
    default: 'Root',
  },
});

const modelValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const dialogValue = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const error = computed({
  get: () => props.error,
  set: (v) => emit('update:error', v),
});

const items = computed(() => {
  if (props.showRoot) {
    return [
      { [props.itemValue]: props.rootValue, [props.itemTitle]: props.rootTitle },
      ...props.items,
    ];
  }
  return props.items;
});

const tree = ref({
  nodes: {} as Record<string, VueTreeViewConfig.TreeNode<any>>,
  config: {} as VueTreeViewConfig.TreeConfig,
});

const methods = {
  close: () => {
    dialogValue.value = false;
  },
  nodeIsChecked: (item: any) => {
    if (item[props.itemValue] === modelValue.value) return true;
    return false;
  },
  nodeFocus: (node: VueTreeViewConfig.TreeNode<any>) => {
    if (!props.checkboxes) modelValue.value = node.id;
    methods.close();
  },
  _openParentOfModel: () => {
    const ids = props.checkboxes ? modelValue.value : [modelValue.value];
    lodash.forEach(ids, (id) => methods._openParent(tree.value.nodes[id]));
  },
  _openParent: (node?: VueTreeViewConfig.TreeNode<any>) => {
    if (!node) return;
    const parent = tree.value.nodes[node.item[props.parentValue]];
    if (!parent) return;
    parent.state.opened = true;
    methods._openParent(parent);
  },
};

watchEffect(() => {
  // if dialog is not open, return.
  if (!dialogValue.value) return;

  tree.value.nodes = lodash
    .chain(items.value)
    .mapValues((item) => {
      const id = item[props.itemValue];

      return {
        id: id,
        text: i18n.ndt(item[props.itemTitle], undefined, { context: props.itemTitleContext }),
        item: item,
        state: {
          opened: tree.value.nodes[id]?.state?.opened || false,
          checked: methods.nodeIsChecked(item),
          disabled: props.disabledItems.includes(id),
        },
        children: lodash
          .chain(items.value)
          .filter((child) => child[props.parentValue] === id)
          .map((m) => String(m[props.itemValue]))
          .value(),
      };
    })
    .keyBy('id')
    .value();

  methods._openParent(tree.value.nodes[modelValue.value]);

  tree.value.config = {
    checkboxes: props.checkboxes,
    roots: lodash
      .chain(items.value)
      .filter((node) => {
        return props.showRoot
          ? lodash.isUndefined(node[props.parentValue])
          : !node[props.parentValue];
      })
      .map(props.itemValue)
      .value(),
  };
});
</script>

<template>
  <v-dialog v-model="dialogValue" :max-width="maxWidth">
    <template v-slot:activator="{ props: actProps }">
      <v-select
        density="compact"
        v-model="modelValue"
        :label="label"
        :items="items"
        :item-title="itemTitle"
        :item-value="itemValue"
        :prepend-inner-icon="prependInnerIcon"
        :variant="variant"
        :rules="rules"
        :error="error"
        :chips="chips"
        :clearable="clearable"
        :menuIcon="''"
        readonly
      >
        <template v-for="(_, name) in $slots" v-slot:[name]="data">
          <!-- slots -->
          <slot :name="name" v-bind="data"></slot>
        </template>
        <template v-slot:append-inner>
          <v-btn v-bind="actProps" variant="text" density="compact" icon="mdi-chevron-down"></v-btn>
        </template>
      </v-select>
    </template>

    <v-card flat>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="methods.close" density="compact" variant="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-0">
        <hr class="mb-4 linear" />
        <VueTreeView
          :class="checkboxes ? 'multi' : 'uni'"
          :nodes="tree.nodes"
          :config="tree.config"
          @node-focus="methods.nodeFocus"
        ></VueTreeView>
        <hr class="my-4 linear" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="css">
.tree.uni :deep(.node-wrapper.checked) {
  border: 0;
  background-color: #e0e0e0;
}
</style>
