<!--
* @Component: BackToTop
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import { Icon } from '@iconify/vue';

const toolboxShow = ref(false);
</script>

<template>
  <v-btn
    class="toolbox-activator elevation-10"
    @click="toolboxShow = !toolboxShow"
    size="50"
    color="white"
  >
    <Icon width="30" icon="ri:openai-fill" />
  </v-btn>

  <transition name="slide-y">
    <v-card v-if="toolboxShow" elevation="10" class="d-flex flex-column mb-1 toolbox">
      <!-- ---------------------------------------------- -->
      <!-- Code Assistant -->
      <!-- ---------------------------------------------- -->
      <v-btn size="50" @click="false">
        <v-icon size="30">mdi-code-tags</v-icon>
        <v-tooltip
          activator="parent"
          location="left"
          :text="$t('toolbox.codeAssistant.title')"
        ></v-tooltip>
      </v-btn>
      <!-- ---------------------------------------------- -->
      <!-- Code Assistant -->
      <!-- ---------------------------------------------- -->
      <v-btn size="50" @click="false">
        <v-icon size="30">mdi-seesaw</v-icon>
        <v-tooltip
          activator="parent"
          location="left"
          :text="$t('toolbox.playGround.title')"
        ></v-tooltip>
      </v-btn>
    </v-card>
  </transition>
</template>

<style scoped lang="scss">
.toolbox {
  z-index: 999;
  position: fixed;
  bottom: 150px;
  right: 5px;
}

.toolbox-activator {
  position: fixed;
  transition: all 0.3s ease;
  bottom: 100px;
  right: 5px;
  z-index: 999;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s;
  cursor: pointer;
}
</style>
