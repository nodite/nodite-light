<script setup lang="ts">
import MainMenuItem from '@/components/navigation/MainMenuItem.vue';
import { NavigationConfig } from '@/types/config';

const props = defineProps({
  // Data
  menu: {
    type: Array<NavigationConfig.Menu>,
    default: () => [],
  },
});
</script>

<template>
  <v-list class="menu-list" nav dense color="primary">
    <template v-for="menuArea in props.menu" :key="menuArea.key">
      <!-- menu level 0 -->
      <main-menu-item :menu-item="menuArea" :menu-level="0"></main-menu-item>
    </template>
  </v-list>
</template>

<style scoped>
@import '@/components/navigation/MainMenuItem.scss';
</style>
