<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { ItemsPerPageOption } from '../types';

const { t: $t } = useI18n();

const emit = defineEmits(['update-items-per-page', 'update-page']);

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

const localData = ref({
  itemsPerPage: props.itemsPerPage,
  itemsPerPageOptions: [] as ItemsPerPageOption[],
  page: props.page,
  totalPage: props.totalPage,
});

watchEffect(() => {
  localData.value.itemsPerPage = props.itemsPerPage;
  localData.value.page = props.page;
  localData.value.totalPage = props.totalPage;
});

onMounted(() => {
  localData.value.itemsPerPageOptions = props.itemsPerPageOptions || [
    { value: 5, title: 5 },
    { value: 10, title: 10 },
    { value: 25, title: 25 },
    { value: 50, title: 50 },
    { value: 100, title: 100 },
    { value: -1, title: $t('$vuetify.dataFooter.itemsPerPageAll') },
  ];
});

const methods = {
  updateItemsPerPage: (v: number) => {
    emit('update-items-per-page', v);
  },
  updatePage: (v: number) => {
    emit('update-page', v);
  },
};
</script>

<template>
  <div class="v-data-table-footer">
    <div class="v-data-table-footer__items-per-page">
      <v-select
        v-model="localData.itemsPerPage"
        @update:model-value="methods.updateItemsPerPage"
        :items="localData.itemsPerPageOptions"
        density="compact"
        variant="outlined"
        hide-details
      >
        <template v-slot:prepend>
          <v-label>{{ $t('$vuetify.dataFooter.itemsPerPageText') }}</v-label>
        </template>
      </v-select>
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
        v-model="localData.page"
        @update:model-value="methods.updatePage"
        :length="localData.totalPage"
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
