<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useTheme } from 'vuetify';

import { useCustomizeThemeStore } from '@/stores/modules/customizeTheme';
import { ThemeConfig } from '@/types/config';

const customizeTheme = useCustomizeThemeStore();
const theme = useTheme();

const themeDrawer = ref(false);

const currentColor = ref<ThemeConfig.Color>({
  colorId: 2,
  colorName: 'grey',
  colorValue: '#344767',
});

onMounted(() => updatePrimaryColor(customizeTheme.primaryColor));

watch(currentColor, () => {
  updatePrimaryColor(customizeTheme.primaryColor);
});

const updatePrimaryColor = (color: ThemeConfig.Color) => {
  theme.themes.value.light.colors.primary = color.colorValue;
  theme.themes.value.dark.colors.primary = color.colorValue;
  currentColor.value = color;
};
</script>

<template>
  <div>
    <div class="drawer-button" @click="themeDrawer = true">
      <v-icon class="text-white">mdi-cog-outline</v-icon>
    </div>

    <v-navigation-drawer
      v-model="themeDrawer"
      location="right"
      temporary
      width="300"
      class="theme-drawer"
    >
      <div class="pa-5">
        <div class="top-area">
          <div class="d-flex align-center">
            <b>UI Configurator</b>
            <v-spacer></v-spacer>
          </div>
          <div>See our dashboard options.</div>
        </div>

        <hr class="my-6 linear" />

        <div class="theme-area">
          <b>Global Theme Mode</b>
          <div class="px-3 pt-3" v-if="customizeTheme.darkTheme">
            <v-btn
              @click="customizeTheme.setDarkTheme(!customizeTheme.darkTheme, updatePrimaryColor)"
              color="grey-darken-4"
              class="text-white"
              :title="$ndt('Change to Light Mode')"
              icon
            >
              <Icon width="30" icon="line-md:moon-filled-loop" />
            </v-btn>
            <span class="ml-5">Dark Mode</span>
          </div>
          <div class="px-3 pt-3" v-else>
            <v-btn
              @click="customizeTheme.setDarkTheme(!customizeTheme.darkTheme, updatePrimaryColor)"
              color="white"
              class="text-red"
              :title="$ndt('Change to Dark Mode')"
              icon
            >
              <Icon width="30" icon="line-md:moon-filled-alt-to-sunny-filled-loop-transition" />
            </v-btn>
            <span class="ml-5">Light Mode</span>
          </div>
        </div>

        <hr class="my-6 linear" />

        <div>
          <v-btn color="" class="gradient info" block size="large" :title="$ndt('Contact Me')">
            Contact Me
          </v-btn>
        </div>
        <div class="ml-5 mt-5 d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-email-outline</v-icon>
          <a href="mailto:oscaner1997@gmail.com">oscaner1997@gmail.com</a>
        </div>
        <div>
          <img src="@/assets/wechat.jpg" alt="" />
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<style lang="scss" scoped>
.drawer-button {
  position: fixed;
  background-color: #705cf6;
  top: 340px;
  right: -45px;
  z-index: 999;
  padding: 0.5rem 1rem;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  box-shadow: 1px 1px 9px #705cf6;
  transition: all 0.5s;
  cursor: pointer;
  &:hover {
    box-shadow: 1px 1px 18px #705cf6;
    right: 0px;
    transition: all 0.5s;
  }

  .v-icon {
    font-size: 1.3rem;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
