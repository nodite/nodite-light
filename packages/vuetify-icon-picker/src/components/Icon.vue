<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineEmits(['click']);

defineProps({
  icon: {
    type: String,
  },
  classes: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <Icon v-if="icon?.includes(':')" :icon="icon" :class="classes" @click="$emit('click')"></Icon>
  <v-icon v-else :icon="icon" :class="classes" @click="$emit('click')"></v-icon>
</template>
