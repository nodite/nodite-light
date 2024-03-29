<!--
* @Component: ToolbarNotifications
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import StatusMenu from '@/components/toolbar/StatusMenu.vue';
import { useAuthStore } from '@/stores/modules/authStore';
import { useProfileStore } from '@/stores/modules/profileStore';

const authStore = useAuthStore();
const profileStore = useProfileStore();

const navs = [
  {
    title: 'Profile Details',
    key: 'menu.profileDetails',
    link: '/profile',
    icon: 'mdi-account-box-outline',
  },
];
</script>

<template>
  <v-menu :close-on-content-click="false" location="bottom right" transition="slide-y-transition">
    <!-- ---------------------------------------------- -->
    <!-- Activator Btn -->
    <!-- ---------------------------------------------- -->
    <template #activator="{ props }">
      <v-btn class="mx-2" icon v-bind="props">
        <v-badge content="2" color="success" dot bordered>
          <v-avatar size="40">
            <v-img src="/admin/src/assets/default_avatar.jpeg"></v-img>
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>

    <v-card max-width="300">
      <v-list lines="three" density="compact">
        <!-- Profile Area -->
        <v-list-item to="/profile">
          <template #prepend>
            <v-avatar size="40">
              <v-img src="/admin/src/assets/default_avatar.jpeg"></v-img>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-primary">
            {{ profileStore.profile?.nickname || profileStore.profile?.username }}
            <StatusMenu />
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ profileStore.profile?.email }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <hr class="linear" />

      <!-- ---------------------------------------------- -->
      <!-- Menu Area -->
      <!-- ---------------------------------------------- -->
      <v-list variant="flat" elevation="0" :lines="false" density="compact">
        <v-list-item
          color="primary"
          v-for="(nav, i) in navs"
          :key="i"
          :to="nav.link"
          link
          density="compact"
        >
          <template #prepend>
            <v-avatar size="30">
              <v-icon>{{ nav.icon }}</v-icon>
            </v-avatar>
          </template>

          <v-list-item-subtitle class="text-body-2">{{ nav.title }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <hr class="linear" />

      <!-- ---------------------------------------------- -->
      <!-- Toolkit Area -->
      <!-- ---------------------------------------------- -->
      <v-list variant="flat" elevation="0" :lines="false" density="compact">
        <!-- Help Center -->
        <v-list-item color="primary" to="nav.link" link density="compact">
          <template #prepend>
            <v-avatar size="30">
              <v-icon>mdi-lifebuoy</v-icon>
            </v-avatar>
          </template>

          <v-list-item-subtitle class="text-body-2">Help Center</v-list-item-subtitle>
        </v-list-item>

        <!-- Logout -->
        <v-list-item color="primary" link @click="authStore.logout(true)" density="compact">
          <template #prepend>
            <v-avatar size="30">
              <v-icon>mdi-logout</v-icon>
            </v-avatar>
          </template>

          <v-list-item-subtitle class="text-body-2">Logout</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped lang="scss"></style>
