<script setup lang="ts">
import lodash from 'lodash';

import { useCustomizeThemeStore } from '@/stores/modules/customizeTheme';
import { NavigationConfig } from '@/types/config';

const customizeTheme = useCustomizeThemeStore();

const props = defineProps({
  menuItem: {
    type: Object as PropType<NavigationConfig.Menu>,
    default: () => ({}),
  },
  menuLevel: {
    type: Number,
    default: 1,
  },
});

const validator = {
  getIType: () => {
    return props.menuItem.iType || 'menu';
  },
  hasTitle: () => {
    return props.menuItem.iKey || props.menuItem.meta?.title;
  },
  hasChildren: () => {
    return !lodash.isEmpty(props.menuItem.children);
  },
  isHidden: () => {
    return Boolean(props.menuItem.meta?.hidden) || !validator.hasTitle();
  },
  isOverline: () => {
    return validator.getIType() === 'overline';
  },
  isDirectory: () => {
    return validator.getIType() === 'directory';
  },
  isMenu: () => {
    return validator.getIType() === 'menu';
  },
  isAction: () => {
    return validator.getIType() === 'action';
  },
};
</script>

<template>
  <template v-if="!validator.isHidden()">
    <template v-if="validator.isOverline()">
      <!-- overline -->
      <div
        v-bind="props"
        v-if="!customizeTheme.miniSidebar && validator.hasTitle()"
        class="pa-1 mt-2 text-overline"
      >
        {{ menuItem.iKey ? $t(menuItem.iKey) : menuItem.meta?.title }}
      </div>
      <template v-if="validator.hasChildren()">
        <!-- subMenu -->
        <main-menu-item
          v-bind="props"
          v-for="subMenuItem in menuItem.children"
          :key="subMenuItem.iKey"
          :menu-item="subMenuItem"
          :menu-level="menuLevel + 1"
        ></main-menu-item>
      </template>
    </template>

    <template v-else-if="validator.isDirectory()">
      <!-- directory -->
      <v-list-group :value="menuItem.children">
        <!-- activator -->
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="menuItem.icon || 'mdi-circle-medium'"
            :title="menuItem.iKey ? $t(menuItem.iKey) : menuItem.meta?.title"
          ></v-list-item>
        </template>
        <template v-if="validator.hasChildren()">
          <!-- subMenu -->
          <main-menu-item
            v-bind="props"
            v-for="subMenuItem in menuItem.children"
            :key="subMenuItem.iKey"
            :menu-item="subMenuItem"
            :menu-level="menuLevel + 1"
          ></main-menu-item>
        </template>
      </v-list-group>
    </template>

    <template v-else-if="validator.isMenu()">
      <!-- menu -->
      <v-list-item
        v-bind="props"
        :key="menuItem.iKey"
        :to="menuItem.path"
        :prepend-icon="menuItem.icon || 'mdi-circle-medium'"
        :active-class="`active-nav-${customizeTheme.primaryColor.colorName}`"
        density="compact"
      >
        <v-list-item-title v-bind="props">
          {{ menuItem.iKey ? $t(menuItem.iKey) : menuItem.meta?.title }}
        </v-list-item-title>
      </v-list-item>
    </template>
  </template>
</template>

<style scoped>
@import '@/components/navigation/MainMenuItem.scss';
</style>
