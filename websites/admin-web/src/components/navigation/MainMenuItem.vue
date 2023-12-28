<script setup lang="ts">
import lodash from 'lodash';

import { useCustomizeThemeStore } from '@/stores/modules/customizeTheme';
import { NavigationConfig } from '@/types/config';
import * as menuUtil from '@/utils/menu';

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
  getiType: (): NavigationConfig.MenuType => {
    return props.menuItem.meta?.iType || 'menu';
  },
  hasTitle: () => {
    return Boolean(menuUtil.toI18Title(props.menuItem.meta));
  },
  hasChildren: () => {
    return !lodash.isEmpty(props.menuItem.children);
  },
  isHidden: () => {
    return Boolean(props.menuItem.meta?.hidden) || !validator.hasTitle();
  },
  isOverline: (): boolean => {
    return validator.getiType() === 'overline';
  },
  isDirectory: (): boolean => {
    return validator.getiType() === 'directory';
  },
  isMenu: (): boolean => {
    return validator.getiType() === 'menu';
  },
  isAction: (): boolean => {
    return validator.getiType() === 'action';
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
        {{ menuUtil.toI18Title(props.menuItem.meta) }}
      </div>
      <template v-if="validator.hasChildren()">
        <!-- subMenu -->
        <main-menu-item
          v-bind="props"
          v-for="subMenuItem in menuItem.children"
          :key="subMenuItem.meta?.iKey"
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
            :prepend-icon="menuItem.meta?.icon || 'mdi-circle-medium'"
            :title="menuUtil.toI18Title(menuItem.meta)"
          ></v-list-item>
        </template>
        <template v-if="validator.hasChildren()">
          <!-- subMenu -->
          <main-menu-item
            v-bind="props"
            v-for="subMenuItem in menuItem.children"
            :key="subMenuItem.meta?.iKey"
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
        :key="menuItem.meta?.iKey"
        :to="menuItem.path"
        :prepend-icon="menuItem.meta?.icon || 'mdi-circle-medium'"
        :active-class="`active-nav-${customizeTheme.primaryColor.colorName}`"
        density="compact"
      >
        <v-list-item-title v-bind="props">
          {{ menuUtil.toI18Title(menuItem.meta) }}
        </v-list-item-title>
      </v-list-item>
    </template>
  </template>
</template>

<style scoped>
@import '@/components/navigation/MainMenuItem.scss';
</style>
