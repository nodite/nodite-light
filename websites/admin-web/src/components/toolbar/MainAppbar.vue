<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import { useDisplay } from 'vuetify';

import LanguageSwitcher from '@/components/toolbar/LanguageSwitcher.vue';
import { useCustomizeThemeStore } from '@/stores/modules/customizeTheme';

import ToolbarUser from './ToolbarUser.vue';
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
      <v-app-bar-nav-icon @click="customizeTheme.mainSidebar = !customizeTheme.mainSidebar"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <div class="d-flex">
        <LanguageSwitcher />
        <ToolbarUser />
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss"></style>
