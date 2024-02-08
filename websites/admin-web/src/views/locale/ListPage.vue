<script setup lang="ts">
import { useLocaleStore } from '@/stores/modules/localeStore';
import LocaleList from '@/views/locale/LocaleList.vue';
import MessageList from '@/views/locale/MessageList.vue';

const localeStore = useLocaleStore();

const tab = computed({
  get: () => localeStore.pageTab,
  set: (v) => (localeStore.pageTab = v),
});
</script>

<template>
  <div class="d-flex flex-row">
    <v-tabs v-model="tab" density="comfortable" direction="vertical">
      <v-tab value="locales">
        <v-icon start>mdi-earth</v-icon>
        {{ $ndt('Locales', undefined, { context: 'locale.tab' }) }}
      </v-tab>
      <v-tab value="messages">
        <v-icon start>mdi-translate</v-icon>
        {{ $ndt('Messages', undefined, { context: 'locale.tab' }) }}
      </v-tab>
    </v-tabs>

    <v-window class="w-100" v-model="tab">
      <v-window-item value="locales">
        <v-container class="py-0"><LocaleList></LocaleList></v-container>
      </v-window-item>

      <v-window-item value="messages">
        <v-container class="py-0"><MessageList></MessageList></v-container>
      </v-window-item>
    </v-window>
  </div>
</template>
