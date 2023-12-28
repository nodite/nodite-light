<script setup lang="ts">
import lodash from 'lodash';

import { Common, NavigationConfig } from '@/types/config';
import { BreadcrumbItem } from '@/types/vuetify/components/VBreadcrumbs';
import * as menuUtil from '@/utils/menu';

const route = useRoute() as unknown as NavigationConfig.Router;

const breadcrumbs = ref<Exclude<Common.ArrayElem<NonNullable<BreadcrumbItem>>, string>[]>([]);

watchEffect(() => {
  // if you go to the redirect page, do not update the breadcrumbs
  //   if (route.path.startsWith('/redirect/')) {
  //     return
  //   }
  breadcrumbs.value = lodash.filter(
    lodash.map(route.matched, (item) => {
      return {
        to: item.path ? { path: item.path } : undefined,
        title: menuUtil.toI18Title(item.meta) as string,
        disabled: false,
      };
    }) || [],
    (item) => !!item.title,
  );

  lodash.last(breadcrumbs.value)!.disabled = true;
});
</script>

<template>
  <v-breadcrumbs v-if="breadcrumbs.length > 0" :items="breadcrumbs" class="ml-n3 text-body-2">
    <!-- <template v-slot:prepend>
      <v-icon size="small" icon="mdi-vuetify" color="blue"></v-icon>
    </template> -->
  </v-breadcrumbs>
</template>
