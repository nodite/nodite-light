<script setup lang="ts">
import SalesCard from '@/components/dashboard/SalesCard.vue';
import TicketsCard from '@/components/dashboard/TicketsCard.vue';
</script>
<template>
  <div class="pa-5">
    <!-- ---------------------------------------------- -->
    <!---First Row -->
    <!-- ---------------------------------------------- -->
    <v-row class="flex-0" dense>
      <v-col cols="12" xl="4">
        <!-- Sales Card -->
        <v-card class="card-shadow" height="420">
          <!-- <sales-card></sales-card> -->
          <sales-card
            :value="1837.32"
            class="h-100"
            :percentage="3.2"
            style="min-height: 380px"
            :percentage-label="$t('dashboard.lastweek')"
            :action-label="$t('dashboard.viewReport')"
          ></sales-card>
        </v-card>
      </v-col>
      <v-col cols="12" xl="6">
        <v-card class="card-shadow" height="420"><tickets-card></tickets-card> </v-card>
      </v-col>
    </v-row>
    <!-- ---------------------------------------------- -->
    <!---Second Row -->
    <!-- ---------------------------------------------- -->

    <!-- ---------------------------------------------- -->
    <!---Third Row -->
    <!-- ---------------------------------------------- -->
    <v-row class="card-shadow flex-grow-0" dense> </v-row>
  </div>
</template>
<style lang="scss" scoped></style>
