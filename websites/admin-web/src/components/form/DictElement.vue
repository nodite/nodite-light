<script setup lang="ts">
import lodash from 'lodash';
import { PropType } from 'vue';
import * as Components from 'vuetify/components';

import { IDictTypeWithItems } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import { useDictStore } from '@/stores/modules/dictStore';
import { Common } from '@/types/config';

const dictStore = useDictStore();

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: undefined,
  },
  component: {
    type: String as PropType<keyof typeof Components>,
    required: true,
  },
  componentProps: {
    type: Object as PropType<Common.VuePropType<Common.InstanceTypeValueOf<typeof Components>>>,
    default: () => ({}),
  },
  dictKey: {
    type: String,
    required: true,
  },
  showItemKey: {
    type: Boolean,
    default: false,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  showPrependLabel: {
    type: Boolean,
    default: false,
  },
});

const modelValue = computed({
  get: () => {
    if (['VRadioGroup'].includes(props.component)) {
      return String(props.modelValue);
    }
    return props.modelValue;
  },
  set: (v) => emit('update:modelValue', v),
});

const componentProps = computed(() => {
  return props.componentProps as any;
});

const dictType = ref({} as IDictTypeWithItems);

const dictItems = computed(() => {
  return lodash
    .chain(dictType.value.dictItems)
    .sortBy(['orderNum', 'itemId'])
    .map((item) => ({
      title: i18n.ndt(item.itemValue, undefined, { context: `dict.type.${item.dictKey}` }),
      value: item.itemKey,
    }))
    .value();
});

onMounted(async () => {
  dictType.value = (await dictStore.queryType(props.dictKey)) || ({} as IDictTypeWithItems);
});
</script>

<template>
  <!-- VTextField -->
  <component
    :is="component"
    v-if="['VTextField'].includes(component)"
    :label="
      props.showLabel ? $ndt(dictType.dictName, undefined, { context: 'dict.type' }) : undefined
    "
    v-bind="componentProps"
    v-model="modelValue"
  >
    <template v-if="props.showPrependLabel" #prepend>
      <v-label>{{ $ndt(dictType.dictName, undefined, { context: 'dict.type' }) }}:</v-label>
    </template>

    <template v-for="(_, name) in $slots" #[name]="data">
      <slot :name="`${name}`" v-bind="data"></slot>
    </template>
  </component>

  <!-- VSelect, VAutocomplete -->
  <component
    :is="component"
    v-else-if="['VSelect', 'VAutocomplete'].includes(component)"
    :label="
      props.showLabel ? $ndt(dictType.dictName, undefined, { context: 'dict.type' }) : undefined
    "
    v-bind="componentProps"
    v-model="modelValue"
    :items="dictItems"
    :item-title="props.showItemKey ? 'value' : 'title'"
    item-value="value"
  >
    <template v-if="props.showPrependLabel" #prepend>
      <v-label>{{ $ndt(dictType.dictName, undefined, { context: 'dict.type' }) }}:</v-label>
    </template>

    <template v-for="(_, name) in $slots" #[name]="data">
      <slot :name="`${name}`" v-bind="data"></slot>
    </template>
  </component>

  <!-- VRadioGroup -->
  <v-radio-group
    v-else-if="component === 'VRadioGroup'"
    :label="
      props.showLabel ? $ndt(dictType.dictName, undefined, { context: 'dict.type' }) : undefined
    "
    v-bind="componentProps"
    v-model="modelValue"
  >
    <template v-if="props.showPrependLabel" #prepend>
      <v-label>{{ $ndt(dictType.dictName, undefined, { context: 'dict.type' }) }}:</v-label>
    </template>

    <v-radio
      v-for="(item, idx) in dictItems"
      :key="idx"
      :label="item.title"
      :value="item.value"
    ></v-radio>

    <template v-for="(_, name) in $slots" #[name]="data">
      <slot :name="`${name}`" v-bind="data"></slot>
    </template>
  </v-radio-group>

  <!-- Others -->
  <v-alert v-else type="warning" density="compact">
    {{ component }}: {{ $ndt('Not implemented yet.') }}
  </v-alert>
</template>
