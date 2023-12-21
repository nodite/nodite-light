<script setup lang="ts">
import { NavigationConfig } from '@/types/config';
import * as navUtil from '@/utils/navigation';

const route = useRoute() as unknown as NavigationConfig.Router;
const title = ref('');

watchEffect(() => {
  title.value = navUtil.toi18Title(route as NavigationConfig.Router) as string;
});
</script>

<template>
  <h1 class="text-h5 mt-5">{{ title }}</h1>
</template>
