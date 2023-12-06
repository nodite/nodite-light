<template>
  <v-breadcrumbs v-if="breadcrumbs.length > 0" :items="breadcrumbs" class="ml-n3 text-body-2">
    <!-- <template v-slot:prepend>
      <v-icon size="small" icon="mdi-vuetify" color="blue"></v-icon>
    </template> -->
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { BreadcrumbItem } from '@/types/vuetify/components/VBreadcrumbs';
const route = useRoute();

const breadcrumbs = ref<NonNullable<BreadcrumbItem>>([]);

watchEffect(() => {
  // if you go to the redirect page, do not update the breadcrumbs
  //   if (route.path.startsWith('/redirect/')) {
  //     return
  //   }
  if (route.meta && route.meta.title) {
    breadcrumbs.value = [
      {
        title: route.meta.category as string,
        disabled: false,
      },
      {
        title: route.meta.title as string,
        disabled: true,
      },
    ];
  } else {
    breadcrumbs.value = [];
  }
});
</script>
