<script setup lang="ts">
import Breadcrumb from '@/components/Breadcrumb.vue';
// import GlobalLoading from '@/components/GlobalLoading.vue';
import MainSidevar from '@/components/navigation/MainSidebar.vue';
import PageTitle from '@/components/PageTitle.vue';
import MainAppbar from '@/components/toolbar/MainAppbar.vue';
import ToolBox from '@/components/Toolbox.vue';
import { useCustomizeThemeStore } from '@/stores/modules/customizeTheme';

const customizeTheme = useCustomizeThemeStore();
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Main Sidebar -->
  <!-- ---------------------------------------------- -->
  <MainSidevar />
  <!-- ---------------------------------------------- -->
  <!---Top AppBar -->
  <!-- ---------------------------------------------- -->
  <MainAppbar />
  <!-- ---------------------------------------------- -->
  <!---MainArea -->
  <!-- ---------------------------------------------- -->
  <v-main
    v-touch="{
      left: () => (customizeTheme.mainSidebar = false),
      right: () => (customizeTheme.mainSidebar = true),
    }"
    class="main-container"
  >
    <!-- <GlobalLoading /> -->

    <div class="d-none d-sm-block px-3">
      <PageTitle></PageTitle>
      <Breadcrumb></Breadcrumb>
    </div>

    <div class="flex-fill">
      <slot></slot>
    </div>
    <ToolBox />
  </v-main>
</template>

<style scoped>
.scrollnav {
  height: calc(100vh - 326px);
}

.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
