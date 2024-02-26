<script setup lang="ts">
import { toast } from 'vuetify-sonner';

import i18n from '@/plugins/i18n';
import clipboard from '@/utils/clipboard';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
});

const copyText = (event: Event) => {
  clipboard(props.text, event);
  toast.success(i18n.ndt('Copied to clipboard.'));
};
</script>

<template>
  <div>
    <v-btn v-bind="$attrs" icon @click="copyText($event)" :title="$ndt('Copy')">
      <v-icon>mdi-content-copy</v-icon>
      <v-tooltip activator="parent" location="bottom" text="Copy"></v-tooltip>
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.text {
  cursor: pointer;
  display: inline-block;
}
</style>
