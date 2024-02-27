<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import { Icon } from '@iconify/vue';

import MainMenu from '@/components/navigation/MainMenu.vue';
import { useCustomizeThemeStore } from '@/stores/modules/customizeTheme';
import { NavigationConfig } from '@/types/config';
import * as navUtil from '@/utils/navigation';

const customizeTheme = useCustomizeThemeStore();
const menus = ref([] as NavigationConfig.Menu[]);

onMounted(async () => {
  menus.value = await navUtil.getSidebar();
});

const openGithubSite = () => {
  window.open('https://github.com/oscaner', '_blank');
};

onMounted(() => {
  scrollToBottom();
});

const scrollToBottom = () => {
  const contentArea = document.querySelector('.v-navigation-drawer__content');
  const activeItem = document.querySelector('.v-list-item--active') as HTMLElement;

  setTimeout(() => {
    contentArea?.scrollTo({
      top: activeItem?.offsetTop,
    });
  }, 100);
};
</script>

<template>
  <v-navigation-drawer
    border="none"
    elevation="1"
    v-model="customizeTheme.mainSidebar"
    id="mainMenu"
    :rail="customizeTheme.mainSidebarRail"
    permanent
  >
    <!-- ---------------------------------------------- -->
    <!---Top Area -->
    <!-- ---------------------------------------------- -->
    <template #prepend>
      <v-card
        style="box-shadow: rgba(0, 0, 0, 0.05) 0px 25px 15px -20px"
        height="100"
        class="d-flex align-center justify-center"
        :to="{ path: '/' }"
      >
        <v-card-text v-if="!customizeTheme.mainSidebarRail">
          <img v-if="customizeTheme.darkTheme" width="200" src="@/assets/logo_dark.svg" alt="" />
          <img v-else width="200" src="@/assets/logo_light.svg" alt="" />
        </v-card-text>
        <v-card-text v-if="customizeTheme.mainSidebarRail">
          <!-- todo -->
        </v-card-text>
      </v-card>
    </template>

    <!-- ---------------------------------------------- -->
    <!---Nav List -->
    <!-- ---------------------------------------------- -->

    <main-menu :menus="menus"></main-menu>

    <!-- ---------------------------------------------- -->
    <!---Bottom Area -->
    <!-- ---------------------------------------------- -->
    <template v-if="!customizeTheme.mainSidebarRail" #append>
      <v-card
        theme="dark"
        height="225"
        class="pa-3"
        variant="text"
        style="box-shadow: rgba(0, 0, 0, 0.05) 0px -25px 15px -20px"
      >
        <v-card
          class="d-flex flex-column gradient pa-2"
          :class="customizeTheme.primaryColor.colorName"
          height="200"
        >
          <v-card-title>
            <v-btn
              class="mr-2"
              size="40"
              color="white"
              :class="`text-${customizeTheme.primaryColor.colorName}`"
              title="'Github'"
              icon
            >
              <Icon width="30" icon="line-md:github-loop" />
            </v-btn>
            Oscaner
          </v-card-title>
          <v-card-subtitle> </v-card-subtitle>
          <v-card-text>
            <div><b>Github:</b></div>
            <div>github.com/oscaner</div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="white"
              block
              prepend-icon="mdi-thumb-up-outline"
              variant="elevated"
              @click="openGithubSite"
              title="Star Me"
            >
              Star-Me
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </template>
  </v-navigation-drawer>
</template>

<style scoped lang="scss"></style>
