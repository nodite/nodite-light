<script setup lang="ts">
import { toast } from 'vuetify-sonner';

import i18n from '@/plugins/i18n';
import clipboard from '@/utils/clipboard';

// ToolTip
const tooltip = ref('Copy');

// Copy Animation Flag
const heartBeat = ref(false);

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
});

const { text } = toRefs(props);

// Copy Text
const copyText = (text: string, event: Event) => {
  clipboard(text, event);
  heartBeat.value = true;
  toast.success(i18n.ndt('Copied to clipboard.'));
  tooltip.value = 'Copied';
  setTimeout(() => {
    heartBeat.value = false;
    tooltip.value = 'Copy';
  }, 1000);
};
</script>

<template>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <span
        :class="{
          heartBeat: heartBeat === true,
        }"
        class="text"
        v-bind="props"
        @click.stop.prevent="copyText(text, $event)"
      >
        {{ text }}
      </span>
    </template>
    <span>{{ $ndt(tooltip) }}</span>
  </v-tooltip>
</template>

<style scoped lang="scss">
.text {
  cursor: pointer;
  display: inline-block;
  border-bottom: 1px dashed;
}
</style>
