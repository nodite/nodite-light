<!--
* Component: ListPage.vue
* Project: @nodite-light/admin-web
* Created Time: 2023-12-07 16:24
* Created By: Oscaner Miao
-->
<script setup lang="ts">
const animations = ref([]);
</script>

<template>
  <v-card class="mt-5 pa-5" elevation="0">
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="animation in animations" :key="animation">
        <v-card>
          <v-card-title class="font-weight-bold text-grey-darken-3"> </v-card-title>
          <v-divider></v-divider>
          <v-card-text> </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss"></style>
