<script setup lang="ts">
import { PropType } from 'vue';

import MainMenuItem from '@/components/navigation/MainMenuItem.vue';
import { NavigationConfig } from '@/types/config';

defineProps({
  // Data
  menus: {
    type: Array as PropType<NavigationConfig.Menu[]>,
    default: () => [],
  },
});
</script>

<template>
  <v-list class="menu-list" nav dense color="primary">
    <template v-for="menu in menus" :key="menu.menuId">
      <!-- menu level 0 -->
      <MainMenuItem :menu-item="menu" :menu-level="0"></MainMenuItem>
    </template>
  </v-list>
</template>

<style scoped>
@import '@/components/navigation/MainMenuItem.scss';
</style>
