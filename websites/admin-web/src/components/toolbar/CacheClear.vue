<script setup lang="ts">
import CacheUtil from '@/utils/cache';
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" :title="$ndt('Clear Cache')">
        <v-icon color="primary">mdi-broom</v-icon>
      </v-btn>
    </template>

    <v-list nav>
      <v-list-item
        v-for="(fn, key) in CacheUtil.invalidation"
        :key="key"
        @click="fn"
        density="compact"
      >
        <template v-slot:prepend>
          <v-icon class="mr-1">mdi-broom</v-icon>
        </template>
        <v-list-item-title>{{ $ndt(`Clear ${key} cache`) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped lang="css">
:deep(.v-list-item__prepend) .v-list-item__spacer {
  width: 0 !important;
}
</style>
