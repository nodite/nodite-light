<!--
* @Component: LanguageSwitcher.vue
* @Maintainer: J.K. Yang
* @Description: 语言切换组件
-->
<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useLocale } from 'vuetify';

import locales from '@/configs/locales';
import { useCustomizeThemeStore } from '@/stores/modules/customizeTheme';
import type { LocaleConfig } from '@/types/config';

const { current } = useLocale();
const customizeTheme = useCustomizeThemeStore();

const methods = {
  setLocale(locale: Omit<LocaleConfig.Locale, 'messages'>) {
    if (locale.code) current.value = locale.code;
    customizeTheme.setLocale(locale);
  },
};

onMounted(() => {
  methods.setLocale(customizeTheme.locale);
});
</script>
<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon color="primary">mdi-translate</v-icon>
      </v-btn>
    </template>
    <v-list nav>
      <v-list-item
        v-for="locale in locales.availableLocales"
        :key="locale.code"
        @click="methods.setLocale(locale)"
        density="compact"
        :active="locale.code === current"
      >
        <template v-slot:prepend>
          <Icon :icon="`twemoji:flag-${locale.name}`" class="mr-2" />
        </template>
        <v-list-item-title> {{ locale.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
