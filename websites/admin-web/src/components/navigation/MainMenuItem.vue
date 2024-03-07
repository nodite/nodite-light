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
  getType: (): NavigationConfig.MenuType => {
    return props.menuItem.meta?.iType || 'menu';
  },
  hasTitle: () => {
    return Boolean(props.menuItem.meta?.title);
  },
  hasChildren: () => {
    return !lodash.isEmpty(props.menuItem.children);
  },
  isHidden: () => {
    return Boolean(props.menuItem.meta?.hidden) || !validator.hasTitle();
  },
  isOverline: (): boolean => {
    return validator.getType() === 'overline';
  },
  isDirectory: (): boolean => {
    if (validator.getType() === 'directory') {
      return true;
    }
    if (validator.getType() === 'menu' && validator.hasChildren()) {
      return true;
    }
    return false;
  },
  isMenu: (): boolean => {
    return validator.getType() === 'menu';
  },
  isAction: (): boolean => {
    return validator.getType() === 'action';
  },
};
</script>

<template>
  <template v-if="!validator.isHidden()">
    <!-- overline -->
    <template v-if="validator.isOverline()">
      <div v-bind="props" v-if="validator.hasTitle()" class="px-1 text-overline">
        <hr class="linear" v-if="customizeTheme.mainSidebarRail" />
        <span v-if="!customizeTheme.mainSidebarRail">{{ $ndt(props.menuItem.meta?.title) }}</span>
      </div>

      <!-- subMenu -->
      <template v-if="validator.hasChildren()">
        <MainMenuItem
          v-bind="props"
          v-for="(subMenuItem, idx) in menuItem.children"
          :key="idx"
          :menu-item="subMenuItem"
          :menu-level="menuLevel + 1"
        ></MainMenuItem>
      </template>
    </template>

    <!-- directory -->
    <template v-else-if="validator.isDirectory()">
      <!-- no-rail -->
      <v-list-group v-if="!customizeTheme.mainSidebarRail">
        <!-- activator -->
        <template #activator="{ props }">
          <v-list-item v-bind="props" :title="$ndt(menuItem.meta?.title)" density="compact">
            <template #prepend>
              <v-icon size="small">{{ menuItem.meta?.icon || 'mdi-circle-medium' }}</v-icon>
            </template>
          </v-list-item>
        </template>
        <!-- subMenu -->
        <template v-if="validator.hasChildren() && !customizeTheme.mainSidebarRail">
          <MainMenuItem
            v-bind="props"
            v-for="(subMenuItem, idx) in menuItem.children"
            :key="idx"
            :menu-item="subMenuItem"
            :menu-level="menuLevel + 1"
          ></MainMenuItem>
        </template>
      </v-list-group>

      <!-- rail -->
      <v-menu v-if="customizeTheme.mainSidebarRail" location="end" open-on-hover open-on-click>
        <!-- activator -->
        <template #activator="{ props }">
          <v-list-item v-bind="props" :title="$ndt(menuItem.meta?.title)" density="compact">
            <template #prepend>
              <v-icon size="small">{{ menuItem.meta?.icon || 'mdi-circle-medium' }}</v-icon>
            </template>
          </v-list-item>
        </template>
        <!-- subMenu -->
        <v-list class="v-list-item--nav" density="compact">
          <v-list-subheader>
            {{ $ndt(menuItem.meta?.title) }}
          </v-list-subheader>

          <hr class="linear" />

          <MainMenuItem
            v-bind="props"
            v-for="(subMenuItem, idx) in menuItem.children"
            :key="idx"
            :menu-item="subMenuItem"
            :menu-level="menuLevel + 1"
          ></MainMenuItem>
        </v-list>
      </v-menu>
    </template>

    <!-- menu -->
    <template v-else-if="validator.isMenu()">
      <v-list-item
        v-bind="props"
        :to="menuItem.path"
        :active-class="`active-nav-${customizeTheme.primaryColor.colorName}`"
        density="compact"
      >
        <template #prepend>
          <v-icon size="small">{{ menuItem.meta?.icon || 'mdi-circle-medium' }}</v-icon>
        </template>
        <v-list-item-title v-bind="props">
          {{ $ndt(menuItem.meta?.title) }}
        </v-list-item-title>
      </v-list-item>
    </template>
  </template>
</template>

<style scoped>
@import '@/components/navigation/MainMenuItem.scss';
</style>
