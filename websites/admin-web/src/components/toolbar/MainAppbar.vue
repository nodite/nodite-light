<script setup lang="ts">
import { useDisplay } from 'vuetify';

import CacheClear from '@/components/toolbar/CacheClear.vue';
import LanguageSwitcher from '@/components/toolbar/LanguageSwitcher.vue';
import ToolbarUser from '@/components/toolbar/ToolbarUser.vue';
import { useCustomizeThemeStore } from '@/stores/modules/customizeTheme';

const { mdAndUp } = useDisplay();
const customizeTheme = useCustomizeThemeStore();
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!--App Bar -->
  <!-- ---------------------------------------------- -->
  <v-app-bar :density="mdAndUp ? 'default' : 'compact'">
    <!-- ---------------------------------------------- -->
    <!-- search input mobil -->
    <!-- ---------------------------------------------- -->

    <div class="px-2 d-flex align-center justify-space-between w-100">
      <!-- ---------------------------------------------- -->
      <!-- NavIcon -->
      <!-- ---------------------------------------------- -->
      <v-app-bar-nav-icon
        @click="customizeTheme.mainSidebarRail = !customizeTheme.mainSidebarRail"
      ></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <div class="d-flex">
        <LanguageSwitcher />
        <CacheClear />
        <ToolbarUser />
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss"></style>
