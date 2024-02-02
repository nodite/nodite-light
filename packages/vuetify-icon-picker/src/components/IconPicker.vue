<script setup lang="ts">
import { kebabCase } from 'change-case';
import { ref } from 'vue';
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import IconCommon from '../assets/icons/common';
import IconData from '../assets/icons/data';
import IconDirection from '../assets/icons/direction';
import IconEditing from '../assets/icons/editing';
import IconIndication from '../assets/icons/indication';
import IconNavigation from '../assets/icons/navigation';
import IconShape from '../assets/icons/shape';
import Icon from './Icon.vue';

const { t: $t } = useI18n();

const emit = defineEmits(['update:modelValue', 'update:dialog', 'update:error', 'close']);

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  dialog: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: Number,
    default: 700,
  },
  label: {
    type: String,
    default: '',
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
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array as PropType<((v: any) => boolean | string)[]>,
    default: () => [],
  },
  error: {
    type: Boolean,
    default: false,
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

// Local data.
const myRefStore = ref({
  initialized: false,
  tab: null,
  tabs: [
    { key: 'common', icon: '' },
    { key: 'data', icon: '' },
    { key: 'direction', icon: '' },
    { key: 'editing', icon: 'mdi-tag-edit' },
    { key: 'indication', icon: 'mdi-flag' },
    { key: 'navigation', icon: 'mdi-navigation-variant' },
    { key: 'shape', icon: 'mdi-shape' },
  ] as { key: string; icon: string }[],
  iconDict: {
    common: IconCommon.map((i) => kebabCase(i)),
    data: IconData.map((i) => kebabCase(i)),
    direction: IconDirection.map((i) => kebabCase(i)),
    editing: IconEditing.map((i) => kebabCase(i)),
    indication: IconIndication.map((i) => kebabCase(i)),
    navigation: IconNavigation.map((i) => kebabCase(i)),
    shape: IconShape.map((i) => kebabCase(i)),
  } as Record<string, string[]>,
});

// Methods.
const methods = {
  // Open dialog.
  open() {
    dialogValue.value = true;
  },
  // Input icon.
  input(icon: string) {
    modelValue.value = icon;
    dialogValue.value = false;
  },
  // Close dialog.
  close() {
    dialogValue.value = false;
  },
};
</script>

<template>
  <v-dialog v-model="dialogValue" :max-width="maxWidth">
    <template v-slot:activator="{ props: actProps }">
      <v-text-field
        density="compact"
        v-model="modelValue"
        :label="props.label"
        :variant="props.variant"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :rules="props.rules"
        validate-on="blur"
        :error="error"
      >
        <template v-if="modelValue" v-slot:prepend-inner>
          <Icon :icon="modelValue"></Icon>
        </template>
        <template v-slot:append-inner>
          <v-btn
            v-bind="actProps"
            variant="tonal"
            density="compact"
            :title="$t('$vuetify.iconPicker.open')"
          >
            {{ $t('$vuetify.iconPicker.open') }}
          </v-btn>
        </template>
      </v-text-field>
    </template>

    <v-card flat>
      <v-toolbar color="primary">
        <v-toolbar-title>{{ $t('$vuetify.iconPicker.title') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="methods.close" :title="$t('Close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <div class="d-flex flex-row">
        <v-tabs v-model="myRefStore.tab" direction="vertical" color="primary">
          <v-tab v-for="v in myRefStore.tabs" :key="v.key" :value="v.key" class="py-2">
            <v-icon start>{{ v.icon }}</v-icon>
            {{ $t(`$vuetify.iconPicker.group.${v.key}`) }}
          </v-tab>
        </v-tabs>

        <v-window v-model="myRefStore.tab">
          <v-window-item v-for="v in myRefStore.tabs" :key="v.key" :value="v.key">
            <v-card flat>
              <v-card-text>
                <v-btn
                  class="ma-2"
                  elevation="20"
                  v-for="icon in myRefStore.iconDict[v.key]"
                  :key="icon"
                  density="default"
                  @click="methods.input(icon)"
                  :title="icon"
                >
                  <v-icon>{{ icon }}</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="css">
.v-window {
  width: 100% !important;
  height: calc(48px * 8) !important;
  overflow-y: auto;
}
</style>
