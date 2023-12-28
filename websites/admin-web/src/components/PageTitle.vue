<script setup lang="ts">
import { NavigationConfig } from '@/types/config';
import * as menuUtil from '@/utils/menu';

const route = useRoute() as unknown as NavigationConfig.Router;
const title = ref('');

watchEffect(() => {
  title.value = menuUtil.toI18Title(route.meta) as string;
});
</script>

<template>
  <h1 class="text-h5 mt-5">{{ title }}</h1>
</template>
