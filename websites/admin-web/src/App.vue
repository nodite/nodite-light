<script setup lang="ts">
import BackToTop from '@/components/common/BackToTop.vue';
import Sonner from '@/components/common/Sonner.vue';
import CustomizationMenu from '@/components/CustomizationMenu.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import LandingLayout from '@/layouts/LandingLayout.vue';
import UILayout from '@/layouts/UILayout.vue';
import { useCustomizeThemeStore } from '@/stores/modules/customizeTheme';

const customizeTheme = useCustomizeThemeStore();
const route = useRoute();

const isRouterLoaded = computed(() => {
  if (route.name !== null) return true;
  return false;
});

const layouts = {
  default: DefaultLayout,
  ui: UILayout,
  landing: LandingLayout,
  auth: AuthLayout,
  error: DefaultLayout,
};

type LayoutName = 'default' | 'ui' | 'landing' | 'auth' | 'error';

const currentLayout = computed(() => {
  const layoutName = route.meta.layout as LayoutName;
  if (!layoutName) {
    return DefaultLayout;
  }
  return layouts[layoutName];
});
</script>

<template>
  <v-app :theme="customizeTheme.darkTheme ? 'dark' : 'light'">
    <component :is="currentLayout" v-if="isRouterLoaded">
      <router-view></router-view>
    </component>
    <CustomizationMenu />
    <BackToTop />
    <Sonner />
  </v-app>
</template>

<style scoped></style>
