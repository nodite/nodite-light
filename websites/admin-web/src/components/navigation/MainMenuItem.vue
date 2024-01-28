<script setup lang="ts">
import i18n from '@/plugins/i18n';
import { useCustomizeThemeStore } from '@/stores/modules/customizeTheme';
import { NavigationConfig } from '@/types/config';
import lodash from '@/utils/lodash';

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
    return Boolean(i18n.ndt(props.menuItem.meta?.title));
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
        {{ $ndt(props.menuItem.meta?.title) }}
      </div>
      <template v-if="validator.hasChildren()">
        <!-- subMenu -->
        <main-menu-item
          v-bind="props"
          v-for="(subMenuItem, idx) in menuItem.children"
          :key="idx"
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
          <v-list-item v-bind="props" :title="$ndt(menuItem.meta?.title)">
            <template v-slot:prepend>
              <v-icon size="small">{{ menuItem.meta?.icon || 'mdi-circle-medium' }}</v-icon>
            </template>
          </v-list-item>
        </template>
        <template v-if="validator.hasChildren()">
          <!-- subMenu -->
          <main-menu-item
            v-bind="props"
            v-for="(subMenuItem, idx) in menuItem.children"
            :key="idx"
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
        :to="menuItem.path"
        :active-class="`active-nav-${customizeTheme.primaryColor.colorName}`"
        density="compact"
      >
        <template v-slot:prepend>
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
