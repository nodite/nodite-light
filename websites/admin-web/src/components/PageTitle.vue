<script setup lang="ts">
import { $tnd } from '@/plugins/i18n';
import { NavigationConfig } from '@/types/config';

const route = useRoute() as unknown as NavigationConfig.Router;
const title = ref('');

watchEffect(() => {
  title.value = $tnd(route.meta?.iKey, route.meta?.title) as string;
});
</script>

<template>
  <h1 class="text-h5 mt-5">{{ title }}</h1>
</template>
