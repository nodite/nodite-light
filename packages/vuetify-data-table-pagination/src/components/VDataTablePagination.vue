<script setup lang="ts">
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import { ItemsPerPageOption } from '../types';

const { t: $t } = useI18n();

const emit = defineEmits(['update:itemsPerPage', 'update:page']);

const props = defineProps({
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  itemsPerPageOptions: {
    type: Array as PropType<ItemsPerPageOption[]>,
    default: () => [],
  },
  page: {
    type: Number,
    default: 1,
  },
  currentCount: {
    type: Number,
    default: 0,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  totalPage: {
    type: Number,
    default: 1,
  },
});

const itemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: (v: number) => emit('update:itemsPerPage', v),
});

const page = computed({
  get: () => props.page,
  set: (v: number) => emit('update:page', v),
});

const itemsPerPageOptions = computed(() =>
  props.itemsPerPageOptions.length > 0
    ? props.itemsPerPageOptions
    : [
        { value: 10, title: '10' },
        { value: 25, title: '25' },
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: -1, title: $t('$vuetify.dataFooter.itemsPerPageAll') },
      ],
);

const totalPage = computed(() => props.totalPage);
</script>

<template>
  <div class="v-data-table-footer">
    <div class="v-data-table-footer__items-per-page">
      <span>{{ $t('$vuetify.dataFooter.itemsPerPageText') }}</span>
      <v-select
        v-model="itemsPerPage"
        :items="itemsPerPageOptions"
        density="compact"
        variant="outlined"
        hide-details
      ></v-select>
    </div>

    <div class="v-data-table-footer__info">
      <div>
        {{
          $t('$vuetify.dataFooter.pageText', [
            (page - 1) * itemsPerPage + 1,
            (page - 1) * itemsPerPage + currentCount,
            totalCount,
          ])
        }}
      </div>
    </div>

    <div class="v-data-table-footer__pagination">
      <v-pagination
        v-model="page"
        :length="totalPage"
        :total-visible="3"
        density="compact"
        rounded
        show-first-last-page
        variant="plain"
      ></v-pagination>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
