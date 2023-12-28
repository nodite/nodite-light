<script setup lang="ts">
import { kebabCase } from 'change-case';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import * as Icons from '../assets/icons';

const { t: $t } = useI18n();

const emit = defineEmits(['close-icon-picker', 'input']);

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  activator: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: Number,
    default: 700,
  },
});

const localData = ref({
  dialog: props.dialog,
  tab: null,
  tabs: [
    { key: 'direction', icon: '' },
    { key: 'indication', icon: '' },
    { key: 'editing', icon: '' },
    { key: 'data', icon: '' },
    { key: 'shape', icon: 'mdi-shape' },
    { key: 'common', icon: '' },
  ] as { key: string; icon: string }[],
});

watchEffect(() => {
  localData.value.dialog = props.dialog;
});

const iconDict = computed((): Record<string, string[]> => {
  return {
    common: Icons.Common.map((i) => kebabCase(i)),
    data: Icons.Data.map((i) => kebabCase(i)),
    direction: Icons.Direction.map((i) => kebabCase(i)),
    editing: Icons.Editing.map((i) => kebabCase(i)),
    indication: Icons.Indication.map((i) => kebabCase(i)),
    shape: Icons.Shape.map((i) => kebabCase(i)),
  };
});

const methods = {
  clearLocalData() {
    localData.value.dialog = false;
    localData.value.tab = null;
  },
  closeIconPicker() {
    methods.clearLocalData();
    emit('close-icon-picker');
  },
  input(icon: string) {
    emit('input', icon);
    methods.closeIconPicker();
  },
};
</script>

<template>
  <v-dialog
    v-model="localData.dialog"
    @click:outside="methods.closeIconPicker"
    :max-width="maxWidth"
  >
    <template v-if="activator" v-slot:activator="{ props }">
      <v-btn v-bind="props" variant="tonal" density="comfortable">
        {{ $t('$vuetify.icon_picker.open') }}
      </v-btn>
    </template>

    <v-card flat>
      <v-toolbar color="primary">
        <v-toolbar-title>{{ $t('$vuetify.icon_picker.title') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="methods.closeIconPicker">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <div class="d-flex flex-row">
        <v-tabs v-model="localData.tab" direction="vertical" color="primary">
          <v-tab v-for="v in localData.tabs" :key="v.key" :value="v.key" class="py-2">
            <v-icon start>{{ v.icon }}</v-icon>
            {{ $t(`$vuetify.icon_picker.group.${v.key}`) }}
          </v-tab>
        </v-tabs>

        <v-window v-model="localData.tab">
          <v-window-item v-for="v in localData.tabs" :key="v.key" :value="v.key">
            <v-card flat>
              <v-card-text>
                <v-btn
                  class="ma-2"
                  elevation="20"
                  v-for="icon in iconDict[v.key]"
                  :key="icon"
                  density="default"
                  @click="methods.input(icon)"
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
  height: calc(48px * 7) !important;
  overflow-y: auto;
}
</style>
