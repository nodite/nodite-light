<script setup lang="ts">
const title = import.meta.env.VITE_APP_TITLE;
const { vue, vuetify, vite } = process.env;
</script>

<template>
  <div class="d-flex text-center flex-grow-1">
    <v-sheet class="layout-side d-none d-md-flex flex-column justify-space-between">
      <div class="mt-3 mt-md-10 pa-2">
        <div class="text-primary text-h4 font-weight-bold">{{ title }} Admin</div>
        <div class="title my-2">Welcome! Let's build amazing things together.</div>
      </div>
    </v-sheet>
    <v-card variant="outlined" class="flex-grow-1 d-flex align-center justify-center flex-column">
      <div class="layout-content ma-auto w-full">
        <slot></slot>
      </div>
      <div class="pa-5">Vue {{ vue }} & Vuetify {{ vuetify }} & Vite {{ vite }}</div>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
.layout-side {
  width: 420px;
}

.layout-content {
  max-width: 480px;
}
</style>
