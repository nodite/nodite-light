<script setup lang="ts">
import { Icon } from '@nodite-light/vuetify-icon-picker';
import { useLocale } from 'vuetify';

import { IAvailableLocale } from '@/api/admin/data-contracts';
import { useLocaleStore } from '@/stores/modules/localeStore';

const { current } = useLocale();
const localeStore = useLocaleStore();

const availableLocales = ref([] as IAvailableLocale[]);

const methods = {
  setLocale(locale: IAvailableLocale, notice: boolean = true) {
    if (locale.langcode) current.value = locale.langcode;
    if (notice) localeStore.setCurrLocale(locale);
  },
};

onMounted(async () => {
  methods.setLocale(localeStore.currLocale, false);
});

watchEffect(async () => {
  availableLocales.value = await localeStore.listAvailableLocales();
});
</script>
<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" :title="$ndt('Language Switcher')">
        <v-icon color="primary">mdi-translate</v-icon>
      </v-btn>
    </template>
    <v-list nav>
      <v-list-item
        v-for="locale in availableLocales"
        :key="locale.langcode"
        @click="methods.setLocale(locale)"
        density="compact"
        :active="locale.langcode === current"
      >
        <template v-slot:prepend>
          <Icon :icon="locale.icon" classes="mr-2" />
        </template>
        <v-list-item-title> {{ locale.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
