<script setup lang="ts">
import lodash from 'lodash';

import i18n from '@/plugins/i18n';
import { Common, NavigationConfig } from '@/types/config';
import { BreadcrumbItem } from '@/types/vuetify/components/VBreadcrumbs';

const route = useRoute() as unknown as NavigationConfig.Route;

const breadcrumbs = ref<Exclude<Common.ArrayElem<NonNullable<BreadcrumbItem>>, string>[]>([]);

watchEffect(() => {
  // if you go to the redirect page, do not update the breadcrumbs
  //   if (route.path.startsWith('/redirect/')) {
  //     return
  //   }

  breadcrumbs.value = lodash
    .chain(route.matched)
    .sortedUniqBy((item) => item.path + item.meta?.title)
    .map((item) => {
      return {
        to: item.path ? { path: item.path } : undefined,
        title: i18n.ndt(item.meta?.title) as string,
        disabled: false,
      };
    })
    .filter((item) => !!item.title)
    .value();

  lodash.last(breadcrumbs.value)!.disabled = true;
});
</script>

<template>
  <v-breadcrumbs v-if="breadcrumbs.length > 0" :items="breadcrumbs" class="ml-n3 text-body-2">
    <!-- <template #prepend>
      <v-icon size="small" icon="mdi-vuetify" color="blue"></v-icon>
    </template> -->
  </v-breadcrumbs>
</template>
