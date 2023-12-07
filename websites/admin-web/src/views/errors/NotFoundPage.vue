<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie';
</script>
<template>
  <v-card variant="flat" height="100vh" class="d-flex justify-center align-center text-center">
    <div>
      <Vue3Lottie
        animationLink="https://assets2.lottiefiles.com/packages/lf20_cr9slsdh.json"
        :height="500"
        :width="500"
      />
      <v-btn flat color="#00A9D7" class="mb-4 text-white" to="/">Go Back to Home</v-btn>
    </div>
  </v-card>
</template>
